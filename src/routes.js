import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';

import ValidateUserStore from './app/validators/UserStore';
import ValidateUserUpdate from './app/validators/UserUpdate';
import ValidateSession from './app/validators/Session';
import ValidateMeetup from './app/validators/Meetup';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/users', UserController.index);
routes.post('/users', ValidateUserStore, UserController.store);
routes.put('/users/:id', ValidateUserUpdate, UserController.update);

routes.post('/sessions', ValidateSession, SessionController.store);

routes.post('/meetups', ValidateMeetup, MeetupController.store);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
