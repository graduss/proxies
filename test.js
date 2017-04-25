'use strict';

const proxies = require('./index')('ukr_checked.txt');

proxies.getAgent().then((a) => console.log(a));
