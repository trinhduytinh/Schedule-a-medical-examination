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
import DatePicker from "../../../components/Input/DatePicker";
import ViewBookingModal from "./ViewBookingModal";
import { getListPatientBooking } from "../../../services/userService";

class CheckBookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      day: "",
      data: [],
      isShowLoading: false,
      isOpenModalCheckBooking: false,
    };
  }

  async componentDidMount() {}

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  handleOnChangeDatePicker = (date) => {
    this.setState({
      day: date[0],
    });
  };

  handleConfirmCheckBooking = async () => {
    let { email, day } = this.state;

    // Validate email
    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (!this.isValidGmail(email)) {
      toast.error("Please enter a valid Gmail address");
      return;
    }

    if (!day) {
      toast.error("Date is required");
      return;
    }

    let formattedDate = new Date(day).getTime();
    let res = await getListPatientBooking(email, formattedDate);
    if (res && res.errCode === 0) {
      this.setState({
        data: res.data,
        isOpenModalCheckBooking: true,
      });
    }
  };

  isValidGmail = (email) => {
    let regxEmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return regxEmail.test(email);
  };

  handleOnChangeInput = (event, id) => {
    let valueInput = event.target.value;
    let stateCopy = { ...this.state };
    stateCopy[id] = valueInput;
    this.setState({
      ...stateCopy,
    });
  };

  closeCheckBookingClose = () => {
    this.setState({
      isOpenModalCheckBooking: false,
    });
  };

  refreshData = async () => {
    let { email, day } = this.state;
    let formattedDate = new Date(day).getTime();
    let res = await getListPatientBooking(email, formattedDate);
    if (res && res.errCode === 0) {
      this.setState({
        data: res.data,
      });
    }
  };

  render() {
    let { isOpenModal, closeBookingClose } = this.props;
    let { isOpenModalCheckBooking, data } = this.state;
    return (
      <>
        <Modal
          isOpen={isOpenModal}
          className={"booking-modal-container"}
          size="sm"
          centered>
          <div className="booking-modal-content">
            <div className="booking-modal-header">
              <span className="left">
                <FormattedMessage id={"pay.check-medical-schedule"} />
              </span>
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
              <div className="row">
                <div className="form-group">
                  <label>
                    <FormattedMessage id={"manage-schedule.choose-date"} />
                  </label>
                  <DatePicker
                    onChange={this.handleOnChangeDatePicker}
                    className="form-control"
                    value={this.state.day}
                  />
                </div>
              </div>
            </div>
            <div className="booking-modal-footer">
              <button
                className="btn-booking-confirm"
                onClick={() => this.handleConfirmCheckBooking()}>
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
        <ViewBookingModal
          isOpenModal={isOpenModalCheckBooking}
          closeCheckBookingClose={this.closeCheckBookingClose}
          data={data}
          refreshData={this.refreshData}
        />
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
