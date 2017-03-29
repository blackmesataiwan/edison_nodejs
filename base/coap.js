var QIoT = require('./lib/qiotlib');
var bl = require('bl');
var cp = require('child_process');

/***
  Setup caonnect options
***/

//coap.set('resourceinfo.json path');
//return coapoptions Object

var Qclient = QIoT.coap.set('./res/resourceinfo.json');

/*** 
  Send sensor's data to QIoT Suite Lite by Resourcetype.
***/

//by resourcetypename: QIoT.coap.publishByType("resourcetypename", value, Qclient);
//by resourceid: QIoT.qiotacoap.publishByType("resourceid", value, Qclient);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sensors(){

	QIoT.coap.publishByType("Temperature",getRandomInt(0,50),Qclient);	
	QIoT.coap.publishByType("Button",getRandomInt(0,50),Qclient);
	QIoT.coap.publishByType("Touch",getRandomInt(0,50),Qclient);
	QIoT.coap.publishByType("Sound",getRandomInt(0,50),Qclient);
	QIoT.coap.publishByType("Rotary Angle",getRandomInt(0,50),Qclient);
	QIoT.coap.publishByType("Piezo Vibration",getRandomInt(0,50),Qclient);
	QIoT.coap.publishByType("Light",getRandomInt(0,50),Qclient);
	QIoT.coap.publishByType("Humidity",getRandomInt(0,50),Qclient);

	QIoT.coap.publishByType("Custom Sensor(Float)",getRandomInt(0,50),Qclient);
	QIoT.coap.publishByType("Custom Sensor(Boolean)",getRandomInt(0,50),Qclient);
	QIoT.coap.publishByType("Custom Sensor(Int)",getRandomInt(0,50),Qclient);
	QIoT.coap.publishByType("Custom Sensor(String)",getRandomInt(0,50),Qclient);

  	QIoT.coap.publishById("temps",10,Qclient);
  	
	setTimeout(function() {
		console.log("wating......");
		sensors();
	}, 100);
}
sensors();
