const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('db.db');

function initDb() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS bill (
                    year INT,
                    month INT,
                    day INT,
                    cls1 TEXT,
                    cls2 TEXT,
                    money DECIAML,
                    detail TEXT
                )`);
    });
}

function insertBill(bills) {
    db.serialize(() => {
        let stmt = db.prepare(`INSERT INTO bill VALUES
                            (?, ?, ?, ?, ?, ?, ?)`);
        bills.forEach(bill => {
            stmt.run(
                bill.year,
                bill.month,
                bill.day,
                bill.cls1,
                bill.cls2,
                bill.money,
                bill.detail,
            );
        });
        stmt.finalize()
    });
}

exports.initDb = initDb;
exports.insertBill = insertBill;