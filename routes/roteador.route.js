const { default: axios } = require('axios');
const express = require('express');
const roteadorRoute = express.Router();
const ApiClient = require('@logocomune/maclookup');

let roteadorModel = require('../models/Roteador');
let apiClient = new ApiClient();

roteadorRoute.route('/').get((req, res, next) => {
    roteadorModel.find((error, data) => {
        if (error) {
            return next(error);
        } else {
            res.json(data);
        }
    })
})

roteadorRoute.route('/get-roteador/:mac').get((req, res, next) => {
    roteadorModel.findOne({mac: req.params.mac}, function(error, data) {
        if (error) {
            return next(error);
        } else {
            res.json(data)
        }
    });
});

roteadorRoute.route('/save-roteador').put((req, res, next) => {
    let result = req.body.data;
    result.reincidencia = Number(result.reincidencia) + 1
    roteadorModel.findByIdAndUpdate(result._id, {
        $set: result
    }, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.json(data);
        }
    })
});

roteadorRoute.route('/create-roteador').post((req, res, next) => {
    let result = data(req.body);
    result.reincidencia = 1
    apiClient.withLRUCache()
    apiClient.getMacInfo(result.mac, (res) => {
        let vendor = res['macInfo']
        result.modelo = vendor['company'];
        switch(result.modelo){
            case 'TP-LINK TECHNOLOGIES CO.,LTD.':
                result.modelo = 'tplink';
                break;
            case 'Huawei Device Co., Ltd.':
                result.modelo = 'huawei';
                break;
            case 'Parks S/A Comunicacoes Digitais':
                result.modelo = 'parks';
                break;
            case 'Shenzhen C-Data Technology Co., Ltd.':
                result.modelo = 'xpon';
                break;
            case 'TERACOM TELEMATICA S.A':
                result.modelo = 'datacom';
                break;
            default:
                result.modelo = 'nenhum';
        }
        },
        (e) => {
            console.log("Error",e);
        },
        () => {
            roteadorModel.create(result, (error, data) => {
                if (error) {
                    return next(error);
                }else{
                    res.json(data);
                }
            })
        });
});

roteadorRoute.route('/edit-roteador/:id').get((req, res, next) => {
    roteadorModel.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.json(data);
        }
    })
})

roteadorRoute.route('/update-roteador/:id').put((req, res, next) => {
    data(req.body)
    roteadorModel.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.json(data);
        }
    })
})

roteadorRoute.route('/delete-roteador/:id').delete((req, res, next) => {
    roteadorModel.findByIdAndDelete(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

function data(req){
    var data = req.date
    var brDate = data.split('-').reverse().join('/');
    req.date = brDate

    var pppoe = req.pppoe
    req.pppoe = pppoe.toLowerCase()

    var mac = req.mac
    req.mac = mac.toUpperCase()

    return req
}

module.exports = roteadorRoute;