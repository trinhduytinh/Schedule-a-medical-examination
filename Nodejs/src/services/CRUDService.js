
import db from "../models/index";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashUserPasswordFromBcrypt = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashUserPasswordFromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phonenumber: data.phonenumber,
        gender: data.gender === '1' ? true: false,
        roleId: data.roleId,
      });

      resolve('ok! create a new user succeed!')
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

let getAllUser = () =>{
  //ham promise de xu ly bat dong bo
  return new Promise( async (resolve, reject) => {
    try {
      let users = db.User.findAll({
        raw: true,//ko in nhung thu ko an thiet
      });
      resolve(users);
    } catch (e) {
      reject(e);
    }
  })
}
let getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: {id: userId},
        raw: true,
        
      })
      if (user){
        resolve(user)
      }
      else{
        resolve({});
      }
    }catch (e) {
      reject(e);
    }
  })
}
let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: {id: data.id}
    })
    if(user){
      user.firstName = data.firstName;
      user.lastName = data.lastName;
      user.address = data.address;

      await user.save();

      let allUsers = await db.User.findAll();
      resolve(allUsers);
    }
    else{
      resolve();
    }
    } catch (e) {
      console.log(e);
    }
  })
}
let deleteUserById = (id) => {
  return new Promise(async ( resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: id}
      })

      if( user ) {
        await user.destroy();
      }
      resolve(); // = return
    } catch (e) {
      reject(e);
    }
  })
} 
module.exports = {
  createNewUser: createNewUser,
  getAllUser: getAllUser,
  getUserInfoById: getUserInfoById,
  updateUserData: updateUserData,
  deleteUserById: deleteUserById,
};
