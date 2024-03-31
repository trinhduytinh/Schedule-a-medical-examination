import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./MoreSection.scss";
import * as actions from "../../../store/actions";
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import { LANGUAGES } from "../../../utils";
import { getAllHandbook } from "../../../services/userService";
class MoreHandbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allHandbooks: [],
    };
  }
  async componentDidMount() {
    let res = await getAllHandbook(0, "R1");
    if (res && res.errCode === 0) {
      this.setState({
        allHandbooks: res.data ? res.data : [],
      });
    }
  }
  handleViewDetailHandbook = (handbook) => {
    if (this.props.history) {
      this.props.history.push(`detail-handbook/${handbook.id}`);
    }
  };
  async componentDidUpdate(prevProps, prevState, snapshot) {}
  render() {
    let { allHandbooks } = this.state;
    let { language } = this.props;
    return (
      <>
        <HomeHeader />
        <div className="more-container">
          <div className="title">Cẩm nang y tế</div>
          {allHandbooks &&
            allHandbooks.length > 0 &&
            allHandbooks.map((item, index) => {
              return (
                <div
                  className="more-card"
                  key={index}
                  onClick={() => this.handleViewDetailHandbook(item)}>
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
                              ? item.title
                              : language === LANGUAGES.EN
                              ? item.titleEn
                              : language === LANGUAGES.JA
                              ? item.titleJa
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
    allHandbooks: state.admin.allHandbooks,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadHandbook: () => dispatch(actions.fetchAllHandbooks()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoreHandbook);
