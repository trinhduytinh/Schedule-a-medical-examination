import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./PaySuccess.scss";
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
import HomeHeader from "../../HomePage/HomeHeader";
import ImgPaySuccess from "../../../assets/payseccus.png";
import { postPatientBookAppointmentRemote } from "../../../services/userService";
import { toast } from "react-toastify";
class PaySuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {
    this.getPaymentBooking();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {}
  getPaymentBooking = async () => {
    const params = new URLSearchParams(this.props.location.search);
    const encodedData = params.get("data");
    if (encodedData) {
      try {
        const decodedData = decodeURIComponent(encodedData);
        const data = JSON.parse(decodedData);
        let res = await postPatientBookAppointmentRemote({
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          email: data.email,
          address: data.address,
          reason: data.reason,
          date: data.date,
          birthday: "" + data.birthday,
          selectedGender: data.selectedGender,
          doctorId: data.doctorId,
          timeType: data.timeType,
          language: data.language,
          timeString: data.timeString,
          doctorName: data.doctorName,
        });
        if (res && res.errCode === 0) {
          toast.success("Booking a new appointment succeed!");
        } else {
          toast.error("Booking a new appointment error!");
        }
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    } else {
      console.error("No data parameter found");
    }
  };
  backHome = () =>{
    if (this.props.history) {
      this.props.history.push(`/home`);
    }
  }
  render() {
    return (
      <>
        <HomeHeader />
        <div className="container">
          <div className="pay mt-3">
            <div
              className="img-pay-success"
              style={{ backgroundImage: `url(${ImgPaySuccess})` }}></div>
          </div>
          <div className="title-pay"><FormattedMessage id={"pay.payment-success"}/></div>
          <div className="title-pay"><FormattedMessage id={"pay.check-mail"}/></div>
          <div className="pay mt-4">
            <button className="btn btn-primary" onClick={this.backHome()}><FormattedMessage id={"pay.return-to-home-page"}/></button>
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

export default connect(mapStateToProps, mapDispatchToProps)(PaySuccess);
