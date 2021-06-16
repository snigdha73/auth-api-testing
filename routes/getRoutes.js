import { Router } from 'express';
import getController from '../controllers/getcontrollers';

const routes = Router();

routes.get('/', getController.getAllUser);
routes.get('/:id', getController.getUserById);

export default routes;
