import { parseISO, isBefore, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

const limitPerPage = 10;
class MeetupController {
  async index(req, res) {
    const { date, page } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date of event is required.' });
    }

    const parsedDate = parseISO(date);

    const meetup = await Meetup.findAll({
      where: {
        date: { [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)] },
      },
      order: ['date'],
      limit: limitPerPage,
      offset: ((page || 1) - 1) * limitPerPage,
      attributes: ['id', 'title', 'description', 'location', 'date'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
          as: 'banner',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(meetup);
  }

  async store(req, res) {
    const { title, description, date, location, banner_id } = req.body;

    if (isBefore(parseISO(date), new Date())) {
      return res
        .status(400)
        .json({ error: 'The date you entered has passed.' });
    }

    const meetup = await Meetup.create({
      title,
      description,
      date,
      location,
      banner_id,
      user_id: req.userId,
    });

    return res.status(201).json(meetup);
  }

  async update(req, res) {
    const { title, description, date, location, banner_id } = req.body;

    const meetup = await Meetup.findByPk(req.params.id);

    if (!meetup) {
      return res.status(404).json({ error: 'Meetup not found.' });
    }

    if (meetup.user_id !== req.userId) {
      return res
        .status(403)
        .json({ error: "You don't have permission to update this meetup." });
    }

    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({
        error: 'You can only edit meetups where date has not passed.',
      });
    }

    const meetupUpdated = await meetup.update({
      title,
      description,
      date,
      location,
      banner_id,
      user_id: req.userId,
    });

    return res.json(meetupUpdated);
  }

  async destroy(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);
    const response = meetup;

    if (!meetup) {
      return res.status(404).json({ error: 'Meetup not found.' });
    }

    if (meetup.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: "You don't have permission to delete this meetup." });
    }

    if (isBefore(meetup.date, new Date())) {
      return res.status(403).json({
        error: 'You can only delete meetups where date has not passed.',
      });
    }

    await meetup.destroy();

    return res.json(response);
  }
}

export default new MeetupController();
