import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./ManageHandbook.scss";
import { emitter } from "../../../utils/emitter";
import ModalHandbook from "./ModalHandbook";
import { toast } from "react-toastify";
import {
  createNewHandBookServices,
  editHandbookService,
  getAllHandbook,
} from "../../../services/userService";
import CardHandbook from "./CardHandbook";
import ModalHandbookEdit from "./ModalHandbookEdit";
import LoadingOverlay from "react-loading-overlay";

class ManageHandbook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrHandbooks: [],
      isOpenModalHandbook: false,
      isOpenModalEditHandbook: false,
      handbookEdit: {},
      doctorId: "",
      isShowLoading: false,
    };
  }

  async componentDidMount() {
    this.getAllHandbook();
    this.setState({
      doctorId: this.props.userInfo.id,
    });
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.userInfo !== prevProps.userInfo) {
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
        // emitter.emit("EVENT_CLEAR_MODAL_DATA");
      }
      this.setState({
        isShowLoading: false,
      });
    } catch (error) {
      console.log(error);
    }
  };
  getAllHandbook = async () => {
    let res = await getAllHandbook(this.props.userInfo.id, this.props.userInfo.roleId);
    if (res && res.errCode !== 0) {
      toast.error(res.errMessage);
    } else {
      this.setState({
        arrHandbooks: res.data,
      });
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
  //nhan tu con
  //nhận từ con
  receiveDataFromChild = async (data) => {
    this.setState({
      handbookEdit: data,
      isOpenModalEditHandbook: true,
    });
  };
  render() {
    //properties, nested
    let {
      arrHandbooks,
      isOpenModalEditHandbook,
      isOpenModalHandbook,
      handbookEdit,
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
            <div className="title text-center"><FormattedMessage id={"manage-handbook.managing-articles"}/></div>
            <div className="mx-1 my-4">
              <button
                className="btn btn-primary px-3"
                onClick={() => this.handleAddNewHandbook()}>
                <i className="fas fa-plus"></i><FormattedMessage id={"manage-handbook.add-new-handbook"}/>
              </button>
            </div>
            <div class="handbook-card row row-cols-1 row-cols-md-4">
              {arrHandbooks &&
                arrHandbooks.map((item, index) => {
                  return (
                    <div className="row" key={index}>
                      <CardHandbook
                        data={item}
                        receiveDataFromChild={this.receiveDataFromChild}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </LoadingOverlay>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    //lay id ng dung dang nhap
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageHandbook);
