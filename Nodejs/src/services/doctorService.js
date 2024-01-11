import db from "../models/index";
import { translate } from "bing-translate-api";
let getTopDoctorHome = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        where: { roleId: "R2" },
        limit: limit,
        order: [["createdAt", "DESC"]], //sap xep theo ngay tao
        attributes: {
          //bo truong email
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllDoctor = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          //bo truong email
          exclude: ["password", "image"],
        },
      });
      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};
let saveDetailInforDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !inputData.doctorId ||
        !inputData.contentHTML ||
        !inputData.contentMarkdown ||
        !inputData.action
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let contentHTMLEn = "",
          contentHTMLJa = "",
          descriptionEn = "",
          descriptionJa = "";

        try {
          const translationHTMLen = await translate(
            inputData.contentHTML,
            null,
            "en"
          );
          contentHTMLEn = translationHTMLen.translation;

          const translationHTMLja = await translate(
            inputData.contentHTML,
            null,
            "ja"
          );
          contentHTMLJa = translationHTMLja.translation;

          const translationDescen = await translate(
            inputData.description,
            null,
            "en"
          );
          descriptionEn = translationDescen.translation;

          const translationDescja = await translate(
            inputData.description,
            null,
            "ja"
          );
          descriptionJa = translationDescja.translation;
        } catch (err) {
          console.error(err);
        }

        if (inputData.action === "CREATE") {
          await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentHTMLEn: contentHTMLEn,
            contentHTMLJa: contentHTMLJa,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
            descriptionEn: descriptionEn,
            descriptionJa: descriptionJa,
            doctorId: inputData.doctorId,
          });
        } else if (inputData.action === "EDIT") {
          let doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId: inputData.doctorId },
            raw: false,
          });
          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = inputData.contentHTML;
            doctorMarkdown.contentHTMLEn = contentHTMLEn;
            doctorMarkdown.contentHTMLJa = contentHTMLJa;
            doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
            doctorMarkdown.description = inputData.description;
            doctorMarkdown.descriptionEn = descriptionEn;
            doctorMarkdown.descriptionJa = descriptionJa;
            await doctorMarkdown.save();
          }
        }

        resolve({
          errCode: 0,
          errMessage: "Save infor doctor succeed!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getDetailDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let data = await db.User.findOne({
          where: {
            id: inputId,
          },
          attributes: {
            //bo truong email
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: [
                "description",
                "descriptionEn",
                "descriptionJa",
                "contentHTML",
                "contentHTMLEn",
                "contentHTMLJa",
                "contentMarkdown",
              ],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }
        if (!data) data = {};
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctor: getAllDoctor,
  saveDetailInforDoctor: saveDetailInforDoctor,
  getDetailDoctorById: getDetailDoctorById,
};
