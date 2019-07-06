"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const md5 = require("md5");
class SMSAPI {
    constructor(options) {
        this.publicKey = options.publicKey;
        this.privateKey = options.privateKey;
        this.url = this.removeTrailingSlash(options.url);
        this.version = options.version || SMSAPI.DEFAULT_VERSION;
        this.testMode = !!options.testMode || false;
    }
    removeTrailingSlash(str) {
        return str.replace(/\/$/, "");
    }
    calcMD5(params) {
        let keys = Object.keys(params);
        let result = '';
        keys.sort();
        keys.forEach((key) => {
            //This is hack for correct md5 summ calculating
            //when we have array value in param, we must concatenate with 'Array' string
            //instead of value of this array =\
            //because of PHP origin of EPochta engine
            if (Array.isArray(params[key])) {
                result += "Array";
            }
            else {
                result += params[key];
            }
        });
        result += this.privateKey;
        return md5(result);
    }
    request(params) {
        return new Promise((resolve, reject) => {
            try {
                request.post({
                    url: `${this.url}/${this.version}/${params.action}`,
                    json: true,
                    form: params
                }, (err, res, body) => {
                    if (err) {
                        return reject(err);
                    }
                    //API always responds with statusCode=200. Need to examine body to check on errors
                    if (body.error) {
                        return reject(body);
                    }
                    if (res.statusCode !== 200) {
                        return reject(new Error(`status code:${res.statusCode}, body:${body}`));
                    }
                    let result = this.processResponce(body.result);
                    resolve(result);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    //we need this for proper md5 sum
    sanitizeParams(params) {
        for (let key in params) {
            if (params.hasOwnProperty(key) && params[key] == undefined) {
                params[key] = '';
            }
        }
    }
    processResponce(result) {
        if (!result.fields)
            return result;
        let fields = result.fields;
        let processedResult = [];
        Object.defineProperty(processedResult, 'total', { enumerable: false, value: result.count });
        result.data.forEach((item) => {
            let processedItem = {};
            fields.forEach((field, index) => {
                processedItem[field] = item[index];
            });
            processedResult.push(processedItem);
        });
        return processedResult;
    }
    send(action, params) {
        if (this.testMode) {
            params.testMode = true;
        }
        Object.assign(params, {
            action: action,
            version: this.version,
            key: this.publicKey
        });
        this.sanitizeParams(params);
        let sum = this.calcMD5(params);
        Object.assign(params, { sum: sum });
        return this.request(params);
    }
}
SMSAPI.DEFAULT_VERSION = "3.0";
exports.SMSAPI = SMSAPI;
class Addressbook {
    constructor(gateway) {
        this.gateway = gateway;
    }
    addAddressbook(params) {
        return this.gateway.send('addAddressbook', params);
    }
    delAddressbook(params) {
        return this.gateway.send('delAddressbook', params);
    }
    editAddressbook(params) {
        return this.gateway.send('editAddressbook', params);
    }
    getAddressbook(params) {
        return this.gateway.send('getAddressbook', params);
    }
    searchAddressBook(params) {
        return this.gateway.send('searchAddressBook', params);
    }
    cloneaddressbook(params) {
        return this.gateway.send('cloneaddressbook', params);
    }
    addPhoneToAddressBook(params) {
        return this.gateway.send('addPhoneToAddressBook', params);
    }
    //TODO: check if method exists. It called 'addPhonesToAddressBook' in documentation
    addPhonesToAddressBook(params) {
        return this.gateway.send('addPhonesToAddressBook', params);
    }
    getPhoneFromAddressBook(params) {
        return this.gateway.send('getPhoneFromAddressBook', params);
    }
    delPhoneFromAddressBook(params) {
        return this.gateway.send('delPhoneFromAddressBook', params);
    }
    delphonefromaddressbookgroup(params) {
        return this.gateway.send('delphonefromaddressbookgroup', params);
    }
    editPhone(params) {
        return this.gateway.send('addPhoneToAddressBook', params);
    }
    searchPhones(params) {
        return this.gateway.send('searchPhones', params);
    }
}
exports.Addressbook = Addressbook;
class Stat {
    constructor(gateway) {
        this.gateway = gateway;
    }
    //dateTime example 2012-05-01 00:20:00
    createCampaign(params) {
        params.batch = params.batch || 0;
        params.batchinterval = params.batchinterval || 0;
        return this.gateway.send('createCampaign', params);
    }
    //dateTime example 2012-05-01 00:20:00
    sendSMS(params) {
        return this.gateway.send('sendSMS', params);
    }
    //dateTime example 2012-05-01 00:20:00
    sendSMSGroup(params) {
        return this.gateway.send('sendsmsgroup', params);
    }
}
exports.Stat = Stat;
