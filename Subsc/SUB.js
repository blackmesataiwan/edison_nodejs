var QIoT = require('./QIoT');
var m = require('mraa'); //require mraa
console.log('MRAA Version: ' + m.getVersion()); //write the mraa version to the console


var LED = new m.Gpio(7); //setup digital read on pin 6
LED.dir(m.DIR_OUT);



var Qclient = QIoT.qiotmqtt.start('./res/resourceinfo.json');

//Qclient.subscribe('qiot/things/admin/edison222/LED');
QIoT.qiotmqtt.subscribeofid("LED", Qclient);

Qclient.on('message', function(topic, message){

	console.log(message.toString());
	LED.write(LED.read()?0:1);

});
