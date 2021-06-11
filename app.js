var createError = require('http-errors');
const RateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const app = express();
const compression = require('compression');
const helmet = require('helmet');
const csurf = require('csurf');
const mobileRoutesV1 = require('api/v1/mobile');
const webRoutesV1 = require('api/v1/web');
const errorHandler = require('middlewares/errorHandler');
const router = require('routes');
const mongoSanitize = require('express-mongo-sanitize');
const redisClient = require('utils/cache');

// Connect database
require('db').connect();

app.set('view engine', 'ejs');
// Disable insecure headers
app.disable('x-powered-by');

app.all('/api/', (req, res) => {
    res.status = 404;
    res.json({
        success: false,
        message: 'Unknown end point'
    });
});

// Rate limiting

const limiter = new RateLimit({
    store: new RedisStore({
        client: redisClient
    }),
    max: 100
});

const csrfProtection = csurf({ cookie: true });

// MIDDLEWARES

app.use(limiter);
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(csrfProtection);
app.use(mongoSanitize());

app.use('/', router);

app.use(errorHandler);

module.exports = app;









