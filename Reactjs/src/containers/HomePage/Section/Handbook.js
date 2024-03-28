import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import "./Handbook.scss"
import Slider from "react-slick";
import { withRouter } from "react-router"; 

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
    if(this.props.history){
      this.props.history.push(`detail-handbook/${handbook.id}`)
    }
  };
  render() {
    let {allHandbooks} = this.state;
    let { language } = this.props;
    console.log("check handbook:", allHandbooks);
    return (
      <div className="section-share section-handbook">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">Cẩm nang</span>
            <button className="btn-section">Xem thêm</button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
            {allHandbooks &&
                allHandbooks.length > 0 &&
                allHandbooks.map((item, index) => {
                  return (
                    <div
                      className="section-customize handbook-child"
                      key={index}
                      onClick={() => this.handleViewDetailHandbook(item)}
                      >
                      <div
                        className="bg-image section-medical-facility"
                        style={{ backgroundImage: `url(${item.image})` }}></div>
                      <div className="handbook-name">{item.title}</div>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadHandbook: () => dispatch(actions.fetchAllHandbooks()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Handbook));
