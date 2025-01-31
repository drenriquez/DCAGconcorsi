require('dotenv').config();
const cors = require('cors');
const fs = require('fs');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const { MongoClient } = require('mongodb');
const databaseConfig = require('./config/database');
const { userApiAuth } = require('./middleware/userApiAuth');

// Import GraphQL dependencies
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql-mongodb-app/schema');
const resolvers = require('./graphql-mongodb-app/resolver');

const mongoClient = new MongoClient(databaseConfig.dbURI);
mongoClient.connect(function(err) {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  console.log('Connected to MongoDB');
});
const MongoStore = require('connect-mongo');

const rfs = require('rotating-file-stream');
const helmet = require('helmet');
const homeRouter = require('./routes/home');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const dashboardRouter = require('./routes/dashboard');
const adminRouter = require('./routes/admin');
const databaseRouter = require('./routes/database');
const gestioneConcorsiRouter = require('./routes/gestioneConcorsi');
const concorsiEsterniRouter = require('./routes/concorsiEsterni');
const gestioneProveConcorsualiRouter = require('./routes/gestioneProveConcorsuali');
const gestioneProveCandidatoRouter = require('./routes/gestioneProveCandidato');
const tabellaDaRiconvocareRouter = require('./routes/TabellaDaRiconvocare');
const ConcorsiEsterniController = require('./controllers/concorsiEsterniController');
const UserController = require('./controllers/userController');
const DatabaseController = require('./controllers/databaseController');

const app = express();
const utilsPath = path.join(__dirname, 'utils');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'https://172.16.17.11',
  credentials: true
}));

const userController = new UserController();
const databaseController = new DatabaseController();
const concorsiEsterniController = new ConcorsiEsterniController();

// Configura il server GraphQL
app.use('/CONCORSI/graphql', userApiAuth, graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true, // Attiva GraphiQL per testare le query via interfaccia
}));

//REST
app.use('/CONCORSI/api', databaseController.getRouter());
app.use('/CONCORSI/api', concorsiEsterniController.getRouter());
app.use('/CONCORSI/api', userApiAuth, userController.getRouter());

app.use(helmet());
app.use(cookieParser());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 3600000,
    httpOnly: true,
    secure: false,
    sameSite: 'Lax'
  },
  store: new MongoStore({ 
    client: mongoClient, 
    dbName: databaseConfig.dbName,
    collection: 'sessions'
  })
}));

var accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: path.join(__dirname)
});
app.use(morgan('combined', { stream: accessLogStream }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'utils')));
app.use('/model', express.static(path.join(__dirname, 'model')));
app.use('/utils', express.static(path.join(__dirname, 'model')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/utils', express.static(utilsPath, {
  setHeaders: (res, filePath) => {
    if (path.extname(filePath) === '.js') {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

app.use('/CONCORSI', homeRouter);
app.use('/CONCORSI', userApiAuth, usersRouter);
app.use('/CONCORSI', loginRouter);
app.use('/CONCORSI', logoutRouter);
app.use('/CONCORSI', dashboardRouter);
app.use('/CONCORSI', adminRouter);
app.use('/CONCORSI', databaseRouter);
app.use('/CONCORSI', gestioneConcorsiRouter);
app.use('/CONCORSI', concorsiEsterniRouter);
app.use('/CONCORSI', gestioneProveConcorsualiRouter);
app.use('/CONCORSI', gestioneProveCandidatoRouter);
app.use('/CONCORSI', tabellaDaRiconvocareRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;