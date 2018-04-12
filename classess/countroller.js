const wifi = require('node-wifi');
const axios = require('axios');
const qs = require('querystring');
const settings = require('../settings.json')

wifi.init({ iface : null });

module.exports = class Controller {
    constructor(){
        this.SSIDChecker = null;
    }

    getCurrentSSID(){
        return new Promise((resolve, reject) => {
            let ssid = "";
            wifi.getCurrentConnections((err, currentConnections) => {
                if (err) throw reject(err);
                ssid = currentConnections[0].ssid;
                resolve(ssid);
            });
        });
    };

    enableSSIDChecker(timeout = 10000){
        // NOTE: CITのWIFIはIPアドレスの取得に15秒以上かかる。
        this.SSIDChecker = setInterval(() => {
            this.getCurrentSSID().then((SSID) => {
                if(TARGET_SSIDS.includes(SSID)){
                    // PCが対象SSIDに接続され、IPアドレスが取得できている場合
                    this.isAuthPageAvailable().then( arr => {
                        // オースページが表示できている状態
                        this.disableSSIDChecker();
                        this.login().then(res => {
                            enableSSIDChecker(15000);
                        })
                        .catch(err => {console.log(err)})
                    });
                }
            });
        }, timeout);
    }

    disableSSIDChecker(){
        clearInterval(this.SSIDChecker);
    }
    
    isAuthPageAvailable(){
        let result = null;
        return new Promise ((resolve, reject) => {
            axios.get(TARGET_URI).then(res => {resolve(true)}).catch(err => {reject(err)});
        })
    }

    login(){
        return new Promise((resolve, reject) => {
            console.log(`${TARGET_URI}${TARGET_PATH}`)
            axios.post(`${TARGET_URI}${TARGET_PATH}`, qs.stringify(
                {
                    name : settings.username,
                    pass : settings.password
                }
            )).then(res => {
                console.log(res.data)
                if(res.data.indexOf('Authentication successful!')){
                    resolve('Authentication successful!');
                } else if(res.data.indexOf('Failed')) {
                    reject('Authentication Failed.');
                } else {
                    reject('Unknown Error.');
                }
            })
            .catch(err => {
                reject(err);
            });
        });
    }
}