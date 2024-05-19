import axios from "../axios";

const handleLoginApi = (userEmail, userPassword) => {
  return axios.post("/api/login", { email: userEmail, password: userPassword });
};

const getAllUsers = (inputId) => {
  return axios.get(`/api/get-all-users?id=${inputId}`);
};
const getUsersPage=(page, limit)=>{
  return axios.get(`/api/get-all-users?page=${page}&limit=${limit}`)
}
const createNewUserService = (data) => {
  return axios.post("/api/create-new-user", data);
};

const deleteUserService = (userId) => {
  return axios.delete("/api/delete-user", {
    data: {
      id: userId,
    },
  });
};

const editUserService = (inputData) => {
  return axios.put("/api/edit-user", inputData);
};

const getAllCodeService = (inputType) => {
  return axios.get(`/api/allcode?type=${inputType}`);
};

const getTopDoctorHomeService = (limit) => {
  return axios.get(`/api/top-doctor-home?limit=${limit}`);
};

const getAllDoctor = () => {
  return axios.get(`/api/get-all-doctors`);
};
const saveDetailDoctorService = (data) => {
  return axios.post("/api/save-infor-doctor", data);
};
const getDetailInforDoctor = (inputId) => {
  return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`);
};
const saveBulkScheduleDoctor = (data) => {
  return axios.post("/api/bulk-create-schedule", data);
};
const getScheduleDoctorByDate = (doctorID, date) => {
  return axios.get(
    `/api/get-schedule-doctor-by-date?doctorID=${doctorID}&date=${date}`
  );
};
const getExtraInforDoctorById = (doctorId) => {
  return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`);
};
const getProfileInforDoctorById = (doctorId) => {
  return axios.get(`/api/get-profile-infor-doctor-by-id?doctorId=${doctorId}`);
};
const postPatientBookAppointment = (data) => {
  return axios.post("/api/patient-book-appointment", data);
};
const postVerifyBookAppointment = (data) => {
  return axios.post("/api/verify-book-appointment", data);
};
const createNewSpecialty = (data) => {
  return axios.post("/api/create-new-specialty", data);
};
const getAllSpecialty = () => {
  return axios.get(`/api/get-specialty`);
};
const getAllDetailSpecialtyById = (data) => {
  return axios.get(
    `/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`
  );
};
const createNewClinic = (data) => {
  return axios.post("/api/create-new-clinic", data);
};
const getAllClinic = () => {
  return axios.get(`/api/get-clinic`);
};
const getAllDetailClinicById = (data) => {
  return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`);
};
const getAllPatientForDoctor = (data) => {
  return axios.get(
    `/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`
  );
};
const postSendRemedy = (data) => {
  return axios.post("/api/send-remedy", data);
};
const createNewHandBookServices = (data) => {
  return axios.post("/api/create-new-handbook", data);
};
const getAllHandbook = (doctorId, role) => {
  return axios.get(`/api/get-handbook?doctorId=${doctorId}&role=${role}`);
};
const getAllDetailHandbookById = (handbookId) => {
  return axios.get(`/api/get-detail-handbook-by-id?id=${handbookId}`);
};
const deleteHandbook = (handbookId)=>{
  return axios.delete("/api/delete-handbook", {
    data: {
      id: handbookId,
    },
  });
}
const editHandbookService = (inputData) => {
  return axios.put("/api/edit-handbook", inputData);
};
const saveBulkScheduleRemoteDoctor = (data) => {
  return axios.post("/api/create-new-schedules-remote", data);
};
const getAllDoctorRemote = () => {
  return axios.get(`/api/get-all-doctor-remotes`);
};
const getAllDetailSpecialtyRemoteById = (data) => {
  return axios.get(
    `/api/get-detail-specialty-remote-by-id?id=${data.id}&location=${data.location}`
  );
};
const getScheduleRemoteByDate = (doctorID, date) => {
  return axios.get(
    `/api/get-schedule-remote-doctor-by-date?doctorID=${doctorID}&date=${date}`
  );
};

export {
  handleLoginApi,
  getAllUsers,
  createNewUserService,
  deleteUserService,
  editUserService,
  getAllCodeService,
  getTopDoctorHomeService,
  getAllDoctor,
  saveDetailDoctorService,
  getDetailInforDoctor,
  saveBulkScheduleDoctor,
  getScheduleDoctorByDate,
  getExtraInforDoctorById,
  getProfileInforDoctorById,
  postPatientBookAppointment,
  postVerifyBookAppointment,
  createNewSpecialty,
  getAllSpecialty,
  getAllDetailSpecialtyById,
  createNewClinic,
  getAllClinic,
  getAllDetailClinicById,
  getAllPatientForDoctor,
  postSendRemedy,
  createNewHandBookServices,
  getAllHandbook,
  getAllDetailHandbookById,
  deleteHandbook,
  editHandbookService,
  getUsersPage,
  saveBulkScheduleRemoteDoctor,
  getAllDoctorRemote,
  getAllDetailSpecialtyRemoteById,
  getScheduleRemoteByDate
};
