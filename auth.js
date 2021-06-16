import express from 'express';
import getController from './controllers/getcontrollers';

const app = express();

app.use(express.json());

app.get('/', getController.getAllUser);
app.get('/:id', getController.getUserById);
app.listen(8080);

export default app;
