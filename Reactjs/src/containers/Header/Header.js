import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
import * as actions from "../../store/actions";
import Navigator from "../../components/Navigator";
import { adminMenu, doctorMenu } from "./menuApp";
import { LANGUAGES, USER_ROLE } from "../../utils";
import "./Header.scss";
import { isEmpty } from "lodash";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuApp: [],
    };
  }
  handleChangeLanguage = (event) => {
    this.props.changeLanguageAppRedux(event.target.value);
  };
  componentDidMount() {
    let { userInfo } = this.props;
    let menu = [];
    if (userInfo && !isEmpty(userInfo)) {
      let role = userInfo.roleId;
      if(role === USER_ROLE.ADMIN)
        menu = adminMenu;
      if(role === USER_ROLE.DOCTOR)
        menu = doctorMenu;
    }
    this.setState({
      menuApp: menu,
    })

  }
  render() {
    const { processLogout, language, userInfo } = this.props;
    return (
      <div className="header-container">
        {/* thanh navigator */}
        <div className="header-tabs-container">
          <Navigator menus={this.state.menuApp} />
        </div>
        <div className="languages">
          <span className="welcome">
            <FormattedMessage id="homeheader.welcome" />,{" "}
            {userInfo && userInfo.firstName ? userInfo.firstName : ""}!
          </span>
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
