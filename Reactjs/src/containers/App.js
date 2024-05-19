import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import { history } from "../redux";
import { ToastContainer } from "react-toastify";

import {
  userIsAuthenticated,
  userIsNotAuthenticated,
} from "../hoc/authentication";

import { path } from "../utils";

import Home from "../routes/Home";
// import Login from '../routes/Login';
import Login from "./Auth/Login";
import Header from "./Header/Header";
import System from "../routes/System";
import HomePage from "./HomePage/HomePage";
import { CustomToastCloseButton } from "../components/CustomToast";
// import ConfirmModal from '../components/ConfirmModal';
import CustomScrollbars from "../components/CustomScrollbars"; //component cuon
import DetailDoctor from "./Patient/Doctor/DetailDoctor";
import Doctor from "../routes/Doctor";
import VerifyEmail from "./Patient/VerifyEmail";
import DetailSpecialty from "./Patient/Specialty/DetailSpecialty";
import DetailClinic from "./Patient/Clinic/DetailClinic";
import DetailsHandbook from "./Patient/Handbook/DetailsHandbook";
import MoreSpecialty from "./Patient/MoreSection/MoreSpecialty";
import MoreClinic from "./Patient/MoreSection/MoreClinic";
import MoreHandbook from "./Patient/MoreSection/MoreHandbook";
import MoreDoctor from "./Patient/MoreSection/MoreDoctor";
import SpecialtyRemote from "./HomePage/Section/SpecialtyRemote";
import DetailSpecialtyRemote from "./Patient/Specialty/DetailSpecialtyRemote";
import DetailDoctorRemote from "./Patient/Doctor/DetailDoctorRemote";

class App extends Component {
  handlePersistorState = () => {
    const { persistor } = this.props;
    let { bootstrapped } = persistor.getState();
    if (bootstrapped) {
      if (this.props.onBeforeLift) {
        Promise.resolve(this.props.onBeforeLift())
          .then(() => this.setState({ bootstrapped: true }))
          .catch(() => this.setState({ bootstrapped: true }));
      } else {
        this.setState({ bootstrapped: true });
      }
    }
  };

  componentDidMount() {
    this.handlePersistorState();
  }

  render() {
    return (
      <Fragment>
        <Router history={history}>
          <div className="main-container">
            <div className="content-container">
              <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
                <Switch>
                  <Route path={path.HOME} exact component={Home} />
                  <Route
                    path={path.LOGIN}
                    component={userIsNotAuthenticated(Login)}
                  />
                  <Route
                    path={path.SYSTEM}
                    component={userIsAuthenticated(System)}
                  />
                  <Route
                    path={'/doctor'}
                    component={userIsAuthenticated(Doctor)}
                  />
                  <Route path={path.HOMEPAGE} component={HomePage} />
                  <Route path={path.DETAIL_DOCTOR} component={DetailDoctor} />
                  <Route path={path.DETAIL_SPECIALTY} component={DetailSpecialty} />
                  <Route path={path.VERIFY_EMAIL_BOOKING} component={VerifyEmail} />
                  <Route path={path.DETAIL_Clinic} component={DetailClinic} />
                  <Route path={path.DETAIL_HandBook} component={DetailsHandbook} />
                  <Route path={path.MORE_SPECIALTY} component={MoreSpecialty}/>
                  <Route path={path.MORE_CLINIC} component={MoreClinic}/>
                  <Route path={path.MORE_HANDBOOK} component={MoreHandbook}/>
                  <Route path={path.MORE_DOCTOR} component={MoreDoctor}/>
                  <Route path={path.MORE_SPECIALTY_REMOTE} component={SpecialtyRemote}/>
                  <Route path={path.DETAIL_SPECIALTY_REMOTE} component={DetailSpecialtyRemote} />
                  <Route path={path.DETAIL_DOCTOR_REMOTE} component={DetailDoctorRemote} />
                </Switch>
              </CustomScrollbars>
            </div>

            {/* <ToastContainer
              className="toast-container"
              toastClassName="toast-item"
              bodyClassName="toast-item-body"
              autoClose={false}
              hideProgressBar={true}
              pauseOnHover={false}
              pauseOnFocusLoss={true}
              closeOnClick={false}
              draggable={false}
              closeButton={<CustomToastCloseButton />}
            /> */}
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </Router>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    started: state.app.started,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
