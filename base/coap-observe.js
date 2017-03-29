var QIoT = require('./lib/qiotlib');
var bl = require('bl');

/***
  Setup caonnect options
***/

//coap.set('resourceinfo.json path');
//return coapoptions Object

var Qclient = QIoT.coap.set('./res/resourceinfo.json');//Read resourceinfo json file

/*** 
  Receive data of QIoT Suite Lite.
***/

//Setting Subscribe is use id <coap.subscribeById("ID", Qclient);>
//It will return coap object
var LEDreq = QIoT.coap.subscribeById("LED", Qclient)
if (typeof LEDreq !== "undefined"){
	LEDreq.on('response', function(res) {
	  res.on('data', function(data) {
	    var json = JSON.parse(data); 
	    console.log("LED : "+json.value);
	    console.log("------------------------")
	  })
	})
}

var BLEDreq = QIoT.coap.subscribeById("BLED", Qclient)
if (typeof BLEDreq !== "undefined"){
	BLEDreq.on('response', function(res) {
	  res.on('data', function(data) {
	    var json = JSON.parse(data); 
	    console.log("BLED : "+json.value);
	    console.log("------------------------")
	  })
	})
}
