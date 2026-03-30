const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const db = require('./bin/db');
const fs = require('fs');
const members = require('./routes/members');
const coaches = require('./routes/coaches');
const classes = require('./routes/classes');
const index = require('./routes/index');

const app = express();



const dataDir = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const dbFileName = process.env.DB_NAME || 'database.sqlite';
const dbPath = path.join(dataDir, dbFileName);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const databaseManager = db.createDatabaseManager(dbPath);
if (databaseManager.members.countAllMembers() === 0) {
  databaseManager.dbHelpers.seedSampleData();
}


app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('ejs').__express);
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


app.use(express.static(path.join(__dirname, 'static')));


app.use((request, response, next) => {
  response.locals.title = 'CourtOps';
  next();
});

app.use((request, response, next) => {
  request.db = databaseManager;
  next();
});

app.use('/', index);
app.use('/members', members);
app.use('/coaches', coaches);
app.use('/classes', classes);

module.exports = app;
