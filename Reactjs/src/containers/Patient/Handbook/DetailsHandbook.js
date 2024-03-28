import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./DetailsHandbook.scss";
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
import HomeHeader from "../../HomePage/HomeHeader";
import Comment from "../SocialPlugin/Comment";
import { getAllDetailHandbookById } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
class DetailsHandbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentHandbookId: "",
      detailHandbook: {},
    };
  }
  async componentDidMount() {
    //lay id trong duong dan
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      this.setState({
        currentHandbookId: id,
      });
      let res = await getAllDetailHandbookById(id);
      if (res && res.errCode === 0) {
        this.setState({
          detailHandbook: res.data,
        });
      }
    }
  }
  // convertDate = (date) => {
  //   if (date) {
  //     date = new Date(date);
  //   }
  //   return date;
  // };

  async componentDidUpdate(prevProps, prevState, snapshot) {}
  convertTime = (dateString) => {
    // Tạo một đối tượng Date từ chuỗi
    var date = new Date(dateString);

    // Lấy thông tin về ngày, tháng, năm, giờ và phút
    var day = date.getDate();
    var month = date.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();

    // Định dạng lại chuỗi theo định dạng mong muốn
    return day + "/" + month + "/" + year + " " + hours + ":" + minutes;
  };
  render() {
    let { detailHandbook } = this.state;
    let { language } = this.props;
    let name = "",
      nameVi = "",
      nameEn = "",
      nameJa = "",
      description = "",
      title = "";
    if (detailHandbook && detailHandbook.doctorDataHandbook) {
      nameVi = `${detailHandbook.doctorDataHandbook.lastName} ${detailHandbook.doctorDataHandbook.firstName}`;
      nameEn = `${detailHandbook.doctorDataHandbook.firstName} ${detailHandbook.doctorDataHandbook.lastName}`;
      nameJa = `${detailHandbook.doctorDataHandbook.lastName} ${detailHandbook.doctorDataHandbook.firstName}`;
    }
    switch (language) {
      case LANGUAGES.VI:
        name = nameVi;
        title = detailHandbook && detailHandbook.title;
        description = detailHandbook && detailHandbook.description;
        break;
      case LANGUAGES.EN:
        name = nameEn;
        title = detailHandbook && detailHandbook.titleEn;
        description = detailHandbook && detailHandbook.descriptionEn;
        break;
      case LANGUAGES.JA:
        name = nameJa;
        title = detailHandbook && detailHandbook.titleJa;
        description = detailHandbook && detailHandbook.descriptionJa;
        break;
      default:
        break;
    }
    let currentURL =
      +process.env.REACT_APP_IS_LOCALHOST === 1
        ? "https://test.com/"
        : window.location.href;
    return (
      <div>
        <HomeHeader />
        <div className="handbook-detail-container">
          <div className="title">{title}</div>
          <div className="posting-date">
            <strong>Ngày đăng bài: </strong>
            {this.convertTime(detailHandbook.updatedAt)}
          </div>
          <div className="body">
            <div
              dangerouslySetInnerHTML={{
                __html: description,
              }}></div>
          </div>
          <div className="person-posting d-flex justify-content-end">
            <strong>Người đăng bài:</strong> {name}
          </div>
          <div className="comment-handbook">
            <Comment dataHref={currentURL} width={"100%"} />
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailsHandbook);
