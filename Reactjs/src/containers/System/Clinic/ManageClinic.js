import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./ManageClinic.scss";
import { FormattedMessage } from "react-intl"; // dung de chuyen doi ngon ngu
import { LANGUAGES, CRUD_ACTION, CommonUtils } from "../../../utils";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import {
  createNewClinic,
  createNewSpecialty,
  deleteClinic,
  getClinicPage,
} from "../../../services/userService";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay"; // mang hinh load doi
import ModalClinic from "./ModalClinic";
import ReactPaginate from "react-paginate";
import ModalClinicEdit from "./ModalClinicEdit";
const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrClinic: [],
      handClinicEdit: {},
      currentPage: 1,
      currentLimit: 10,
      totalPages: 0,
      isShowLoading: false,
      isOpenModalClinic: false,
      isOpenModalEditClinic: false,
    };
  }
  async componentDidMount() {
    this.fetchClinic();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {}

  toggleClinicModal = async () => {
    this.setState({
      isOpenModalClinic: !this.state.isOpenModalClinic,
    });
    await this.fetchClinic(this.state.currentPage);
  };
  toggleEditClinicModal = () => {
    this.setState({
      isOpenModalEditClinic: !this.state.isOpenModalEditClinic,
    });
  };
  handleEditClinicModal = (item) => {
    this.setState({
      isOpenModalEditClinic: !this.state.isOpenModalEditClinic,
      handClinicEdit: item,
    });
  };
  handleAddNewClinic = () => {
    this.setState({
      isOpenModalClinic: true,
    });
  };
  handleDeleteClinic = async (clinic) => {
    let res = await deleteClinic(clinic.id);
    if (res && res.errCode === 0) {
      await this.fetchClinic(this.state.currentPage);
      toast.success(res.errMessage);
    } else {
      toast.error(res.errMessage);
    }
  };
  fetchClinic = async (page = this.state.currentPage) => {
    const { currentLimit } = this.state;
    const response = await getClinicPage(page, currentLimit);
    if (response && response.errCode === 0) {
      this.setState((prevState) => ({
        arrClinic: response.data.clinic,
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
      arrClinic,
      isOpenModalClinic,
      isOpenModalEditClinic,
      handClinicEdit,
      totalPages,
    } = this.state;
    let { language } = this.props;
    return (
      <>
        <div className="manage-specialty-container">
          <ModalClinic
            isOpen={isOpenModalClinic}
            toggleClinicModal={this.toggleClinicModal}
          />
          {isOpenModalEditClinic && (
            <ModalClinicEdit
              isOpen={isOpenModalEditClinic}
              toggleEditClinicModal={this.toggleEditClinicModal}
              currentClinic={handClinicEdit}
            />
          )}
          <div className="title">
            <FormattedMessage id="manage-specialty.specialty-management" />
          </div>
          <div className="mx-1 my-4">
            <button
              className="btn btn-primary px-3"
              onClick={() => this.handleAddNewClinic()}>
              <i className="fas fa-plus"></i>
              <FormattedMessage id={"manage-clinic.add-new-clinic"} />
            </button>
          </div>
          <table id="TableManageUser">
            <tbody>
              <tr>
                <th>
                  <FormattedMessage id={"manage-clinic.STT"} />
                </th>
                <th>
                  <FormattedMessage id={"manage-clinic.name-clinic"} />
                </th>
                <th>
                  <FormattedMessage id={"manage-clinic.action"} />
                </th>
              </tr>
              {arrClinic && arrClinic.length > 0 ? (
                arrClinic.map((item, index) => {
                  return (
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
                          onClick={() => this.handleEditClinicModal(item)}>
                          <i className="fas fa-pencil-alt"></i>
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => this.handleDeleteClinic(item)}>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
