import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../src/app/models/User';

const password = faker.internet.password();

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password,
  confirmPassword: password,
});

export default factory;
