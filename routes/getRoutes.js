import getController from '../controllers/getcontrollers';
import app from '../auth';

app.get('/', getController.getAllUser);
app.get('/:id', getController.getUserById);
