import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Login.scss";
import { FormattedMessage } from "react-intl";
import {
  createNewUserLogin,
  forgotPassword,
  handleLoginApi,
} from "../../services/userService";
import { toast } from "react-toastify";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isShowPassword: false,
      errMessage: "",
      isShowForgotPassword: false,
      email: "",
      isShowRegister: false,
      firstName: "",
      lastName: "",
    };
  }

  handleOnChangeUsername = (event) => {
    this.setState({
      username: event.target.value,
    });
  };

  handleOnChangePassword = (event) => {
    this.setState({
      password: event.target.value,
    });
  };

  handleOnChangeForgotPassword = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  handleOnChangeFirstName = (event) => {
    this.setState({
      firstName: event.target.value,
    });
  };

  handleOnChangeLastName = (event) => {
    this.setState({
      lastName: event.target.value,
    });
  };

  handleLogin = async () => {
    this.setState({
      errMessage: "",
    });
    try {
      let data = await handleLoginApi(this.state.username, this.state.password);
      console.log(data);
      if (data && data.errCode !== 0) {
        this.setState({
          errMessage: data.message,
        });
      }
      if (data && data.errCode === 0) {
        this.props.userLoginSuccess(data.user);
      }
    } catch (e) {
      if (e.response && e.response.data) {
        this.setState({
          errMessage: e.response.data.message,
        });
      }
    }
  };

  handleShowHidePassword = () => {
    this.setState({
      isShowPassword: !this.state.isShowPassword,
    });
  };

  handleKeyDown = (event) => {
    if (event.key === "Enter") this.handleLogin();
  };

  handleForgotPassword = () => {
    this.setState({
      isShowForgotPassword: true,
      isShowRegister: false,
    });
  };

  handleRegister = () => {
    this.setState({
      isShowRegister: true,
      isShowForgotPassword: false,
    });
  };

  handleSubmitForgotPassword = async () => {
    let { email } = this.state;
    let { language } = this.props;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email) {
      if (emailRegex.test(email)) {
        let res = await forgotPassword(email, language);
        if (res && res.errCode === 0) {
          this.setState({
            email: "",
          });
          toast.success("Gửi email thành công!");
        } else {
          toast.error(res.message);
        }
      } else {
        toast.error("Vui lòng nhập đúng cú pháp!");
      }
    } else {
      toast.error("Vui lòng nhập email!");
    }
  };
  handleCreateUser = async () => {
    let { email, password, firstName, lastName } = this.state;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password || !firstName || !lastName) {
      toast.error("Missing required parameters!");
    } else {
      if (emailRegex.test(email)) {
        let res = await createNewUserLogin({
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
        });
        if (res && res.errCode === 0) {
          console.log("check res", res);
          toast.success("Đăng ký tài khoản thành công!");
        } else {
          toast.error(res.errMessage);
        }
      } else {
        toast.error("Vui lòng nhập email!");
      }
    }
  };
  handleBackToLogin = () => {
    this.setState({
      isShowForgotPassword: false,
      isShowRegister: false,
    });
  };

  render() {
    let { isShowForgotPassword, isShowRegister } = this.state;
    return (
      <>
        {isShowForgotPassword ? (
          <div className="login-background">
            <div className="login-container">
              <div className="login-content row">
                <div className="col-12 text-login">Quên mật khẩu</div>
                <div className="col-12 form-group login-input">
                  <label>
                    Vui lòng nhập email của bạn và nhấn vào{" "}
                    <strong>"Liên kết qua Email"</strong> để đặt lại mật khẩu
                    cho tài khoản của bạn.
                  </label>
                  <input
                    type="text"
                    className="form-control mt-3"
                    placeholder="email@gmail.com"
                    value={this.state.email}
                    onChange={this.handleOnChangeForgotPassword}
                  />
                </div>
                <div className="col-12">
                  <button
                    className="btn-login"
                    onClick={this.handleSubmitForgotPassword}>
                    Submit
                  </button>
                </div>
                <div className="col-12">
                  <span
                    className="forgot-password"
                    onClick={this.handleBackToLogin}>
                    Quay lại đăng nhập
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : isShowRegister ? (
          <div className="login-background">
            <div className="login-container">
              <div className="login-content row">
                <div className="col-12 text-login">Đăng ký tài khoản</div>
                <div className="col-12 form-group login-input">
                  <label>
                    Lưu ý sau khi đăng ký tài khoản thành công. Vui lòng liên hệ
                    với admin cập nhập thông tin.
                  </label>
                  <label className="mt-3">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="email@gmail.com"
                    value={this.state.email}
                    onChange={this.handleOnChangeForgotPassword}
                  />
                </div>
                <div className="col-12 form-group login-input">
                  <label>Password: </label>
                  <div className="custom-input-password">
                    <input
                      type={this.state.isShowPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Enter your password"
                      value={this.state.password}
                      onChange={this.handleOnChangePassword}
                      onKeyDown={this.handleKeyDown}
                    />
                    <span onClick={this.handleShowHidePassword}>
                      <i
                        className={
                          this.state.isShowPassword
                            ? "far fa-eye"
                            : "fas fa-eye-slash"
                        }></i>
                    </span>
                  </div>
                </div>
                <div className="col-6 form-group login-input">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First Name"
                    value={this.state.firstName}
                    onChange={this.handleOnChangeFirstName}
                  />
                </div>
                <div className="col-6 form-group login-input">
                  <label>Last name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last name"
                    value={this.state.lastName}
                    onChange={this.handleOnChangeLastName}
                  />
                </div>
                <div className="col-12">
                  <button className="btn-login" onClick={this.handleCreateUser}>
                    Submit
                  </button>
                </div>
                <div className="col-12">
                  <span
                    className="forgot-password"
                    onClick={this.handleBackToLogin}>
                    Quay lại đăng nhập
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="login-background">
            <div className="login-container">
              <div className="login-content row">
                <div className="col-12 text-login">Login</div>
                <div className="col-12 form-group login-input">
                  <label>Username: </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your username"
                    value={this.state.username}
                    onChange={this.handleOnChangeUsername}
                  />
                </div>
                <div className="col-12 form-group login-input">
                  <label>Password: </label>
                  <div className="custom-input-password">
                    <input
                      type={this.state.isShowPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Enter your password"
                      value={this.state.password}
                      onChange={this.handleOnChangePassword}
                      onKeyDown={this.handleKeyDown}
                    />
                    <span onClick={this.handleShowHidePassword}>
                      <i
                        className={
                          this.state.isShowPassword
                            ? "far fa-eye"
                            : "fas fa-eye-slash"
                        }></i>
                    </span>
                  </div>
                </div>
                <div className="col-12" style={{ color: "red" }}>
                  {this.state.errMessage}
                </div>
                <div className="col-12">
                  <button className="btn-login" onClick={this.handleLogin}>
                    Login
                  </button>
                </div>
                <div className="col-9">
                  <span
                    className="forgot-password"
                    onClick={this.handleForgotPassword}>
                    Forgot your password?
                  </span>
                </div>
                <div className="col-3">
                  <span
                    className="forgot-password"
                    onClick={this.handleRegister}>
                    Đăng ký?
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
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
  return {
    navigate: (path) => dispatch(push(path)),
    userLoginSuccess: (userInfor) =>
      dispatch(actions.userLoginSuccess(userInfor)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
