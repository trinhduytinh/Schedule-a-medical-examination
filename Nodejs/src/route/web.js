import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController"
import specialtyController from '../controllers/specialtyController'
import clinicController from "../controllers/clinicController";
import handbookController from "../controllers/handbookController";
import schedulesRemoteController from "../controllers/schedulesRemoteController";
let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/about", homeController.getAboutPage);
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.displayGetCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUsers);
  router.put("/api/edit-user", userController.handleEditUsers);
  router.delete("/api/delete-user", userController.handleDeleteUsers);
  router.get("/api/allcode", userController.getAllCode);
  router.post("/api/change-password", userController.changePassword);
  router.post("/api/forgot-password", userController.forgotPassword);
  router.post("/api/confirm-password", userController.confirmPassword);
  router.post("/api/create-new-user-login", userController.handleCreateNewUsersLogin);

  router.get("/api/top-doctor-home", doctorController.getTopDoctorHome);
  router.get("/api/get-all-doctors", doctorController.getAllDoctor);
  router.post("/api/save-infor-doctor", doctorController.postInforDoctor);
  router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
  router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
  router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
  router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById);
  router.get('/api/get-profile-infor-doctor-by-id', doctorController.getProfileDoctorById);
  router.get('/api/get-list-patient-for-doctor',doctorController.getListPatientForDoctor);
  router.post('/api/send-remedy', doctorController.sendRemedy);
  router.post('/api/total-stars', doctorController.totalStars);
  router.get('/api/get-stars', doctorController.getStars);

  router.post('/api/patient-book-appointment', patientController.postBookAppointment);
  router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);
  router.get('/api/get-list-patient-booking',patientController.getListPatient);
  router.delete('/api/delete-list-patient-booking',patientController.deleteListPatient);

  router.post('/api/create-new-specialty', specialtyController.createSpecialty);
  router.get('/api/get-specialty', specialtyController.getAllSpecialty);
  router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);

  router.post('/api/create-new-clinic', clinicController.createClinic);
  router.get('/api/get-clinic', clinicController.getAllClinic);
  router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);

  router.post('/api/create-new-handbook', handbookController.createHandbook);
  router.get('/api/get-handbook', handbookController.getAllHandbook);
  router.get('/api/get-detail-handbook-by-id', handbookController.getDetailHandbookById);
  router.delete('/api/delete-handbook', handbookController.deleteHandbook);
  router.put('/api/edit-handbook', handbookController.editHandbook);

  router.get("/api/get-all-doctor-remotes", schedulesRemoteController.getAllDoctorRemote);
  router.post('/api/create-new-schedules-remote', schedulesRemoteController.bulkCreateScheduleRemote);
  router.get('/api/get-schedule-remote-doctor-by-date', schedulesRemoteController.getScheduleRemoteByDate);
  router.get('/api/get-detail-specialty-remote-by-id', schedulesRemoteController.getDetailSpecialtyRemoteById);
  router.post('/api/patient-book-appointment-remote', schedulesRemoteController.postBookAppointmentRemote);
  router.get('/api/get-list-patient-remote-for-doctor',schedulesRemoteController.getListPatientRemoteForDoctor);
  router.post('/api/create-payment-booking-remote', schedulesRemoteController.createPaymentBookingRemote);
  // router.post('/api/pay-success', schedulesRemoteController.handlePaymentSuccess );

  return app.use("/", router);
};

module.exports = initWebRoutes;
