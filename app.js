var HOST = "10.10.10.3"
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

var l = [['khh','/10.C0AB5B020800'],['makuuhuone','/10.52B25B020800'],['keittioLattia','/28.FF4952330400'],['olohuone','/10.A6815B020800'],['khhLattia','/28.FF6250330400'],['keittio','/28.52B48E040000'],['ulkoE','/28.C6FA8E040000'], ['varaajaMiddle','/28.FFED0E340400'], ['greeWaterCold','/28.FF7C4E330400'],['greeGasCold','/28.FF014E310400'],['ykMH','/28.FFC94E330400']]

var tableSvc = azure.createTableService(accountName, accountKey);
tableSvc.createTableIfNotExists(tableName, function(error, result, response){
    if(!error){
        // Table exists or created
        console.log(result + ' ' + response + 'error: ' + error)
    }
});

function readSensor(sensor, sensorname, rowKey) {
	con.read(sensor, function(err, result){
		var entGen = azure.TableUtilities.entityGenerator;
		var temp = { 
		  PartitionKey: entGen.String('SoittilaTemps'),
		  RowKey: entGen.String(rowKey),
		  Sensor: entGen.String(sensorname),
		  Temperature: entGen.String(result),
		};
    console.log(sensorname + ' : ' + result);
    console.log(temp);
    tableSvc.insertOrReplaceEntity(tableName, temp, function(error, result, response){
  if(!error) {
    // Entity updated
    console.log('insert: ' +  result + ' ' + response + 'error: ' + error)
  }
});
 })
};

function writeAzure(){
for(var i = 0; i < l.length; i++) {
	var sensor = l[i][1] + '/temperature'
	var sensorname = l[i][0]
	var rowKey = String(i)
 	readSensor(sensor, sensorname, rowKey);	

}
};

var minutes = 5, the_interval = minutes * 60 * 1000;
setInterval(function() {
  console.log("I am doing my 5 minutes check");
  // do your stuff here
  writeAzure();
}, the_interval);


