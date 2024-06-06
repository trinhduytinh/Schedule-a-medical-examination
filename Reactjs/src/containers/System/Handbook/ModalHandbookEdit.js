import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from "../../../utils/emitter";
import { toast } from "react-toastify";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { CommonUtils } from "../../../utils";
import _ from "lodash";
const mdParser = new MarkdownIt(/* Markdown-it options */);
class ModalHandbookEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      title: "",
      description: "",
      descriptionMarkdown: "",
      imageBase64: "",
    };
    // this.listenToEmitter();
  }
  componentDidMount() {
    let handbook = this.props.currentHandbook;
    if (handbook && !_.isEmpty(handbook)) {
      this.setState({
        id: handbook.id,
        title: handbook.title,
        description: handbook.description,
        descriptionMarkdown: handbook.descriptionMarkdown,
        imageBase64: handbook.image,
      });
    }
  }
  toggle = () => {
    this.props.toggleHandbookModal();
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
    let arrInput = ["title"];
    for (let i = 0; i < arrInput.length; i++) {
      if (!this.state[arrInput[i]]) {
        isValid = false;
        toast.error("Missing parameter: " + arrInput[i]);
        break;
      }
    }
    if (!this.state.imageBase64) {
      this.setState({
        imageBase64: this.props.currentHandbook.image,
      });
    }
    return isValid;
  };
  handleEditorChange = ({ html, text }) => {
    this.setState({
      description: html,
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
  handleSaveHandbook = () => {
    let isValid = this.checkValidateInput();
    if (isValid === true) {
      this.props.editHandbook(this.state);
      this.setState({
        title: "",
        description: "",
        descriptionMarkdown: "",
        imageBase64: "",
      });
    }
  };
  render() {
    return (
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
                <FormattedMessage id={"manage-handbook.title"} />
              </label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "title");
                }}
                value={this.state.title}></input>
            </div>
            <div className="input-container">
              <label className="form-label">
                <FormattedMessage id={"manage-handbook.image-handbook"} />
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
            onClick={() => this.handleSaveHandbook()}>
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
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalHandbookEdit);
