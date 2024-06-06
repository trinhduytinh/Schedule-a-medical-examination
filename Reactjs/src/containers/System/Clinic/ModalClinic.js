import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from "../../../utils/emitter";
import { toast } from "react-toastify";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { CommonUtils } from "../../../utils";
import LoadingOverlay from "react-loading-overlay"; // mang hinh load doi
import {
  createNewClinic,
  createNewSpecialty,
} from "../../../services/userService";
const mdParser = new MarkdownIt(/* Markdown-it options */);
class ModalSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: "",
      imageBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      isShowLoading: false,
    };
    // this.listenToEmitter();
  }
  componentDidMount() {}
  handleOnChangeInput = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
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
  handleSaveNewClinic = async () => {
    let { name, address, imageBase64, descriptionHTML, descriptionMarkdown } =
      this.state;
    this.setState({
      isShowLoading: true,
    });
    let res = await createNewClinic({
      name: name,
      address: address,
      imageBase64: imageBase64,
      descriptionHTML: descriptionHTML,
      descriptionMarkdown: descriptionMarkdown,
    });
    if (res && res.errCode === 0) {
      toast.success("Add new clinic succeeds");
      this.setState({
        name: "",
        address: "",
        imageBase64: "",
        descriptionHTML: "",
        descriptionMarkdown: "",
      });
      this.setState({
        isShowLoading: false,
      });
    } else {
      toast.error("Something wrongs....");
      this.setState({
        isShowLoading: false,
      });
    }
  };
  toggle = () => {
    this.props.toggleClinicModal();
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
              Quản lý phòng khám
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
                onClick={() => this.handleSaveNewClinic()}>
                <FormattedMessage id={"manage-handbook.add-new"} />
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalSpecialty);
