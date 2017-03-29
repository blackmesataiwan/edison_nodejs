var QIoT = require('./lib/qiotlib');

/***
  Setup caonnect options
***/

//http.set('resourceinfo.json path');
//return httpoptions Object

var Qclient = QIoT.http.set('./res/resourceinfo.json');

/*** 
  Receive data of QIoT Suite Lite.
***/

//Setting Subscribe is use id <http.subscribeById("ID", Qclient);>
//It will return http object

function getvalue(){
		
	var LEDreq = QIoT.http.subscribeById("LED", Qclient);
	LEDreq.on('response', function(response) {
		var buffers = [];
		response.on("data", function (chunk) {
		    buffers.push(chunk);
		});
		response.on('end', function () {
		    var wholeData = Buffer.concat(buffers);
		    var data = wholeData.toString('utf8');
		   	var json = JSON.parse(data); 
	    	console.log("LED : "+json.value);
	    	console.log("------------------------")
		});
	}).end();	
	
	setTimeout(function() {
		getvalue();
	}, 1000);
}
getvalue();