import userService from "../services/userService";

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  //check email exist
  //compare password
  //return userInfor
  //access_token: JWT json web token

  if (!email || !password) {
    return res.status(500).json({
      errorCode: 1,
      message: "Missing inputs parameter!",
    });
  }

  let userData = await userService.handleUserLogin(email, password);
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};

let handleGetAllUsers = async (req, res) => {
  let { page, limit, search } = req.query;
  if (page && limit) {
    let users = await userService.getUserWithPagination(+page, +limit, search);
    return res.status(200).json({
      errCode: 0,
      errMessage: "OK",
      users,
    });
  } else {
    let id = req.query.id;
    if (!id) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Missing required parameters",
        users: [],
      });
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
      errCode: 0,
      errMessage: "OK",
      users,
    });
  }
};
let handleCreateNewUsers = async (req, res) => {
  let message = await userService.createNewUser(req.body);
  return res.status(200).json(message);
};
let handleCreateNewUsersLogin = async (req, res) => {
  try {
    let data = await userService.handleCreateNewUsersLogin(req.body);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let handleEditUsers = async (req, res) => {
  let data = req.body;
  let message = await userService.updateUserData(data);
  return res.status(200).json(message);
};
let handleDeleteUsers = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters!",
    });
  }
  let message = await userService.deleteUser(req.body.id);
  return res.status(200).json(message);
};
let getAllCode = async (req, res) => {
  try {
    let data = await userService.getAllCodeService(req.query.type);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let changePassword = async (req, res) => {
  //check email exist
  //compare password
  //return userInfor
  //access_token: JWT json web token
  let data = req.body;
  if (!data) {
    return res.status(500).json({
      errorCode: 1,
      message: "Missing inputs parameter!",
    });
  }

  let userData = await userService.changePassword(data);
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
  });
};
let forgotPassword = async (req, res) => {
  if (!req.query.email || !req.query.language) {
    return res.status(500).json({
      errorCode: 1,
      message: "Missing inputs parameter!",
    });
  }

  let userData = await userService.forgotPassword(
    req.query.email,
    req.query.language
  );
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
  });
};
let confirmPassword = async (req, res) => {
  let data = req.body;
  if (!data) {
    return res.status(500).json({
      errorCode: 1,
      message: "Missing inputs parameter!",
    });
  }

  let userData = await userService.confirmPassword(data);
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
  });
};
let handleGetUserInfo = async (req, res) => {
  try {
    let infor = await userService.handleGetUserInfo(req.query.doctorId);
    return res.status(200).json(infor);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
module.exports = {
  handleLogin: handleLogin,
  handleGetAllUsers: handleGetAllUsers,
  handleCreateNewUsers: handleCreateNewUsers,
  handleEditUsers: handleEditUsers,
  handleDeleteUsers: handleDeleteUsers,
  getAllCode: getAllCode,
  changePassword: changePassword,
  forgotPassword: forgotPassword,
  confirmPassword: confirmPassword,
  handleCreateNewUsersLogin: handleCreateNewUsersLogin,
  handleGetUserInfo: handleGetUserInfo,
};
