import handbookService from "../services/handbookService";
let createHandbook = async (req, res) => {
  try {
    let infor = await handbookService.createHandbook(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let getAllHandbook = async (req, res) => {
  const { page, limit, doctorId, role } = req.query;
  if (page && limit && doctorId && role) {
    try {
      let infor = await handbookService.getAllHandbookWithPagination(req.query);
      return res.status(200).json({
        infor,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        errCode: -1,
        errMessage: "Error from the server",
      });
    }
  } else if (!page && !limit && doctorId && role) {
    try {
      let infor = await handbookService.getAllHandbook(doctorId, role);
      return res.status(200).json(infor);
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        errCode: -1,
        errMessage: "Error from the server",
      });
    }
  } else {
    return res.status(400).json({
      errCode: -1,
      errMessage: "Missing required parameters!",
    });
  }
};
let getDetailHandbookById = async (req, res) => {
  try {
    let infor = await handbookService.getDetailHandbookById(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let editHandbook = async (req, res) => {
  let message = await handbookService.updateHandbookData(req.body);
  return res.status(200).json(message);
};
let deleteHandbook = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters!",
    });
  }
  let message = await handbookService.deleteHandbook(req.body.id);
  return res.status(200).json(message);
};
module.exports = {
  createHandbook: createHandbook,
  getAllHandbook: getAllHandbook,
  getDetailHandbookById: getDetailHandbookById,
  editHandbook: editHandbook,
  deleteHandbook: deleteHandbook,
};
