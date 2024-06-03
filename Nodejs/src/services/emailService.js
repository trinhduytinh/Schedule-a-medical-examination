import nodemailer from "nodemailer";
require("dotenv").config();
let sendSimpleEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Trịnh Duy Tính 👻" <tinhtrinh54@gmail.com>', // sender address
    to: dataSend.receiverEmail, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh", // Subject line
    // text: "Hello world?", // plain text body
    html: getBodyHTMLEmail(dataSend), // html body
  });
};
let getBodyHTMLEmail = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
    <h3>Xin chào ${dataSend.patientName}<h3/>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên wed của Trịnh Duy Tính</p>
    <p>Thông tin đặt lịch khám bệnh như sau:<p>
    <div><b>Thời gian: ${dataSend.time}</b></div>
    <div><b>Bác sĩ: ${dataSend.doctorName}</div>
    <p>Nếu các thông tin trên là chính xác , vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</p>
    <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
    <div>Xin chân thành cảm ơn</div>
    <div>Chúc bạn một ngày tốt lành</div>

`;
  }
  if (dataSend.language === "en") {
    result = `
  <h3>Hello ${dataSend.patientName}<h3/>
  <p>You are receiving this email because you have scheduled an online medical appointment on Trinh Duy Tinh's website</p>
  <p>The details of the medical appointment are as follows:<p>
  <div><b>Time: ${dataSend.time}</b></div>
  <div><b>Doctor: ${dataSend.doctorName}</b></div>
  <p>If the above information is correct, please click on the link below to confirm and complete the medical appointment booking process</p>
  <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
  <div>Thank you sincerely</div>
  <div>Wishing you a wonderful day</div>
   `;
  }
  if (dataSend.language === "ja") {
    result = `
  <h3>こんにちは ${dataSend.patientName}<h3/>
  <p>あなたがTrinh Duy Tinhのウェブサイトでオンライン医療予約を行ったため、このメールを受け取っています</p>
  <p>医療予約の詳細は次の通りです:<p>
  <div><b>時間: ${dataSend.time}</b></div>
  <div><b>医師: ${dataSend.doctorName}</b></div>
  <p>上記の情報が正しい場合、以下のリンクをクリックして医療予約の手続きを確認および完了してください</p>
  <div><a href=${dataSend.redirectLink} target="_blank">こちらをクリック</a></div>
  <div>心から感謝いたします</div>
  <div>素晴らしい一日をお過ごしください</div>
   `;
  }
  return result;
};
let sendAttachment = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Trịnh Duy Tính 👻" <tinhtrinh54@gmail.com>', // sender address
    to: dataSend.email, // list of receivers
    subject: "Hóa đơn khám bệnh", // Subject line
    // text: "Hello world?", // plain text body
    html: getBodyHTMLEmailRemedy(dataSend), // html body
    attachments: [
      //gui file
      {
        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
        content: dataSend.imgBase64.split("base64,")[1],
        encoding: "base64",
      },
    ],
  });
};
let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
    <h3>Xin chào ${dataSend.patientName}!<h3/>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên wed của Trịnh Duy Tính</p>
    <p>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ cảu chúng tôi.</p>
    <p>Thông tin đơn thuốc/hóa đơn được gửi đến bạn trong file đính kèm dưới:<p>
    <div>Xin chân thành cảm ơn.</div>
    <div>Chúc bạn một ngày tốt lành.</div>

`;
  }
  if (dataSend.language === "en") {
    result = `
    <h3>Hello ${dataSend.patientName}!<h3/>
    <p>You are receiving this email because you have scheduled an online medical appointment on Trinh Duy Tinh's website</p>
    <p>Thank you for your trust and using our services.</p>
    <p>The prescription/invoice information has been sent to you in the attached file below:<p>
    <div>Thank you sincerely.</div>
    <div>Wishing you a wonderful day.</div>
`;
  }
  if (dataSend.language === "ja") {
    result = `
    <h3>${dataSend.patientName}さん、こんにちは！<h3/>
    <p>Trinh Duy Tinhのウェブサイトでオンライン医療予約をされたため、このメールを受信しています</p>
    <p>お信頼いただき、当サービスをご利用いただき、ありがとうございます。</p>
    <p>処方箋/請求書の情報は、以下の添付ファイルに添付されています:<p>
    <div>心から感謝いたします。</div>
    <div>素晴らしい一日をお過ごしください。</div>
`;
  }
  return result;
};
let sendSimpleEmailRemote = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Trịnh Duy Tính 👻" <tinhtrinh54@gmail.com>', // sender address
    to: dataSend.receiverEmail, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh từ xa", // Subject line
    // text: "Hello world?", // plain text body
    html: getBodyHTMLEmailRemote(dataSend), // html body
  });
};
let getBodyHTMLEmailRemote = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
    <h3>Xin chào ${dataSend.patientName}<h3/>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên wed của Trịnh Duy Tính</p>
    <p>Thông tin đặt lịch khám bệnh như sau:<p>
    <div><b>Thời gian: ${dataSend.time}</b></div>
    <div><b>Bác sĩ: ${dataSend.doctorName}</div>
    <p>Cảm ơn bã đã thanh toán xác nhận đặt lịch khám online.</p>
    <p>Bạn vui lòng click vào đường link bên dưới để vào đúng giờ trên để tham gia khám từ xa.</p>
    <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
    <div>Xin chân thành cảm ơn</div>
    <div>Chúc bạn một ngày tốt lành</div>

