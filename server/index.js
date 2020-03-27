import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackConfig from '../webpack.config.dev';

import users from './routes/users';
import auth from './routes/auth';
import events from './routes/events';

const config = require('./config/hidden/config.js');

let app = express();
app.use(bodyParser.json());
app.use('/api/users',users);
app.use('/api/auth',auth);
app.use('/api/events',events);

const compiler = webpack(webpackConfig);
app.use(webpackMiddleware(compiler));

//database connection
var connection = require ("./config/db.js");

app.get('/*',(req,res) => {
    res.sendFile(path.join(__dirname,'./index.html'));
});

app.listen(3000,() => console.log("Running on " + config.db.host+ ":" + config.app.port ));