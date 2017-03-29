var QIoT = require('./lib/qiotlib');


/***
  Setup caonnect options
***/

//mqtt.set('resourceinfo.json path');
//It will return mqttconnect Object

/***If you use mqtts, please place the certificate and key in the ssl folder***/

var Qclient = QIoT.mqtt.set('./res/resourceinfo.json');

/*** 
	Receive data of QIoT Suite Lite.
***/

//Setting Subscribe is use id <mqtt.subscribeById("ID", Qclient);>
//It will return topic name

var topic_LED = QIoT.mqtt.subscribeById("LED", Qclient);

//It's Switch case of topic name to receive message

Qclient.on('message', function(topic, message){
	var data = JSON.parse(message.toString());
	switch (topic){
		case topic_LED:
			if (data.value == 1) {
				console.log("1");
			}
			else{
				console.log("0");
			}
			break;

		default:
                
            break;
	}
	console.log(topic_LED);
	console.log(data.value);

});