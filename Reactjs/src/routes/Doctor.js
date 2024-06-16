import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import ManageSchedule from "../containers/System/Doctor/ManageSchedule";
import Header from "../containers/Header/Header";
import ManagePatient from "../containers/System/Doctor/ManagePatient";
import ManageHandbook from "../containers/System/Handbook/ManageHandbook";
import ManageScheduleRemote from "../containers/System/Doctor/ManageScheduleRemote";
import ManagePatientRemote from "../containers/System/Doctor/ManagePatientRemote";
class Doctor extends Component {
  render() {
    const { isLoggedIn } = this.props;  
    return (
      <React.Fragment>
        {this.props.isLoggedIn && <Header />}
        <div className="system-container">
          <div className="system-list">
            <Switch>
              <Route path="/doctor/manage-schedule" component={ManageSchedule} />
              <Route path="/doctor/manage-patient" component={ManagePatient} />
              <Route path="/doctor/manage-handbook" component={ManageHandbook}/>
              <Route path="/doctor/manage-schedule-remote" component={ManageScheduleRemote} />
              <Route path="/doctor/manage-patient-remote" component={ManagePatientRemote} />
            </Switch>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
