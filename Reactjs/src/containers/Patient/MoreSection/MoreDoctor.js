import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./MoreSection.scss";
import * as actions from "../../../store/actions";
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import { LANGUAGES } from "../../../utils";
import { getTopDoctorHomeService } from "../../../services/userService";
class MoreDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctors: [],
    };
  }
  async componentDidMount() {
    let res = await getTopDoctorHomeService("ALL");
    if (res && res.errCode === 0) {
      this.setState({
        arrDoctors: res.data ? res.data : [],
      });
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    // if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
    //   this.setState({
    //     arrDoctors: this.props.topDoctorsRedux,
    //   });
    // }
  }
  handleViewDetailDoctor = (doctor) => {
    if (this.props.history)
      this.props.history.push(`/detail-doctor/${doctor.id}`);
  };
  render() {
    let { arrDoctors } = this.state;
    console.log("check data", arrDoctors);
    let { language } = this.props;
    return (
      <>
        <HomeHeader />
        <div className="more-container">
          <div className="title"><FormattedMessage id={"patient.extra-infor-doctor.list-of-all-doctors"}/></div>
          {arrDoctors &&
            arrDoctors.length > 0 &&
            arrDoctors.map((item, index) => {
              let imageBase64 = "";
              if (item.image) {
                imageBase64 = Buffer.from(item.image, "base64").toString(
                  "binary"
                );
              }
              return (
                <div
                  className="more-card"
                  key={index}
                  onClick={() => this.handleViewDetailDoctor(item)}>
                  <div className="card mb-3">
                    <div className="row g-0">
                      <div className="col-md-4">
                        <div
                          className="bg-image section-specialty"
                          style={{
                            backgroundImage: `url(${imageBase64})`,
                          }}></div>
                      </div>
                      <div className="col-md-8">
                        <div className="card-body">
                          <p className="card-text">
                            <div>
                              {language === LANGUAGES.VI
                                ? `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`
                                : language === LANGUAGES.EN
                                ? `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`
                                : language === LANGUAGES.JA
                                ? `${item.positionData.valueJa}, ${item.lastName} ${item.firstName}`
                                : ""}
                            </div>
                            <div>
                              {language === LANGUAGES.VI
                                ? item.Doctor_Infor.specialtyTypeData.name
                                : language === LANGUAGES.EN
                                ? item.Doctor_Infor.specialtyTypeData.nameEn
                                : language === LANGUAGES.JA
                                ? item.Doctor_Infor.specialtyTypeData.nameJa
                                : ""}
                            </div>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <HomeFooter />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    // topDoctorsRedux: state.admin.topDoctor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // loadTopDoctor: () => dispatch(actions.fetchTopDoctor()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoreDoctor);
