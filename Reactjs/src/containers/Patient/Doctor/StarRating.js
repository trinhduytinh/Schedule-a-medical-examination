import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./StarRating.scss";
import { FormattedMessage } from "react-intl";
import { getStars, postTotalStars } from "../../../services/userService";

class StarRating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 0,
      hover: 0,
      currentStars: 0,
    };
  }

  async componentDidMount() {
    await this.fetchStars(this.props.doctorId);
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.doctorId !== this.props.doctorId) {
      await this.fetchStars(this.props.doctorId);
    }
  }

  async fetchStars(doctorId) {
    if (doctorId && doctorId !== -1) {
      let res = await getStars(doctorId);
      if (res && res.errCode === 0) {
        const stars = res.totalStars.totalStars;
        this.setState({
          currentStars: stars, // Giả sử res.totalStars.totalStars chứa số sao
          rating: stars ? Math.round(stars) : 0, // Cập nhật rating dựa trên currentStars
        });
      }
    }
  }

  async setRating(rating) {
    this.setState({ rating });
    await this.updateStars(rating);
  }

  setHover(hover) {
    this.setState({ hover });
  }

  async updateStars(newStars) {
    const { doctorId } = this.props;
    if (doctorId && doctorId !== -1) {
      let res = await postTotalStars(doctorId, newStars);
      if (res && res.errCode === 0) {
        await this.fetchStars(doctorId);
      }
    }
  }

  render() {
    const { rating, hover, currentStars } = this.state;
    return (
      <Fragment>
        <div className="title-evaluate"><FormattedMessage id={"patient.detail-doctor.evaluate"}/></div>
        <div className="star-wrapper">
          {[...Array(5)].map((star, index) => {
            const ratingValue = index + 1;
            return (
              <div
                key={index}
                className={`star ${
                  ratingValue <= (hover || rating) ? "hovered" : ""
                }`}
                onClick={() => this.setRating(ratingValue)}
                onMouseEnter={() => this.setHover(ratingValue)}
                onMouseLeave={() => this.setHover(0)}
              >
                <i className="fa fa-star"></i>
              </div>
            );
          })}
          <div className="total-stars">
            {currentStars ? currentStars.toFixed(1) : "0.0"} <i className="fa fa-star"></i>
          </div>
        </div>
      </Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(StarRating);
