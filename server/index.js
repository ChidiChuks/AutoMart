import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/index';
import winston from './logger';
import '@babel/polyfill';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny', { stream: winston.stream }));
app.use(cors());

// cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Access-Token');
    next();
});

app.use('/api/v1', routes);
const port = process.env.PORT || 4000;

app.listen(port, () => winston.log('info', `Listening on port ${port}`));

module.exports = app;