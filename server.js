var express = require('express'); 
var bodyParser = require("body-parser");
var path = require("path")
var app = express();
const fs = require('fs'); 
var csvWriter = require('csv-write-stream');
var writer = csvWriter ({sendHeaders:false}); 
const port = 3000;
app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static('public'));



app.listen(port, ()=>console.log("server good"));

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/index.html"));
});

app.post("/ajax_response",function(req,res){
    console.log(req.body.latitude);
    if (!fs.existsSync("./public/Pins.csv"))
        writer = csvWriter({ headers: ["latitude","longitude","locName","locDesc","id"]});
    else
        writer = csvWriter({sendHeaders: false});
    writer.pipe(fs.createWriteStream("./public/Pins.csv", {flags: 'a'}));
    writer.write({
        header1:req.body.latitude,
        header2:req.body.longitude,
        header3:req.body.locName,
        header4:req.body.locDesc,
        header5:req.body.id,
    });
    writer.end();
    // res.json(data);
    // console.log(data);

})



