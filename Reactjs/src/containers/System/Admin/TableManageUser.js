import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./TableManageUser.scss";
import * as actions from "../../../store/actions";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";
import ReactPaginate from "react-paginate"; // thu vien phan trang
import { getUsersPage } from "../../../services/userService";

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
// function handleEditorChange({ html, text }) {
//   console.log("handleEditorChange", html, text);
// }

class TableManageUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersRedux: [],
      currentPage: 1,
      currentLimit: 10,
      totalPages: 0,
    };
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = async (page = this.state.currentPage) => {
    const { currentLimit } = this.state;
    const response = await getUsersPage(page, currentLimit);
    if (response && response.errCode === 0) {
      this.setState((prevState) => ({
        usersRedux: response.users.users,
        totalPages: response.users.totalPages,
        currentPage: page, // Cập nhật currentPage dựa trên tham số truyền vào
      }));
    }
  };

  handleDeleteUser = async (user) => {
    await this.props.deleteUserRedux(user.id);
    // Sau khi xóa thành công, cập nhật lại danh sách người dùng
    await this.fetchUsers(this.state.currentPage);
  };

  handleEditUser = async (user) => {
    await this.props.handleEditUserFromParentKey(user);
    // Sau khi chỉnh sửa thành công, cập nhật lại danh sách người dùng
    await this.fetchUsers(this.state.currentPage);
  };

  handlePageClick = async (event) => {
    const selectedPage = +event.selected + 1;
    this.setState({ currentPage: selectedPage }, () => {
      this.fetchUsers(selectedPage);
    });
  };
  render() {
    let arrUsers = this.state.usersRedux;
    let { totalPages } = this.state;
    return (
      <React.Fragment>
        <table id="TableManageUser">
          <tbody>
            <tr>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
            {arrUsers &&
              arrUsers.length > 0 &&
              arrUsers.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.email}</td>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.address}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => this.handleEditUser(item)}>
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => this.handleDeleteUser(item)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
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
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listUsers: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
    deleteUserRedux: (id) => dispatch(actions.deleteUser(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
