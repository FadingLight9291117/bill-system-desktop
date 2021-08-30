const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

const configFile = path.join(__dirname, 'config.yaml')

const data = fs.readFileSync(configFile, "utf8")
const config = yaml.load(data)

exports.config = config


