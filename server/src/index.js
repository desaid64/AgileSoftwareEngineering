import express from 'express';
import bodyParser from 'body-parser';

import users from './routes/users';
import auth from './routes/auth';
import events from './routes/events';
import departments from './routes/departments';
import rulesconfig from './routes/rulesconfig';
import callouts from './routes/callout';

const config = require('./config/hidden/config.js');

let app = express();
app.use(bodyParser.json());
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/events', events);
app.use('/api/departments', departments);
app.use('/api/rulesconfig', rulesconfig);
app.use('/api/callouts', callouts);


//database connection
var connection = require("./config/db.js");

app.listen(8080, () => console.log("Running on " + config.db.host + ":" + config.app.port));