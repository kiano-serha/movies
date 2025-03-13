const nodeMailer = require("nodemailer");
const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: "sms.movies.assessment@gmail.com",
    pass: "fjgb nqtn nqek ezpo",
  },
});

const sendMail = (req, res) => {
  transporter.sendMail(
    {
      from: "Testing",
      to: req.to_address,
      subject: req.subject,
      html: req.html,
    },
    (error, info) => {
      if (error) {
        return console.log(error);
      }
      return console.log(info);
    }
  );
};

module.exports = {
  sendMail,
};
