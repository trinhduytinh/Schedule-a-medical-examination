import nodemailer from "nodemailer";
require("dotenv").config();
let sendSimpleEmail = async (dataSend) => {
  const transporter = nodemailer.createTransport({
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
  const info = await transporter.sendMail({
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
    <div>Xinh chân thành cảm ơn</div>
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
module.exports = {
  sendSimpleEmail: sendSimpleEmail,
};
