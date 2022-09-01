/* eslint-disable no-unused-vars */
let express     = require('express'),
    cors        = require('cors'),
    mongoose    = require('mongoose'),
    bodyParser  = require('body-parser'),
    createError = require('http-errors')
let dotenv = require('dotenv');
dotenv.config();


// Connect MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(process.env.URL_API, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected successfully.');
}, error => {
    console.log('Cannot connect to database ' + error);
})

const roteadorAPI = require('./routes/roteador.route');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}))

// Cors
app.use(cors());

// API
app.use('/api', roteadorAPI);

// CREATE PORT
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log('Connect to port ' + port);
})

// 404 Handler
app.use((req, res, next) => {
    next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message)
})