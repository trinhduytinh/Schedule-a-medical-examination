import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./ManageSpecialty.scss";
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
import { LANGUAGES, CRUD_ACTION, CommonUtils } from "../../../utils";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { createNewSpecialty } from "../../../services/userService";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay"; // mang hinh load doi

const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      imageBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      isShowLoading: false,
    };
  }
  async componentDidMount() {}

  async componentDidUpdate(prevProps, prevState, snapshot) {}

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
    } else {
      toast.error("Something wrongs....");
      this.setState({
        isShowLoading: false,
      });
    }
  };
  render() {
    return (
      <>
        <LoadingOverlay
          active={this.state.isShowLoading}
          spinner
          text="Loading...">
          <div className="manage-specialty-container">
            <div className="ms-title"><FormattedMessage id="manage-specialty.specialty-management"/></div>
            <div className="add-new-specialty row">
              <div className="col-6 form-group">
                <label className="form-label"><FormattedMessage id="manage-specialty.name_of_specialty"/></label>
                <input
                  className="form-control"
                  type="text"
                  value={this.state.name}
                  onChange={(event) => this.handleOnChangeInput(event, "name")}
                />
              </div>
              <div className="col-6 form-group">
                <label className="form-label"><FormattedMessage id="manage-specialty.specialized_image"/></label>
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
              <div className="col-12">
                <button
                  className="btn-save-specialty"
                  onClick={() => this.handleSaveNewSpecialty()}>
                  <FormattedMessage id="manage-specialty.save"/>
                </button>
              </div>
            </div>
          </div>
        </LoadingOverlay>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
