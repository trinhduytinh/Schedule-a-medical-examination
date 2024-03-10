import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
import { LANGUAGES } from "../../utils";
import { changeLanguageApp } from "../../store/actions";
import { withRouter } from "react-router";
import vn from "../../assets/vietnam.png";
import ja from "../../assets/ja.png";
import en from "../../assets/en.png";
class HomeHeader extends Component {
  changeLanguage = (language) => {
    console.log(language);
    //fire redux event : actions
    if (language === "VN") this.props.changeLanguageAppRedux(LANGUAGES.VI);
    if (language === "EN") this.props.changeLanguageAppRedux(LANGUAGES.EN);
    if (language === "JA") this.props.changeLanguageAppRedux(LANGUAGES.JA);
  };
  returnToHome = () => {
    if (this.props.history) this.props.history.push(`/home`);
  };
  render() {
    let language = this.props.language;
    console.log('check render:', language);
    return (
      <React.Fragment>
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="left-content">
              <i className="fas fa-bars"></i>
              <div
                className="header-logo"
                onClick={() => this.returnToHome()}></div>
            </div>
            <div className="center-content">
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id={"homeheader.specialty"} />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id={"homeheader.search-doctor"} />
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id={"homeheader.health-facility"} />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id={"homeheader.select-room"} />
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id={"homeheader.doctor"} />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id={"homeheader.select-doctor"} />
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id={"homeheader.fee"} />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id={"homeheader.check-health"} />
                </div>
              </div>
            </div>
            <div className="right-content">
              <div className="support">
                <i className="fas fa-question-circle"></i>
                <FormattedMessage id={"homeheader.support"} />
              </div>
              <div>
                {language === LANGUAGES.VI ? (
                  <div className="dropdown-language">
                    <button className="dropdown-btn">
                      <img src={vn}></img>
                      <span> <FormattedMessage id={"homeheader.vn"} /></span>
                    </button>
                    <div className="dropdown-content">
                      <button
                        onClick={() => {
                          this.changeLanguage("EN");
                        }}>
                        <img src={en}></img>
                        <div> <FormattedMessage id={"homeheader.en"} /></div>
                      </button>
                      <button
                        onClick={() => {
                          this.changeLanguage("JA");
                        }}>
                        <img src={ja}></img>
                        <div> <FormattedMessage id={"homeheader.ja"} /></div>
                      </button>
                    </div>
                  </div>
                ) : language === LANGUAGES.EN ? (
                  <div className="dropdown-language">
                    <button className="dropdown-btn">
                      <img src={en}></img>
                      <span> <FormattedMessage id={"homeheader.en"} /></span>
                    </button>
                    <div className="dropdown-content">
                      <button
                        onClick={() => {
                          this.changeLanguage("VN");
                        }}>
                        <img src={vn}></img>
                        <div> <FormattedMessage id={"homeheader.vn"} /></div>
                      </button>
                      <button
                        onClick={() => {
                          this.changeLanguage("JA");
                        }}>
                        <img src={ja}></img>
                        <div> <FormattedMessage id={"homeheader.ja"} /></div>
                      </button>
                    </div>
                  </div>
                ) : language === LANGUAGES.JA?(
                  <div className="dropdown-language">
                    <button className="dropdown-btn">
                      <img src={ja}></img>
                      <span> <FormattedMessage id={"homeheader.ja"} /></span>
                    </button>
                    <div className="dropdown-content">
                      <button
                        onClick={() => {
                          this.changeLanguage("EN");
                        }}>
                        <img src={en}></img>
                        <div> <FormattedMessage id={"homeheader.en"} /></div>
                      </button>
                      <button
                        onClick={() => {
                          this.changeLanguage("VN");
                        }}>
                        <img src={vn}></img>
                        <div> <FormattedMessage id={"homeheader.vn"} /></div>
                      </button>
                    </div>

                    {/* <select value={language} onChange={this.changeLanguage}>
                  <option value={LANGUAGES.VI}>Tiếng Việt</option>
                  <option value={LANGUAGES.EN}>English</option>
                  <option value={LANGUAGES.JA}>日本語</option>
                </select> */}
                  </div>
                ):""}
              </div>
            </div>
          </div>
        </div>
        {this.props.isShowBanner === true && (
          <div className="home-header-banner">
            <div className="content-up">
              <div className="title1">
                <FormattedMessage id={"banner.title1"} />
              </div>
              <div className="title2">
                <FormattedMessage id={"banner.title2"} />
              </div>
              <div className="search">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Tìm Chuyên khoa khám bệnh" />
              </div>
            </div>
            <div className="content-down">
              <div className="options">
                <div className="option-child">
                  <div className="icon-child">
                    <i className="far fa-hospital"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id={"banner.specialized-examination"} />
                  </div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-mobile-alt"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id={"banner.remote-examination"} />
                  </div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-stethoscope"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id={"banner.general-examination"} />
                  </div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-flask"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id={"banner.medical-tests"} />
                  </div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-user-md"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id={"banner.mental-health"} />
                  </div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fas fa-briefcase-medical"></i>
                  </div>
                  <div className="text-child">
                    <FormattedMessage id={"banner.dental-examination"} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
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
  return {
    changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomeHeader)
);
