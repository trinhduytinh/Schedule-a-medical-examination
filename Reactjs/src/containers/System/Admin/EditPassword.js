import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./EditPassword.scss";
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
import { toast } from "react-toastify";
import { changePassword } from "../../../services/userService";
class EditPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPassword: "",
      newPassword: "",
      reEnterPassword: "",
      isShowCurrentPassword: false,
      isShowNewPassword: false,
      isShowReEnterPassword: false,
    };
  }
  async componentDidMount() {}

  handleOnChangeText = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };
  handleShowHidePassword = (id) => {
    this.setState((prevState) => ({
      [id]: !prevState[id],
    }));
  };
  SubmitEditPassword = async (event) => {
    event.preventDefault();
    let { user } = this.props;
    const { newPassword, reEnterPassword, currentPassword } = this.state;

    if (newPassword !== reEnterPassword) {
      toast.error("New password and re-enter new password do not match!");
    } else {
      let res = await changePassword({
        doctorId: user.id,
        password: currentPassword,
        newPassword: newPassword,
      });
      if (res && res.errCode === 0) {
        toast.success("Password change successful!");
      } else {
        toast.error(res.message);
      }
    }
  };
  async componentDidUpdate(prevProps, prevState, snapshot) {}
  render() {
    return (
      <div className="container">
        <div className="title">
          <FormattedMessage id={"change-password.change-password"} />
        </div>
        <div className="form-edit-password">
          <form>
            <div className="col-12 form-group login-input mb-3">
              <label className="form-label">
                <FormattedMessage id={"change-password.current-password"} />
              </label>
              <div className="custom-input-password">
                <input
                  type={this.state.isShowCurrentPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Mật khẩu hiện tại"
                  value={this.state.currentPassword}
                  onChange={(event) =>
                    this.handleOnChangeText(event, "currentPassword")
                  }
                />
                <span
                  onClick={() => {
                    this.handleShowHidePassword("isShowCurrentPassword");
                  }}>
                  <i
                    className={
                      this.state.isShowCurrentPassword
                        ? "far fa-eye"
                        : "fas fa-eye-slash"
                    }></i>
                </span>
              </div>
            </div>
            <div className="col-12 form-group login-input mb-3">
              <label className="form-label">
                <FormattedMessage id={"change-password.new-password"} />{" "}
              </label>
              <div className="custom-input-password">
                <input
                  type={this.state.isShowNewPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Mật khẩu mới"
                  value={this.state.newPassword}
                  onChange={(event) =>
                    this.handleOnChangeText(event, "newPassword")
                  }
                />
                <span
                  onClick={() => {
                    this.handleShowHidePassword("isShowNewPassword");
                  }}>
                  <i
                    className={
                      this.state.isShowNewPassword
                        ? "far fa-eye"
                        : "fas fa-eye-slash"
                    }></i>
                </span>
              </div>
            </div>
            <div className="col-12 form-group login-input mb-3">
              <label className="form-label">
                <FormattedMessage id={"change-password.enter-a-new-password"} />
              </label>
              <div className="custom-input-password">
                <input
                  type={this.state.isShowReEnterPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Nhập lại mật khẩu mới"
                  value={this.state.reEnterPassword}
                  onChange={(event) =>
                    this.handleOnChangeText(event, "reEnterPassword")
                  }
                />
                <span
                  onClick={() => {
                    this.handleShowHidePassword("isShowReEnterPassword");
                  }}>
                  <i
                    className={
                      this.state.isShowReEnterPassword
                        ? "far fa-eye"
                        : "fas fa-eye-slash"
                    }></i>
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={this.SubmitEditPassword}>
              <FormattedMessage id={"change-password.submit"} />
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPassword);
