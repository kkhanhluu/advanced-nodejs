const azure = require('azure-storage');
const keys = require('../config/keys');

const blobService = azure.createBlobService(
  keys.azureStorageAccountName,
  keys.azureStorageAccessKey
);

module.exports = (app) => {
  app.get('/api/upload', (req, res) => {});
};
