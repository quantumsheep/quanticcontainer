const app = require('express')();
const helpers = require('./helpers');

/*
| Define express properties
*/
app.set('trust proxy', 1);


/*
| Load middlewares
*/
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

const helmet = require('helmet');
app.use(helmet());

const busboy = require('connect-busboy');
app.use(busboy());

const session = require('./middlewares/session');
app.use(session);

const router = require('./middlewares/router');
app.use(router);

// ONLY IN PRODUCTION - Serve client files
if (helpers.isProd) {
    const serving = require('./middlewares/serving');
    router.use(serving);
}

/*
| Load HTTP request listener
*/
const port = 3020;
app.listen(port, () => console.log(`> Ready on http://localhost:${port}`));