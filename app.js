const csv2json = require('./csv2json.js');
const path = require('path');

let csv2jsonObj = new csv2json();

csv2jsonObj.fromFile(path.join('customer-data.csv')).then((json)=>{
    console.log(JSON.parse(json));
}).catch((err)=>{
    console.log(err);
});


