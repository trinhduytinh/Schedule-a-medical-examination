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
import { createNewSpecialty } from "../../../services/userService";
const mdParser = new MarkdownIt(/* Markdown-it options */);
class ModalSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
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
  handleSaveNewSpecialty = async () => {
    this.setState({
      isShowLoading: true,
    });
    let res = await createNewSpecialty(this.state);
    if (res && res.errCode === 0) {
      toast.success("Add new specialty succeeds");
      this.setState({
        name: "",
        imageBase64: "",
        descriptionHTML: "",
        descriptionMarkdown: "",
      });
      this.setState({
        isShowLoading: false,
      });
      this.props.toggleSpecialtyModal();
    } else {
      toast.error("Something wrongs....");
      this.setState({
        isShowLoading: false,
      });
    }
  };
  toggle = () => {
    this.props.toggleSpecialtyModal();
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
              Quản lý chuyên khoa
            </ModalHeader>
            <ModalBody>
              <div className="manage-specialty-container">
                <div className="add-new-specialty row">
                  <div className="col-6 form-group">
                    <label className="form-label">
                      <FormattedMessage id="manage-specialty.name_of_specialty" />
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
                      <FormattedMessage id="manage-specialty.specialized_image" />
                    </label>
                    <input
                      className="form-control"
                      type="file"
                      onChange={(event) => this.handleOnchangeImage(event)}
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
                onClick={() => this.handleSaveNewSpecialty()}>
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
