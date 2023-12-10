import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import { FormattedMessage } from "react-intl";// dung de chuyen doi ngon ngu
class HomeHeader extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="left-content">
              <i class="fas fa-bars"></i>
              <div className="header-logo"></div>
            </div>
            <div className="center-content">
              <div className="child-content">
                <div>
                  <b><FormattedMessage id={"homeheader.specialty"}/></b>
                </div>
                <div className="subs-title"><FormattedMessage id={"homeheader.search-doctor"}/></div>
              </div>
              <div className="child-content">
                <div>
                  <b><FormattedMessage id={"homeheader.health-facility"}/></b>
                </div>
                <div className="subs-title"><FormattedMessage id={"homeheader.select-room"}/></div>
              </div>
              <div className="child-content">
                <div>
                  <b><FormattedMessage id={"homeheader.doctor"}/></b>
                </div>
                <div className="subs-title"><FormattedMessage id={"homeheader.select-doctor"}/></div>
              </div>
              <div className="child-content">
                <div>
                  <b><FormattedMessage id={"homeheader.fee"}/></b>
                </div>
                <div className="subs-title"><FormattedMessage id={"homeheader.check-health"}/></div>
              </div>
            </div>
            <div className="right-content">
              <div className="support">
                <i className="fas fa-question-circle"></i> <FormattedMessage id={"homeheader.support"}/>
              </div>
              <div className="language-vi">VN</div>
              <div className="language-japan">日本語</div>
            </div>
          </div>
        </div>
        <div className="home-header-banner">
          <div className="content-up">
            <div className="title1"><FormattedMessage id={"banner.title1"}/></div>
            <div className="title2"><FormattedMessage id={"banner.title2"}/></div>
            <div className="search">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Tìm Chuyên khoa khám bệnh" />
            </div>
          </div>
          <div className="content-down">
            <div className="options">
              <div className="option-child">
                <div className="icon-child">
                  <i class="far fa-hospital"></i>
                </div>
                <div className="text-child"><FormattedMessage id={"banner.specialized-examination"}/></div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i class="fas fa-mobile-alt"></i>
                </div>
                <div className="text-child"><FormattedMessage id={"banner.remote-examination"}/></div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="fas fa-stethoscope"></i>
                </div>
                <div className="text-child"><FormattedMessage id={"banner.general-examination"}/></div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="fas fa-flask"></i>
                </div>
                <div className="text-child"><FormattedMessage id={"banner.medical-tests"}/></div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="fas fa-user-md"></i>
                </div>
                <div className="text-child"><FormattedMessage id={"banner.mental-health"}/></div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="fas fa-briefcase-medical"></i>
                </div>
                <div className="text-child"><FormattedMessage id={"banner.dental-examination"}/></div>
              </div>
            </div>
          </div>
        </div>
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
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
