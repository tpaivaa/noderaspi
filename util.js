var url = 'https://soittila.firebaseio.com/';
var Firebase = require('firebase');
var FirebaseClient = require('firebase-client');
var Ref = new Firebase(url);
var sensors = require('./sensors');
var base = Ref.child("temps");
var sfirebase = new FirebaseClient({
  url: url
});

var HOST = "10.10.10.4"
var PORT = 4304
var Client = require("owfs").Client;
var con = new Client(HOST,PORT);


function updatetemps(sensors) {
	Ref.once("value", function(snapshot) {
    	if (snapshot.exists()) {
    		for (sensor in sensors){
    			var sensormac = sensors[sensor][1];
    			var name = sensors[sensor][2];
    			var sensor = sensors[sensor][0];
    			console.log('logging ' + sensor);
    			if (snapshot.child("temps").exists()){
	    			updateTemp(sensor,name,sensormac);
	    			console.log('sensorille '+ sensor + ' löyty paikka');
	    		} else {
	    			console.log('Firessä ei ole ' + sensor);
	    			sfirebase.set('temps', sensor);
	    			updateTemp(sensor,name,sensormac);
	    		}
    		}
    	} else{
    		sfirebase.set('soittila', 'temps');
    	}
  	});
};

function updateTemp(sensor,name,sensormac){
	con.read(sensormac+'/temperature',function(err, result){
		var now = new Date().toString().substr(0,24);
		var data = {temp:result,'name':name,'time':now}
		sfirebase.update('temps/' + sensor, data);   			
	    });
}



module.exports = {
	updatetemps: updatetemps
}