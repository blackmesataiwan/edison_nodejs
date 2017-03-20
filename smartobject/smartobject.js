var m = require('mraa'),
    SmartObject = require('smartobject');

// Add our led blink driver to hal
var sensor = new SmartObject({
    
    Sound: new m.Aio(0),
    Rotary: new m.Aio(1),
    Piezo: new m.Aio(2),
    Light: new m.Aio(3),

    Button: new m.Gpio(2),
    Touch: new m.Gpio(4),

}, function () {
    var self = this;

    this.hal.Button.dir(m.DIR_IN);
    this.hal.Touch.dir(m.DIR_IN);  // set up direction for the button gpio
});

// Analog Input (oid = 3202 or 'aIn')
sensor.init('aIn', 0, {
    aInCurrValue: {                 // < rid = 5600, R, Float >
        read: function (cb) {
            var hal = this.parent.hal,
                value = parseInt(hal.Sound.read()/1023*100, 10);
            cb(null, value);
        }
    },
    // minMeaValue: ,               // < rid = 5601,  R, Float >
    // maxMeaValue: ,               // < rid = 5602,  R, Float >
    minRangeValue: 0,             // < rid = 5603,  R, Float >
    maxRangeValue: 100,             // < rid = 5604,  R, Float >
    // resetMinMaxMeaValues: ,      // < rid = 5605,  E, Opaque >
    // appType: ,                   // < rid = 5750, RW, String >
    sensorType: 'Sound'                 // < rid = 5751,  R, String >
});

sensor.init('aIn', 1, {
    aInCurrValue: {                 // < rid = 5600, R, Float >
        read: function (cb) {
            var hal = this.parent.hal,
                value = parseInt(hal.Rotary.read()/1023*100, 10);
            cb(null, value);
        }
    },
    // minMeaValue: ,               // < rid = 5601,  R, Float >
    // maxMeaValue: ,               // < rid = 5602,  R, Float >
    minRangeValue: 0,             // < rid = 5603,  R, Float >
    maxRangeValue: 100,             // < rid = 5604,  R, Float >
    // resetMinMaxMeaValues: ,      // < rid = 5605,  E, Opaque >
    // appType: ,                   // < rid = 5750, RW, String >
    sensorType: 'Rotary'                 // < rid = 5751,  R, String >
});

sensor.init('aIn', 2, {
    aInCurrValue: {                 // < rid = 5600, R, Float >
        read: function (cb) {
            var hal = this.parent.hal,
                value = hal.Piezo.read();
            cb(null, value);
        }
    },
    // minMeaValue: ,               // < rid = 5601,  R, Float >
    // maxMeaValue: ,               // < rid = 5602,  R, Float >
    minRangeValue: 0,             // < rid = 5603,  R, Float >
    maxRangeValue: 100,             // < rid = 5604,  R, Float >
    // resetMinMaxMeaValues: ,      // < rid = 5605,  E, Opaque >
    // appType: ,                   // < rid = 5750, RW, String >
    sensorType: "Piezo Vibration"                 // < rid = 5751,  R, String >
});

sensor.init('aIn', 3, {
    aInCurrValue: {                 // < rid = 5600, R, Float >
        read: function (cb) {
            var hal = this.parent.hal,
                value = hal.Light.read();
            cb(null, value);
        }
    },
    // minMeaValue: ,               // < rid = 5601,  R, Float >
    // maxMeaValue: ,               // < rid = 5602,  R, Float >
    // minRangeValue: ,             // < rid = 5603,  R, Float >
    // maxRangeValue: ,             // < rid = 5604,  R, Float >
    // resetMinMaxMeaValues: ,      // < rid = 5605,  E, Opaque >
    // appType: ,                   // < rid = 5750, RW, String >
    sensorType: 'Light'                 // < rid = 5751,  R, String >
});

sensor.read('aIn', 0, 'aInCurrValue', function (err, data) {
    if (!err)
        console.log('S:' + data);  // 18.4 
});
sensor.read('aIn', 1, 'aInCurrValue', function (err, data) {
    if (!err)
        console.log('R:' + data);  // 18.4 
});
sensor.read('aIn', 2, 'aInCurrValue', function (err, data) {
    if (!err)
        console.log('P:' + data);  // 18.4 
});
sensor.read('aIn', 3, 'aInCurrValue', function (err, data) {
    if (!err)
        console.log('L:' + data);  // 18.4 
});