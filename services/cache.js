const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);

client.get = util.promisify(client.get);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function () {
  const key = JSON.stringify(
    Object.assign({}, this.getOptions(), {
      collection: this.mongooseCollection.name,
    })
  );

  // see if we have a value for 'key' in redis
  const cachedValue = await client.get(key);

  // If we do, return that
  if (cachedValue) {
    console.log('CACHED', cachedValue);
    const doc = new this.model(JSON.parse(cachedValue));
    return doc;
  }

  // Otherwise, issue the query and store the result in redis
  const result = await exec.apply(this, arguments);

  console.log(result);
  await client.set(key, JSON.stringify(result));

  return result;
};
