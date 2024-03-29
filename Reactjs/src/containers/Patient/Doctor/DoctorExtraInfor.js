import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../HomePage/HomeHeader";
import "./DoctorExtraInfor.scss";
import { getExtraInforDoctorById } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import DoctorSchedule from "./DoctorSchedule";
import { NumericFormat } from "react-number-format"; //format tien
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
class DoctorExtraInfor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDetailInfor: false,
      extraInfor: {},
    };
  }
  async componentDidMount() {
    if (this.props.doctorIdFromParent) {
      let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
      if (res && res.errCode === 0) {
        this.setState({
          extraInfor: res.data,
        });
      }
    }
  }
  showHideDetailInfor = (status) => {
    this.setState({
      isShowDetailInfor: status,
    });
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
    if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
      let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
      if (res && res.errCode === 0) {
        this.setState({
          extraInfor: res.data,
        });
      }
    }
  }
  render() {
    let { isShowDetailInfor, extraInfor } = this.state;
    let { language } = this.props;
    return (
      <div className="doctor-extra-infor-container">
        <div className="content-up">
          <div className="text-address">
            <FormattedMessage id="patient.extra-infor-doctor.text-address" />
          </div>
          <div className="name-clinic">
            {extraInfor && extraInfor.nameClinic && language === LANGUAGES.VI
              ? extraInfor.nameClinic
              : ""}
            {extraInfor && extraInfor.nameClinicEn && language === LANGUAGES.EN
              ? extraInfor.nameClinicEn
              : ""}
            {extraInfor && extraInfor.nameClinicJa && language === LANGUAGES.JA
              ? extraInfor.nameClinicJa
              : ""}
          </div>
          <div className="detail-address">
            {extraInfor && extraInfor.addressClinic && language === LANGUAGES.VI
              ? extraInfor.addressClinic
              : ""}
            {extraInfor &&
            extraInfor.addressClinicEn &&
            language === LANGUAGES.EN
              ? extraInfor.addressClinicEn
              : ""}
            {extraInfor &&
            extraInfor.addressClinicJa &&
            language === LANGUAGES.JA
              ? extraInfor.addressClinicJa
              : ""}
          </div>
        </div>
        <div className="content-down">
          {isShowDetailInfor === false && (
            <div className="short-infor">
              <FormattedMessage id="patient.extra-infor-doctor.price" />
              {extraInfor &&
                extraInfor.priceTypeData &&
                language === LANGUAGES.VI && (
                  <NumericFormat
                    className="currency"
                    value={extraInfor.priceTypeData.valueVi}
                    displayType="text"
                    thousandSeparator={true}
                    suffix="đ"
                  />
                )}
              {extraInfor &&
                extraInfor.priceTypeData &&
                language === LANGUAGES.EN && (
                  <NumericFormat
                    className="currency"
                    value={extraInfor.priceTypeData.valueEn}
                    displayType="text"
                    thousandSeparator={true}
                    suffix="$"
                  />
                )}
              {extraInfor &&
                extraInfor.priceTypeData &&
                language === LANGUAGES.JA && (
                  <NumericFormat
                    className="currency"
                    value={extraInfor.priceTypeData.valueJa}
                    displayType="text"
                    thousandSeparator={true}
                    suffix="円"
                  />
                )}
              <span
                className="detail"
                onClick={() => this.showHideDetailInfor(true)}>
                <FormattedMessage id="patient.extra-infor-doctor.detail" />
              </span>
            </div>
          )}
          {isShowDetailInfor === true && (
            <>
              <div className="title-price">
                <FormattedMessage id="patient.extra-infor-doctor.price" />
              </div>
              <div className="detail-infor">
                <div className="price">
                  <span className="left">
                    <FormattedMessage id="patient.extra-infor-doctor.price" />
                  </span>
                  <span className="right">
                    {extraInfor &&
                      extraInfor.priceTypeData &&
                      language === LANGUAGES.VI && (
                        <NumericFormat
                          className="currency"
                          value={extraInfor.priceTypeData.valueVi}
                          displayType="text"
                          thousandSeparator={true}
                          suffix="đ"
                        />
                      )}
                    {extraInfor &&
                      extraInfor.priceTypeData &&
                      language === LANGUAGES.EN && (
                        <NumericFormat
                          className="currency"
                          value={extraInfor.priceTypeData.valueEn}
                          displayType="text"
                          thousandSeparator={true}
                          suffix="$"
                        />
                      )}
                    {extraInfor &&
                      extraInfor.priceTypeData &&
                      language === LANGUAGES.JA && (
                        <NumericFormat
                          className="currency"
                          value={extraInfor.priceTypeData.valueJa}
                          displayType="text"
                          thousandSeparator={true}
                          suffix="円"
                        />
                      )}
                  </span>
                </div>
                <div className="note">
                  {extraInfor && extraInfor.note && language === LANGUAGES.VI
                    ? extraInfor.note
                    : ""}
                  {extraInfor && extraInfor.noteEn && language === LANGUAGES.EN
                    ? extraInfor.noteEn
                    : ""}
                  {extraInfor && extraInfor.noteJa && language === LANGUAGES.JA
                    ? extraInfor.noteJa
                    : ""}
                </div>
              </div>
              <div className="payment">
                <FormattedMessage id="patient.extra-infor-doctor.payment" />
                {extraInfor &&
                extraInfor.paymentTypeData &&
                language === LANGUAGES.VI
                  ? extraInfor.paymentTypeData.valueVi
                  : ""}
                {extraInfor &&
                extraInfor.paymentTypeData &&
                language === LANGUAGES.EN
                  ? extraInfor.paymentTypeData.valueEn
                  : ""}
                {extraInfor &&
                extraInfor.paymentTypeData &&
                language === LANGUAGES.JA
                  ? extraInfor.paymentTypeData.valueJa
                  : ""}
              </div>
              <div className="hide-price">
                <span onClick={() => this.showHideDetailInfor(false)}>
                  <FormattedMessage id="patient.extra-infor-doctor.hide-price" />
                </span>
              </div>
            </>
          )}
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
