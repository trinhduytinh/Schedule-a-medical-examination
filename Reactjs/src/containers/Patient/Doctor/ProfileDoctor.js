import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./ProfileDoctor.scss";
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
import { getProfileInforDoctorById } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import { NumericFormat } from "react-number-format";
import _ from "lodash";
import moment from "moment";
import { Link } from "react-router-dom";
class ProfileDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProfile: {},
      isRemote1: "",
    };
  }
  async componentDidMount() {
    let data = await this.getInforDoctor(this.props.doctorId);
    this.setState({
      dataProfile: data,
      isRemote1: this.props.isRemote,
    });
  }
  getInforDoctor = async (id) => {
    let result = {};
    if (id) {
      let res = await getProfileInforDoctorById(id);
      if (res && res.errCode === 0) {
        result = res.data;
      }
    }
    return result;
  };
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.doctorId !== prevProps.doctorId) {
      // this.getInforDoctor(this.props.doctorId);
    }
  }
  renderTimeBooking = (dataTime) => {
    let { language } = this.props;
    let date = "",
      time = "";
    if (dataTime && !_.isEmpty(dataTime)) {
      if (language === LANGUAGES.VI) {
        date = moment
          .unix(+dataTime.date / 1000)
          .format("dddd - DD/MM/YYYY")
          .replace(/^t/g, "T")
          .replace("chủ nhật", "Chủ Nhật");
        //kiem tra co ton tai ton tai du lieu trong object
        if (
          ("timeTypeData" in dataTime && "valueVi" in dataTime.timeTypeData) ===
          true
        )
          time = dataTime.timeTypeData.valueVi;
        else time = dataTime.timeType;
      }
      if (language === LANGUAGES.EN) {
        date = moment
          .unix(+dataTime.date / 1000)
          .locale("en")
          .format("ddd - MM/DD/YYYY");
        if (
          ("timeTypeData" in dataTime && "valueEn" in dataTime.timeTypeData) ===
          true
        )
          time = dataTime.timeTypeData.valueEn;
        else time = dataTime.timeType;
      }
      if (language === LANGUAGES.JA) {
        date = moment
          .unix(+dataTime.date / 1000)
          .locale("ja")
          .format("ddd - MM月DD日")
          .replace("CN", "日")
          .replace("T2", "月")
          .replace("T3", "火")
          .replace("T4", "水")
          .replace("T5", "木")
          .replace("T6", "金")
          .replace("T7", "土");
        if (
          ("timeTypeData" in dataTime && "valueVi" in dataTime.timeTypeData) ===
          true
        )
          time = dataTime.timeTypeData.valueVi;
        else time = dataTime.timeType;
      }
      return (
        <>
          <div>
            {time} - {date}
          </div>
          {dataTime &&
            !_.isEmpty(dataTime) &&
            ("timeTypeData" in dataTime && "valueEn" in dataTime.timeTypeData) === false && (
              <div><FormattedMessage id={"pay.pay-when-booking"}/></div>
            )}
          {dataTime &&
            !_.isEmpty(dataTime) &&
            ("timeTypeData" in dataTime && "valueEn" in dataTime.timeTypeData) === true && (
              <div>
                <FormattedMessage id={"patient.booking-modal.priceBooking"} />
              </div>
            )}
        </>
      );
    }
  };
  render() {
    let { dataProfile } = this.state;
    let {
      language,
      isShowDescriptionDoctor,
      dataTime,
      isShowPrice,
      isShowLinkDetail,
      isRemote,
      doctorId,
    } = this.props;
    let nameVi = "",
      nameEn = "",
      nameJa = "";
    let description, nameDoctor, price;

    if (dataProfile && dataProfile.positionData) {
      nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`;
      nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`;
      nameJa = `${dataProfile.positionData.valueJa}, ${dataProfile.lastName} ${dataProfile.firstName}`;
    }
    switch (language) {
      case LANGUAGES.VI:
        description =
          dataProfile &&
          dataProfile.Markdown &&
          dataProfile.Markdown.description;
        nameDoctor = nameVi;
        price = dataProfile && dataProfile.Doctor_Infor && (
          <NumericFormat
            className="currency"
            value={dataProfile.Doctor_Infor.priceTypeData.valueVi}
            displayType="text"
            thousandSeparator={true}
            suffix="VND"
          />
        );
        break;
      case LANGUAGES.EN:
        description =
          dataProfile &&
          dataProfile.Markdown &&
          dataProfile.Markdown.descriptionEn;
        nameDoctor = nameEn;
        price = dataProfile && dataProfile.Doctor_Infor && (
          <NumericFormat
            className="currency"
            value={dataProfile.Doctor_Infor.priceTypeData.valueEn}
            displayType="text"
            thousandSeparator={true}
            suffix="$"
          />
        );
        break;
      case LANGUAGES.JA:
        description =
          dataProfile &&
          dataProfile.Markdown &&
          dataProfile.Markdown.descriptionJa;
        nameDoctor = nameJa;
        price = dataProfile && dataProfile.Doctor_Infor && (
          <NumericFormat
            className="currency"
            value={dataProfile.Doctor_Infor.priceTypeData.valueJa}
            displayType="text"
            thousandSeparator={true}
            suffix="円"
          />
        );
        break;
      default:
        break;
    }
    return (
      <div className="profile-doctor-container">
        <div className="intro-doctor">
          <div
            className="content-left"
            style={{
              backgroundImage: `url(${
                dataProfile && dataProfile.image ? dataProfile.image : ""
              })`,
            }}></div>
          <div className="content-right">
            <div className="up">{nameDoctor}</div>
            {isShowDescriptionDoctor === true ? (
              <>
                <div className="down">
                  <span>{description}</span>
                </div>
              </>
            ) : (
              <>{this.renderTimeBooking(dataTime)}</>
            )}
          </div>
        </div>
        {isRemote === false && isShowLinkDetail === true && (
          <div className="view-detail-doctor">
            {/* Dùnglink thay cho a để cho khỏi có load lại trang, tăng trải nghiệm ng dùng */}
            <Link to={`/detail-doctor/${doctorId}`}>
              <FormattedMessage id={"patient.clinic.more"} />
            </Link>
          </div>
        )}
        {isRemote === true && isShowLinkDetail === true && (
          <div className="view-detail-doctor">
            {/* Dùnglink thay cho a để cho khỏi có load lại trang, tăng trải nghiệm ng dùng */}
            <Link to={`/detail-doctor-remote/${doctorId}`}>
              <FormattedMessage id={"patient.clinic.more"} />
            </Link>
          </div>
        )}
        {isShowPrice === true && (
          <div className="price">
            <FormattedMessage id={"patient.booking-modal.price"} />
            {price}
          </div>
        )}
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
