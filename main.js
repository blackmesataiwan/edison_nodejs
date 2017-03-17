var QIoT = require('./QIoT');
var m = require('mraa'); //require mraa
console.log('MRAA Version: ' + m.getVersion()); //write the mraa version to the console

var Sound = new m.Aio(0);
var Rotary = new m.Aio(1);
var Piezo = new m.Aio(2);
var Light = new m.Aio(3);  


var Button = new m.Gpio(2); //setup digital read on pin 6
Button.dir(m.DIR_IN); //set the gpio direction to input
var Touch = new m.Gpio(3); //setup digital read on pin 6
Touch.dir(m.DIR_IN); //set the gpio direction to input

var Qclient = QIoT.qiotmqtt.start('./res/resourceinfo.json');


/*** 
	Send sensor's data to QIoT Suite Lite by Resourcetype.
***/

function sensors(){
	
	//QIoT.qiotmqtt.type("Temperature",DHTSensor.read()[0],Qclient);
	//QIoT.qiotmqtt.type("Humidity",DHTSensor.read()[1],Qclient);
	QIoT.qiotmqtt.type("Button",Button.read(),Qclient);
	QIoT.qiotmqtt.type("Touch",Touch.read(),Qclient);
	QIoT.qiotmqtt.type("Sound",parseInt(Sound.read()/1023*100, 10),Qclient);
	QIoT.qiotmqtt.type("Rotary Angle",parseInt(Rotary.read()/1023*100, 10),Qclient);
	QIoT.qiotmqtt.type("Light",Light.read(),Qclient);
	QIoT.qiotmqtt.type("Piezo Vibration",Piezo.read(),Qclient);

	setTimeout(function() {
		console.log("wating......");
		sensors();
	}, 100);
}
sensors();