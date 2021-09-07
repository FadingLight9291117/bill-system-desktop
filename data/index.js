const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data.db');

const db = new sqlite3.Database(dbPath);

function initDb() {
    const createTable = `
        CREATE TABLE IF NOT EXISTS BILL (
            ID          INTEGER     PRIMARY KEY AUTOINCREMENT,
            YEAR        INTEGER     NOT NULL,
            MONTH       INTEGER     NOT NULL,
            DAY         INTEGER     NOT NULL,
            CLS1        TEXT        NOT NULL,
            CLS2        TEXT        NOT NULL,
            MONEY       DECIAML,
            DETAIL      TEXT,
            DATE_TIME   TEXT        NOT NULL
        )
    `;
    db.serialize(() => {
        db.run(createTable);
    });
}

function insertBill(bills) {
    const insertStmt = `
        INSERT INTO BILL
        (YEAR, MONTH, DAY, CLS1, CLS2, MONEY, DETAIL, DATE_TIME)
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
    `
    const stmt = db.prepare(insertStmt);
    db.serialize(() => {
        bills.forEach(bill => {
            stmt.run(bill.year, bill.month, bill.day, bill.cls1, bill.cls2, bill.money, bill.detail, bill.dateTime);
        })
    });

    stmt.finalize()
}

exports.initDb = initDb;
exports.insertBill = insertBill;