
var m = require('mraa'); //require mraa
console.log('MRAA Version: ' + m.getVersion()); //write the mraa version to the console

var analogPin0 = new m.Aio(0); //setup access analog inpuput pin 0
 //read the value of the analog pin

var myDigitalPin = new m.Gpio(6); //setup digital read on pin 6
myDigitalPin.dir(m.DIR_IN); //set the gpio direction to input

periodicActivity(); //call the periodicActivity function

function periodicActivity() //
{
  var myDigitalValue =  myDigitalPin.read();
  var analogValue = analogPin0.read();	//read the digital value of the pin
  console.log('Gpio is ' + myDigitalValue);
  console.log('Aio is ' + analogValue);  //write the read value out to the console
  setTimeout(periodicActivity,1000); //call the indicated function after 1 second (1000 milliseconds)
}