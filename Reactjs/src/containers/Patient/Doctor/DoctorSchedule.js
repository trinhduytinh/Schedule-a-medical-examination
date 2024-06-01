import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./DoctorSchedule.scss";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
import moment from "moment";
import localization from "moment/locale/vi";
import { getScheduleDoctorByDate } from "../../../services/userService";
import BookingModal from "./Modal/BookingModal";
class DoctorSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDays: [],
      allAvailableTime: [],
      isOpenModalBooking: false,
      dataScheduleTimeModal: {},
    };
  }
  async componentDidMount() {
    let { language } = this.props;
    let allDays = this.getArrDays(language);
    if (this.props.doctorIdFromParent) {
      // let res = await getScheduleDoctorByDate(
      //   this.props.doctorIdFromParent,
      //   allDays[0].value
      // );
      // this.setState({
      //   allAvailableTime: res.data ? res.data : [],
      // });
      let res = await getScheduleDoctorByDate(
        this.props.doctorIdFromParent,
        allDays[0].value
      );
      if (res.data) {
        // Lấy ngày và thời gian hiện tại
        const currentTime = moment();
        const currentTimestamp = currentTime.valueOf(); // Lấy giá trị timestamp của thời gian hiện tại

        // Lọc ra các mục theo ngày
        //filter() trong JavaScript được sử dụng để lọc các phần tử trong một mảng dựa trên một điều kiện được xác định bởi một hàm callback
        const futureTimes = res.data.filter((item) => {
          const itemTimestamp = parseInt(item.date);
          if (moment(itemTimestamp).isSame(currentTime, "day")) {
            // Nếu là ngày hiện tại, loại bỏ các mục có thời gian đã qua
            const itemTime = moment(item.timeTypeData.valueVi, "H:mm");
            //Phương thức isAfter() trong thư viện Moment.js được sử dụng để kiểm tra xem một đối tượng thời gian có sau một đối tượng thời gian khác không.
            //Nó trả về true nếu thời gian đầu tiên đến sau thời gian thứ hai, và ngược lại trả về false.
            return itemTime.isAfter(currentTime);
          } else {
            // Nếu không phải là ngày hiện tại, giữ lại tất cả các mục
            return true;
          }
        });
        this.setState({
          allAvailableTime: futureTimes,
        });
      } else {
        this.setState({
          allAvailableTime: [],
        });
      }
    }
    this.setState({
      allDays: allDays,
    });
  }
  getArrDays = (language) => {
    let allDays = [];
    for (let i = 0; i < 7; i++) {
      let object = {};
      if (language === LANGUAGES.VI) {
        if (i === 0) {
          let ddMM = moment(new Date()).format("DD/MM");
          let today = `Hôm nay - ${ddMM}`;
          object.label = today;
        } else {
          object.label = moment(new Date())
            .add(i, "days")
            .format("dddd - DD/MM")
            .replace(/^t/g, "T")
            .replace("chủ nhật", "Chủ Nhật");
        }
      }
      if (language === LANGUAGES.EN) {
        if (i === 0) {
          let ddMM = moment(new Date()).format("DD/MM");
          let today = `Today - ${ddMM}`;
          object.label = today;
        } else {
          object.label = moment(new Date())
            .add(i, "days")
            .locale("en")
            .format("ddd - DD/MM");
        }
      }
      if (language === LANGUAGES.JA) {
        if (i === 0) {
          let ddMM = moment(new Date()).format("DD/MM");
          let today = `本日- ${ddMM}`;
          object.label = today;
        } else {
          object.label = moment(new Date())
            .add(i, "days")
            .locale("ja")
            .format("ddd - MM月DD日")
            .replace("CN", "日")
            .replace("T2", "月")
            .replace("T3", "火")
            .replace("T4", "水")
            .replace("T5", "木")
            .replace("T6", "金")
            .replace("T7", "土");
        }
      }
      object.value = moment(new Date()).add(i, "days").startOf("day").valueOf();
      allDays.push(object);
    }

    return allDays;
  };
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      let allDays = this.getArrDays(this.props.language);
      this.setState({
        allDays: allDays,
      });
    }
    if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
      let allDays = this.getArrDays(this.props.language);
      let res = await getScheduleDoctorByDate(
        this.props.doctorIdFromParent,
        allDays[0].value
      );
      if (res.data) {
        // Lấy ngày và thời gian hiện tại
        const currentTime = moment();
        const currentTimestamp = currentTime.valueOf(); // Lấy giá trị timestamp của thời gian hiện tại

        // Lọc ra các mục theo ngày
        const futureTimes = res.data.filter((item) => {
          const itemTimestamp = parseInt(item.date);
          if (moment(itemTimestamp).isSame(currentTime, "day")) {
            // Nếu là ngày hiện tại, loại bỏ các mục có thời gian đã qua
            const itemTime = moment(item.timeTypeData.valueVi, "H:mm");
            return itemTime.isAfter(currentTime);
          } else {
            // Nếu không phải là ngày hiện tại, giữ lại tất cả các mục
            return true;
          }
        });

        this.setState({
          allAvailableTime: futureTimes,
        });
      } else {
        this.setState({
          allAvailableTime: [],
        });
      }
    }
  }
  handleOnChangeSelect = async (event) => {
    if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
      let doctorID = this.props.doctorIdFromParent;
      let date = event.target.value;
      let res = await getScheduleDoctorByDate(doctorID, date);
      if (res && res.errCode === 0) {
        // this.setState({
        //   allAvailableTime: res.data ? res.data : [],
        // });
        console.log("check log:", res);
        if (res.data) {
          // Lấy ngày và thời gian hiện tại
          const currentTime = moment();
          const currentTimestamp = currentTime.valueOf(); // Lấy giá trị timestamp của thời gian hiện tại

          // Lọc ra các mục theo ngày
          const futureTimes = res.data.filter((item) => {
            const itemTimestamp = parseInt(item.date);
            if (moment(itemTimestamp).isSame(currentTime, "day")) {
              // Nếu là ngày hiện tại, loại bỏ các mục có thời gian đã qua
              const itemTime = moment(item.timeTypeData.valueVi, "H:mm");
              return itemTime.isAfter(currentTime);
            } else {
              // Nếu không phải là ngày hiện tại, giữ lại tất cả các mục
              return true;
            }
          });

          this.setState({
            allAvailableTime: futureTimes,
          });
        } else {
          this.setState({
            allAvailableTime: [],
          });
        }
      }
    }
  };
  handleClickScheduleTime = (time) => {
    this.setState({
      isOpenModalBooking: true,
      dataScheduleTimeModal: time,
    });
  };
  closeBookingClose = () => {
    this.setState({
      isOpenModalBooking: false,
    });
  };
  render() {
    let {
      allDays,
      allAvailableTime,
      isOpenModalBooking,
      dataScheduleTimeModal,
    } = this.state;
    let { language } = this.props;
    return (
      <>
        <div className="doctor-schedule-container">
          <div className="all-schedule">
            <select onChange={(event) => this.handleOnChangeSelect(event)}>
              {allDays &&
                allDays.length > 0 &&
                allDays.map((item, index) => {
                  return (
                    <option value={item.value} key={index}>
                      {item.label}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="all-available-time">
            <div className="text-calendar">
              <i className="fas fa-calendar-alt">
                <span>
                  <FormattedMessage id="patient.detail-doctor.schedule" />
                </span>
              </i>
            </div>
            <div className="time-content">
              {allAvailableTime && allAvailableTime.length > 0 ? (
                <>
                  <div className="time-content-btn">
                    {allAvailableTime.map((item, index) => {
                      let timeDisplay =
                        language === LANGUAGES.VI
                          ? item.timeTypeData.valueVi
                          : item.timeTypeData.valueEn;
                      return (
                        <button
                          key={index}
                          className={
                            language === LANGUAGES.VI ? "btn-vi" : "btn-en"
                          }
                          onClick={() => this.handleClickScheduleTime(item)}>
                          {timeDisplay}
                        </button>
                      );
                    })}
                  </div>
                  <div className="book-free">
                    <span>
                      <FormattedMessage id={"patient.detail-doctor.choose"} />{" "}
                      <i className="far fa-hand-point-up"></i>{" "}
                      <FormattedMessage
                        id={"patient.detail-doctor.book-free"}
                      />
                    </span>
                  </div>
                </>
              ) : (
                <div className="no-schedule">
                  <FormattedMessage id={"patient.detail-doctor.no-schedule"} />
                </div>
              )}
            </div>
          </div>
        </div>
        <BookingModal
          isOpenModal={isOpenModalBooking}
          closeBookingClose={this.closeBookingClose}
          dataTime={dataScheduleTimeModal}
        />
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
