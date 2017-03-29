var QIoT = require('./lib/qiotlib');
var cp = require('child_process');

/***
  Setup caonnect options
***/

//http.set('resourceinfo.json path');
//return httpoptions Object

var Qclient = QIoT.http.set('./res/resourceinfo.json');

/*** 
  Send sensor's data to QIoT Suite Lite by Resourcetype.
***/


//by resourcetypename: QIoT.http.type("resourcetypename", value, Qclient);
//by resourceid: QIoT.qiotahttp.type("resourceid", value, Qclient);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sensors(){
    QIoT.http.publishByType("Temperature",getRandomInt(0,50),Qclient);   
    QIoT.http.publishByType("Button",getRandomInt(0,50),Qclient);
    QIoT.http.publishByType("Touch",getRandomInt(0,50),Qclient);
    QIoT.http.publishByType("Sound",getRandomInt(0,50),Qclient);
    QIoT.http.publishByType("Rotary Angle",getRandomInt(0,50),Qclient);
    QIoT.http.publishByType("Piezo Vibration",getRandomInt(0,50),Qclient);
    QIoT.http.publishByType("Light",getRandomInt(0,50),Qclient);
    QIoT.http.publishByType("Humidity",getRandomInt(0,50),Qclient);

    QIoT.http.publishByType("Custom Sensor(Float)",getRandomInt(0,50),Qclient);
    QIoT.http.publishByType("Custom Sensor(Boolean)",getRandomInt(0,50),Qclient);
    QIoT.http.publishByType("Custom Sensor(Int)",getRandomInt(0,50),Qclient);
    QIoT.http.publishByType("Custom Sensor(String)",getRandomInt(0,50),Qclient);

    QIoT.http.publishById("temps",10,Qclient);

  setTimeout(function() {
    console.log("wating......");
    sensors();
  }, 100);
}
sensors();