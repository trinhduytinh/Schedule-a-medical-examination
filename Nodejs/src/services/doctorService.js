import db from "../models/index";
let getTopDoctorHome = (limit) => {
    return new Promise(async(resolve, reject)=>{
        try {
            let users = await db.User.findAll({
                limit: limit,
                order: [['createdAt', 'DESC']],//sap xep theo ngay tao
                attributes: {//bo truong email
                    exclude: ["password"],
                  },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']},
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome
}