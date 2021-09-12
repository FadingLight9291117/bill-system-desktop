const path = require('path');

const { MongoClient } = require('mongodb');
const mongoConfig = require(path.join(__dirname, '../config')).config.remote.mongo;
const { findNotSync, setSync } = require(path.join(__dirname, '../data'))

const url = `mongodb://${mongoConfig.username}:${mongoConfig.password}@${mongoConfig.url}:${mongoConfig.port}`;
const client = new MongoClient(url);

const dbName = mongoConfig.database;


async function syncBills(bills) {
    // 连接数据库
    await client.connect();
    console.log('Connected successfully to server.');
    const db = client.db(dbName);
    const inserResult = await db.collection('bills').insertMany(bills);
    client.close();
    return inserResult;
}

function transBill(bill) {
    return {
        year: bill.YEAR,
        month: bill.MONTH,
        day: bill.DAY,
        cls1: bill.CLS1,
        cls2: bill.CLS2,
        money: bill.MONEY,
        detail: bill.DETAIL,
        dataTime: bill.DATE_TIME,
    }
}

async function mainSync() {

    // 1. 查找未同步的数据
    const bills = await findNotSync();
    if (bills.length === 0) {
        return 0;
    }
    // 2. 处理数据
    const newBills = bills.map(transBill);
    // 3. 同步数据
    await syncBills(newBills);
    // 4. 修改刚同步的数据的标志位
    setSync(bills);
    return newBills.length;
}


exports.mainSync = mainSync;
