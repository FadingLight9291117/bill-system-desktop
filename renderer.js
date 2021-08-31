// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.



// get data
let cls1;
let cls2;

ipcRenderer.invoke('cls').then(res => {
    cls1 = res.cls1;
    cls2 = res.cls2;

    // set one class
    setCls(cls1Elem, cls1);
})


// get element
const addBill = document.getElementById("addBill");
const cancle = document.getElementById("cancle");
const cls1Elem = document.getElementById("cls1");
const cls2Elem = document.getElementById("cls2");

// set data & set listening & store data
addBill.addEventListener("click", submitBillAction);
cancle.addEventListener("click", resetBill);

cls1Elem.addEventListener("change", (e) => {
    const cls1Val = cls1Elem.value;
    setCls(cls2Elem, cls2[cls1Val]);
});

// some function
function setCls(elem, clss) {
    elem.innerHTML = `<option value="">--请选择一项--</option>`;
    clss.forEach((cls, idx) => {
        let option = `<option value="${idx}">${cls}</option>`;
        elem.innerHTML += option;
    })

}

function submitBillAction() {
    const money = document.getElementById("money").value;
    const cls1Val = document.getElementById("cls1").value;
    const cls2Val = document.getElementById("cls2").value;
    if (money == "" || cls1Val == "" || cls2Val == "") {
        console.log('请填完整');
        return;
    }
    console.log(`money: ${money}\ncls1: ${cls1[cls1Val]}\ncls2: ${cls2[cls1Val][cls2Val]}`);
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const billItem = new BillItem(year, month, day, money, cls1Val, cls2Val);
    ipcRenderer.invoke('addBill', { billItem: billItem }).then(res => {
        if (res === true) {
            resetBill();
        }
    })
}

function resetBill() {
    const money = document.getElementById("money");
    const cls1 = document.getElementById("cls1");
    const cls2 = document.getElementById("cls2");
    money.value = "";
    cls1.value = "";
    cls2.value = "";
}


class BillItem {
    constructor(year, month, day, money, cls1, cls2, detail) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.money = money;
        this.cls1 = cls1;
        this.cls2 = cls2;
        this.detail = detail ? detail : "";
    }
}