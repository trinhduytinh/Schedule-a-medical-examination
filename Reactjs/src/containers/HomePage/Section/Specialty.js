import React, { Component } from "react";
import { connect } from "react-redux";
import "./Specialty.scss";
import Slider from "react-slick";
import { getAllSpecialty } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router"; //chuyen trang
import { LANGUAGES } from "../../../utils";
class Specialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSpecialty: [],
    };
  }
  async componentDidMount() {
    let res = await getAllSpecialty();
    if (res && res.errCode === 0) {
      this.setState({
        dataSpecialty: res.data ? res.data : [],
      });
    }
  }
  handleViewDetailSpecialty = (item) => {
    if (this.props.history) {
      this.props.history.push(`/detail-specialty/${item.id}`);
    }
  };
  handleViewMoreHandbook = () => {
    if (this.props.history) {
      this.props.history.push(`/more-specialty`);
    }
  };
  render() {
    let { dataSpecialty } = this.state;
    let { language } = this.props;
    return (
      <div className="section-share section-specialty">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">
              <FormattedMessage id="homepage.specialty-popular" />
            </span>
            <button
              className="btn-section"
              onClick={() => this.handleViewMoreHandbook()}>
              <FormattedMessage id="homepage.more-infor" />
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {dataSpecialty &&
                dataSpecialty.length > 0 &&
                dataSpecialty.map((item, index) => {
                  return (
                    <div
                      className="section-customize specialty-child"
                      key={index}
                      onClick={() => this.handleViewDetailSpecialty(item)}>
                      <div
                        className="bg-image section-specialty"
                        style={{ backgroundImage: `url(${item.image})` }}></div>
                      <div className="specialty-name">
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
    //inject
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Specialty)
);
