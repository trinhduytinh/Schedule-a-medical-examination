import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from "../../../utils/emitter";
import { toast } from "react-toastify";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { CommonUtils } from "../../../utils";
const mdParser = new MarkdownIt(/* Markdown-it options */);
class ModalHandbook extends Component {
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
  componentDidMount() {}
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
  handleAddNewHandbook = () => {
    let isValid = this.checkValidateInput();
    if (isValid === true) {
      this.props.createNewHandBook(this.state);
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
          Create a new handbook
        </ModalHeader>
        <ModalBody>
          <div className="modal-user-body">
            <div className="input-container max-width-input">
              <label className="form-label">Tiêu đề</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "title");
                }}
                value={this.state.title}></input>
            </div>
            <div className="input-container">
              <label className="form-label">Ảnh bài viết</label>
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
            onClick={() => this.handleAddNewHandbook()}>
            Add new
          </Button>
          <Button
            color="secondary"
            className="px-3"
            onClick={() => this.toggle()}>
            Close
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalHandbook);
