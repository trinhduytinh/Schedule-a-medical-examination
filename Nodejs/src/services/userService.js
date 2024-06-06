import db from "../models/index";
import bcrypt from "bcryptjs";
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";
require("dotenv").config();
const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        //user already exits
        let user = await db.User.findOne({
          attributes: [
            "id",
            "email",
            "roleId",
            "password",
            "firstName",
            "lastName",
          ],
          where: { email: email },
          raw: true,
        });
        if (user) {
          //compare password
          let check = bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "OK";
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = `Wrong password`;
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = `User's not found~`;
        }
      } else {
        //return error
        userData.errCode = 1;
        userData.errMessage = `Your's Email isn't exist in your system. Plz try other email.!`;
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};
let getUserWithPagination = (page, limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let offset = (page - 1) * limit;
      //js object destructuring
      const { count, rows } = await db.User.findAndCountAll({
        offset: offset,
        limit: limit,
      });
      let totalPages = Math.ceil(count / limit);
      let data = {
        totalRows: count,
        totalPages: totalPages,
        users: rows,
      };
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      var hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};
let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          errCode: 1,
          errMessage: "You email is already in used, Plz try another email",
        });
      } else {
        let hashUserPasswordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashUserPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phonenumber: data.phonenumber,
          gender: data.gender,
          roleId: data.roleId,
          positionId: data.positionId,
          image: data.avatar,
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
let handleCreateNewUsersLogin = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.password || !data.firstName || !data.lastName) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let check = await checkUserEmail(data.email);
        if (check === true) {
          resolve({
            errCode: 2,
            errMessage: "You email is already in used, Plz try another email",
          });
        } else {
          let hashUserPasswordFromBcrypt = await hashUserPassword(
            data.password
          );
          await db.User.create({
            email: data.email,
            password: hashUserPasswordFromBcrypt,
            firstName: data.firstName,
            lastName: data.lastName,
          });
          resolve({
            errCode: 0,
            errMessage: "OK",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    let user = await db.User.findOne({
      where: { id: userId },
    });
    if (!user) {
      resolve({
        errCode: 2,
        errMessage: `The user isn't exist`,
      });
    }
    await db.User.destroy({
      where: { id: userId },
    });
    resolve({
      errCode: 0,
      errMessage: `The user is deleted`,
    });
  });
};
let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.roleId || !data.positionId || !data.gender) {
        resolve({
          errCode: 2,
          errMessage: `Missing required parameters`,
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.roleId = data.roleId;
        user.positionId = data.positionId;
        user.gender = data.gender;
        user.phonenumber = data.phonenumber;
        if (data.avatar) {
          user.image = data.avatar;
        }
        await user.save();
        resolve({
          errCode: 0,
          errMessage: `Update the user succeeds!`,
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: `User's not found!`,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !",
        });
      } else {
        let res = {};
        let allcode = await db.Allcode.findAll({ where: { type: typeInput } });
        res.errCode = 0;
        res.data = allcode;
        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  });
};
let changePassword = (data) => {
  return new Promise(async (resolve, reject) => {
    let userData = {};
    try {
      // Kiểm tra người dùng đã tồn tại chưa
      let user = await db.User.findOne({
        attributes: [
          "id",
          "email",
          "roleId",
          "password",
          "firstName",
          "lastName",
        ],
        where: { id: data.doctorId },
        raw: true,
      });

      if (user) {
        // So sánh mật khẩu
        let check = bcrypt.compareSync(data.password, user.password);
        if (check) {
          // Nếu mật khẩu đúng, băm mật khẩu mới
          let hashUserPasswordFromBcrypt = await hashUserPassword(
            data.newPassword
          );
          // Cập nhật mật khẩu trong cơ sở dữ liệu
          await db.User.update(
            { password: hashUserPasswordFromBcrypt },
            { where: { id: data.doctorId } }
          );

          userData.errCode = 0;
          userData.errMessage = "OK";
          userData.user = user;
        } else {
          userData.errCode = 3;
          userData.errMessage = "Wrong password";
        }
      } else {
        userData.errCode = 2;
        userData.errMessage = "User's not found";
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};
let buildUrlEmail = (email, token) => {
  let result = "";
  result = `${process.env.URL_REACT}/chang-password?token=${token}&email=${email}`;
  return result;
};
let forgotPassword = (email, language) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("check email", email);
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        //user already exits
        let user = await db.User.findOne({
          attributes: [
            "id",
            "email",
            "roleId",
            "password",
            "firstName",
            "lastName",
          ],
          where: { email: email },
          raw: true,
        });
        if (user) {
          let token = uuidv4();
          //compare password
          await emailService.sendSimpleEmailForgotPassword({
            receiverEmail: email,
            user: `${user.firstName} ${user.lastName}`,
            language: language,
            redirectLink: buildUrlEmail(email, token),
          });
          await db.User.update({ password: token }, { where: { id: user.id } });
          userData.errCode = 0;
          userData.errMessage = "OK";
          userData.user = user;
        } else {
          userData.errCode = 2;
          userData.errMessage = `Email's not found~`;
        }
      } else {
        //return error
        userData.errCode = 1;
        userData.errMessage = `Your's Email isn't exist in your system. Plz try other email.!`;
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};
let confirmPassword = (data) => {
  return new Promise(async (resolve, reject) => {
    let userData = {};
    try {
      // Kiểm tra người dùng đã tồn tại chưa
      let user = await db.User.findOne({
        attributes: [
          "id",
          "email",
          "roleId",
          "password",
          "firstName",
          "lastName",
        ],
        where: { email: data.email },
        raw: true,
      });

      if (user) {
        // So sánh token với mật khẩu
        let check = data.token === user.password;
        if (check) {
          // Nếu token đúng, băm mật khẩu mới
          let hashUserPasswordFromBcrypt = await hashUserPassword(
            data.newPassword
          );
          // Cập nhật mật khẩu trong cơ sở dữ liệu
          await db.User.update(
            { password: hashUserPasswordFromBcrypt },
            { where: { id: user.id } }
          );

          userData.errCode = 0;
          userData.errMessage = "OK";
          userData.user = user;
        } else {
          userData.errCode = 3;
          userData.errMessage = "Wrong token";
        }
      } else {
        userData.errCode = 2;
        userData.errMessage = "User's not found";
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};
let handleGetUserInfo = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !",
        });
      } else {
        let data = await db.Doctor_Infor.findOne({
          where: { doctorId: doctorId },
        });
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
  handleUserLogin: handleUserLogin,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  updateUserData: updateUserData,
  getAllCodeService: getAllCodeService,
  getUserWithPagination: getUserWithPagination,
  changePassword: changePassword,
  forgotPassword: forgotPassword,
  confirmPassword: confirmPassword,
  handleCreateNewUsersLogin: handleCreateNewUsersLogin,
  handleGetUserInfo: handleGetUserInfo,
};
