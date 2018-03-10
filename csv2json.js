const fs = require('fs');
const path = require('path');

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


function csv2json() {
    
}
csv2json.prototype.fromFile = function(csvFilePath){
    return new Promise((resolve,reject)=>{
        fs.readFile(csvFilePath,'ascii',(err,data)=>{
            if(err){
                reject(err);
                return;
            }
    
            data = data.replace(new RegExp("\\r|\\*|\\'|\\\"|\'", 'g'),'');
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
    
            resolve(json);
        });
    })   
}
module.exports = csv2json;