const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let roteadorSchema = new Schema({
    mac: {
        type: String
    },
    pppoe: {
        type: String
    },
    date: {
        type: String
    },
    modelo: {
        type: String
    },
    observacao: {
        type: String
    },
    reincidencia: {
        type: String
    }
}, {
    collection: 'routers'
})

module.exports = mongoose.model('Roteador', roteadorSchema)