const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data.db');

let db = new sqlite3.Database(dbPath);

function initDb() {
    const createTable = `
        CREATE TABLE IF NOT EXISTS BILL (
            ID          INTEGER     PRIMARY KEY AUTOINCREMENT,
            YEAR        INTEGER     NOT NULL,
            MONTH       INTEGER     NOT NULL,
            DAY         INTEGER     NOT NULL,
            CLS1        TEXT        NOT NULL,
            CLS2        TEXT        NOT NULL,
            MONEY       DECIAML     DEFAULT 0,
            DETAIL      TEXT        DEFAULT "",
            DATE_TIME   TEXT        NOT NULL,
            IS_SYNC     INTEGER     DEFAU
        )
    `;
    db.run(createTable);
}

function insertBill(bills) {
    const insertStmt = `
        INSERT INTO BILLS
        (YEAR, MONTH, DAY, CLS1, CLS2, MONEY, DETAIL, DATE_TIME)
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
    `
    const stmt = db.prepare(insertStmt);

    db.serialize(() => {
        bills.forEach(bill => {
            stmt.run(bill.year,
                bill.month,
                bill.day,
                bill.cls1,
                bill.cls2,
                bill.money,
                bill.detail,
                bill.dateTime);
        })
    });
    stmt.finalize()

    return bills.length;
}

// !!!注意注意
async function findNotSync() {
    const quaryStmt = `
        SELECT *
        FROM BILL
        WHERE
        IS_SYNC=0;
    `;
    const bills = await new Promise((resolve) => {
        db.all(quaryStmt, (err, rows) => {
            resolve(rows);
        });
    });
    return bills;
}

function setSync(bills) {
    const updateSql = `
        UPDATE BILL
        SET IS_SYNC=1
        WHERE
        ID=?
    `;
    const stmt = db.prepare(updateSql);

    db.serialize(() => {
        bills.map(i => stmt.run(i.ID));
    });
    stmt.finalize();

    return bills.length;
}


exports.initDb = initDb;
exports.insertBill = insertBill;
exports.findNotSync = findNotSync;
exports.setSync = setSync;