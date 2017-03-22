var QIoT = require('./QIoT');
var m = require('mraa'); //require mraa
console.log('MRAA Version: ' + m.getVersion()); //write the mraa version to the console

var Temperature = new m.Aio(0); 
//var Sound = new m.Aio(0);
var Rotary = new m.Aio(1);
var Piezo = new m.Aio(2);
var Light = new m.Aio(3);
 


var Button = new m.Gpio(2); //setup digital read on pin 6
Button.dir(m.DIR_IN); //set the gpio direction to input
var Touch = new m.Gpio(4); //setup digital read on pin 6
Touch.dir(m.DIR_IN); //set the gpio direction to input
var LED = new m.Gpio(7); //setup digital read on pin 6
LED.dir(m.DIR_OUT);

var Qclient = QIoT.qiotmqtt.start('./res/resourceinfo.json');

/*** 
	Receive data of QIoT Suite Lite.
***/

//Setting Subscribe is use id <qiotmqtt.subscribeofid("ID", Qclient);>
//It will return topic name

var topic_LED = QIoT.qiotmqtt.subscribeofid("LED", Qclient);

//It's Switch case of topic name to receive message

Qclient.on('message', function(topic, message){
	var data = JSON.parse(message.toString());
	switch (topic){
		case topic_LED:
			if (data.value == 1) {
				LED.write(1);
			}
			else{
				LED.write(0);
			}
			break;

		default:
                
            break;
	}
	console.log(topic_LED);
	console.log(data.value);
	//LED.write(LED.read()?0:1);

});



/*** 
	Send sensor's data to QIoT Suite Lite by Resourcetype.
***/

//It's use "resourcetypename" to sending data.
//QIoT.qiotmqtt.type("resourcetypename", value, Qclient);


function sensors(){
	//QIoT.qiotmqtt.type("Temperature",DHTSensor.read()[0],Qclient);
	//QIoT.qiotmqtt.type("Humidity",DHTSensor.read()[1],Qclient);
	
	a = Temperature.read();
	QIoT.qiotmqtt.type("Temperature",(1/(Math.log(((1023-a)*10000/a)/10000)/3975+1/298.15)-273.15).toFixed(2),Qclient); //anolog temperature
	
	QIoT.qiotmqtt.type("Button",Button.read(),Qclient);
	QIoT.qiotmqtt.type("Touch",Touch.read(),Qclient);
	//QIoT.qiotmqtt.type("Sound",parseInt(Sound.read()/1023*100, 10),Qclient);
	QIoT.qiotmqtt.type("Rotary Angle",parseInt(Rotary.read()/1023*100, 10),Qclient);
	QIoT.qiotmqtt.type("Light",Light.read(),Qclient);
	QIoT.qiotmqtt.type("Piezo Vibration",Piezo.read()>1000 ? 1:0,Qclient);

	setTimeout(function() {
		console.log("wating......");
		sensors();
	}, 100);
}
sensors();
