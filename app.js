require('rconsole')
console.set({ facility: 'local0', title: 'basic' })

var MariaClient = require('mariasql');


var HOST = "10.10.10.4"
var PORT = 4304

var Client = require("owfs").Client;
var con = new Client(HOST,PORT);

var azure = require('azure-storage');
var nconf = require('nconf');
	nconf.env()
	.file({ file: 'config.json'});

var tableName = nconf.get("TABLE_NAME");
var partitionKey = nconf.get("PARTITION_KEY");
var accountName = nconf.get("STORAGE_NAME");
var accountKey = nconf.get("STORAGE_KEY");


var l = [['ulkoE','/28.C6FA8E040000', 'Ulkolämpötila'],['varaajaMiddle','/28.FFED0E340400','Lämmitysvesi Varaaja'],['greeWaterCold','/28.FF7C4E330400','Lämpöpumppu Vesi'],['greeGasCold','/28.FF014E310400','Lämpöpumppu Kaasu'],['khh','/10.C0AB5B020800','Kodinhoitohuone'],['khhLattia','/28.FF6250330400','Kodinhoitohuone Lattia'],['keittio','/28.52B48E040000','Keittiö'],['keittioLattia','/28.FF4952330400','Keittiö Lattia'],['olohuone','/10.A6815B020800','Olohuone'],['makuuhuone','/10.52B25B020800','Makuuhuone'],['ykMH','/28.FFC94E330400','Yläkerta Makuuhuone'],['ykAula','/28.FF570F340400','Yläkerta Aula'],['verantaLattia','/28.FF8A31430400','Verannan Lattia'],['veranta','/28.FF2859330400','Veranta']]
var retryOperations = new azure.ExponentialRetryPolicyFilter();
var tableSvc = azure.createTableService(accountName, accountKey).withFilter(retryOperations);

tableSvc.createTableIfNotExists(tableName, function(error, result, response){
    if(!error){
        // Table exists or created
      console.log(result.entries);
    }
    if(error && err.code) {
      console.log('error: ' + error.code);

    }
});

function readSensor(sensor, sensorname, rowKey, now, displayName) {
	con.read(sensor, function(err, result){
		var entGen = azure.TableUtilities.entityGenerator;
		var temp = { 
		  PartitionKey: entGen.String('SoittilaTemps'),
		  RowKey: entGen.String(rowKey),
		  Sensor: entGen.String(sensorname),
		  Temperature: entGen.String(result),
		  Time: entGen.String(now),
		  DisplayName: entGen.String(displayName),
		};
		console.log('Time: ' + now + ' ' + sensorname + ' : ' + result);
		tableSvc.insertOrReplaceEntity(tableName, temp, function(error, result, response){
			if(!error) {
			// Entity updated
				console.log('Entity updated ! ');
			}
			if(error && err.code) {
				console.log('error: ' + error.code);
			}
		});
		var c = new MariaClient({host: 'localhost',db: 'lampotilat',user: 'lampo',password: 'lampotilat'});
		var prep = c.prepare('UPDATE lampotilat SET celsius = :temperature WHERE sensor = :name');
		c.query('UPDATE lampotilat SET celsius = ? WHERE sensor = ?',[result , sensorname], function(err, rows) {
		//c.query(prep({ temperature: result, name: sensorname }), function(err, rows) {
			if (err)
				c.end();
				console.log(err);
			console.dir('Temp for: ' + sensorname + ' updated ' + result);
			c.end();
		});
	})
};

function writeAzure(){
for(var i = 0; i < l.length; i++) {
	var sensor = l[i][1] + '/temperature'
	var sensorname = l[i][0]
	var rowKey = String(i+20)
        var now = new Date().toString().substr(0,24);
        var displayName = l[i][2]
 	readSensor(sensor, sensorname, rowKey, now, displayName);	

}
};

function readAzure(){
	var query = new azure.TableQuery()
	.select(['Sensor','Temperature','Time'])
	.top(11)
	.where('PartitionKey eq ?', 'SoittilaTemps');
	tableSvc.queryEntities(tableName,query, null, function(error, result, response) {
  		if(!error) {
   		 // query was successful
				console.log(result.entries);
  		}
	});
};


var minutes = 5, the_interval = minutes * 60 * 1000;
setInterval(function() {
  console.log("I am doing my 5 minutes check");
  // do your stuff here
  writeAzure();
}, the_interval);
//readAzure();
writeAzure();
