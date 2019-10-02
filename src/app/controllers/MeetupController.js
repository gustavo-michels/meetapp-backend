import Meetup from '../models/Meetup';

class MeetupController {
  async store(req, res) {
    const meetup = await Meetup.create(req.body);

    return res.status(201).json(meetup);
  }
}

export default new MeetupController();
