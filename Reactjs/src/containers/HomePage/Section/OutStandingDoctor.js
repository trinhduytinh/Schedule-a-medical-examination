import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
class OutStandingDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctors: [],
    };
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
      this.setState({
        arrDoctors: this.props.topDoctorsRedux,
      });
    }
  }
  componentDidMount() {
    this.props.loadTopDoctor();
  }
  handleViewDetailDoctor = (doctor) => {
    if (this.props.history)
      this.props.history.push(`/detail-doctor/${doctor.id}`);
  };
  handleViewMoreHandbook = () => {
    if (this.props.history) {
      this.props.history.push(`/more-doctor`);
    }
  };
  render() {
    let arrDoctors = this.state.arrDoctors;
    let { language } = this.props;
    return (
      <div className="section-share section-outstanding-doctor">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">
              <FormattedMessage id="homepage.outstanding-doctor" />
            </span>
            <button
              className="btn-section"
              onClick={() => this.handleViewMoreHandbook()}>
              <FormattedMessage id="homepage.more-infor" />
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
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
                      className="section-customize"
                      key={index}
                      onClick={() => this.handleViewDetailDoctor(item)}>
                      <div className="customize-border shadow p-3 mb-5 bg-white rounded">
                        <div className="outer-bg">
                          <div
                            className="bg-image section-outstanding-doctor"
                            style={{
                              backgroundImage: `url(${imageBase64})`,
                            }}></div>
                        </div>
                        <div className="position text-center">
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
                          <div><FormattedMessage id={"homepage.number-of-bookings-per-week"}/> {item.bookingCountLastWeek}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    isLoggedIn: state.user.isLoggedIn,
    topDoctorsRedux: state.admin.topDoctor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadTopDoctor: () => dispatch(actions.fetchTopDoctor()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor)
);
