import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
// import "./BookingModalRemote.scss";
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
import { Modal } from "reactstrap";
import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";
import DatePicker from "../../../../components/Input/DatePicker";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import Select from "react-select";
import {
  createPaymentBookingRemote,
  postPatientBookAppointment,
  postPatientBookAppointmentRemote,
} from "../../../../services/userService";
import { toast } from "react-toastify";
import moment from "moment";
import LoadingOverlay from "react-loading-overlay";

class BookingModalRemote extends Component {
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
  async componentDidMount() {
    this.props.getGenders();
  }
  buildDataGender = (data) => {
    let result = [];
    let language = this.props.language;
    if (data && data.length > 0) {
      data.map((item) => {
        let object = {};
        if (language === LANGUAGES.VI) {
          object.label = item.valueVi;
        }
        if (language === LANGUAGES.EN) {
          object.label = item.valueEn;
        }
        if (language === LANGUAGES.JA) {
          object.label = item.valueJa;
        }
        object.value = item.keyMap;
        result.push(object);
      });
    }
    return result;
  };
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }
    if (this.props.genders !== prevProps.genders) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }
    if (this.props.dataTime !== prevProps.dataTime) {
      if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
        let doctorId = this.props.dataTime.doctorID;
        let timeType = this.props.dataTime.timeType;
        this.setState({
          doctorId: doctorId,
          timeType: timeType,
        });
      }
    }
  }
  handleOnChangeInput = (event, id) => {
    let valueInput = event.target.value;
    let stateCopy = { ...this.state };
    stateCopy[id] = valueInput;
    this.setState({
      ...stateCopy,
    });
  };
  handleOnCHangeDatePicker = (date) => {
    this.setState({
      birthday: date[0],
    });
  };
  handleChangeSelect = (selectedOption) => {
    this.setState({ selectedGender: selectedOption });
  };
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

  // handleConfirmBooking = async () => {
  //   //validate input
  //   let check = this.isValidInput(this.state);
  //   if (check) {
  //     this.setState({
  //       isShowLoading: true,
  //     });
  //     let date = new Date(this.state.birthday).getTime();
  //     let timeString = this.buildTimeBooking(this.props.dataTime);
  //     let doctorName = this.buildDoctorName(this.props.dataTime);
  //     let resPayment = await createPaymentBookingRemote({
  //       fullName: this.state.fullName,
  //       phoneNumber: this.state.phoneNumber,
  //       email: this.state.email,
  //       address: this.state.address,
  //       reason: this.state.reason,
  //       date: this.props.dataTime.date,
  //       birthday: "" + date,
  //       selectedGender: this.state.selectedGender.value,
  //       doctorId: this.state.doctorId,
  //       timeType: this.state.timeType,
  //       language: this.props.language,
  //       timeString: timeString,
  //       doctorName: doctorName,
  //     });
  //     console.log("check res", resPayment);
  //     if (resPayment && resPayment.errCode === 0) {
  //       let res = await postPatientBookAppointmentRemote({
  //         fullName: this.state.fullName,
  //         phoneNumber: this.state.phoneNumber,
  //         email: this.state.email,
  //         address: this.state.address,
  //         reason: this.state.reason,
  //         date: this.props.dataTime.date,
  //         birthday: "" + date,
  //         selectedGender: this.state.selectedGender.value,
  //         doctorId: this.state.doctorId,
  //         timeType: this.state.timeType,
  //         language: this.props.language,
  //         timeString: timeString,
  //         doctorName: doctorName,
  //       });
  //       if (res && res.errCode === 0) {
  //         toast.success("Booking a new appointment succeed!");
  //         this.setState({
  //           isShowLoading: false,
  //         });
  //         this.props.closeBookingClose();
  //       } else {
  //         this.setState({
  //           isShowLoading: false,
  //         });
  //         toast.error("Booking a new appointment error!");
  //       }
  //     } else {
  //       this.setState({
  //         isShowLoading: false,
  //       });
  //       toast.error("Booking a new appointment error!");
  //     }
  //   }
  // };
  handleConfirmBooking = async () => {
    let check = this.isValidInput(this.state);
    if (check.isValid) {
      this.setState({ isShowLoading: true });
      let date = new Date(this.state.birthday).getTime();
      let timeString = this.buildTimeBooking(this.props.dataTime);
      let doctorName = this.buildDoctorName(this.props.dataTime);

      try {
        let resPayment = await createPaymentBookingRemote({
          fullName: this.state.fullName,
          phoneNumber: this.state.phoneNumber,
          email: this.state.email,
          address: this.state.address,
          reason: this.state.reason,
          date: this.props.dataTime.date,
          birthday: "" + date,
          selectedGender: this.state.selectedGender.value,
          doctorId: this.state.doctorId,
          timeType: this.state.timeType,
          language: this.props.language,
          timeString: timeString,
          doctorName: doctorName,
        });

        if (resPayment && resPayment.errCode === 0) {
          toast.success("Booking a new appointment succeed!");
          window.location.href = resPayment.paymentLink.checkoutUrl; // Redirect to payment link
        } else {
          this.setState({ isShowLoading: false });
          toast.error(
            resPayment.errMessage || "Booking a new appointment error!"
          );
        }
      } catch (error) {
        console.error("Error in handleConfirmBooking:", error);
        this.setState({ isShowLoading: false });
        toast.error("Booking a new appointment error!");
      }
    } else {
      toast.error(`Missing parameter: ${check.element}`);
    }
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
        time = dataTime.timeType;
      }
      if (language === LANGUAGES.EN) {
        date = moment
          .unix(+dataTime.date / 1000)
          .locale("en")
          .format("ddd - MM/DD/YYYY");
        time = dataTime.timeType;
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
        time = dataTime.timeType;
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
        name = `${dataTime.doctorDataRemote.lastName} ${dataTime.doctorDataRemote.firstName}`;
      if (language === LANGUAGES.JA)
        name = `${dataTime.doctorDataRemote.lastName} ${dataTime.doctorDataRemote.firstName}`;
      if (language === LANGUAGES.EN)
        name = `${dataTime.doctorDataRemote.firstName} ${dataTime.doctorDataRemote.lastName}`;
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
            size="lg"
            centered>
            <div className="booking-modal-content">
              <div className="booking-modal-header">
                <span className="left">
                  <FormattedMessage id={"pay.information-remote"}/>
                </span>
                <span className="right" onClick={closeBookingClose}>
                  <i className="fas fa-times"></i>
                </span>
              </div>
              <div className="booking-modal-body">
                <div className="doctor-infor">
                  <ProfileDoctor
                    doctorId={this.state.doctorId}
                    isShowDescriptionDoctor={false}
                    dataTime={dataTime}
                    isShowLinkDetail={false}
                    isShowPrice={true}
                  />
                </div>
                <div className="row">
                  <div className="form-group">
                    <label>
                      <FormattedMessage id={"patient.booking-modal.fullName"} />
                    </label>
                    <input
                      className="form-control"
                      value={this.state.fullName}
                      onChange={(event) =>
                        this.handleOnChangeInput(event, "fullName")
                      }></input>
                  </div>
                  <div className="form-group">
                    <label>
                      <FormattedMessage
                        id={"patient.booking-modal.phoneNumber"}
                      />
                    </label>
                    <input
                      className="form-control"
                      value={this.state.phoneNumber}
                      onChange={(event) =>
                        this.handleOnChangeInput(event, "phoneNumber")
                      }></input>
                  </div>
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
                  <div className="form-group">
                    <label>
                      <FormattedMessage id={"patient.booking-modal.address"} />
                    </label>
                    <input
                      className="form-control"
                      value={this.state.address}
                      onChange={(event) =>
                        this.handleOnChangeInput(event, "address")
                      }></input>
                  </div>
                  <div className="form-group">
                    <label>
                      <FormattedMessage id={"patient.booking-modal.reason"} />
                    </label>
                    <input
                      className="form-control"
                      value={this.state.reason}
                      onChange={(event) =>
                        this.handleOnChangeInput(event, "reason")
                      }></input>
                  </div>
                  <div className="form-group col-6">
                    <label>
                      <FormattedMessage id={"patient.booking-modal.birthday"} />
                    </label>
                    <DatePicker
                      onChange={this.handleOnCHangeDatePicker}
                      className="form-control"
                      value={this.state.birthday}
                    />
                  </div>
                  <div className="form-group col-6">
                    <label>
                      <FormattedMessage id={"patient.booking-modal.gender"} />
                    </label>
                    <Select
                      value={this.props.selectedGender}
                      onChange={this.handleChangeSelect}
                      options={this.state.genders}
                    />
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
  return {
    getGenders: () => dispatch(actions.fetchGenderStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModalRemote);
