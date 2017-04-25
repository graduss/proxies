'use strict';

const fs = require('fs');
const Promise = require("bluebird");
const HttpsProxyAgent = require('https-proxy-agent');

module.exports = function (path) {
  const reg = /^(.*:.*)@(.+):(\d+)$/;

  let LIST = loadProxies (path);

  let last = Date.now();

  function getAgent() {
    if ((Date.now() - last) > 5*60*1000) {
      LIST = loadProxies (path);
      last = Date.now();
    }

    return LIST.then((list) => {
      if (list.length === 0) return null;
      else return list[Math.floor(Math.random() * 10000) % list.length];
    })
    .then((opt) => {
      if (opt) return new HttpsProxyAgent(opt);
      else void 0;
    })
  }

  function loadProxies (path) {
    return (new Promise((res,rej) => {
      fs.readFile(path, { encoding: 'utf8' }, (err,data) => {
        if (err) rej(err);
        else res(data);
      })
    }))
    .then((data) => data.split('\n'))
    .then((list) => list.map((proxy) => {
      try {
        let [,auth, host, port] = proxy.match(reg);
        return {auth, host, port};
      } catch (e) {
        return null;
      }
    }).filter((p) => p));
  }

  return {
    getAgent
  }
}





// module.exports = function proxies (path) {
//   return new Promise((res,rej) => {
//
//   })
// }
