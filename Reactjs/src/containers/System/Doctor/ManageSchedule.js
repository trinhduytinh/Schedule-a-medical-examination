import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageSchedule.scss";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import * as actions from "../../../store/actions";
import { CRUD_ACTION, LANGUAGES, dateFormat } from "../../../utils";
import DatePicker from "../../../components/Input/DatePicker";
import moment from "moment";
import _, { times } from "lodash";
import { toast } from "react-toastify";
import { saveBulkScheduleDoctor } from "../../../services/userService";

class ManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDoctors: [],
      selectedDoctor: {},
      currentDate: moment(new Date()).startOf("day").valueOf(), // lay ngay ko lay gio de phu hop vs thu vien lich
      rangetime: [],
    };
  }

  componentDidMount() {
    this.props.fetchAllDoctors();
    this.props.fetchAllsScheduleTime();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allDoctors !== this.props.allDoctors || prevProps.userInfo !== this.props.userInfo) {
      let dataSelect = this.buildDataInputSelect([this.props.userInfo]);
      this.setState({
        listDoctors: dataSelect,
        selectedDoctor: dataSelect[0] // automatically select the logged-in doctor
      });
    }

    if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
      let data = this.props.allScheduleTime;
      if (data && data.length > 0) {
        data = data.map((item) => ({ ...item, isSelected: false }));
      }
      this.setState({
        rangetime: data,
      });
    }

    if (prevProps.language !== this.props.language) {
      let dataSelect = this.buildDataInputSelect([this.props.userInfo]);
      this.setState({
        listDoctors: dataSelect,
        selectedDoctor: dataSelect[0] // automatically select the logged-in doctor
      });
    }
  }

  buildDataInputSelect = (inputData) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      inputData.map((item) => {
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

  handleClickBtnTime = (time) => {
    let { rangetime } = this.state;
    if (rangetime && rangetime.length > 0) {
      rangetime = rangetime.map((item) => {
        if (item.id === time.id) item.isSelected = !item.isSelected;
        return item;
      });
      this.setState({
        rangetime: rangetime,
      });
    }
  };

  handleSaveSchedule = async () => {
    let { rangetime, selectedDoctor, currentDate } = this.state;
    let result = [];
    if (selectedDoctor && _.isEmpty(selectedDoctor)) {
      toast.error("Invalid selected doctor!");
      return;
    }
    if (!currentDate) {
      toast.error("Invalid date!");
      return;
    }
    // let formateDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER);
    // let formateDate = moment(currentDate).unix();
    let formateDate = new Date(currentDate).getTime();
    if (rangetime && rangetime.length > 0) {
      let selectedTime = rangetime.filter((item) => item.isSelected === true);
      if (selectedTime && selectedTime.length > 0) {
        selectedTime.map((schedule) => {
          let object = {};
          object.doctorID = selectedDoctor.value;
          object.date = formateDate;
          object.timeType = schedule.keyMap;
          result.push(object);
        });
      } else {
        toast.error("Invalid selected time!");
        return;
      }
    }
    let res = await saveBulkScheduleDoctor({
      arrSchedule: result,
      doctorID: selectedDoctor.value,
      formateDate: formateDate,
    });

    if (res && res.errCode === 0) {
      toast.success("Save InFor succeed!");
    } else {
      toast.error("Error SaveBulkScheduleDoctor!");
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
                isDisabled={true} // disable the Select component
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
              {rangetime &&
                rangetime.length > 0 &&
                rangetime.map((item, index) => {
                  return (
                    <button
                      className={
                        item.isSelected === true
                          ? "btn btn-schedule active"
                          : "btn btn-schedule"
                      }
                      key={index}
                      onClick={() => this.handleClickBtnTime(item)}>
                      {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                    </button>
                  );
                })}
            </div>
          </div>
          <div>
            <button
              className="btn btn-primary btn-save-schedule"
              onClick={() => this.handleSaveSchedule()}>
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
    userInfo: state.user.userInfo, // assuming userInfo contains the logged-in user's info
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    fetchAllsScheduleTime: () => dispatch(actions.fetchAllsScheduleTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
