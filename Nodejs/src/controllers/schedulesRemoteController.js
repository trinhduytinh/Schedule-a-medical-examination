import schedulesRemoteService from "../services/schedulesRemoteService";
let getAllDoctorRemote = async (req, res) => {
  try {
    let doctors = await schedulesRemoteService.getAllDoctorRemote();
    return res.status(200).json(doctors);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let bulkCreateScheduleRemote = async (req, res) => {
  try {
    let infor = await schedulesRemoteService.bulkCreateScheduleRemote(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let getScheduleRemoteByDate = async (req, res) => {
  try {
    let infor = await schedulesRemoteService.getScheduleRemoteByDate(
      req.query.doctorID,
      req.query.date
    );
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
// let getExtraInforDoctorById = async (req, res) => {
//   try {
//     let infor = await doctorService.getExtraInforDoctorById(req.query.doctorId);
//     return res.status(200).json(infor);
//   } catch (e) {
//     console.log(e);
//     return res.status(200).json({
//       errCode: -1,
//       errMessage: "Error from the server",
//     });
//   }
// };
let getDetailSpecialtyRemoteById = async (req, res) => {
  try {
    let infor = await schedulesRemoteService.getDetailSpecialtyRemoteById(
      req.query.id,
      req.query.location
    );
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let postBookAppointmentRemote = async (req, res) => {
  try {
    let infor = await schedulesRemoteService.postBookAppointmentRemote(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let postVerifyBookAppointmentRemote = async (req, res) => {
  try {
    let infor = await schedulesRemoteService.postVerifyBookAppointmentRemote(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let getListPatientRemoteForDoctor = async (req, res) => {
  try {
    let infor = await schedulesRemoteService.getListPatientRemoteForDoctor(
      req.query.doctorId,
      req.query.date
    );
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
  getAllDoctorRemote: getAllDoctorRemote,
  bulkCreateScheduleRemote: bulkCreateScheduleRemote,
  getScheduleRemoteByDate: getScheduleRemoteByDate,
  getDetailSpecialtyRemoteById: getDetailSpecialtyRemoteById,
  postBookAppointmentRemote: postBookAppointmentRemote,
  postVerifyBookAppointmentRemote: postVerifyBookAppointmentRemote,
  getListPatientRemoteForDoctor: getListPatientRemoteForDoctor
};
