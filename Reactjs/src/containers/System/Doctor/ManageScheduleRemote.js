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
} from "../../../services/userService";

class ManageScheduleRemote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDoctors: [],
      selectedDoctor: {},
      currentDate: moment(new Date()).startOf("day").valueOf(),
      rangetime: [""], // khởi tạo với một phần tử trống
    };
  }

  async componentDidMount() {
    // this.props.fetchAllDoctors();
    let res = await getAllDoctorRemote();
    if (res && res.errCode === 0) {
      let dataSelect = this.buildDataInputSelect(res.data);
      this.setState({
        listDoctors: dataSelect,
      });
    }
    // this.props.fetchAllsScheduleTime();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    // if (prevProps.allDoctors !== this.props.allDoctors) {
    //   let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
    //   this.setState({
    //     listDoctors: dataSelect,
    //   });
    // }

    if (prevProps.language !== this.props.language) {
      let res = await getAllDoctorRemote();
      if (res && res.errCode === 0) {
        let dataSelect = this.buildDataInputSelect(res.data);
        this.setState({
          listDoctors: dataSelect,
        });
      }
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

  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedDoctor: selectedOption });
  };

  handleOnchangeDatePicker = (data) => {
    this.setState({
      currentDate: data[0],
    });
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
    let { rangetime, selectedDoctor, currentDate } = this.state;
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
          object.timeType = time; // Giả định time là keyMap hoặc một định danh nào đó
          result.push(object);
        }
      });
    } else {
      toast.error("Invalid selected time!");
      return;
    }
    let res = await saveBulkScheduleRemoteDoctor({
      arrScheduleRemote: result,
      doctorID: selectedDoctor.value,
      formateDate: formateDate,
    });

    if (res && res.errCode === 0) {
      toast.success("Lưu thông tin thành công!");
    } else {
      toast.error("Lỗi khi lưu thông tin!");
      console.log("error saveBulkScheduleDoctor: ", res);
    }
  };

  render() {
    let { language } = this.props;
    let { rangetime } = this.state;
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
                onChange={this.handleChangeSelect}
                options={this.state.listDoctors}
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
              <FormattedMessage id="manage-schedule.save" />
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
    allDoctors: state.admin.allDoctors,
    allScheduleTime: state.admin.allScheduleTime,
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
