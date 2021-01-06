const azure = require('azure-storage');
const uuid = require('uuid/v1');
const keys = require('../config/keys');
const requireLogin = require('../middlewares/requireLogin');

const blobService = azure.createBlobService(
  keys.azureStorageAccountName,
  keys.azureStorageAccessKey
);

module.exports = (app) => {
  app.get('/api/upload', requireLogin, (req, res) => {
    const startDate = new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 100);
    startDate.setMinutes(startDate.getMinutes() - 100);

    const sharedAccessPolicy = {
      AccessPolicy: {
        Permissions: azure.BlobUtilities.SharedAccessPermissions.WRITE,
        Start: startDate,
        Expiry: expiryDate,
      },
    };

    const key = `${req.user.id}/${uuid()}.jpeg`;
    const sasToken = blobService.generateSharedAccessSignature(
      'blog-post',
      key,
      sharedAccessPolicy
    );
    const url = blobService.getUrl('blog-post', key, sasToken);
    res.send({ key, url });
  });
};
