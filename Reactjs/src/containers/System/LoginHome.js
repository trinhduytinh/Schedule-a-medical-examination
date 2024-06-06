import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./LoginHome.scss";
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
import { LANGUAGES, CRUD_ACTION, CommonUtils } from "../../utils";
import { toast } from "react-toastify";

class LoginHome extends Component {
  constructor(props) {
    super(props);
  }
  async componentDidMount() {}

  async componentDidUpdate(prevProps, prevState, snapshot) {}

  render() {
    let { userInfo, language } = this.props;
    let labelVi = `${userInfo.lastName} ${userInfo.firstName}`;
    let labelEn = `${userInfo.firstName} ${userInfo.lastName}`;
    return (
      <>
        <div className="container">
          <div className="title-welcome">
            Xin chào
            {language === LANGUAGES.VI
              ? labelVi
              : language === LANGUAGES.EN
              ? labelEn
              : labelVi}
          </div>
          <div className="title">Hôm nay bạn muốn làm gì?</div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginHome);
