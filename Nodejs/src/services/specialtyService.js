const db = require("../models");
import { translate } from "bing-translate-api";
let createSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.imageBase64 ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let descriptionHTMLEn = "",
          descriptionHTMLJa = "",
          descriptionMarkdownEn = "",
          descriptionMarkdownJa = "";

        try {
          const translationHTMLen = await translate(
            data.descriptionHTML,
            null,
            "en"
          );
          descriptionHTMLEn = translationHTMLen.translation;

          const translationHTMLja = await translate(
            data.descriptionHTML,
            null,
            "ja"
          );
          descriptionHTMLJa = translationHTMLja.translation;

          const translationDescen = await translate(
            data.descriptionMarkdown,
            null,
            "en"
          );
          descriptionMarkdownEn = translationDescen.translation;

          const translationDescja = await translate(
            data.descriptionMarkdown,
            null,
            "ja"
          );
          descriptionMarkdownJa = translationDescja.translation;
        } catch (err) {
          console.error(err);
        }
        await db.Specialty.create({
          name: data.name,
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
let getAllSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll();
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = new Buffer(item.image, "base64").toString("binary");
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
module.exports = {
  createSpecialty: createSpecialty,
  getAllSpecialty: getAllSpecialty,
};
