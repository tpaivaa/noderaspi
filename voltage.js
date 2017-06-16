
var mqtt = require('mqtt')
var solarTopic = 'home/solarlogger/voltage';
var optiot = {password: new Buffer('passu1'), username:'soittila'}
var client  = mqtt.connect('mqtt://10.10.10.2',optiot)
var azureTables = require('azure-table-client');
var conf = require('./config'); //clientID ja secret
var azureTableClient = new azureTables.AzureTableClient();
azureTableClient.config(conf.clientID, conf.clientSecret);
var Voltage = azureTableClient.define({
				  Voltage: String,
				  Time: String,
				  UniqueIdentifier: String,
				  TableName: function () {
				  	return 'solarVoltage'
				  },
				  PartitionKey: function(model) {
				    return model.UniqueIdentifier;
				  },
				  RowKey: function(model) {
				    return model.Time;
				  }
			})
var voltage = Voltage.build({Voltage: "0", Time: "0000000000000",UniqueIdentifier:"soittilaSolar"});
var getTime = () => {
	return JSON.stringify(new Date().getTime());
} 


client.on('connect', () => {  
  client.subscribe(solarTopic)
})

client.on('message', (topic, message) => {
  // message is Buffer
  var h = JSON.parse(message.toString())
  voltage.Voltage = h.Voltage
  voltage.Time = getTime();
  console.log('received message %s %s', topic, message);
  voltage.insert();
  console.log('Voltage inserted to Azure :',  JSON.stringify(voltage));

})

