var QIoT = require('./lib/qiotlib');

/***
  Setup caonnect options
***/

//mqtt.set('resourceinfo.json path');
//It will return mqttconnect Object

/***If you use mqtts, please place the certificate and key in the ssl folder***/

var Qclient = QIoT.mqtt.set('./res/resourceinfo.json');

/*** 
	Send sensor's data to QIoT Suite Lite by Resourcetype.
***/

//by resourcetypename: QIoT.mqtt.publishByType("resourcetypename", value, Qclient);
//by resourceid: QIoT.mqtt.publishByType("resourceid", value, Qclient);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sensors(){
		
	QIoT.mqtt.publishByType("Temperature",getRandomInt(0,50),Qclient);	
	QIoT.mqtt.publishByType("Button",getRandomInt(0,50),Qclient);
	QIoT.mqtt.publishByType("Touch",getRandomInt(0,50),Qclient);
	QIoT.mqtt.publishByType("Sound",getRandomInt(0,50),Qclient);
	QIoT.mqtt.publishByType("Rotary Angle",getRandomInt(0,50),Qclient);
	QIoT.mqtt.publishByType("Piezo Vibration",getRandomInt(0,50),Qclient);
	QIoT.mqtt.publishByType("Light",getRandomInt(0,50),Qclient);
	QIoT.mqtt.publishByType("Humidity",getRandomInt(0,50),Qclient);

	QIoT.mqtt.publishByType("Custom Sensor(Float)",getRandomInt(0,50),Qclient);
	QIoT.mqtt.publishByType("Custom Sensor(Boolean)",getRandomInt(0,50),Qclient);
	QIoT.mqtt.publishByType("Custom Sensor(Int)",getRandomInt(0,50),Qclient);
	QIoT.mqtt.publishByType("Custom Sensor(String)",getRandomInt(0,50),Qclient);

	QIoT.mqtt.subscribeById("temps",getRandomInt(0,50),Qclient);
	
	setTimeout(function() {
		console.log("wating......");
		sensors();
	}, 100);
}
sensors();
