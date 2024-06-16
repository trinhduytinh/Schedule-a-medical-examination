import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./ManageHandbook.scss";
import ModalHandbook from "./ModalHandbook";
import { toast } from "react-toastify";
import {
  createNewHandBookServices,
  editHandbookService,
  getAllHandbook as getAllHandbookService,
} from "../../../services/userService";
import CardHandbook from "./CardHandbook";
import ModalHandbookEdit from "./ModalHandbookEdit";
import LoadingOverlay from "react-loading-overlay";
import ReactPaginate from "react-paginate";

class ManageHandbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrHandbooks: [],
      handbookEdit: {},
      doctorId: "",
      currentPage: 1,
      currentLimit: 10,
      totalPages: 0,
      searchQuery: "", // Thêm searchQuery vào state
      isShowLoading: false,
      isOpenModalHandbook: false,
      isOpenModalEditHandbook: false,
    };
  }

  async componentDidMount() {
    this.getAllHandbook();
    this.setState({
      doctorId: this.props.userInfo.id,
    });
  }

  async componentDidUpdate(prevProps, prevState) {
    // Kiểm tra nếu searchQuery thay đổi thì gọi lại getAllHandbook
    if (prevState.searchQuery !== this.state.searchQuery) {
      this.getAllHandbook(1);
    }
  }

  toggleHandbookModal = () => {
    this.setState({
      isOpenModalHandbook: !this.state.isOpenModalHandbook,
    });
  };

  toggleEditHandbookModal = () => {
    this.setState({
      isOpenModalEditHandbook: !this.state.isOpenModalEditHandbook,
    });
  };

  handleAddNewHandbook = () => {
    this.setState({
      isOpenModalHandbook: true,
    });
  };

  createNewHandbook = async (data) => {
    try {
      this.setState({
        isShowLoading: true,
      });
      data.doctorId = this.state.doctorId;
      let response = await createNewHandBookServices(data);
      if (response && response.errCode !== 0) {
        toast.error(response.errMessage);
      } else {
        await this.getAllHandbook();
        toast.success(response.errMessage);
        this.setState({
          isOpenModalHandbook: false,
        });
      }
      this.setState({
        isShowLoading: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  getAllHandbook = async (page = this.state.currentPage) => {
    const { currentLimit, searchQuery } = this.state;
    const roleId = this.props.userInfo.roleId;
    const doctorId = this.props.userInfo.id;
    try {
      this.setState({ isShowLoading: true });
      let res = await getAllHandbookService({
        page,
        limit: currentLimit,
        doctorId,
        role: roleId,
        search: searchQuery,
      });
      console.log("check res", res);

      if (res && res.infor && res.infor.errCode === 0) {
        this.setState({
          arrHandbooks: res.infor.data.rows,
          totalPages: res.infor.data.totalPages,
          currentPage: page,
        });
      } else {
        toast.error("Error fetching data");
      }
      this.setState({ isShowLoading: false });
    } catch (error) {
      console.log(error);
      this.setState({ isShowLoading: false });
      toast.error("Error fetching data");
    }
  };

  doEditHandbook = async (handbook) => {
    try {
      this.setState({
        isShowLoading: true,
      });
      handbook.doctorId = this.state.doctorId;
      let res = await editHandbookService(handbook);
      if (res && res.errCode === 0) {
        this.setState({
          isOpenModalEditHandbook: false,
        });
        toast.success(res.errMessage);
        await this.getAllHandbook();
      } else {
        toast.error(res.errMessage);
      }
      this.setState({
        isShowLoading: false,
      });
    } catch (e) {
      console.log(e);
    }
  };

  receiveDataFromChild = async (data) => {
    this.setState({
      handbookEdit: data,
      isOpenModalEditHandbook: true,
    });
  };

  handlePageClick = async (event) => {
    const selectedPage = +event.selected + 1;
    this.setState({ currentPage: selectedPage }, () => {
      this.getAllHandbook(selectedPage);
    });
  };

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  render() {
    let {
      arrHandbooks,
      isOpenModalEditHandbook,
      isOpenModalHandbook,
      handbookEdit,
      totalPages,
      searchQuery,
    } = this.state;
    return (
      <>
        <LoadingOverlay
          active={this.state.isShowLoading}
          spinner
          text="Loading...">
          <div className="users-container">
            <ModalHandbook
              isOpen={isOpenModalHandbook}
              toggleHandbookModal={this.toggleHandbookModal}
              createNewHandBook={this.createNewHandbook}
            />
            {isOpenModalEditHandbook && (
              <ModalHandbookEdit
                isOpen={isOpenModalEditHandbook}
                toggleHandbookModal={this.toggleEditHandbookModal}
                currentHandbook={handbookEdit}
                editHandbook={this.doEditHandbook}
              />
            )}
            <div className="title text-center">
              <FormattedMessage id={"manage-handbook.managing-articles"} />
            </div>
            <div className="mx-1 my-4">
              <button
                className="btn btn-primary px-3"
                onClick={this.handleAddNewHandbook}>
                <i className="fas fa-plus"></i>
                <FormattedMessage id={"manage-handbook.add-new-handbook"} />
              </button>
            </div>
            <div className="search-container col-3 mb-3">
              <input
                className="input-search"
                type="text"
                value={searchQuery}
                onChange={this.handleSearchChange}
                placeholder="Search..."
              />
            </div>
            <div className="handbook-card row row-cols-1 row-cols-md-4">
              {arrHandbooks &&
                arrHandbooks.map((item, index) => {
                  return (
                    <div className="row" key={index}>
                      <CardHandbook
                        data={item}
                        receiveDataFromChild={this.receiveDataFromChild}
                        refreshHandbooks={this.getAllHandbook} // Truyền callback xuống CardHandbook
                      />
                    </div>
                  );
                })}
            </div>
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
        </LoadingOverlay>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageHandbook);
