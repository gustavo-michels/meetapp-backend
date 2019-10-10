import { Op } from 'sequelize';
import { isBefore } from 'date-fns';
import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';
import Queue from '../../lib/Queue';
import ConfirmationMail from '../jobs/ConfirmationMail';

class SubscriptionController {
  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      attributes: ['id'],
      include: [
        {
          model: Meetup,
          as: 'meetup',
          where: {
            date: {
              [Op.gt]: new Date(),
            },
          },
          order: ['date'],
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
        },
      ],
    });

    return res.json(subscriptions);
  }

  async store(req, res) {
    if (!req.body.meetup_id) {
      return res.status(400).json({ error: 'Field meetup_id is required.' });
    }

    const meetup = await Meetup.findByPk(req.body.meetup_id);
    if (!meetup) {
      return res.status(404).json({ error: 'Meetup not found.' });
    }

    const checkIfAlreadyRegistered = await Subscription.findOne({
      where: {
        user_id: req.userId,
        meetup_id: meetup.id,
      },
    });

    if (checkIfAlreadyRegistered) {
      return res
        .status(400)
        .json({ error: 'You are already subscribe for this meetup.' });
    }

    if (meetup.user_id === req.userId) {
      return res
        .status(400)
        .json({ error: 'You cannot subscribe in owns meetups.' });
    }

    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({
        error: 'You cannot subscribe for meetups where the date passed.',
      });
    }

    const userMeetups = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
    });

    const meetupIds = userMeetups.map(id => id.meetup_id);

    const countMeetupsInDate = await Meetup.count({
      where: {
        id: {
          [Op.in]: meetupIds,
        },
        date: meetup.date,
      },
    });

    if (countMeetupsInDate > 0) {
      return res.status(400).json({
        error: "Can't subscribe to a meetup at the same date of another one.",
      });
    }

    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id: meetup.id,
    });

    const mailData = await Subscription.findOne({
      where: {
        user_id: req.userId,
        meetup_id: meetup.id,
      },
      attributes: ['id'],
      include: [
        {
          model: Meetup,
          as: 'meetup',
          attributes: ['title'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['name', 'email'],
            },
          ],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
        },
      ],
    });

    await Queue.add(ConfirmationMail.key, {
      mailData,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
