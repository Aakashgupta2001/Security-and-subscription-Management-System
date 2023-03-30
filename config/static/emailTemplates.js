// all email templates
const emailSignature = () =>
  `<br>Warm Regards,<br>
  <b>Team- Woobblr</b>
  <br>Woobblr,<br>
  </body>`;

const logo = `<img width="50px" src="https://woobblr.co.in/wp-content/uploads/2023/01/cropped-Woobblr_Logo.png" alt="" /> <br>`;

const forgotPassword = (token, name, email, appid) => {
  return {
    body: `<body>${logo} Hi ${name},<br>There was a request to change your password! <br>
If you did not make this request then please ignore this email.
Otherwise, please click below button to change your password: 
<br>
<button><a href="${process.env.CLIENT_URL}/resetPassword?token=${token}&email=${email}&appid=${appid}"> Reset Password </a></button>
If you are not able to click on the button, pls paste this link in your browser --> <br>
<a href = "${process.env.CLIENT_URL}/resetPassword?token=${token}&email=${email}&appid=${appid}">
${process.env.CLIENT_URL}/resetPassword?token=${token}&email=${email}&appid=${appid}
</a>

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
