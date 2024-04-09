const db = require("../models");
import { translate } from "bing-translate-api";
async function translateText(text, language) {
  const maxLength = 1000;
  let translation = "";
  let chunks = text.match(new RegExp(".{1," + maxLength + "}", "g"));

  for (let chunk of chunks) {
    try {
      let result = await translate(chunk, null, language);
      translation += result.translation;
    } catch (error) {
      console.error("Translation error:", error);
    }
  }

  return translation;
}
let createClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.address ||
        !data.imageBase64 ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let nameEn = "",
          nameJa = "",
          addressEn = "",
          addressJa = "",
          descriptionHTMLEn = "",
          descriptionHTMLJa = "",
          descriptionMarkdownEn = "",
          descriptionMarkdownJa = "";

        try {
          // Dịch các trường dữ liệu
          nameEn = await translateText(data.name, "en");
          nameJa = await translateText(data.name, "ja");
          addressEn = await translateText(data.address, "en");
          addressJa = await translateText(data.address, "ja");
          descriptionHTMLEn = await translateText(data.descriptionHTML, "en");
          descriptionHTMLJa = await translateText(data.descriptionHTML, "ja");
          descriptionMarkdownEn = await translateText(
            data.descriptionMarkdown,
            "en"
          );
          descriptionMarkdownJa = await translateText(
            data.descriptionMarkdown,
            "ja"
          );
        } catch (err) {
          console.error(err);
        }
        await db.Clinic.create({
          name: data.name,
          nameEn: nameEn,
          nameJa: nameJa,
          address: data.address,
          addressEn: addressEn,
          addressJa: addressJa,
          image: data.imageBase64,
          descriptionHTML: data.descriptionHTML,
          descriptionHTMLEn: descriptionHTMLEn,
          descriptionHTMLJa: descriptionHTMLJa,
          descriptionMarkdown: data.descriptionMarkdown,
          descriptionMarkdownEn: descriptionMarkdownEn,
          descriptionMarkdownJa: descriptionMarkdownJa,
        });
        resolve({
          errCode: 0,
          errMessage: "OK",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getAllClinic = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll();
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = Buffer.from(item.image, "base64").toString("binary");
          return item;
        });
      }
      resolve({
        errCode: 0,
        errMessage: "ok",
        data,
      });
    } catch (e) {
      reject(e);
    }
  });
};
let getDetailClinicById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.Clinic.findOne({
          where: {
            id: inputId,
          },
          attributes: [
            "name",
            "nameEn",
            "nameJa",
            "address",
            "addressEn",
            "addressJa",
            "descriptionHTML",
            "descriptionHTMLEn",
            "descriptionHTMLJa",
            "descriptionMarkdown",
            "descriptionMarkdownEn",
            "descriptionMarkdownJa",
          ],
        });
        if (data) {
          let doctorClinic = [];

          doctorClinic = await db.Doctor_Infor.findAll({
            where: { clinicId: inputId },
            attributes: ["doctorId", "provinceId"],
          });
          data.doctorClinic = doctorClinic;
        } else {
          data = {};
        }
        resolve({
          errMessage: "Ok",
          errCode: 0,
          data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createClinic: createClinic,
  getAllClinic: getAllClinic,
  getDetailClinicById: getDetailClinicById,
};
