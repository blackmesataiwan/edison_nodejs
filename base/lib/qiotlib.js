console.log("Loaded QIoT module");

var mqtt = require('mqtt');
var coap  = require('coap');
var http = require('http');
var bl = require('bl');
var fs = require('fs');


//declare the path which cert infos locates.
var KEY = "";
var CERT = "";
var TRUSTED_CA_LIST = "";

//declare mqtt server host & port infos
PORT = 8883;
HOST = '172.17.28.39';
USER_NAME = "";
USER_PASS = "";

//Device Info
CLIENT_ID = "";

var sensorslength = 0;

/***
    for mqtt "default" options
    host,port,username,password,protocol,clientId will be change of resourcesinfo.json file
***/
var mqttoptions = {
  clean: true, // or false,
  clientId: CLIENT_ID,
  protocol: 'mqtt',
  port: PORT,
  host: HOST,
  rejectUnauthorized : true,
  username: USER_NAME,
  password: USER_PASS,
  checkServerIdentity: function (host, cert) {
    return undefined;
  }
};

/***
    for coap "default" options
    host,port,query will be change of resourcesinfo.json file
    method,pathname will be change of another functions
***/
var coapConnection = {
    host: '172.17.28.20',
    port:"5683",
    pathname: 'r/qiot/things/admin/test/test', //topicname
    method: 'PUT',
    observe: false,
    confirmable: true,
    query: 'r=6df6a142-5421-4d50-8321-17f035a5a4ab&t=r:fc943307c59818e63b77aec90ca56a8e' 
};

/***
    for http "default" options
    hostname,port,headers will be change of resourcesinfo.json file
    method,path will be change of another functions
***/
var httpoptions = {
    hostname: '172.17.30.19',
    port: 21500,
    path: '/resources/qiot/things/admin/windowstest/test', //topicname
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Access-Token': 'r:0047b9e2ec02ba1da75a44523f95ae4d',
        'Requesterid' : '05e3ab04-5268-4492-a1d5-94f0a61ee431'
    }
};

var Qclient = null; //mqtt.connect(mqttoptions);

var sensors = []; //all resource item
var resourceinfo = [];

/**MQTT options**/
function getMqttResourceinfo(fileName) {
        var data = fs.readFileSync(fileName, 'utf8'); //read resourceinfo json file

        data = JSON.parse(data);

        HOST = data.host[0];
        PORT = data.port;

        USER_NAME = data.username;
        USER_PASS = data.password;
        CLIENT_ID = data.clientId;

        /*Assginged new value to mqttoptions*/
        mqttoptions.clientId = CLIENT_ID;
        mqttoptions.port = PORT;
        mqttoptions.host = HOST;
        mqttoptions.username = USER_NAME;
        mqttoptions.password = USER_PASS;
        
        if(data.privateCert) { // mqtts
            var key_o = data.privateCert;
            var arr_KEY = key_o.split("/");
            if(typeof arr_KEY !== "undefined"){
                if(arr_KEY.length > 0){
                    var index = arr_KEY.length;
                    KEY = fs.readFileSync("./ssl/" + arr_KEY[index - 1].toString().trim());
                    console.log("privatekey full path = " + arr_KEY[index - 1].toString().trim());
                }
            }

            var ca_o = data.caCert;
            var arr_CA = ca_o.split("/");
            if(typeof arr_CA !== "undefined"){
                if(arr_CA.length > 0){
                    var index = arr_CA.length;
                    TRUSTED_CA_LIST = fs.readFileSync("./ssl/" + arr_CA[index - 1].toString().trim());
                }
            }
            var cert_o = data.clientCert;
            var arr_CERT = cert_o.split("/");
            if(typeof arr_CERT !== "undefined"){
                if(arr_CERT.length > 0){
                    var index = arr_CERT.length;
                    CERT = fs.readFileSync("./ssl/" + arr_CERT[index - 1].toString().trim());
                }
            }
            mqttoptions.key = KEY;
            mqttoptions.cert = CERT;
            mqttoptions.ca = TRUSTED_CA_LIST;
            mqttoptions.protocol = 'mqtts';
        }

        /* End of Assginged new value to mqttoptions*/

        //add resource item
        var resourcedetail = data.resources;
        sensorslength = Object.keys(data.resources).length;
        for (var resourceidx in resourcedetail) {
            var jsonobj = {
                topic: resourcedetail[resourceidx].topic,
                resourceid: resourcedetail[resourceidx].resourceid,
                resourcetype: resourcedetail[resourceidx].resourcetypename,
                datatype: resourcedetail[resourceidx].datatype,
                unit: resourcedetail[resourceidx].unit,
            };
            resourceinfo.push(jsonobj);
        }
    
    return resourceinfo;
	}

