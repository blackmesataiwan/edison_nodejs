var QIoT = require('./qiotlib');
var m = require('mraa'); //require mraa
console.log('MRAA Version: ' + m.getVersion()); //write the mraa version to the console

var Button = new m.Gpio(2); //setup digital read on pin 2
Button.dir(m.DIR_IN); //set the gpio direction to input

/***
  Setup caonnect options
***/

//mqtt.set('resourceinfo.json path');
//It will return mqttconnect Object

/***If you use mqtts, please place the certificate and key in the ssl folder***/

var Qclient = QIoT.mqtt.set('./res/resourceinfo.json');//Read resourceinfo json file

/*** 
	Send sensor's data to QIoT Suite Lite by Resourcetype.
***/

//It's use "resourcetypename" to sending data.
//QIoT.mqtt.publishByType("resourcetypename", value, Qclient);


function sensors(){
	
	QIoT.mqtt.publishByType("Button",Button.read(),Qclient);
	
	setTimeout(function() {
		console.log("wating......");
		sensors();
	}, 100);
}
sensors();
