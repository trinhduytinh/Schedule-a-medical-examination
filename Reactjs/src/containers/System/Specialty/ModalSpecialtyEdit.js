import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { toast } from "react-toastify";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { CommonUtils } from "../../../utils";
import _ from "lodash";
import { editSpecialtyService } from "../../../services/userService";
import LoadingOverlay from "react-loading-overlay";
const mdParser = new MarkdownIt(/* Markdown-it options */);
class ModalSpecialtyEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      imageBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      isShowLoading: false,
    };
    // this.listenToEmitter();
  }
  componentDidMount() {
    let specialty = this.props.currentSpecialty;
    console.log("specialty", specialty);
    if (specialty && !_.isEmpty(specialty)) {
      this.setState({
        id: specialty.id,
        name: specialty.name,
        descriptionHTML: specialty.descriptionHTML,
        descriptionMarkdown: specialty.descriptionMarkdown,
        imageBase64: specialty.image,
      });
    }
  }
  toggle = () => {
    this.props.toggleEditSpecialtyModal();
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
    let arrInput = ["name"];
    for (let i = 0; i < arrInput.length; i++) {
      if (!this.state[arrInput[i]]) {
        isValid = false;
        toast.error("Missing parameter: " + arrInput[i]);
        break;
      }
    }
    if (!this.state.imageBase64) {
      this.setState({
        imageBase64: this.props.currentSpecialty.image,
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
  handleSaveSpecialty = async () => {
    let { id, name, descriptionHTML, descriptionMarkdown, imageBase64 } =
      this.state;
    let isValid = this.checkValidateInput();
    if (isValid === true) {
      this.setState({
        isShowLoading: !this.state.isShowLoading,
      });
      let image = new Buffer(imageBase64, "base64").toString("binary");
      let res = await editSpecialtyService({
        id: id,
        name: name,
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
    console.log("check prop,", this.props);
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
              <FormattedMessage id={"manage-handbook.edit_handbook"} />
            </ModalHeader>
            <ModalBody>
              <div className="modal-user-body">
                <div className="input-container max-width-input">
                  <label className="form-label">
                    <FormattedMessage id="manage-specialty.name_of_specialty" />
                  </label>
                  <input
                    type="text"
                    onChange={(event) => {
                      this.handleOnChangeInput(event, "name");
                    }}
                    value={this.state.name}></input>
                </div>
                <div className="input-container">
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
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                className="px-3"
                onClick={() => this.handleSaveSpecialty()}>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalSpecialtyEdit);
