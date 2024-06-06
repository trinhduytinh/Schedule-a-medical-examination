import specialtyService from "../services/specialtyService";
let createSpecialty = async (req, res) => {
  try {
    let infor = await specialtyService.createSpecialty(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let getAllSpecialty = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;
      //+ chuyen sang kieu int
      let info = await specialtyService.getSpecialtyWithPagination(
        +page,
        +limit
      );
      return res.status(200).json(info);
    } else {
      let info = await specialtyService.getAllSpecialty();
      return res.status(200).json(info);
    }
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let getDetailSpecialtyById = async (req, res) => {
  try {
    let infor = await specialtyService.getDetailSpecialtyById(
      req.query.id,
      req.query.location
    );
    return res.status(200).json(infor);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let deleteSpecialty = async (req, res) => {
  if (!req.body.id) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Missing required parameters!",
    });
  }
  let message = await specialtyService.deleteSpecialty(req.body.id);
  return res.status(200).json(message);
};
let editSpecialty = async (req, res) => {
  if (!req.body) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Missing required parameters!",
    });
  }
  let message = await specialtyService.editSpecialty(req.body);
  return res.status(200).json(message);
};
module.exports = {
  createSpecialty: createSpecialty,
  getAllSpecialty: getAllSpecialty,
  getDetailSpecialtyById: getDetailSpecialtyById,
  deleteSpecialty: deleteSpecialty,
  editSpecialty: editSpecialty,
};
