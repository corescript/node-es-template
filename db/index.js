const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mongoConfig = {
    conn: {
        server: process.env.mongoDomain,
        port: process.env.mongoPort,
        database: process.env.mongoDbName,
        user: process.env.mongoUser,
        password: process.env.mongoPassword,
    },
};
mongoConfig.options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    //dbName: mongoConfig.conn.database
};
const mongoConf = {
    conString: process.env.DB_CONNECTION, //`mongodb://${mongoConfig.conn.user}:${encodeURIComponent(mongoConfig.conn.password)}@${mongoConfig.conn.server}:${mongoConfig.conn.port}`,
    options: mongoConfig.options,
};

// Register required db models here......
exports.User = require('./models/User');


exports.mongoose = mongoose;

exports.connect = () => {
    mongoose.connect(mongoConf.conString, mongoConf.options, (error) => {
        if (error) console.log('Connection error - ', error);
        else console.log('MongoDB connection established');
    });
};
