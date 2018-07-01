import * as nodemailer from 'nodemailer';

const mailer = {
  /* use Ethereal service */
  host: 'smtp.gmail.com',
  port: 465,
  user: 'phuhui.lian@gmail.com',
  pass: 'Test.1234',
  subject: 'Coin Check - ',
  from: 'phuhui.lian@gmail.com',
  to: 'lenardlian@gmail.com',
};

const transporter = nodemailer.createTransport({
  host: mailer.host,
  port: mailer.port,
  auth: { user: mailer.user, pass: mailer.pass },
});

const formatBody = (data, hits?) => {
  let html = `${Object.keys(data)
    .filter(key => key !== 'raw')
    .map(key => `<p>${key}: ${data[key]}</p>`)}`;
  if (hits) html = `<p>${hits} reaches limit.</p><br/>` + html;
  return html;
};

export default (data, hits?: string) => {
  const mailOptions = {
    from: '"CoinCheck 👻" <phuhui.lian@gmail.com>', // sender address
    // replyTo: mailer.user,
    to: mailer.to, // list of receivers
    subject: mailer.subject + hits ? 'Limit Reached' : 'Daily Report', // Subject line
    html: formatBody(data, hits),
  };

  return new Promise((resolve, reject) => {
    // tslint:disable-next-line:no-console
    console.log(mailOptions);
    transporter.sendMail(mailOptions, (error, info) => error
      ? reject(error)
      : resolve(info));
  });
};
