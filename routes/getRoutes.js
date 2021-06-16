import getController from '../controllers/getcontrollers';
import app from '../auth';
import {Router} from 'express';

const routes = Router();

routes.get('/', getController.getAllUser);
routes.get('/:id', getController.getUserById);

export default routes;