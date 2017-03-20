import time
import sys  
import datetime
import json
import os
import QIoT

sys.path.insert(0, '/usr/lib/python2.7/bridge/') 
from bridgeclient import BridgeClient as bridgeclient

bridge_client = bridgeclient()


client = QIoT.setup('./res/resourceinfo.json', '/ssl/');

while True:
	h0 = bridge_client.get("humidity")
	t0 = bridge_client.get("temperature")

	print "Humidity: " + h0
	print "Temperature: " + t0
	
	t = time.time()
	QIoT.sendoftype("Temperature", t0, client)
	QIoT.sendoftype("Humidity", h0, client)
	time.sleep(1)




