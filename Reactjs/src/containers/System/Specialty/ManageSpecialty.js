import React, { Component, Fragment, memo } from "react";
import { connect } from "react-redux";
import "./ManageSpecialty.scss";
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
import { LANGUAGES, CRUD_ACTION, CommonUtils } from "../../../utils";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import {
  deleteSpecialty,
  getSpecialtyPage,
} from "../../../services/userService";
import { toast } from "react-toastify";
import ModalSpecialty from "./ModalSpecialty";
import ModalSpecialtyEdit from "./ModalSpecialtyEdit";
import ReactPaginate from "react-paginate";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrSpecialty: [],
      handSpecialtyEdit: {},
      currentPage: 1,
      currentLimit: 10,
      totalPages: 0,
      isOpenModalSpecialty: false,
      isOpenModalEditSpecialty: false,
    };
  }

  componentDidMount() {
    this.fetchSpecialty();
  }

  fetchSpecialty = async (page = this.state.currentPage) => {
    const { currentLimit } = this.state;
    const response = await getSpecialtyPage(page, currentLimit);
    if (response && response.errCode === 0) {
      this.setState({
        arrSpecialty: response.data.specialty,
        totalPages: response.data.totalPages,
        currentPage: page,
      });
    }
  };

  toggleSpecialtyModal = async () => {
    this.setState(
      (prevState) => ({
        isOpenModalSpecialty: !prevState.isOpenModalSpecialty,
      }),
      this.fetchSpecialty
    );
  };

  toggleEditSpecialtyModal = () => {
    this.setState((prevState) => ({
      isOpenModalEditSpecialty: !prevState.isOpenModalEditSpecialty,
    }));
  };

  handleEditSpecialtyModal = (item) => {
    this.setState({
      isOpenModalEditSpecialty: true,
      handSpecialtyEdit: item,
    });
  };

  handleAddNewSpecialty = () => {
    this.setState({
      isOpenModalSpecialty: true,
    });
  };

  handleDeleteSpecialty = async (specialty) => {
    let res = await deleteSpecialty(specialty.id);
    if (res && res.errCode === 0) {
      await this.fetchSpecialty(this.state.currentPage);
      toast.success(res.errMessage);
    } else {
      toast.error(res.errMessage);
    }
  };

  handlePageClick = async (event) => {
    const selectedPage = +event.selected + 1;
    this.setState({ currentPage: selectedPage }, () => {
      this.fetchSpecialty(selectedPage);
    });
  };

  render() {
    const {
      arrSpecialty,
      isOpenModalSpecialty,
      isOpenModalEditSpecialty,
      handSpecialtyEdit,
      totalPages,
    } = this.state;
    let { language } = this.props;
    return (
      <>
        <div className="manage-specialty-container">
          <ModalSpecialty
            isOpen={isOpenModalSpecialty}
            toggleSpecialtyModal={this.toggleSpecialtyModal}
          />
          {isOpenModalEditSpecialty && (
            <ModalSpecialtyEdit
              isOpen={isOpenModalEditSpecialty}
              toggleEditSpecialtyModal={this.toggleEditSpecialtyModal}
              currentSpecialty={handSpecialtyEdit}
            />
          )}
          <div className="title">
            <FormattedMessage id="manage-specialty.specialty-management" />
          </div>
          <div className="mx-1 my-4">
            <button
              className="btn btn-primary px-3"
              onClick={this.handleAddNewSpecialty}>
              <i className="fas fa-plus"></i>
              <FormattedMessage id={"manage-specialty.add-new-specialty"} />
            </button>
          </div>
          <table id="TableManageUser">
            <tbody>
              <tr>
                <th>
                  <FormattedMessage id={"manage-specialty.stt"} />
                </th>
                <th>
                  {" "}
                  <FormattedMessage id={"manage-specialty.name_of_specialty"} />
                </th>
                <th>
                  <FormattedMessage id={"manage-specialty.action"} />
                </th>
              </tr>
              {arrSpecialty && arrSpecialty.length > 0 ? (
                arrSpecialty.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {language === LANGUAGES.VI
                        ? `${item.name}`
                        : language === LANGUAGES.EN
                        ? `${item.nameEn}`
                        : language === LANGUAGES.JA
                        ? `${item.nameJa}`
                        : ""}
                    </td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => this.handleEditSpecialtyModal(item)}>
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => this.handleDeleteSpecialty(item)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center" }}>
                    <FormattedMessage id="manage-patient.no-data" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {totalPages > 0 && (
            <div className="user-footer">
              <ReactPaginate
                nextLabel="next >"
                onPageChange={this.handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={totalPages}
                previousLabel="< previous"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
                renderOnZeroPageCount={null}
              />
            </div>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

export default connect(mapStateToProps)(memo(ManageSpecialty));
