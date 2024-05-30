import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
import { Modal } from "reactstrap";

import _ from "lodash";
import { LANGUAGES } from "../../../utils";
import { toast } from "react-toastify";
import { deleteBooking } from "../../../services/userService";

class ViewBookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {}
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  convertTime = (timestampUnix) => {
    var timestampInt = parseInt(timestampUnix, 10);
    var date = new Date(timestampInt);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    return day + "/" + month + "/" + year;
  };

  deleteBooking = async (id) => {
    let res = await deleteBooking(id);
    if (res && res.errCode === 0) {
      toast.success(res.errMessage);
      this.props.refreshData(); // Call refreshData after deleting booking
    } else toast.error(res.errMessage);
  };


  render() {
    let { isOpenModal, closeCheckBookingClose, data, language } = this.props;
    return (
      <>
        <Modal
          isOpen={isOpenModal}
          className={"booking-modal-container"}
          size="lg"
          centered>
          <div className="booking-modal-content">
            <div className="booking-modal-header">
              <span className="left"><FormattedMessage id={"menu.patient.scheduling-information"}/></span>
              <span className="right" onClick={closeCheckBookingClose}>
                <i className="fas fa-times"></i>
              </span>
            </div>
            <div className="booking-modal-body">
              <div className="col-12 table-manage-patient">
                <table id="customers">
                  <tbody>
                    <tr>
                      <th>
                        <FormattedMessage id={"manage-patient.stt"} />
                      </th>
                      <th>
                        <FormattedMessage id={"manage-patient.time"} />
                      </th>
                      <th>
                        <FormattedMessage id={"manage-patient.name"} />
                      </th>
                      <th>
                        <FormattedMessage id={"manage-patient.birthday"} />
                      </th>
                      <th>
                        <FormattedMessage id={"manage-patient.reason"} />
                      </th>
                      <th>
                        <FormattedMessage id={"manage-patient.action"} />
                      </th>
                    </tr>
                    {data && data.length > 0 ? (
                      data.map((item, index) => {
                        let time;
                        if (item.statusId === "S1") {
                          switch (language) {
                            case LANGUAGES.VI:
                              time = item.timeTypeDataPatient.valueVi;
                              break;
                            case LANGUAGES.EN:
                              time = item.timeTypeDataPatient.valueEn;
                              break;
                            case LANGUAGES.JA:
                              time = item.timeTypeDataPatient.valueJa;
                              break;
                          }
                        } else time = item.timeType;
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{time}</td>
                            <td>{item.patientData.firstName}</td>
                            <td>{this.convertTime(item.birthday)}</td>
                            <td>{item.reason}</td>
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={() => this.deleteBooking(item.id)}>
                                <FormattedMessage id={"menu.patient.delete-the-appointment"}/>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} style={{ textAlign: "center" }}>
                          <FormattedMessage id={"manage-patient.no-data"} />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewBookingModal);
