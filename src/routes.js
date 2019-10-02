import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import ValidateUserStore from './app/validators/UserStore';
import ValidateUserUpdate from './app/validators/UserUpdate';
import ValidateSession from './app/validators/Session';

const routes = new Router();

routes.get('/users', UserController.index);
routes.post('/users', ValidateUserStore, UserController.store);
routes.put('/users/:id', ValidateUserUpdate, UserController.update);

routes.post('/sessions', ValidateSession, SessionController.store);

export default routes;
