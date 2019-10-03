import User from '../models/User';

class UserController {
  async index(req, res) {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email'],
    });
    return res.json(users);
  }

  async store(req, res) {
    const checkEmailUser = await User.findOne({
      where: { email: req.body.email },
    });

    if (checkEmailUser) {
      return res.status(400).json({ error: 'This email already been used.' });
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({ id, name, email });
  }

  async update(req, res) {
    const { name, email, oldPassword, password, confirmPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (password || confirmPassword || oldPassword) {
      if (!(await user.checkPassword(oldPassword))) {
        return res.status(400).json({ error: 'Ivalid old password.' });
      }
      if (!password === confirmPassword) {
        return res
          .status(400)
          .json({ error: 'Password and password confirmation do not match.' });
      }
      await user.update({
        name,
        email,
        password,
      });
    }
    await user.update({ name, email });

    const userUpdated = await User.findByPk(req.userId, {
      attributes: ['id', 'name', 'email'],
    });

    return res.json(userUpdated);
  }
}

export default new UserController();
