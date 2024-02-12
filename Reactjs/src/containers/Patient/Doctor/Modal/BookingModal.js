import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./BookingModal.scss";
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
import { Modal } from "reactstrap";
import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";
import DatePicker from "../../../../components/Input/DatePicker";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import Select from "react-select";
import { postPatientBookAppointment } from "../../../../services/userService";
import { toast } from "react-toastify";
import moment from "moment";

class BookingModal extends Component {
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
  handleConfirmBooking = async () => {
    //validate input
    let date = new Date(this.state.birthday).getTime();
    let timeString = this.buildTimeBooking(this.props.dataTime);
    let doctorName = this.buildDoctorName(this.props.dataTime);
    let res = await postPatientBookAppointment({
      fullName: this.state.fullName,
      phoneNumber: this.state.phoneNumber,
      email: this.state.email,
      address: this.state.address,
      reason: this.state.reason,
      date: date,
      selectedGender: this.state.selectedGender.value,
      doctorId: this.state.doctorId,
      timeType: this.state.timeType,
      language: this.props.language,
      timeString: timeString,
      doctorName: doctorName,
    });
    if (res && res.errCode === 0) {
      toast.success("Booking a new appointment succeed!");
      this.props.closeBookingClose();
    } else {
      toast.error("Booking a new appointment error!");
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
      <Modal
        isOpen={isOpenModal}
        className={"booking-modal-container"}
        size="lg"
        centered>
        <div className="booking-modal-content">
          <div className="booking-modal-header">
            <span className="left">
              <FormattedMessage id={"patient.booking-modal.title"} />
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
                  <FormattedMessage id={"patient.booking-modal.phoneNumber"} />
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
            <button className="btn-booking-cancel" onClick={closeBookingClose}>
              <FormattedMessage id={"patient.booking-modal.btnCancel"} />
            </button>
          </div>
        </div>
      </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