/**CoAP options**/
function getCoapResourceinfo(fileName) {     
        var data = fs.readFileSync(fileName, 'utf8'); //read resourceinfo json file

        data = JSON.parse(data);
        HOST = data.host[0];
        PORT = data.port;

        R = data.r;
        T = data.t;
        CLIENT_ID = data.clientId;

        /*Assginged new value to coapoptions*/

        coapConnection.host = HOST;
        coapConnection.query = "r="+R+"&t="+T;

        /* End of Assginged new value to coapoptions*/
        var resourcedetail = data.resources;
        sensorslength = Object.keys(data.resources).length;
        for (var resourceidx in resourcedetail) {
            var jsonobj = {
                topic: resourcedetail[resourceidx].topic,
                resourceid: resourcedetail[resourceidx].resourceid,
                resourcetype: resourcedetail[resourceidx].resourcetypename,
                datatype: resourcedetail[resourceidx].datatype,
                unit: resourcedetail[resourceidx].unit,
            };
            resourceinfo.push(jsonobj);
        }
    
    return resourceinfo;
    }

/**HTTP options**/
function getHttpResourceinfo(fileName) {     
        var data = fs.readFileSync(fileName, 'utf8');

        data = JSON.parse(data);
        HOST = data.host[0];
        PORT = data.port;

        REQUESTER_ID = data.requesterid;
        ACCESS_TOKEN = data.accesstoken;
        CLIENT_ID = data.clientId;

        /*Assginged new value to httpoptions*/

        httpoptions.hostname = HOST;
        httpoptions.port = PORT;
        httpoptions.headers = {
            'Content-Type': 'application/json',
            'Access-Token': ACCESS_TOKEN,
            'Requesterid' : REQUESTER_ID
        };

        /* End of Assginged new value to httpoptions*/

        //add resource item
        var resourcedetail = data.resources;
        sensorslength = Object.keys(data.resources).length;
        for (var resourceidx in resourcedetail) {
            var jsonobj = {
                topic: resourcedetail[resourceidx].topic,
                resourceid: resourcedetail[resourceidx].resourceid,
                resourcetype: resourcedetail[resourceidx].resourcetypename,
                datatype: resourcedetail[resourceidx].datatype,
                unit: resourcedetail[resourceidx].unit,
            };
            resourceinfo.push(jsonobj);
        }
    
    return resourceinfo;
    }

//Add resources to resourcesinfo
function addSensors(resourcesinfo) {	
    var length = Object.keys(resourcesinfo).length;

    for(var i = 0; i < length; i++){
        var jsonobj = {
                
        name: 'Real' + i.toString(),
        id: resourcesinfo[i].resourceid,
        type: 22,
        pin: -1,
        topic: resourcesinfo[i].topic,
        resourcetype: resourcesinfo[i].resourcetype,
        value: 1
            
        };
            sensors.push(jsonobj);
    }
   	return sensors;
}

/**MQTT Functions**/
module.exports.mqtt = {
	
    //Setup caonnect options 	
	set: 	function (resourceinfofile){
				
				addSensors(getMqttResourceinfo(resourceinfofile));
                Qclient = mqtt.connect(mqttoptions);
                Qclient.on('error', function(err) {
                    console.log("=========================================");
                    console.log("something wrong with mqtt service, err reason: " + err);
                    console.log("=========================================");
                });

                return Qclient;

			},
    //Publish search by resourceid
	publishById: 	function (id, value, Qsend){
                for (var sensoridx in sensors) {
                    if (id == sensors[sensoridx].id) {
                        sensors[sensoridx].value = value;

                        var topic_Pub = sensors[sensoridx].topic;
                        var qiot_value = sensors[sensoridx].value;

                        Qsend.publish(topic_Pub, JSON.stringify({value: qiot_value}),  {retain:true});
                        console.log(" send message to [mqtt(s)://" + HOST + ":" + PORT + "], topic_Pub = " + topic_Pub + ", value = " + JSON.stringify({value: qiot_value}));
                    }
                    else{

                    }           
                }
		
			},
    //Publish search by resourcetype
	publishByType: 	function (restype_name, value, Qsend){  
                for (var sensoridx in sensors) {
                    if (restype_name == sensors[sensoridx].resourcetype) {
                        sensors[sensoridx].value = value;

                        var topic_Pub = sensors[sensoridx].topic;
                        var qiot_value = sensors[sensoridx].value;

                        Qsend.publish(topic_Pub, JSON.stringify({value: qiot_value}),  {retain:true});
                        console.log(" send message to [mqtt(s)://" + HOST + ":" + PORT + "], topic_Pub = " + topic_Pub + ", value = " + JSON.stringify({value: qiot_value}));
                    }
                    else{

                    }           
                }
            },
    //Subscribe search by resourceid
    subscribeById: function(id, Qreceive){
                    for (var sensoridx in sensors) {
                        if (id == sensors[sensoridx].id) {

                            var topic_Pub = sensors[sensoridx].topic;

                            Qreceive.subscribe(sensors[sensoridx].topic);
                            console.log("add subscribe :" + sensors[sensoridx].topic)
                            return sensors[sensoridx].topic;
                        }
                        else{

                        }           
                    }


    }
}

