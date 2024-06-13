import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./MoreSection.scss";
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import { LANGUAGES } from "../../../utils";
import { getAllClinic } from "../../../services/userService";
class MoreClinic extends Component {
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
  handleViewDetailClinic = (clinic) => {
    if (this.props.history) {
      this.props.history.push(`detail-clinic/${clinic.id}`);
    }
  };
  async componentDidUpdate(prevProps, prevState, snapshot) {}
  render() {
    let { dataClinics } = this.state;
    let { language } = this.props;
    return (
      <>
        <HomeHeader />
        <div className="more-container">
          <div className="title"><FormattedMessage id={"more.medical-facility"}/></div>
          {dataClinics &&
            dataClinics.length > 0 &&
            dataClinics.map((item, index) => {
              return (
                <div
                  className="more-card"
                  key={index}
                  onClick={() => this.handleViewDetailClinic(item)}>
                  <div className="card mb-3">
                    <div className="row g-0">
                      <div className="col-md-4">
                        <div
                          className="bg-image section-specialty"
                          style={{
                            backgroundImage: `url(${item.image})`,
                          }}></div>
                      </div>
                      <div className="col-md-8">
                        <div className="card-body">
                          <p className="card-text">
                            {language === LANGUAGES.VI
                              ? item.name
                              : language === LANGUAGES.EN
                              ? item.nameEn
                              : language === LANGUAGES.JA
                              ? item.nameJa
                              : ""}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MoreClinic);
