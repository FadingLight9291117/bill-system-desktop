// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})


const { contextBridge } = require('electron')

const cls1 = ["食品", "饮料", "衣服"];
const cls2 = [
  ["早餐", "午餐"],
  ["奶茶", "可乐"],
  ["上衣", "鞋子"],
];

contextBridge.exposeInMainWorld('cls', {
  cls1: cls1,
  cls2: cls2,
})
const { ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);
