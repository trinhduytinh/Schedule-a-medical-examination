import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import * as actions from "../../store/actions";
import Navigator from "../../components/Navigator";
import { adminMenu, doctorMenu, doctorMenuRemote } from "./menuApp";
import { LANGUAGES, USER_ROLE } from "../../utils";
import "./Header.scss";
import { isEmpty } from "lodash";
import { getDoctorInfor } from "../../services/userService";
import { toast } from "react-toastify";
import vn from "../../assets/vietnam.png";
import ja from "../../assets/ja.png";
import en from "../../assets/en.png";

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

  async componentDidMount() {
    let { userInfo } = this.props;
    let menu = [];
    if (userInfo && !isEmpty(userInfo)) {
      let role = userInfo.roleId;
      if (role === USER_ROLE.ADMIN) menu = adminMenu;
      if (role === USER_ROLE.DOCTOR) {
        let res = await getDoctorInfor(userInfo.id);
        if (res && res.errCode === 0) {
          if (res.data && res.data.remote === "RM") {
            menu = doctorMenuRemote;
          }
          if (res.data && res.data.remote === "RM0") {
            menu = doctorMenu;
          }
        } else {
          toast.error("Error!");
        }
      }
      if (role === USER_ROLE.NEW_USER) {
        toast.info(
          "Please contact the system administrator for updated information."
        );
      }
    }
    this.setState({
      menuApp: menu,
    });
  }
  changeLanguage = (language) => {
    //fire redux event : actions
    if (language === "VN") this.props.changeLanguageAppRedux(LANGUAGES.VI);
    if (language === "EN") this.props.changeLanguageAppRedux(LANGUAGES.EN);
    if (language === "JA") this.props.changeLanguageAppRedux(LANGUAGES.JA);
  };
  render() {
    const { processLogout, language, userInfo } = this.props;
    return (
      <div className="header-container">
        <div className="header-tabs-container">
          <Navigator menus={this.state.menuApp} />
        </div>
        <div className="languages">
          <span className="welcome">
            <FormattedMessage id="homeheader.welcome" />,{" "}
            {userInfo && userInfo.firstName ? userInfo.firstName : ""}!
          </span>
          {/* <select value={language} onChange={this.handleChangeLanguage}>
            <option value={LANGUAGES.VI}>Tiếng Việt</option>
            <option value={LANGUAGES.EN}>English</option>
            <option value={LANGUAGES.JA}>日本語1</option>
          </select> */}
          <div className="change-language">
            {language === LANGUAGES.VI ? (
              <div className="dropdown-language">
                <button className="dropdown-btn">
                  <img src={vn}></img>
                  <span>
                    <FormattedMessage id={"homeheader.vn"} />
                  </span>
                </button>
                <div className="dropdown-content">
                  <button
                    onClick={() => {
                      this.changeLanguage("EN");
                    }}>
                    <img src={en}></img>
                    <div>
                      <FormattedMessage id={"homeheader.en"} />
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      this.changeLanguage("JA");
                    }}>
                    <img src={ja}></img>
                    <div>
                      <FormattedMessage id={"homeheader.ja"} />
                    </div>
                  </button>
                </div>
              </div>
            ) : language === LANGUAGES.EN ? (
              <div className="dropdown-language">
                <button className="dropdown-btn">
                  <img src={en}></img>
                  <span>
                    <FormattedMessage id={"homeheader.en"} />
                  </span>
                </button>
                <div className="dropdown-content">
                  <button
                    onClick={() => {
                      this.changeLanguage("VN");
                    }}>
                    <img src={vn}></img>
                    <div>
                      <FormattedMessage id={"homeheader.vn"} />
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      this.changeLanguage("JA");
                    }}>
                    <img src={ja}></img>
                    <div>
                      <FormattedMessage id={"homeheader.ja"} />
                    </div>
                  </button>
                </div>
              </div>
            ) : language === LANGUAGES.JA ? (
              <div className="dropdown-language">
                <button className="dropdown-btn">
                  <img src={ja}></img>
                  <span>
                    <FormattedMessage id={"homeheader.ja"} />
                  </span>
                </button>
                <div className="dropdown-content">
                  <button
                    onClick={() => {
                      this.changeLanguage("EN");
                    }}>
                    <img src={en}></img>
                    <div>
                      <FormattedMessage id={"homeheader.en"} />
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      this.changeLanguage("VN");
                    }}>
                    <img src={vn}></img>
                    <div>
                      <FormattedMessage id={"homeheader.vn"} />
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
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
