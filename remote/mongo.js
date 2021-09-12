const { MongoClient } = require('mongo');

const mongoConfig = require('./config').mongo;


const url = `mongodb://${mongoConfig.username}:${mongoConfig.password}${mongoConfig.url}:${mongoConfig.port}`;
const client = new MongoClient(url);

const dbName = mongoConfig.database;

await function findAll() {

}

await function dbSync() {
    // 查找未同步的数据
    // 同步数据
    // 修改刚同步的数据的标志位
}


