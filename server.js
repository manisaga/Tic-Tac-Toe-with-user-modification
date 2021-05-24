const express=require('express');
const bodyParser=require('body-parser');
const https=require('https');
const fs = require('fs');
const app=express();
app.use(express.static(__dirname +"/public"));
app.use(bodyParser.urlencoded({extended: true}));
var playerInfo ={
    numOfPlayers : 2,
    Players : ["Computer","Computer"]
};

app.get("/",function(req,res){
    res.sendFile(__dirname+"/Game_entry.html");
});

app.post("/",function(req,res){
    playerInfo.numOfPlayers=req.body.NumberOfPlayers;
    console.log(req.body.Player1);
    if(req.body.Player1 !== "")
        playerInfo.Players[0]=req.body.Player1;
    if(req.body.Player2 !== "")
        playerInfo.Players[1]=req.body.Player2;
    res.redirect("/Game");
});

app.get("/Game",function(req,res){
    res.sendFile(__dirname+"/index.html");
});

app.get("/send_file",function(req,res){
    res.send(playerInfo);
});

app.listen(3000,function(){
    console.log("server listening to port 3000");
});