import React, { Component, Fragment } from "react";
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
      isShowLoading: false,
      isOpenModalSpecialty: false,
      isOpenModalEditSpecialty: false,
    };
  }
  componentDidMount() {
    this.fetchSpecialty();
  }
  // getAllSpecialtyNew = async () => {
  //   let res = await getAllSpecialty();
  //   if (res && res.errCode === 0) {
  //     this.setState({
  //       arrSpecialty: res.data,
  //     });
  //   }
  // };
  async componentDidUpdate(prevProps, prevState, snapshot) {}

  toggleSpecialtyModal = async () => {
    this.setState({
      isOpenModalSpecialty: !this.state.isOpenModalSpecialty,
    });
    await this.fetchSpecialty(this.state.currentPage);
  };
  toggleEditSpecialtyModal = () => {
    this.setState({
      isOpenModalEditSpecialty: !this.state.isOpenModalEditSpecialty,
    });
  };
  handleEditSpecialtyModal = (item) => {
    this.setState({
      isOpenModalEditSpecialty: !this.state.isOpenModalEditSpecialty,
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
  fetchSpecialty = async (page = this.state.currentPage) => {
    const { currentLimit } = this.state;
    const response = await getSpecialtyPage(page, currentLimit);
    if (response && response.errCode === 0) {
      this.setState((prevState) => ({
        arrSpecialty: response.data.specialty,
        totalPages: response.data.totalPages,
        currentPage: page, // Cập nhật currentPage dựa trên tham số truyền vào
      }));
    }
  };
  handlePageClick = async (event) => {
    const selectedPage = +event.selected + 1;
    this.setState({ currentPage: selectedPage }, () => {
      this.fetchSpecialty(selectedPage);
    });
  };
  render() {
    let {
      arrSpecialty,
      isOpenModalSpecialty,
      isOpenModalEditSpecialty,
      handSpecialtyEdit,
      totalPages,
    } = this.state;
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
          <div className="ms-title">
            <FormattedMessage id="manage-specialty.specialty-management" />
          </div>
          <div className="mx-1 my-4">
            <button
              className="btn btn-primary px-3"
              onClick={() => this.handleAddNewSpecialty()}>
              <i className="fas fa-plus"></i>
              Thêm mới chuyên khoa
            </button>
          </div>
          <table id="TableManageUser">
            <tbody>
              <tr>
                <th>STT</th>
                <th>Tên chuyên khoa</th>
                <th>Actions</th>
              </tr>
              {arrSpecialty && arrSpecialty.length > 0 ? (
                arrSpecialty.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
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
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center" }}>
                    <FormattedMessage id={"manage-patient.no-data"} />
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

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
