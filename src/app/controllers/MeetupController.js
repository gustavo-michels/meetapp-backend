import { parseISO, isBefore, startOfDay } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
  async store(req, res) {
    const { title, description, date, location, banner_id } = req.body;

    if (isBefore(parseISO(date), startOfDay(new Date()))) {
      return res
        .status(400)
        .json({ error: 'The date you entered has passed.' });
    }

    const user_id = req.userId;

    const meetup = await Meetup.create({
      title,
      description,
      date,
      location,
      banner_id,
      user_id,
    });

    return res.status(201).json(meetup);
  }
}

export default new MeetupController();
