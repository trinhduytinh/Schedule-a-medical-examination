import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageScheduleRemote.scss";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import * as actions from "../../../store/actions";
import { CRUD_ACTION, LANGUAGES, dateFormat } from "../../../utils";
import DatePicker from "../../../components/Input/DatePicker";
import moment from "moment";
import _, { times } from "lodash";
import { toast } from "react-toastify";
import {
  getAllDoctorRemote,
  saveBulkScheduleRemoteDoctor,
  getScheduleRemoteByDate,  // Import the new function
  updateScheduleRemoteDoctor, // Import the update function
} from "../../../services/userService";

class ManageScheduleRemote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDoctors: [],
      selectedDoctor: {},
      currentDate: moment(new Date()).startOf("day").valueOf(),
      rangetime: [""],
      isUpdate: false,
    };
  }

  async componentDidMount() {
    let { userInfo } = this.props;
    let dataSelect = this.buildDataInputSelect([userInfo]);
    this.setState({
      listDoctors: dataSelect,
      selectedDoctor: dataSelect[0], // Automatically select the logged-in doctor
    });
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.language !== this.props.language) {
      let dataSelect = this.buildDataInputSelect([this.props.userInfo]);
      this.setState({
        listDoctors: dataSelect,
        selectedDoctor: dataSelect[0], // Automatically select the logged-in doctor
      });
    }
  }

  buildDataInputSelect = (inputData) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        let labelVi = `${item.lastName} ${item.firstName}`;
        let labelEn = `${item.firstName} ${item.lastName}`;
        object.label = language === LANGUAGES.VI ? labelVi : labelEn;
        object.value = item.id;
        result.push(object);
      });
    }
    return result;
  };

  handleOnchangeDatePicker = async (data) => {
    let selectedDate = data[0];
    let formateDate = new Date(selectedDate).getTime();
    let { selectedDoctor } = this.state;

    if (selectedDoctor && !_.isEmpty(selectedDoctor)) {
      let res = await getScheduleRemoteByDate(selectedDoctor.value, formateDate);
      if (res && res.errCode === 0) {
        let scheduleData = res.data;
        let updatedRangetime = scheduleData.length > 0 ? scheduleData.map((item) => item.timeType) : [""];
        this.setState({
          currentDate: selectedDate,
          rangetime: updatedRangetime,
          isUpdate: scheduleData.length > 0,
        });
      } else {
        this.setState({
          currentDate: selectedDate,
          rangetime: [""],
          isUpdate: false,
        });
      }
    }
  };

  handleTimeChange = (index, event) => {
    const newTimes = [...this.state.rangetime];
    newTimes[index] = event.target.value;
    this.setState({
      rangetime: newTimes,
    });
  };

  handleAddTimeInput = () => {
    this.setState((prevState) => ({
      rangetime: [...prevState.rangetime, ""],
    }));
  };

  handleRemoveTimeInput = (index) => {
    this.setState((prevState) => {
      const newTimes = [...prevState.rangetime];
      newTimes.splice(index, 1);
      return { rangetime: newTimes };
    });
  };

  handleSaveSchedule = async () => {
    let { rangetime, selectedDoctor, currentDate, isUpdate } = this.state;
    let result = [];
    if (!selectedDoctor || _.isEmpty(selectedDoctor)) {
      toast.error("Invalid selected doctor!");
      return;
    }
    if (!currentDate) {
      toast.error("Invalid date!");
      return;
    }
    let formateDate = new Date(currentDate).getTime();
    if (rangetime && rangetime.length > 0) {
      rangetime.forEach((time) => {
        if (time) {
          let object = {};
          object.doctorID = selectedDoctor.value;
          object.date = formateDate;
          object.timeType = time;
          result.push(object);
        }
      });
    } else {
      toast.error("Invalid selected time!");
      return;
    }

    let res;
    if (isUpdate) {
      res = await updateScheduleRemoteDoctor({
        arrScheduleRemote: result,
        doctorID: selectedDoctor.value,
        formateDate: formateDate,
      });
    } else {
      res = await saveBulkScheduleRemoteDoctor({
        arrScheduleRemote: result,
        doctorID: selectedDoctor.value,
        formateDate: formateDate,
      });
    }

    if (res && res.errCode === 0) {
      toast.success(isUpdate ? "Schedule updated successfully!" : "Schedule saved successfully!");
    } else {
      toast.error("Error saving schedule!");
      console.log("error saveBulkScheduleRemoteDoctor: ", res);
    }
  };

  render() {
    let { language } = this.props;
    let { rangetime, isUpdate } = this.state;
    let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    return (
      <div className="manage-schedule-container">
        <div className="m-s-title">
          <FormattedMessage id="manage-schedule.title" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-6 form-group">
              <label>
                <FormattedMessage id="manage-schedule.choose-doctor" />
              </label>
              <Select
                value={this.state.selectedDoctor}
                options={this.state.listDoctors}
                isDisabled={true} // Disable the Select component
              />
            </div>
            <div className="col-6 form-group">
              <label>
                <FormattedMessage id="manage-schedule.choose-date" />
              </label>
              <DatePicker
                onChange={this.handleOnchangeDatePicker}
                className="form-control"
                value={this.state.currentDate}
                minDate={yesterday}
              />
            </div>
            <div className="col-12 pick-hour-container">
              {rangetime.map((time, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <input
                    type="time"
                    className="form-control"
                    value={time}
                    onChange={(event) => this.handleTimeChange(index, event)}
                  />
                  <button
                    className="btn btn-danger ml-2"
                    onClick={() => this.handleRemoveTimeInput(index)}>
                    X
                  </button>
                  {index === rangetime.length - 1 && (
                    <button
                      className="btn btn-primary ml-2"
                      onClick={this.handleAddTimeInput}>
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <button
              className="btn btn-primary btn-save-schedule"
              onClick={this.handleSaveSchedule}>
              <FormattedMessage id={isUpdate ? "manage-schedule.update" : "manage-schedule.save"} />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    userInfo: state.user.userInfo, // Use userInfo for logged-in doctor
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    fetchAllsScheduleTime: () => dispatch(actions.fetchAllsScheduleTime()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageScheduleRemote);
