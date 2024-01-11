import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../HomePage/HomeHeader";
import "./DetailDoctor.scss";
import { getDetailInforDoctor } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
class DetailDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailDoctor: {},
    };
  }
  async componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      let res = await getDetailInforDoctor(id);
      if (res && res.errCode === 0) {
        this.setState({
          detailDoctor: res.data,
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}
  render() {
    console.log("hoi dan it state: ", this.state);
    let { detailDoctor } = this.state;
    let { language } = this.props;
    let nameVi = "",
      nameEn = "",
      nameJa = "";
    let contentHTML, description, nameDoctor;

    if (detailDoctor && detailDoctor.positionData) {
      nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
      nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
      nameJa = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
    }
    switch (language) {
      case LANGUAGES.VI:
        contentHTML =
          detailDoctor &&
          detailDoctor.Markdown &&
          detailDoctor.Markdown.contentHTML;
        description =
          detailDoctor &&
          detailDoctor.Markdown &&
          detailDoctor.Markdown.description;
        nameDoctor = nameVi;
        break;
      case LANGUAGES.EN:
        contentHTML =
          detailDoctor &&
          detailDoctor.Markdown &&
          detailDoctor.Markdown.contentHTMLEn;
        description =
          detailDoctor &&
          detailDoctor.Markdown &&
          detailDoctor.Markdown.descriptionEn;
        nameDoctor = nameEn;
        break;
      case LANGUAGES.JA:
        contentHTML =
          detailDoctor &&
          detailDoctor.Markdown &&
          detailDoctor.Markdown.contentHTMLJa;
        description =
          detailDoctor &&
          detailDoctor.Markdown &&
          detailDoctor.Markdown.descriptionJa;
        nameDoctor = nameJa;
        break;
      default:
        break;
    }
    return (
      <>
        <HomeHeader isShowBanner={false} />
        <div className="doctor-detail-container">
          <div className="intro-doctor">
            <div
              className="content-left"
              style={{
                backgroundImage: `url(${
                  detailDoctor && detailDoctor.image ? detailDoctor.image : ""
                })`,
              }}></div>
            <div className="content-right">
              <div className="up">{nameDoctor}</div>
              <div className="down">
                <span>{description}</span>
              </div>
            </div>
          </div>
          <div className="schedule-doctor"></div>
          <div className="detail-innfor-doctor">
            <div
              dangerouslySetInnerHTML={{
                __html: contentHTML,
              }}></div>
          </div>
          <div className="comment-doctor"></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
