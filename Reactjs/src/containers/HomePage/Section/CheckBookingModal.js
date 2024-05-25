import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./CheckBookingModal.scss";
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
import { Modal } from "reactstrap";
// import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";
import { LANGUAGES } from "../../../utils";
import Select from "react-select";
import { toast } from "react-toastify";
import moment from "moment";
import LoadingOverlay from "react-loading-overlay";

class CheckBookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      birthday: "",
      selectedGender: "",
      doctorId: "",
      genders: "",
      timeType: "",
      isShowLoading: false,
    };
  }
  async componentDidMount() {}
  // buildDataGender = (data) => {
  //   let result = [];
  //   let language = this.props.language;
  //   if (data && data.length > 0) {
  //     data.map((item) => {
  //       let object = {};
  //       if (language === LANGUAGES.VI) {
  //         object.label = item.valueVi;
  //       }
  //       if (language === LANGUAGES.EN) {
  //         object.label = item.valueEn;
  //       }
  //       if (language === LANGUAGES.JA) {
  //         object.label = item.valueJa;
  //       }
  //       object.value = item.keyMap;
  //       result.push(object);
  //     });
  //   }
  //   return result;
  // };
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }
  isValidInput = (inputData) => {
    let arrFields = [
      "fullName",
      "phoneNumber",
      "email",
      "address",
      "reason",
      "birthday",
      "selectedGender",
    ];
    let isValid = true;
    let element = "";
    for (let i = 0; i < arrFields.length; i++) {
      if (!inputData[arrFields[i]]) {
        isValid = false;
        element = arrFields[i];
        break;
      }
    }
    let regxEmail = /\S+@\S+\.\S+/;
    let regxPhone = /^\d{10,11}$/; // Số điện thoại gồm 10 hoặc 11 chữ số
    if (!regxEmail.test(inputData.email)) {
      toast.error("Please enter a valid email address");
      isValid = false;
    }
    if (!regxPhone.test(inputData.phoneNumber)) {
      toast.error("Please enter a valid phone number");
      isValid = false;
    }
    return {
      isValid: isValid,
      element: element,
    };
  };

  buildTimeBooking = (dataTime) => {
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
        time = dataTime.timeTypeData.valueVi;
      }
      if (language === LANGUAGES.EN) {
        date = moment
          .unix(+dataTime.date / 1000)
          .locale("en")
          .format("ddd - MM/DD/YYYY");
        time = dataTime.timeTypeData.valueEn;
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
        time = dataTime.timeTypeData.valueVi;
      }
      return `${time} - ${date}`;
    }
    return "";
  };
  buildDoctorName = (dataTime) => {
    let { language } = this.props;
    if (dataTime && !_.isEmpty(dataTime)) {
      let name = "";
      if (language === LANGUAGES.VI)
        name = `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`;
      if (language === LANGUAGES.JA)
        name = `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`;
      if (language === LANGUAGES.EN)
        name = `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`;
      return name;
    }
    return "";
  };
  render() {
    let { isOpenModal, closeBookingClose, dataTime } = this.props;
    return (
      <>
        <LoadingOverlay
          active={this.state.isShowLoading}
          spinner
          text="Loading...">
          <Modal
            isOpen={isOpenModal}
            className={"booking-modal-container"}
            size="sm"
            centered>
            <div className="booking-modal-content">
              <div className="booking-modal-header">
                <span className="left">Kiểm tra lịch khám</span>
                <span className="right" onClick={closeBookingClose}>
                  <i className="fas fa-times"></i>
                </span>
              </div>
              <div className="booking-modal-body">
                <div className="doctor-infor"></div>
                <div className="row">
                  <div className="form-group">
                    <label>
                      <FormattedMessage id={"patient.booking-modal.email"} />
                    </label>
                    <input
                      className="form-control"
                      value={this.state.email}
                      onChange={(event) =>
                        this.handleOnChangeInput(event, "email")
                      }></input>
                  </div>
                </div>
              </div>
              <div className="booking-modal-footer">
                <button
                  className="btn-booking-confirm"
                  onClick={() => this.handleConfirmBooking()}>
                  <FormattedMessage id={"patient.booking-modal.btnConfirm"} />
                </button>
                <button
                  className="btn-booking-cancel"
                  onClick={closeBookingClose}>
                  <FormattedMessage id={"patient.booking-modal.btnCancel"} />
                </button>
              </div>
            </div>
          </Modal>
        </LoadingOverlay>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genders: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckBookingModal);
