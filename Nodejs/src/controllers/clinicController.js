import clinicService from "../services/clinicService";
let createClinic = async (req, res) => {
  try {
    let infor = await clinicService.createClinic(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let getAllClinic = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;
      //+ chuyen sang kieu int
      let info = await clinicService.getClinicWithPagination(+page, +limit);
      return res.status(200).json(info);
    } else {
      let info = await clinicService.getAllClinic();
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
let deleteClinic = async (req, res) => {
  if (!req.body.id) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Missing required parameters!",
    });
  }
  let message = await clinicService.deleteClinic(req.body.id);
  return res.status(200).json(message);
};
let editClinic = async (req, res) => {
  if (!req.body) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Missing required parameters!",
    });
  }
  let message = await clinicService.editClinic(req.body);
  return res.status(200).json(message);
};
let getDetailClinicById = async (req, res) => {
  try {
    let infor = await clinicService.getDetailClinicById(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
module.exports = {
  createClinic: createClinic,
  getAllClinic: getAllClinic,
  getDetailClinicById: getDetailClinicById,
  deleteClinic: deleteClinic,
  editClinic: editClinic,
};
