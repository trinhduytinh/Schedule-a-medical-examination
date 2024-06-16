import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
} from "reactstrap";
import { emitter } from "../../../utils/emitter";
import { toast } from "react-toastify";
import { CommonUtils, LANGUAGES } from "../../../utils";
import { deleteHandbook } from "../../../services/userService";
class CardHandbook extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleDeleteHandbook = async (data) => {
    try {
      let res = await deleteHandbook(data.id);
      if (res && res.errCode == 0) {
        toast.success(res.errMessage);
        this.props.refreshHandbooks(); // Gọi hàm refresh từ component cha
        // await ();
      } else {
        toast.error(res.errMessage);
      }
    } catch (e) {
      console.log(e);
    }
  };
  handleEditHandbook = (data) => {
    this.setState({
      isOpenModalEditHandbook: true,
    });
    this.props.receiveDataFromChild(data);
  };
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
    let data = this.props.data;
    let language = this.props.language;
    return (
      <Card
        style={{
          width: "18rem",
        }}>
        <div
          className="bg-image"
          style={{ backgroundImage: `url(${data.image})` }}></div>
        <CardBody>
          <div className="card-body-container">
            <div className="card-info">
              <CardTitle tag="h5">
                {language === LANGUAGES.VI
                  ? data.title
                  : language === LANGUAGES.EN
                  ? data.titleEn
                  : language === LANGUAGES.JA
                  ? data.titleJa
                  : ""}
              </CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                {this.convertTime(data.updatedAt)}
              </CardSubtitle>
            </div>
            <div className="button-handbook">
              <Button
                color="info"
                onClick={() => this.handleEditHandbook(data)}>
                <i className="fas fa-pencil-alt"></i>
              </Button>
              <Button
                color="warning"
                onClick={() => this.handleDeleteHandbook(data)}>
                <i className="fas fa-trash"></i>
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(CardHandbook);
