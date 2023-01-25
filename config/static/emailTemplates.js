// all email templates
const emailSignature = () =>
  `<br>Warm Regards,<br>
  <b>Team- Woobblr</b>
  <br>Woobblr,<br>
  </body>`;

const logo = `<img width="50px" src="https://play-lh.googleusercontent.com/2s64J-TkjEX2pnYn7hDaPV4IxewgPUR9eUvp-Py0UYVPXEuvUhoxVoD18bsYzZup_Q" alt="" /> <br>`;

const forgotPassword = (token, name, email) => {
  return {
    body: `<body>${logo} Hi ${name},<br>There was a request to change your password! <br>
If you did not make this request then please ignore this email.
Otherwise, please click below button to change your password: 
<br>
<button><a href="${process.env.CLIENT_URL}/resetPassword?token=${token}&email=${email}"> Reset Password </a></button>

${emailSignature()}`,
    addresses: email,
    subject: "Reset Password Request",
  };
};

const passwordUpdated = (name, email) => {
  return {
    body: `<body> ${logo} Hi ${name},<br> <p>You have successfully resetted the password for your Woobblr account! </p> <br>
    ${emailSignature()}`,
    addresses: email,
    subject: "New Password Updated",
  };
};
module.exports = { forgotPassword, passwordUpdated, emailSignature };
