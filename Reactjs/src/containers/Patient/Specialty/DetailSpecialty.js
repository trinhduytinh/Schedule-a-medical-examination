import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./DetailSpecialty.scss";
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import {
  getAllCodeService,
  getAllDetailSpecialtyById,
} from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import _ from "lodash";
import HomeFooter from "../../HomePage/HomeFooter";

class DetailSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctorId: [],
      dataDetailSpecialty: {},
      listProvince: [],
    };
  }
  async componentDidMount() {
    //lay id trong duong dan
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      let res = await getAllDetailSpecialtyById({
        id: id,
        location: "ALL",
      });
      let resProvince = await getAllCodeService("PROVINCE");
      if (
        res &&
        res.errCode === 0 &&
        resProvince &&
        resProvince.errCode === 0
      ) {
        let data = res.data;
        let arrDoctorId = [];
        if (data && !_.isEmpty(res.data)) {
          let arr = data.doctorSpecialty;
          if (arr && arr.length > 0) {
            arr.map((item) => {
              arrDoctorId.push(item.doctorId);
            });
          }
        }
        let dataProvince = resProvince.data;
        if (dataProvince && dataProvince.length > 0) {
          dataProvince.unshift({
            createdAt: null,
            keyMap: "ALL",
            type: "PROVINCE",
            valueVi: "Toàn Quốc",
            valueEn: "ALL",
            valueJa: "全国",
          });
        }
        this.setState({
          dataDetailSpecialty: res.data,
          arrDoctorId: arrDoctorId,
          listProvince: dataProvince ? dataProvince : [],
        });
      }
    }
  }
  handleOnChangeSelect = async (event) => {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      let location = event.target.value;
      let res = await getAllDetailSpecialtyById({
        id: id,
        location: location,
      });
      if (res && res.errCode === 0) {
        let data = res.data;
        let arrDoctorId = [];
        if (data && !_.isEmpty(res.data)) {
          let arr = data.doctorSpecialty;
          if (arr && arr.length > 0) {
            arr.map((item) => {
              arrDoctorId.push(item.doctorId);
            });
          }
        }
        this.setState({
          dataDetailSpecialty: res.data,
          arrDoctorId: arrDoctorId,
        });
      }
    }
  };
  getLocationDoctor = (key) => {
    let { listProvince } = this.state;
    let { language } = this.props;
    for (let i = 0; i < listProvince.length; i++) {
      if (listProvince[i].keyMap === key && language === LANGUAGES.VI) {
        return listProvince[i].valueVi;
      }
      if (listProvince[i].keyMap === key && language === LANGUAGES.EN) {
        return listProvince[i].valueEn;
      }
      if (listProvince[i].keyMap === key && language === LANGUAGES.JA) {
        return listProvince[i].valueJa;
      }
    }
    return "";
  };
  async componentDidUpdate(prevProps, prevState, snapshot) {}
  render() {
    let { arrDoctorId, dataDetailSpecialty, listProvince } = this.state;
    let { language } = this.props;
    return (
      <div className="detail-specialty-container">
        <HomeHeader />
        <div className="detail-specialty-body">
          <div className="description-specialty">
            {dataDetailSpecialty &&
              !_.isEmpty(dataDetailSpecialty) &&
              language === LANGUAGES.VI && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: dataDetailSpecialty.descriptionHTML,
                  }}></div>
              )}
            {dataDetailSpecialty &&
              !_.isEmpty(dataDetailSpecialty) &&
              language === LANGUAGES.EN && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: dataDetailSpecialty.descriptionHTMLEn,
                  }}></div>
              )}
            {dataDetailSpecialty &&
              !_.isEmpty(dataDetailSpecialty) &&
              language === LANGUAGES.JA && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: dataDetailSpecialty.descriptionHTMLJa,
                  }}></div>
              )}
          </div>
          <div className="search-sp-doctor">
            <select onChange={(event) => this.handleOnChangeSelect(event)}>
              {listProvince &&
                listProvince.length > 0 &&
                listProvince.map((item, index) => {
                  return (
                    <option key={index} value={item.keyMap}>
                      {language === LANGUAGES.VI && item.valueVi}
                      {language === LANGUAGES.EN && item.valueEn}
                      {language === LANGUAGES.JA && item.valueJa}
                    </option>
                  );
                })}
            </select>
          </div>
          {arrDoctorId &&
            arrDoctorId.length > 0 &&
            arrDoctorId.map((item, index) => {
              let doctorLocation = dataDetailSpecialty.doctorSpecialty.find(
                (doctor) => doctor.doctorId === item
              ).provinceId;
              return (
                <div className="each-doctor" key={index}>
                  <div className="dt-content-left">
                    <ProfileDoctor
                      doctorId={item}
                      isShowDescriptionDoctor={true}
                      isShowLinkDetail={true}
                      isShowPrice={false}
                      // dataTime={dataTime}
                    />
                    <div className="location">
                      <i className="fas fa-map-marker-alt">
                        {" " + this.getLocationDoctor(doctorLocation)}
                      </i>
                    </div>
                  </div>
                  <div className="dt-content-right">
                    <div className="doctor-schedule">
                      <DoctorSchedule doctorIdFromParent={item} />
                    </div>
                    <div className="doctor-extra-infor">
                      <DoctorExtraInfor doctorIdFromParent={item} />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <HomeFooter />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
