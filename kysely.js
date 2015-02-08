var query = new azure.TableQuery()
  .top(5)
  .where('PartitionKey eq ?', 'SoittilaTemps');

tableSvc.queryEntities(tableName, query, null, function(error, result, response) {
  if(!error) {
    // query was successful
    console.log(result.entries);
  }
});