import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
import * as actions from "../../store/actions";
import Navigator from "../../components/Navigator";
import { adminMenu } from "./menuApp";
import { LANGUAGES } from "../../utils";
import "./Header.scss";

class Header extends Component {
  handleChangeLanguage = (event) => {
    this.props.changeLanguageAppRedux(event.target.value);
  };
  render() {
    const { processLogout, language, userInfo } = this.props;
    console.log("check userinfo", userInfo);
    return (
      <div className="header-container">
        {/* thanh navigator */}
        <div className="header-tabs-container">
          <Navigator menus={adminMenu} />
        </div>
        <div className="languages">
          <span className="welcome">
            <FormattedMessage id="homeheader.welcome" />,{" "}
            {userInfo && userInfo.firstName ? userInfo.firstName : ""}!
          </span>
          {/* <span
            className={
              language == LANGUAGES.VI ? "language-vi active" : "language-vi"
            }
            onClick={() => this.handleChangeLanguage(LANGUAGES.VI)}>
            VN
          </span>
          <span
            className={
              language == LANGUAGES.EN ? "language-en active" : "language-en"
            }
            onClick={() => this.handleChangeLanguage(LANGUAGES.EN)}>
            EN
          </span> */}
          {/* nút logout */}

          <select value={language} onChange={this.handleChangeLanguage}>
            <option value={LANGUAGES.VI}>Tiếng Việt</option>
            <option value={LANGUAGES.EN}>English</option>
            <option value={LANGUAGES.JA}>日本語</option>
          </select>
          <div
            className="btn btn-logout"
            onClick={processLogout}
            title="Log out">
            <i className="fas fa-sign-out-alt"></i>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    processLogout: () => dispatch(actions.processLogout()),
    changeLanguageAppRedux: (language) =>
      dispatch(actions.changeLanguageApp(language)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
