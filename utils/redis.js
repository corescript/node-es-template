const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient();

client.on('error', function (error) {
    console.error(error);
});

client.on('ready', function () {
    console.error('Successfully connected to redis server');
});

client.get = promisify(client.get).bind(client);
client.set = promisify(client.set).bind(client);
client.del = promisify(client.del).bind(client);

// Handles user operations
client.setUser = (id, data) => client.set(`user_${id}`, JSON.stringify(data));
client.getUser = (id) => client.get(`user_${id}`);
client.delUser = (id) => client.del(`user_${id}`);

module.exports = client;
