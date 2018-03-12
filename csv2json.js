const fs = require('fs');
const path = require('path');


function run(generator,...args){
    let genObj = generator(args);

    function iterator(retVal){
        if(retVal.done)
            return Promise.resolve(retVal.value);
        
        return Promise.resolve(retVal.value).then((val)=>{
            return iterator(genObj.next(val));
        }).catch((err)=>{
            return iterator(genObj.throw(err));
        });
    }

    try{
        return iterator(genObj.next());
    }
    catch(err){
        return Promise.reject(err);
    }
}


function readFile(filePath){
    
    return new Promise((resolve,reject)=>{
        fs.readFile(filePath,'ascii',(err,data)=>{
            if(err){
                reject(err);        
            }
            else{
                resolve(data);
            }
        });
    });
    
}

function writeFile(filePath,data){
    return new Promise((resolve,reject)=>{
        fs.writeFile(filePath,data,(err)=>{
            if(err)
                reject(err);
            else
                resolve(filePath);
        });
    });
}

function buildRow2Json(row,headers){
    let json = '{';
    
    for(let i=0; i < row.length; i++){
        if(i === row.length - 1)
            json += '"' + headers[i] + '":"' + row[i] + '"';
        
        else
            json += '"' + headers[i] +'":"' + row[i] + '",';
    }
    return json += '}';
}

function *fromFileGen(args){
        let csvFilePath = args[0];
        
        let data = yield readFile(csvFilePath);


        data = data.replace(new RegExp("\\r|\\*|\\'|\\\"|\'", 'g'),''); //Replace any special characters that might invalidate the JSON structure
        let rows = data.split('\n'); 
        for(let index in rows)
            rows[index] = rows[index].split(',');
        
        rows.splice(rows.length-2);

        let json = '[';
        let headers = rows[0];
        
        for(let i = 1; i < rows.length; i++){
            if(i !== rows.length - 1)
                json += buildRow2Json(rows[i],headers) + ',';
            
            else
                json += buildRow2Json(rows[i],headers);
        }
        json += ']';

        $pathObj = path.parse(csvFilePath);

        let outFileNameAndPath = path.join($pathObj.dir,$pathObj.base.replace($pathObj.ext,'.json'));

        return writeFile(outFileNameAndPath,json);
}



function csv2json() {
}
csv2json.prototype.fromFile = function(csvFilePath){
    return run(fromFileGen,csvFilePath);
}
module.exports = csv2json;