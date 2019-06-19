import express from 'express';
import winston from 'winston';
import routes from './routes/index';
import 'dotenv/config';
import logger from './logging';
import docs from '../swagger.yaml';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
logger.configure();

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docs));

app.use('/api/v1', routes);
const port = process.env.PORT || 4000;

app.listen(port, () => winston.log('debug', `Listening on port ${port}`));

module.exports = app;