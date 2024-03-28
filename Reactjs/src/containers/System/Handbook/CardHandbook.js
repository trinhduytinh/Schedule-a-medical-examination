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
import { CommonUtils } from "../../../utils";
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
  render() {
    let data = this.props.data;
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
              <CardTitle tag="h5">{data.title}</CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                {data.updatedAt}
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
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(CardHandbook);
