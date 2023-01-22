const nodemailer = require("nodemailer");
const { responseHandler } = require("../middlewares/response-handler");

exports.sendEmail = async (req, res, next) => {
  //   AWS.config.update(config.get("AWS_SES"));
  try {
    // const ses = new AWS.SES();
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER, // generated ethereal user
        pass: process.env.MAIL_PASS, // generated ethereal password
      },
    });
    console.log(transporter.transporter.auth);
    const params = {
      from: process.env.MAIL_FROM,
      to: req.email.addresses,
      // CcAddresses: req.email.ccAddresses ? req.email.ccAddresses : null,
      html: req.email.body,
      subject: req.email.subject,
    };
    console.log(params);
    const sendEmail = await transporter.sendMail(params);
    console.log(sendEmail);
    // if (req.sms) {
    //   req.emailResponse = sendEmail;
    //   next();
    //   return;
    // }
    responseHandler(req.finals ? req.finals : sendEmail, res);
  } catch (err) {
    console.log("error occured in email", err);
    // if (req.sms) {
    //   next();
    // }
    if (req.finals) {
      responseHandler(req.finals, res);
      return;
    }
    next(err);
  }
};
