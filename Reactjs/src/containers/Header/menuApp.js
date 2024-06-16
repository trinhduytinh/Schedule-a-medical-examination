export const adminMenu = [
  {
    //quản lý người dùng
    name: "menu.admin.manage-user",
    menus: [
      // {
      //   name: "menu.admin.crud",
      //   link: "/system/user-manage",
      // },
      {
        name: "menu.admin.account-management",
        link: "/system/user-redux",
      },
      {
        name: "menu.admin.manage-doctor",
        link: "/system/manage-doctor",
        // subMenus: [
        //     { name: 'menu.system.system-administrator.user-manage', link: '/system/user-manage' },
        //     { name: 'menu.system.system-administrator.user-redux', link: '/system/user-redux' },
        // ]
      },
      // {
      //     name: 'menu.admin.manage-admin', link: '/system/user-admin',
      // },
      // {
      //   //quản lý kế hoạch kahsm bệnh cảu bác sĩ

      //   name: "menu.doctor.manage-schedule",
      //   link: "/doctor/manage-schedule",
      // },
      // {
      //   name: "quản lí lịch khám từ xa",
      //   link: "/doctor/manage-schedule-remote",
      // },
    ],
  },
  {
    //quản lý phòng khám
    name: "menu.admin.clinic",
    menus: [
      {
        name: "menu.admin.manage-clinic",
        link: "/system/manage-clinic",
      },
    ],
  },
  {
    //quản lý chuyên khoa
    name: "menu.admin.specialty",
    menus: [
      {
        name: "menu.admin.manage-specialty",
        link: "/system/manage-specialty",
      },
    ],
  },
  {
    //quản lý phòng khám
    name: "menu.admin.handbook",
    menus: [
      {
        name: "menu.admin.manage-handbook",
        link: "/system/manage-handbook",
      },
    ],
  },
  {
    //Đổi mật khẩu
    name: "menu.admin.change-password",
    menus: [
      {
        name: "menu.admin.change-password",
        link: "/system/edit-password",
      },
    ],
  },
];

export const doctorMenu = [
  {
    //quản lý kế hoạch kahsm bệnh cảu bác sĩ
    name: "menu.admin.manage-user",
    menus: [
      {
        name: "menu.doctor.manage-schedule",
        link: "/doctor/manage-schedule",
      },
      {
        //quan ly benh han kham benh cua bac si
        name: "menu.doctor.manage-patient",
        link: "/doctor/manage-patient",
      },
      {
        name: "menu.doctor.manage-posts",
        link: "/doctor/manage-handbook",
      },
    ],
  },
  {
    //Đổi mật khẩu
    name: "menu.admin.change-password",
    menus: [
      {
        name: "menu.admin.change-password",
        link: "/system/edit-password",
      },
    ],
  },
];
export const doctorMenuRemote = [
  {
    //quản lý kế hoạch kahsm bệnh cảu bác sĩ
    name: "menu.admin.manage-user",
    menus: [
      {
        name: "menu.doctor.manage-schedule",
        link: "/doctor/manage-schedule",
      },
      {
        //quan ly benh han kham benh cua bac si
        name: "menu.doctor.manage-patient",
        link: "/doctor/manage-patient",
      },
      {
        name: "menu.doctor.manage-posts",
        link: "/doctor/manage-handbook",
      },
      {
        name: "menu.doctor.manage-remote-appointment-schedule",
        link: "/doctor/manage-schedule-remote",
      },
      {
        name: "menu.doctor.remote-patient-management",
        link: "/doctor/manage-patient-remote",
      },
    ],
  },
  {
    //Đổi mật khẩu
    name: "menu.admin.change-password",
    menus: [
      {
        name: "menu.admin.change-password",
        link: "/system/edit-password",
      },
    ],
  },
];
