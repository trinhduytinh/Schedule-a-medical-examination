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
let createHandbook = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.title ||
        !data.description ||
        !data.descriptionMarkdown ||
        !data.doctorId ||
        !data.imageBase64
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let titleEn = "",
          titleJa = "",
          descriptionEn = "",
          descriptionJa = "",
          descriptionMarkdownEn = "",
          descriptionMarkdownJa = "";

        try {
          // Dịch các trường dữ liệu
          titleEn = await translateText(data.title, "en");
          titleJa = await translateText(data.title, "ja");
          descriptionEn = await translateText(data.description, "en");
          descriptionJa = await translateText(data.description, "ja");
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
        await db.Handbook.create({
          title: data.title,
          titleEn: titleEn,
          titleJa: titleJa,
          description: data.description,
          descriptionEn: descriptionEn,
          descriptionJa: descriptionJa,
          descriptionMarkdown: data.descriptionMarkdown,
          descriptionMarkdownEn: descriptionMarkdownEn,
          descriptionMarkdownJa: descriptionMarkdownJa,
          doctorId: data.doctorId,
          image: data.imageBase64,
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
let getAllHandbook = (userId, userRole) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data;
      if (userRole === "R1") {
        data = await db.Handbook.findAll();
      } else if (userRole === "R2") {
        // Assuming userId is associated with Handbook Id
        data = await db.Handbook.findAll({ where: { doctorId: userId } });
      } else {
        // Handle other roles if needed
        data = [];
      }
      if (data && data.length > 0) {
        data.forEach((item) => {
          item.image = new Buffer(item.image, "base64").toString("binary");
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
let getDetailHandbookById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.Handbook.findOne({
          where: {
            id: inputId,
          },
          attributes: [
            "title",
            "titleEn",
            "titleJa",
            "description",
            "descriptionEn",
            "descriptionJa",
            "descriptionMarkdown",
            "descriptionMarkdownEn",
            "descriptionMarkdownJa",
            "image",
            "updatedAt",
          ],
          include: [
            {
              model: db.User,
              as: "doctorDataHandbook",
              attributes: ["firstName", "lastName"],
            },
          ],
          raw: true,
          nest: true,
        });
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
let updateHandbookData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.title ||
        !data.description ||
        !data.descriptionMarkdown ||
        !data.imageBase64 ||
        !data.doctorId
      ) {
        resolve({
          errCode: 2,
          errMessage: `Missing required parameters`,
        });
      }
      let handbook = await db.Handbook.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (handbook) {
        let titleEn = "",
          titleJa = "",
          descriptionEn = "",
          descriptionJa = "",
          descriptionMarkdownEn = "",
          descriptionMarkdownJa = "";
        try {
          // Dịch các trường dữ liệu
          titleEn = await translateText(data.title, "en");
          titleJa = await translateText(data.title, "ja");
          descriptionEn = await translateText(data.description, "en");
          descriptionJa = await translateText(data.description, "ja");
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
        handbook.title = data.title;
        handbook.titleEn = titleEn;
        handbook.titleJa = titleJa;
        handbook.description = data.description;
        handbook.descriptionEn = descriptionEn;
        handbook.descriptionJa = descriptionJa;
        handbook.descriptionMarkdown = data.descriptionMarkdown;
        handbook.descriptionMarkdownEn = descriptionMarkdownEn;
        handbook.descriptionMarkdownJa = descriptionMarkdownJa;
        handbook.doctorId = data.doctorId;
        handbook.image = data.imageBase64;
        await handbook.save();
        resolve({
          errCode: 0,
          errMessage: `Update the handbook succeeds!`,
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: `Handbook's not found!`,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let deleteHandbook = (id) => {
  return new Promise(async (resolve, reject) => {
    let handbook = await db.Handbook.findOne({
      where: { id: id },
    });
    if (!handbook) {
      resolve({
        errCode: 2,
        errMessage: `The handbook isn't exist`,
      });
    }
    await db.Handbook.destroy({
      where: { id: id },
    });
    resolve({
      errCode: 0,
      errMessage: `The handbook is deleted`,
    });
  });
};
module.exports = {
  createHandbook: createHandbook,
  getAllHandbook: getAllHandbook,
  getDetailHandbookById: getDetailHandbookById,
  updateHandbookData: updateHandbookData,
  deleteHandbook: deleteHandbook,
};
