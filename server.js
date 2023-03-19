var express = require('express'); 
var app = express();

const fs = require('fs');  
var csvWriter = require('csv-write-stream');
var writer = csvWriter ({sendHeaders:false}); 
var csvFilename = "Pins.csv" 

// getting data from HTML -- using http request, but that excludes lat, lng, and id 
//how to export objectArray to node dynamically??? 

console.log(require('./public/sketch.js'));
if (!fs.existsSync(csvFilename)) {
    writer = csvWriter({sendHeaders: false});
    writer.pipe(fs.createWriteStream(csvFilename));
    writer.write({
      header1: 'lat',
      header2: 'lng',
      header3: 'name',
      header4: 'desc',
      header5: 'id'
    });
    writer.end();
  } 



 writer = csvWriter({sendHeaders:false});
 writer.pipe(fs.createWriteStream(csvFilename,{flags:'a'}));
 writer.write({
    header1: '34.5575',
    header2: '35.67876543',
    header3: 'home',
    header4: 'homehomehome',
    header5:'12345678'
 });
 writer.end(); 

app.use(express.static('public'));




app.listen(3000); 
