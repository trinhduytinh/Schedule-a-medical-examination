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
        let nameEn = "",
          nameJa = "",
          descriptionHTMLEn = "",
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

          const translationNameEn = await translate(data.name, null, "en");
          nameEn = translationNameEn.translation;

          const translationNameJa = await translate(data.name, null, "ja");
          nameJa = translationNameJa.translation;
        } catch (err) {
          console.error(err);
        }
        await db.Specialty.create({
          name: data.name,
          nameEn: nameEn,
          nameJa: nameJa,
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
let getSpecialtyWithPagination = (page, limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let offset = (page - 1) * limit;
      //js object destructuring
      const { count, rows } = await db.Specialty.findAndCountAll({
        offset: offset,
        limit: limit,
      });
      let totalPages = Math.ceil(count / limit);
      let data = {
        totalRows: count,
        totalPages: totalPages,
        specialty: rows,
      };
      resolve({
        errCode: 0,
        errMessage: "ok",
        data,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let getDetailSpecialtyById = (inputId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId || !location) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.Specialty.findOne({
          where: {
            id: inputId,
          },
          attributes: [
            "nameEn",
            "nameJa",
            "descriptionHTML",
            "descriptionHTMLEn",
            "descriptionHTMLJa",
            "descriptionMarkdown",
            "descriptionMarkdownEn",
            "descriptionMarkdownJa",
          ],
        });
        if (data) {
          let doctorSpecialty = [];
          if (location === "ALL") {
            doctorSpecialty = await db.Doctor_Infor.findAll({
              where: { specialtyId: inputId },
              attributes: ["doctorId", "provinceId"],
            });
          } else {
            //find by location
            doctorSpecialty = await db.Doctor_Infor.findAll({
              where: { specialtyId: inputId, provinceId: location },
              attributes: ["doctorId", "provinceId"],
            });
          }
          data.doctorSpecialty = doctorSpecialty;
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
let deleteSpecialty = (id) => {
  return new Promise(async (resolve, reject) => {
    let specialty = await db.Specialty.findOne({
      where: { id: id },
    });
    if (!specialty) {
      resolve({
        errCode: 2,
        errMessage: `The specialty isn't exist`,
      });
    }
    await db.Specialty.destroy({
      where: { id: id },
    });
    resolve({
      errCode: 0,
      errMessage: `The specialty is deleted`,
    });
  });
};
let editSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown ||
        !data.imageBase64 ||
        !data.id
      ) {
        resolve({
          errCode: 2,
          errMessage: `Missing required parameters`,
        });
      }
      let specialty = await db.Specialty.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (specialty) {
        let nameEn = "",
          nameJa = "",
          descriptionHTMLEn = "",
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

          const translationNameEn = await translate(data.name, null, "en");
          nameEn = translationNameEn.translation;

          const translationNameJa = await translate(data.name, null, "ja");
          nameJa = translationNameJa.translation;
        } catch (err) {
          console.error(err);
        }
        specialty.name = data.name;
        specialty.nameEn = nameEn;
        specialty.nameJa = nameJa;
        specialty.descriptionHTML = data.descriptionHTML;
        specialty.descriptionHTMLEn = descriptionHTMLEn;
        specialty.descriptionHTMLJa = descriptionHTMLJa;
        specialty.descriptionMarkdown = data.descriptionMarkdown;
        specialty.descriptionMarkdownEn = descriptionMarkdownEn;
        specialty.descriptionMarkdownJa = descriptionMarkdownJa;
        specialty.image = data.imageBase64;
        await specialty.save();
        resolve({
          errCode: 0,
          errMessage: `Update the specialty succeeds!`,
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: `Specialty's not found!`,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createSpecialty: createSpecialty,
  getAllSpecialty: getAllSpecialty,
  getDetailSpecialtyById: getDetailSpecialtyById,
  deleteSpecialty: deleteSpecialty,
  editSpecialty: editSpecialty,
  getSpecialtyWithPagination: getSpecialtyWithPagination,
};
