// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { contextBridge, ipcRenderer } = require('electron')
const { initDb } = require('./data')

contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);

initDb();