import Mail from '../../lib/Mail';

class ConfirmationMail {
  get key() {
    return 'ConfirmationMail';
  }

  async handle({ data }) {
    const { mailData } = data;

    await Mail.sendMail({
      to: `${mailData.meetup.user.name} <${mailData.meetup.user.email}>`,
      subject: 'Inscrição Confirmada!',
      template: 'confirmation',
      context: {
        host: mailData.meetup.user.name,
        name: mailData.user.name,
        email: mailData.user.email,
        meetup: mailData.meetup.title,
      },
    });
  }
}

export default new ConfirmationMail();
