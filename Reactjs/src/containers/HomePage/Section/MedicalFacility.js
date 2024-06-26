import React, { Component } from "react";
import { connect } from "react-redux";
import "./MedicalFacility.scss";
import Slider from "react-slick";
import { getAllClinic } from "../../../services/userService";
import { withRouter } from "react-router"; //chuyen trang
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../../utils";
class MedicalFacility extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataClinics: [],
    };
  }
  async componentDidMount() {
    let res = await getAllClinic();
    if (res && res.errCode === 0) {
      this.setState({
        dataClinics: res.data ? res.data : [],
      });
    }
  }
  handleViewMoreClinic = () => {
    if (this.props.history) {
      this.props.history.push(`/more-clinic`);
    }
  };
  handleViewDetailClinic = (clinic) => {
    if (this.props.history) {
      this.props.history.push(`detail-clinic/${clinic.id}`);
    }
  };
  render() {
    let { dataClinics } = this.state;
    let { language } = this.props;
    return (
      <div className="section-share section-medical-facility">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">
              <FormattedMessage id="homepage.prominent-healthcare-facilities" />
            </span>
            <button
              className="btn-section"
              onClick={() => this.handleViewMoreClinic()}>
              <FormattedMessage id="homepage.more-infor" />
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {dataClinics &&
                dataClinics.length > 0 &&
                dataClinics.map((item, index) => {
                  return (
                    <div
                      className="section-customize clinic-child"
                      key={index}
                      onClick={() => this.handleViewDetailClinic(item)}>
                      <div
                        className="bg-image section-medical-facility"
                        style={{ backgroundImage: `url(${item.image})` }}></div>
                      <div className="clinic-name">
                        {language === LANGUAGES.VI
                          ? item.name
                          : language === LANGUAGES.EN
                          ? item.nameEn
                          : language === LANGUAGES.JA
                          ? item.nameJa
                          : ""}
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
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MedicalFacility)
);
