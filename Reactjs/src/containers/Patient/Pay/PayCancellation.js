import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./PayCancellation.scss";
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
import HomeHeader from "../../HomePage/HomeHeader";
import ImgPayCancellation from "../../../assets/payCancel.png";
class PayCancellation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {}

  async componentDidUpdate(prevProps, prevState, snapshot) {}
  backHome = () => {
    if (this.props.history) {
      this.props.history.push(`/home`);
    }
  };
  render() {
    let { language } = this.props;
    return (
      <>
        <HomeHeader />
        <div className="container">
          <div className="pay mt-3">
            <div
              className="img-pay-success"
              style={{ backgroundImage: `url(${ImgPayCancellation})` }}></div>
          </div>
          <div className="title-pay"> <FormattedMessage id={"pay.payment-failed"} /></div>
          <div className="pay mt-4">
            <button className="btn btn-primary" onClick={()=>this.backHome()}>
            <FormattedMessage id={"pay.return-to-home-page"} />
            </button>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PayCancellation);
