import express from 'express';
import routes from './routes/getRoutes';

const app = express();

app.use(express.json());

app.use('/', routes);

app.listen(8080);

export default app;
