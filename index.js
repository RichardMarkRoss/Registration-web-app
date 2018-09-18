const exphbs = require('express-handlebars');
const express = require('express');
const app = express();
const regFactory = require('./registration-number-factory');
const regDataBase = require('./reg-database-function');
const regRoutes = require('./routes/routes');

const bodyParser = require('body-parser');
// const flash = require('express-flash');
// const session = require('express-session');
const pg = require('pg');
const Pool = pg.Pool;

// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/plates_held';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});
const regDataFun = regDataBase(pool);
const registrationFactory = regFactory(regDataFun);
const routes = regRoutes(registrationFactory, regDataFun);

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', routes.index);
app.post('/names', routes.home);
app.get('/clear', routes.reset);
app.get('/results/:type', routes.filter);

app.use(express.static('public'));
let PORT = process.env.PORT || 4010;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});
