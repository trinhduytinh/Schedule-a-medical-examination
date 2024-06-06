import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { toast } from "react-toastify";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { CommonUtils } from "../../../utils";
import _ from "lodash";
import { editClinicService } from "../../../services/userService";
import LoadingOverlay from "react-loading-overlay";
const mdParser = new MarkdownIt(/* Markdown-it options */);
class ModalClinicEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      address: "",
      imageBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      isShowLoading: false,
    };
    // this.listenToEmitter();
  }
  componentDidMount() {
    let clinic = this.props.currentClinic;
    if (clinic && !_.isEmpty(clinic)) {
      this.setState({
        id: clinic.id,
        name: clinic.name,
        address: clinic.address,
        descriptionHTML: clinic.descriptionHTML,
        descriptionMarkdown: clinic.descriptionMarkdown,
        imageBase64: clinic.image,
      });
    }
  }
  toggle = () => {
    this.props.toggleEditClinicModal();
  };
  handleOnChangeInput = (event, id) => {
    let copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState({
      ...copyState,
    });
  };

  checkValidateInput = () => {
    let isValid = true;
    let arrInput = ["name", "address"];
    for (let i = 0; i < arrInput.length; i++) {
      if (!this.state[arrInput[i]]) {
        isValid = false;
        toast.error("Missing parameter: " + arrInput[i]);
        break;
      }
    }
    if (!this.state.imageBase64) {
      this.setState({
        imageBase64: this.props.currentClinic.image,
      });
    }
    return isValid;
  };
  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionHTML: html,
      descriptionMarkdown: text,
    });
  };
  handleOnchangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({
        imageBase64: base64,
      });
    }
  };
  handleSaveClinic = async () => {
    let {
      id,
      name,
      address,
      descriptionHTML,
      descriptionMarkdown,
      imageBase64,
    } = this.state;
    let isValid = this.checkValidateInput();
    if (isValid === true) {
      this.setState({
        isShowLoading: !this.state.isShowLoading,
      });
      let image = new Buffer(imageBase64, "base64").toString("binary");
      let res = await editClinicService({
        id: id,
        name: name,
        address: address,
        descriptionHTML: descriptionHTML,
        descriptionMarkdown: descriptionMarkdown,
        imageBase64: image,
      });
      if (res && res.errCode === 0) {
        toast.success(res.errMessage);
        this.setState({
          isShowLoading: !this.state.isShowLoading,
        });
      } else {
        toast.error(res.errMessage);
        this.setState({
          isShowLoading: !this.state.isShowLoading,
        });
      }
    }
  };
  render() {
    return (
      <>
        <LoadingOverlay
          active={this.state.isShowLoading}
          spinner
          text="Loading...">
          <Modal
            isOpen={this.props.isOpen}
            toggle={() => this.toggle()}
            className={"modal-user-container modal-fullscreen"}
            size="lg"
            centered>
            <ModalHeader toggle={() => this.toggle()}>
              Chỉnh sửa thông tin phòng khám
            </ModalHeader>
            <ModalBody>
              <div className="manage-specialty-container">
                <div className="add-new-specialty row">
                  <div className="col-6 form-group">
                    <label className="form-label">
                      <FormattedMessage id={"manage-clinic.name-clinic"} />
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      value={this.state.name}
                      onChange={(event) =>
                        this.handleOnChangeInput(event, "name")
                      }
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label className="form-label">
                      <FormattedMessage id={"manage-clinic.image-clinic"} />
                    </label>
                    <input
                      className="form-control"
                      type="file"
                      onChange={(event) => this.handleOnchangeImage(event)}
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label className="form-label">
                      <FormattedMessage id={"manage-clinic.address-clinic"} />{" "}
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      value={this.state.address}
                      onChange={(event) =>
                        this.handleOnChangeInput(event, "address")
                      }
                    />
                  </div>
                  <div className="col-12 mt-3">
                    <MdEditor
                      style={{ height: "500px" }}
                      renderHTML={(text) => mdParser.render(text)}
                      onChange={this.handleEditorChange}
                      value={this.state.descriptionMarkdown}
                    />
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                className="px-3"
                onClick={() => this.handleSaveClinic()}>
                <FormattedMessage id={"manage-handbook.save-changes"} />
              </Button>
              <Button
                color="secondary"
                className="px-3"
                onClick={() => this.toggle()}>
                <FormattedMessage id={"manage-handbook.close"} />
              </Button>
            </ModalFooter>
          </Modal>
        </LoadingOverlay>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalClinicEdit);
