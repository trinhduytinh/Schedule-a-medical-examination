import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
import { LANGUAGES } from "../../utils";
import { changeLanguageApp } from "../../store/actions";
import { withRouter } from "react-router";
import Select from "react-select";
import vn from "../../assets/vietnam.png";
import ja from "../../assets/ja.png";
import en from "../../assets/en.png";
import { getAllSpecialty } from "../../services/userService";
import { Button, Offcanvas, OffcanvasHeader, OffcanvasBody } from "reactstrap";
import CheckBookingModal from "./Section/CheckBookingModal";

class HomeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSpecialty: "",
      listSpecialty: [],
      isOffcanvasOpen: false, // new state to handle Offcanvas visibility
      isOpenModalBooking: false,
    };
  }
  async componentDidMount() {
    let res = await getAllSpecialty();
    if (res && res.errCode === 0) {
      let dataSelect = this.buildDataInputSelect(res.data);
      this.setState({
        listSpecialty: dataSelect,
      });
    }
  }
  changeLanguage = (language) => {
    //fire redux event : actions
    if (language === "VN") this.props.changeLanguageAppRedux(LANGUAGES.VI);
    if (language === "EN") this.props.changeLanguageAppRedux(LANGUAGES.EN);
    if (language === "JA") this.props.changeLanguageAppRedux(LANGUAGES.JA);
  };
  returnToHome = () => {
    if (this.props.history) this.props.history.push(`/home`);
  };
  returnToLogin = () => {
    if (this.props.history) this.props.history.push(`/login`);
  };
  buildDataInputSelect = (inputData) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        let labelVi = `${item.name}`;
        let labelEn = `${item.nameEn}`;
        let labelJa = `${item.nameJa}`;
        if (language === LANGUAGES.VI) object.label = labelVi;
        if (language === LANGUAGES.EN) object.label = labelEn;
        if (language === LANGUAGES.JA) object.label = labelJa;
        object.value = item.id;
        result.push(object);
      });
    }
    return result;
  };
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.language !== this.props.language) {
      let res = await getAllSpecialty();
      if (res && res.errCode === 0) {
        let dataSelect = this.buildDataInputSelect(res.data);
        this.setState({
          listSpecialty: dataSelect,
        });
      }
    }
  }
  handleChangeSelectDoctorInFor = async (selectedOption, name) => {
    let stateName = name.name;
    let stateCopy = { ...this.state };
    stateCopy[stateName] = selectedOption;
    this.setState({
      ...stateCopy,
    });
    if (this.props.history) {
      this.props.history.push(`/detail-specialty/${selectedOption.value}`);
    }
  };
  handleViewMoreSpecialtyRemote = () => {
    if (this.props.history) {
      this.props.history.push(`/more-specialty-remote`);
    }
  };
  toggleOffcanvas = () => {
    this.setState((prevState) => ({
      isOffcanvasOpen: !prevState.isOffcanvasOpen,
    }));
  };
  handleClickScheduleTime = (time) => {
    this.setState({
      isOpenModalBooking: true,
      dataScheduleTimeModal: time,
    });
  };
  closeBookingClose = () => {
    this.setState({
      isOpenModalBooking: false,
    });
  };
  handleClickCheckBooking = () => {
    this.setState({
      isOpenModalBooking: true,
    });
  };
  handleViewMoreClinic = () => {
    if (this.props.history) {
      this.props.history.push(`/more-clinic`);
    }
  };
  handleViewMoreSpecialty = () => {
    if (this.props.history) {
      this.props.history.push(`more-specialty`);
    }
  };
  handleViewMoreDoctor = () => {
    if (this.props.history) {
      this.props.history.push(`more-doctor`);
    }
  };
  render() {
    let language = this.props.language;
    let { isOpenModalBooking } = this.state;
    return (
      <React.Fragment>
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="left-content">
              <i className="fas fa-bars" onClick={this.toggleOffcanvas}></i>
              <Offcanvas
                isOpen={this.state.isOffcanvasOpen}
                toggle={this.toggleOffcanvas}>
                <OffcanvasHeader toggle={this.toggleOffcanvas}>
                  <FormattedMessage id={"menu.patient.menu"} />
                </OffcanvasHeader>
                <OffcanvasBody>
                  <div
                    className="item"
                    onClick={() => this.handleClickCheckBooking()}>
                    <FormattedMessage
                      id={"menu.patient.check-appointment-schedule"}
                    />
                  </div>
                  <div className="item" onClick={() => this.returnToLogin()}>
                    <FormattedMessage id={"menu.patient.for-doctors"} />
                  </div>
                </OffcanvasBody>
              </Offcanvas>
              <div
                className="header-logo"
                onClick={() => this.returnToHome()}></div>
            </div>
            <div className="center-content">
              <div
                className="child-content"
                onClick={() => this.handleViewMoreSpecialty()}>
                <div>
                  <b>
                    <FormattedMessage id={"homeheader.specialty"} />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id={"homeheader.search-doctor"} />
                </div>
              </div>
              <div
                className="child-content"
                onClick={() => this.handleViewMoreClinic()}>
                <div>
                  <b>
                    <FormattedMessage id={"homeheader.health-facility"} />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id={"homeheader.select-room"} />
                </div>
              </div>
              <div
                className="child-content"
                onClick={() => this.handleViewMoreDoctor()}>
                <div>
                  <b>
                    <FormattedMessage id={"homeheader.doctor"} />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id={"homeheader.select-doctor"} />
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
                {/* <input type="text" placeholder="Tìm Chuyên khoa khám bệnh" /> */}
                <Select
                  value={this.state.selectedSpecialty}
                  onChange={this.handleChangeSelectDoctorInFor}
                  options={this.state.listSpecialty}
                  placeholder={<FormattedMessage id={"homepage.search"} />}
                  name="selectedSpecialty"
                />
              </div>
            </div>
            <div className="content-down">
              <div className="options">
                <div
                  className="option-child"
                  onClick={() => this.handleViewMoreSpecialtyRemote()}>
                  <div className="icon-child">
                    <i className="fas fa-mobile-alt"></i>
                  </div>
                  <div
                    className="text-child"
                    onClick={() => this.handleViewMoreSpecialtyRemote()}>
                    <FormattedMessage id={"banner.remote-examination"} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <CheckBookingModal
          isOpenModal={isOpenModalBooking}
          closeBookingClose={this.closeBookingClose}
        />
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
