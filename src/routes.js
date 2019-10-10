import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import MyMeetupController from './app/controllers/MyMeetupController';
import SubscriptionController from './app/controllers/SubscriptionController';

import ValidateUserStore from './app/validators/UserStore';
import ValidateUserUpdate from './app/validators/UserUpdate';
import ValidateSession from './app/validators/Session';
import ValidateMeetup from './app/validators/Meetup';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', ValidateUserStore, UserController.store);
routes.post('/sessions', ValidateSession, SessionController.store);

routes.use(authMiddleware);

routes.get('/users', UserController.index);
routes.put('/users', ValidateUserUpdate, UserController.update);

routes.get('/meetups', MeetupController.index);
routes.post('/meetups', ValidateMeetup, MeetupController.store);
routes.put('/meetups/:id', ValidateMeetup, MeetupController.update);
routes.delete('/meetups/:id', MeetupController.destroy);

routes.get('/mymeetups', MyMeetupController.index);

routes.get('/subscriptions', SubscriptionController.index);
routes.post('/subscriptions', SubscriptionController.store);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