`;
  }
  if (dataSend.language === "en") {
    result = `
    <h3>Hello ${dataSend.patientName}<h3/>
    <p>You are receiving this email because you have scheduled an online medical appointment on Trịnh Duy Tính's website.</p>
    <p>Your appointment details are as follows:<p>
    <div><b>Time: ${dataSend.time}</b></div>
    <div><b>Doctor: ${dataSend.doctorName}</div>
    <p>Thank you for your payment and confirming your online appointment.</p>
    <p>Please click the link below to join the remote consultation at the scheduled time.</p>
    <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
    <div>Sincerely,</div>
    <div>Wishing you a great day</div>    
   `;
  }
  if (dataSend.language === "ja") {
    result = `
    <h3>こんにちは${dataSend.patientName}<h3/>
    <p>このメールを受信していますのは、Trịnh Duy Tínhのウェブサイトでオンライン医療予約をされたためです。</p>
    <p>ご予約の詳細は以下の通りです:<p>
    <div><b>時間: ${dataSend.time}</b></div>
    <div><b>医師: ${dataSend.doctorName}</div>
    <p>お支払いとオンライン予約の確認ありがとうございます。</p>
    <p>スケジュールされた時間にリモート相談に参加するためには、以下のリンクをクリックしてください。</p>
    <div><a href=${dataSend.redirectLink} target="_blank">こちらをクリック</a></div>
    <div>心より</div>
    <div>良い一日をお過ごしください</div>    
   `;
  }
  return result;
};
let sendSimpleEmailForgotPassword = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Trịnh Duy Tính 👻" <tinhtrinh54@gmail.com>', // sender address
    to: dataSend.receiverEmail, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh từ xa", // Subject line
    // text: "Hello world?", // plain text body
    html: getBodyHTMLEmailForgotPassword(dataSend), // html body
  });
};
let getBodyHTMLEmailForgotPassword = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
    <h3>Xin chào ${dataSend.user}<h3/>
    <p>Bạn đã quên mật khẩu?</p>
    <p>Để đặt lại mật khẩu bạn vui lòng click vào đường link bên dưới để thay đổi mật khẩu.</p>
    <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
    <div>Xin chân thành cảm ơn</div>
    <div>Chúc bạn một ngày tốt lành</div>
`;
  }
  if (dataSend.language === "en") {
    result = `
    <h3>Hello ${dataSend.patientName}<h3/>
    <p>You are receiving this email because you have scheduled an online medical appointment on Trịnh Duy Tính's website.</p>
    <p>Your appointment details are as follows:<p>
    <div><b>Time: ${dataSend.time}</b></div>
    <div><b>Doctor: ${dataSend.doctorName}</div>
    <p>Thank you for your payment and confirming your online appointment.</p>
    <p>Please click the link below to join the remote consultation at the scheduled time.</p>
    <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
    <div>Sincerely,</div>
    <div>Wishing you a great day</div>    
   `;
  }
  if (dataSend.language === "ja") {
    result = `
    <h3>こんにちは${dataSend.patientName}<h3/>
    <p>このメールを受信していますのは、Trịnh Duy Tínhのウェブサイトでオンライン医療予約をされたためです。</p>
    <p>ご予約の詳細は以下の通りです:<p>
    <div><b>時間: ${dataSend.time}</b></div>
    <div><b>医師: ${dataSend.doctorName}</div>
    <p>お支払いとオンライン予約の確認ありがとうございます。</p>
    <p>スケジュールされた時間にリモート相談に参加するためには、以下のリンクをクリックしてください。</p>
    <div><a href=${dataSend.redirectLink} target="_blank">こちらをクリック</a></div>
    <div>心より</div>
    <div>良い一日をお過ごしください</div>    
   `;
  }
  return result;
};
module.exports = {
  sendSimpleEmail: sendSimpleEmail,
  sendAttachment: sendAttachment,
  sendSimpleEmailRemote: sendSimpleEmailRemote,
  sendSimpleEmailForgotPassword: sendSimpleEmailForgotPassword,
};
