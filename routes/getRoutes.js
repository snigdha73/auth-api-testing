import getController from '../controllers/getcontrollers';
import {Router} from 'express';

const routes = Router();

routes.get('/', getController.getAllUser);
routes.get('/:id', getController.getUserById);

export default routes;
