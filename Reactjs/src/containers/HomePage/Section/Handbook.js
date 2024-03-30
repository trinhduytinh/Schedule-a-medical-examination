import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import "./Handbook.scss";
import Slider from "react-slick";
import { withRouter } from "react-router";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../../utils";

class Handbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allHandbooks: [],
    };
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allHandbooks !== this.props.allHandbooks) {
      this.setState({
        allHandbooks: this.props.allHandbooks,
      });
    }
  }
  componentDidMount() {
    this.props.loadHandbook();
  }
  handleViewDetailHandbook = (handbook) => {
    if (this.props.history) {
      this.props.history.push(`detail-handbook/${handbook.id}`);
    }
  };
  render() {
    let { allHandbooks } = this.state;
    let { language } = this.props;
    console.log("check handbook1:", allHandbooks);
    return (
      <div className="section-share section-handbook">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">
              {" "}
              <FormattedMessage id="homepage.handbook" />
            </span>
            <button className="btn-section">
              <FormattedMessage id="homepage.more-infor" />
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {allHandbooks &&
                allHandbooks.length > 0 &&
                allHandbooks.map((item, index) => {
                  console.log("check title", item.titleEn);
                  return (
                    <div
                      className="section-customize handbook-child"
                      key={index}
                      onClick={() => this.handleViewDetailHandbook(item)}>
                      <div
                        className="bg-image section-medical-facility"
                        style={{ backgroundImage: `url(${item.image})` }}></div>
                      <div className="handbook-name">
                        {language === LANGUAGES.VI
                          ? item.title
                          : language === LANGUAGES.EN
                          ? item.titleEn
                          : language === LANGUAGES.JA
                          ? item.titleJa
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
    allHandbooks: state.admin.allHandbooks,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadHandbook: () => dispatch(actions.fetchAllHandbooks()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Handbook)
);
