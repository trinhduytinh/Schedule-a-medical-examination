import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./ChangPassword.scss";
import { FormattedMessage } from "react-intl"; // dùng để chuyển đổi ngôn ngữ
import { confirmPassword } from "../../services/userService";
import { toast } from "react-toastify";

class ChangPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: "",
      rePassword: "",
      isShowNewPassword: false,
      isShowRePassword: false,
      email: "",
      token: "",
    };
  }

  componentDidMount() {
    const searchParams = new URLSearchParams(this.props.location.search);
    const email = searchParams.get("email");
    const token = searchParams.get("token");
    this.setState({ email, token });
  }

  handleOnChangeNewPassword = (event) => {
    this.setState({
      newPassword: event.target.value,
    });
  };

  handleOnChangeRePassword = (event) => {
    this.setState({
      rePassword: event.target.value,
    });
  };

  handleConfirm = async () => {
    const { newPassword, rePassword, email, token } = this.state;
    if (newPassword || rePassword) {
      if (newPassword !== rePassword) {
        toast.error("New password and re-enter new password do not match!");
      } else {
        let res = await confirmPassword({
          token: token,
          email: email,
          newPassword: newPassword,
        });
        if (res && res.errCode === 0) {
          toast.success("Password changed successfully!");
          if (this.props.history) {
            this.props.history.push(`/login`);
          }
        } else {
          toast.error(res.message);
        }
      }
    } else {
      toast.error("Please complete all information");
    }
  };

  handleShowHideNewPassword = () => {
    this.setState({
      isShowNewPassword: !this.state.isShowNewPassword,
    });
  };

  handleShowReRePassword = () => {
    this.setState({
      isShowRePassword: !this.state.isShowRePassword,
    });
  };

  // hàm kích hoạt enter
  handleKeyDown = (event) => {
    if (event.key === "Enter") this.handleConfirm();
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {}

  render() {
    return (
      <div className="login-background-chang-password">
        <div className="login-container">
          <div className="login-content row">
            <div className="col-12 text-login">Đổi Mật Khẩu</div>
            <div className="col-12 form-group login-input">
              <label>Mật khẩu mới: </label>
              <div className="custom-input-password">
                <input
                  type={this.state.isShowNewPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Mật khẩu mới"
                  value={this.state.newPassword}
                  onChange={this.handleOnChangeNewPassword}
                />
                <span onClick={this.handleShowHideNewPassword}>
                  <i
                    className={
                      this.state.isShowNewPassword
                        ? "far fa-eye"
                        : "fas fa-eye-slash"
                    }></i>
                </span>
              </div>
            </div>
            <div className="col-12 form-group login-input">
              <label>Nhập lại mật khẩu: </label>
              <div className="custom-input-password">
                <input
                  type={this.state.isShowRePassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Nhập lại mật khẩu"
                  value={this.state.rePassword}
                  onChange={this.handleOnChangeRePassword}
                  onKeyDown={this.handleKeyDown}
                />
                <span onClick={this.handleShowReRePassword}>
                  <i
                    className={
                      this.state.isShowRePassword
                        ? "far fa-eye"
                        : "fas fa-eye-slash"
                    }></i>
                </span>
              </div>
            </div>
            <div className="col-12">
              <button className="btn-login" onClick={this.handleConfirm}>
                Xác nhận thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangPassword);
