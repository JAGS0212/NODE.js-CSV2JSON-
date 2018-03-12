const csv2json = require('./csv2json.js');
const path = require('path');

let csv2jsonObj = new csv2json();

csv2jsonObj.fromFile(path.join('./some/folder/to/file/customer-data.csv')).then((fileName)=>{
    console.log(fileName);
}).catch((err)=>{
    console.log(err);
});




