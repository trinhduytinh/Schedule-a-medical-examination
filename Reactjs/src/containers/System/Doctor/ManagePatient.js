import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./ManagePatient.scss";
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
import DatePicker from "../../../components/Input/DatePicker";
import LoadingOverlay from "react-loading-overlay"; // mang hinh load doi
import {
  getAllPatientForDoctor,
  handleLoginApi,
  postSendRemedy,
} from "../../../services/userService";
import moment from "moment";
import { LANGUAGES } from "../../../utils";
import RemedyModal from "./RemedyModal";
import { toast } from "react-toastify";
class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(), //lay ngay ko lay gio de phu hop vs thu vien lich,
      dataPatient: [],
      isOpenRemedyModal: false,
      dataModal: {},
      isShowLoading: false,
    };
  }
  async componentDidMount() {
    this.getDataPatient();
  }
  getDataPatient = async () => {
    let { user } = this.props;
    let { currentDate } = this.state;
    let formattedDate = new Date(currentDate).getTime(); //convert tg sang dang timestamp Unix 1028221200000
    let res = await getAllPatientForDoctor({
      doctorId: user.id,
      date: formattedDate,
    });
    if (res && res.errCode === 0) {
      this.setState({
        dataPatient: res.data,
      });
    }
  };
  async componentDidUpdate(prevProps, prevState, snapshot) {}
  handleOnchangeDatePicker = (data) => {
    this.setState(
      {
        currentDate: data[0],
      },
      async () => {
        await this.getDataPatient();
      }
    );
  };
  convertTime = (timestampUnix) => {
    // Chuyển đổi chuỗi string thành một số nguyên
    var timestampInt = parseInt(timestampUnix, 10);
    // Tạo một đối tượng Date từ timestamp Unix
    var date = new Date(timestampInt);
    // Lấy thông tin ngày, tháng, năm
    var day = date.getDate();
    var month = date.getMonth() + 1; // Lưu ý: Tháng trong JavaScript bắt đầu từ 0
    var year = date.getFullYear();
    return day + "/" + month + "/" + year;
  };
  handleBtnConfirm = (item) => {
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeType,
      patientName: item.patientData.firstName,
    };
    this.setState({
      isOpenRemedyModal: true,
      dataModal: data,
    });
  };
  closeRemedyModal = () => {
    this.setState({
      isOpenRemedyModal: false,
      dataModal: {},
    });
  };
  sendRemedy = async (dataChild) => {
    let { dataModal } = this.state;
    this.setState({
      isShowLoading: true,
    });
    let res = await postSendRemedy({
      email: dataChild.email,
      imgBase64: dataChild.imgBase64,
      doctorId: dataModal.doctorId,
      patientId: dataModal.patientId,
      timeType: dataModal.timeType,
      language: this.props.language,
      patientName: dataModal.patientName,
    });
    if (res && res.errCode === 0) {
      toast.success("Send remedy succeeds!");
      this.setState({
        isShowLoading: false,
      });
      await this.getDataPatient();
    } else {
      toast.error("Something wrongs...");
      this.setState({
        isShowLoading: false,
      });
      console.log("error send remedy: ", res);
    }
  };
  render() {
    let { dataPatient, isOpenRemedyModal, dataModal } = this.state;
    let { language } = this.props;
    return (
      <>
        <LoadingOverlay
          active={this.state.isShowLoading}
          spinner
          text="Loading...">
          <div className="manage-patient-container">
            <div className="m-p-title">Quản lý bệnh nhân khám bệnh</div>
            <div className="manage-patient-body row">
              <div className="col-4 form-group">
                <label>Chọn phóng khám</label>
                <DatePicker
                  onChange={this.handleOnchangeDatePicker}
                  className="form-control"
                  value={this.state.currentDate}
                />
              </div>
              <div className="col-12 table-manage-patient">
                <table id="customers">
                  <tbody>
                    <tr>
                      <th>STT</th>
                      <th>Thời gian</th>
                      <th>Họ và tên</th>
                      <th>Địa chỉ</th>
                      <th>Giới tính</th>
                      <th>Ngày sinh</th>
                      <th>Lý do</th>
                      <th>Actions</th>
                    </tr>
                    {dataPatient && dataPatient.length > 0 ? (
                      dataPatient.map((item, index) => {
                        let time, gender;
                        switch (language) {
                          case LANGUAGES.VI:
                            time = item.timeTypeDataPatient.valueVi;
                            gender = item.patientData.genderData.valueVi;
                            break;
                          case LANGUAGES.EN:
                            time = item.timeTypeDataPatient.valueEn;
                            gender = item.patientData.genderData.valueEn;
                            break;
                          case LANGUAGES.JA:
                            time = item.timeTypeDataPatient.valueJa;
                            gender = item.patientData.genderData.valueJa;
                            break;
                        }
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{time}</td>
                            <td>{item.patientData.firstName}</td>
                            <td>{item.patientData.address}</td>
                            <td>{gender}</td>
                            <td>{this.convertTime(item.birthday)}</td>
                            <td>{item.reason}</td>
                            <td>
                              <button
                                className="mp-btn-confirm"
                                onClick={() => this.handleBtnConfirm(item)}>
                                Xác nhận
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} style={{ textAlign: "center" }}>
                          no data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <RemedyModal
            isOpenModal={isOpenRemedyModal}
            dataModal={dataModal}
            closeRemedyModal={this.closeRemedyModal}
            sendRemedy={this.sendRemedy}
          />
        </LoadingOverlay>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    user: state.user.userInfo, //lay nguoi dung dang dang nhap
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