/**CoAP Functions**/
module.exports.coap = {
    
    //Setup caonnect options 
    set:  function (resourceinfofile){
                
                addSensors(getCoapResourceinfo(resourceinfofile));

                return coapConnection;

            },
    //Publish search by resourceid
    publishById:     function (id, value, Qsend){
                for (var sensoridx in sensors) {
                    if (id == sensors[sensoridx].id) {
                        sensors[sensoridx].value = value;

                        Qsend.pathname = sensors[sensoridx].topic;
                        Qsend.method = 'PUT';
                        var qiot_value = sensors[sensoridx].value;

                        var req = coap.request(Qsend).end('{"value":'+qiot_value+'}');
                        req.on('response', function(res) {
                            res.pipe(process.stdout);
                            if(res.code=="2.04") //Success Code Handler
                              console.log("Published:  "+qiot_value);
                            else //Error Code Handler
                              console.log("Error Code:  "+res.code);
                        })                        
                        console.log(" send message to [coap://" + HOST + ":" + PORT + Qsend.pathname + ", value = " + JSON.stringify({value: qiot_value}));
                    }
                    else{

                    }           
                }
        
            },
    //Publish search by resourcetype
    publishByType:   function (restype_name, value, Qsend){  
                for (var sensoridx in sensors) {
                    if (restype_name == sensors[sensoridx].resourcetype) {
                        sensors[sensoridx].value = value;

                        Qsend.pathname = sensors[sensoridx].topic;
                        Qsend.method = 'PUT';
                        var qiot_value = sensors[sensoridx].value;

                        var req = coap.request(Qsend).end('{"value":'+qiot_value+'}');
                        req.on('response', function(res) {
                            res.pipe(process.stdout);
                            if(res.code=="2.04") //Success Code Handler
                              console.log(" send message to [coap://" + HOST + ":" + PORT + Qsend.pathname + ", value = " + JSON.stringify({value: qiot_value}));
                            else //Error Code Handler
                              console.log("Error Code:  "+res.code);
                        })                        
                    }
                    else{

                    }           
                }
            },
    //Subscribe search by resourceid
    subscribeById: function(id, Qreceive){
                    for (var sensoridx in sensors) {
                        if (id == sensors[sensoridx].id) {

                            Qreceive.pathname = sensors[sensoridx].topic;
                            Qreceive.method = 'GET';
                            Qreceive.observe = true;
                            req = coap.request(Qreceive).end();

                            return req
                        }
                        else{

                        }           
                    }


    }
}

/**HTTP Functions**/
module.exports.http = {

    //Setup caonnect options 
    set:  function (resourceinfofile){
                
                addSensors(getHttpResourceinfo(resourceinfofile));

                return httpoptions;

            },
    //Publish search by resourceid
    publishById:     function (id, value, Qsend){
                for (var sensoridx in sensors) {
                    if (id == sensors[sensoridx].id) {
                        sensors[sensoridx].value = value;

                        Qsend.path = '/resources/' + sensors[sensoridx].topic;
                        Qsend.method = 'PUT';
                        var qiot_value = sensors[sensoridx].value;

                        var req = http.request(Qsend, function(httpRes) {
                            var buffers = [];
                            httpRes.on('data', function(chunk) {
                                buffers.push(chunk);
                            });

                            httpRes.on('end', function(chunk) {
                                var wholeData = Buffer.concat(buffers);
                                var dataStr = wholeData.toString('utf8');
                            });
                        }).on('error', function(err) {
                            console.log('error ' + err);
                        });

                        req.write('{"value":'+qiot_value+'}');
                        console.log(" send message to [http://" + HOST + ":" + PORT + Qsend.path + ", value = " + JSON.stringify({value: qiot_value}));
                        req.end();                       
                    }
                    else{

                    }           
                }
        
            },
    //Publish search by resourcetype
    publishByType:   function (restype_name, value, Qsend){  
                for (var sensoridx in sensors) {
                    if (restype_name == sensors[sensoridx].resourcetype) {
                        sensors[sensoridx].value = value;

                        Qsend.path = '/resources/' + sensors[sensoridx].topic;
                        Qsend.method = 'PUT';
                        var qiot_value = sensors[sensoridx].value;

                        var req = http.request(Qsend, function(httpRes) {
                            var buffers = [];
                            httpRes.on('data', function(chunk) {
                                buffers.push(chunk);
                            });

                            httpRes.on('end', function(chunk) {
                                var wholeData = Buffer.concat(buffers);
                                var dataStr = wholeData.toString('utf8');
                            });
                        }).on('error', function(err) {
                            console.log('error ' + err);
                        });

                        req.write('{"value":'+qiot_value+'}');
                        console.log(" send message to [http://" + HOST + ":" + PORT + Qsend.path + ", value = " + JSON.stringify({value: qiot_value}));
                        req.end();                       
                    }
                    else{

                    }           
                }
            },
    //Subscribe search by resourceid
    subscribeById: function(id, Qreceive){
                    for (var sensoridx in sensors) {
                        if (id == sensors[sensoridx].id) {

                            Qreceive.path = '/resources/' + sensors[sensoridx].topic;
                            Qreceive.method = 'GET';
                            req = http.request(Qreceive);

                        return req
                        }
                        else{

                        }           
                    }


    }
}