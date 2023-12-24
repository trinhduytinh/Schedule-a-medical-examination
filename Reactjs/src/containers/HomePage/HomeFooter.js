import React, { Component } from "react";
import { connect } from "react-redux";
class HomeFooter extends Component {
  render() {
    return (
      <div className="home-footer">
        <p>&copy; 2023 Trịnh Duy Tính. More information <a target="_blank" href="https://github.com/trinhduytinh">&#8594; Click here &#8592;</a></p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
