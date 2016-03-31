var express = require("express");
var app = express();
var port = 8080;
var server = require("http").Server(app); //Einbinden von http und erstellen eines servers für unsere express Anwendung
var io = require("socket.io")(server);    //wir laden unsere socket io
/*Das heist nun wenn es eine ganz normale anfrage ist landet man bei der express anwendung, bei einer socket anfrage nicht*/
app.set("view engine","ejs");
app.set("views", __dirname +"/views");
app.use("/public",express.static("public"));

app.get("/",function(req,res){
  res.render("pages/landing.ejs",{
    title : "Hello World"
  });
});

io.on("connection", function(socket/*verbindungsobjekt*/){   //wenn ein eregnis passiert dann führe bitte einen code aus
  console.log("Ein Benutzer hat sich verbunden");
  socket.on("message",function(message){          //hier kommen die Daten an vom Client
    socket.broadcast.emit("newMessage",message);  //Schicke die Info an alle anderen, das es eine neue nachricht gibt
  });
  socket.emit("welcome",{
      datum: new Date()
  });
  socket.on("welcomeServer",function(messageFromClient){
    //console.log("welcomeServer");
    console.log(messageFromClient.name);
  });

})

server.listen(port);   //jetzt können wir sagen das der server auf port 8080 läuft nicht die Anwendung
console.log("express-Server listening on Port: "+port+"...");
