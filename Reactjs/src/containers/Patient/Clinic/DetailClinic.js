import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./DetailClinic.scss";
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import {
  getAllCodeService,
  getAllDetailClinicById,
} from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import _ from "lodash";
import HomeFooter from "../../HomePage/HomeFooter";

class DetailClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctorId: [],
      dataDetailClinic: {},
      isShowDetailClinic: false,
    };
  }
  async componentDidMount() {
    //lay id trong duong dan
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      let res = await getAllDetailClinicById({
        id: id,
      });
      if (res && res.errCode === 0) {
        let data = res.data;
        let arrDoctorId = [];
        if (data && !_.isEmpty(res.data)) {
          let arr = data.doctorClinic;
          if (arr && arr.length > 0) {
            arr.map((item) => {
              arrDoctorId.push(item.doctorId);
            });
          }
        }

        this.setState({
          dataDetailClinic: res.data,
          arrDoctorId: arrDoctorId,
        });
      }
    }
  }
  handleShowDetailClinic = () => {
    this.setState({
      isShowDetailClinic: !this.state.isShowDetailClinic,
    });
  };
  async componentDidUpdate(prevProps, prevState, snapshot) {}
  render() {
    let { arrDoctorId, dataDetailClinic } = this.state;
    let { language } = this.props;
    return (
      <div className="detail-specialty-container">
        <HomeHeader />
        <div className="detail-specialty-body">
          <div className="description-specialty">
            <div
              className={
                this.state.isShowDetailClinic
                  ? "detail-specialty"
                  : "detail-clinic show-detail-clinic"
              }>
              {dataDetailClinic &&
                !_.isEmpty(dataDetailClinic) &&
                language === LANGUAGES.VI && (
                  <>
                    <div className="title">
                      <div className="name-clinic">{dataDetailClinic.name}</div>
                      <div className="address-clinic">
                        {dataDetailClinic.address}
                      </div>
                    </div>

                    <div
                      dangerouslySetInnerHTML={{
                        __html: dataDetailClinic.descriptionHTML,
                      }}></div>
                  </>
                )}
              {dataDetailClinic &&
                !_.isEmpty(dataDetailClinic) &&
                language === LANGUAGES.EN && (
                  <>
                    <div className="name-clinic">{dataDetailClinic.nameEn}</div>
                    <div className="address-clinic">
                      {dataDetailClinic.addressEn}
                    </div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: dataDetailClinic.descriptionHTMLEn,
                      }}></div>
                  </>
                )}
              {dataDetailClinic &&
                !_.isEmpty(dataDetailClinic) &&
                language === LANGUAGES.JA && (
                  <>
                    <div className="name-clinic">{dataDetailClinic.nameJa}</div>
                    <div className="address-clinic">
                      {dataDetailClinic.addressJa}
                    </div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: dataDetailClinic.descriptionHTMLJa,
                      }}></div>
                  </>
                )}
            </div>
            {this.state.isShowDetailClinic ? (
              <div
                className="show-detail"
                onClick={() => this.handleShowDetailClinic()}>
                <FormattedMessage id={"patient.clinic.reduce"} />
              </div>
            ) : (
              <div
                className="show-detail"
                onClick={() => this.handleShowDetailClinic()}>
                <FormattedMessage id={"patient.clinic.more"} />
              </div>
            )}
          </div>

          {arrDoctorId &&
            arrDoctorId.length > 0 &&
            arrDoctorId.map((item, index) => {
              return (
                <div className="each-doctor" key={index}>
                  <div className="dt-content-left">
                    <ProfileDoctor
                      doctorId={item}
                      isShowDescriptionDoctor={true}
                      isShowLinkDetail={true}
                      isShowPrice={false}
                      // dataTime={dataTime}
                    />
                  </div>
                  <div className="dt-content-right">
                    <div className="doctor-schedule">
                      <DoctorSchedule doctorIdFromParent={item} />
                    </div>
                    <div className="doctor-extra-infor">
                      <DoctorExtraInfor doctorIdFromParent={item} />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <HomeFooter />
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
