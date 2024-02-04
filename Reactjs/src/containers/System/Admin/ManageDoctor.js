import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./TableManageUser.scss";
import * as actions from "../../../store/actions";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import "./ManageDoctor.scss";
import Select from "react-select";
import { CRUD_ACTION, LANGUAGES } from "../../../utils";
import { getDetailInforDoctor } from "../../../services/userService";

const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //save to Markdown
      contentMarkdown: "",
      contentHTML: "",
      selectedDoctor: "",
      description: "",
      listDoctors: [],
      hasOldData: false,

      //save to doctor_infor table
      listPrice: [],
      listPayment: [],
      listProvince: [],
      listClinic: [],
      listSpecialty: [],
      selectedPrice: "",
      selectedPayment: "",
      selectedProvince: "",
      selectedClinic: "",
      selectedSPecialty: "",
      nameClinic: "",
      addressClinic: "",
      note: "",
      clinicId: "",
      specialtyId: "",
    };
  }
  componentDidMount() {
    this.props.fetchAllDoctors();
    this.props.getRequiredDoctorInFor();
  }
  buildDataInputSelect = (inputData, type) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        if (type === "USERS") {
          let object = {};
          let labelVi = `${item.lastName} ${item.firstName}`;
          let labelEn = `${item.firstName} ${item.lastName}`;
          let labelJa = `${item.lastName} ${item.firstName}`;
          if (language === LANGUAGES.VI) object.label = labelVi;
          if (language === LANGUAGES.EN) object.label = labelEn;
          if (language === LANGUAGES.JA) object.label = labelJa;
          object.value = item.id;
          result.push(object);
        }
        if (type === "PRICE") {
          let object = {};
          let labelVi = `${item.valueVi} VND`;
          let labelEn = `${item.valueEn} USD`;
          let labelJa = `${item.valueJa} 円`;
          if (language === LANGUAGES.VI) object.label = labelVi;
          if (language === LANGUAGES.EN) object.label = labelEn;
          if (language === LANGUAGES.JA) object.label = labelJa;
          object.value = item.keyMap;
          result.push(object);
        }
        if (type === "PAYMENT" || type === "PROVINCE") {
          let object = {};
          let labelVi = `${item.valueVi}`;
          let labelEn = `${item.valueEn}`;
          let labelJa = `${item.valueJa}`;
          if (language === LANGUAGES.VI) object.label = labelVi;
          if (language === LANGUAGES.EN) object.label = labelEn;
          if (language === LANGUAGES.JA) object.label = labelJa;
          object.value = item.keyMap;
          result.push(object);
        }
        if (type === "SPECIALTY") {
          let object = {};
          let labelVi = `${item.name}`;
          let labelEn = `${item.nameEn}`;
          let labelJa = `${item.nameJa}`;
          if (language === LANGUAGES.VI) object.label = labelVi;
          if (language === LANGUAGES.EN) object.label = labelEn;
          if (language === LANGUAGES.JA) object.label = labelJa;
          object.value = item.id;
          result.push(object);
        }
      });
    }
    return result;
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(
        this.props.allDoctors,
        "USERS"
      );
      this.setState({
        listDoctors: dataSelect,
      });
    }
    if (prevProps.language !== this.props.language) {
      let dataSelect = this.buildDataInputSelect(
        this.props.allDoctors,
        "USERS"
      );
      let { resPayment, resPrice, resProvince } =
        this.props.allRequiredDoctorInFo;
      let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
      let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
      let dataSelectProvince = this.buildDataInputSelect(
        resProvince,
        "PROVINCE"
      );
      this.setState({
        listDoctors: dataSelect,
        listPrice: dataSelectPrice,
        listPayment: dataSelectPayment,
        listProvince: dataSelectProvince,
      });
    }
    if (prevProps.allRequiredDoctorInFo !== this.props.allRequiredDoctorInFo) {
      let { resPayment, resPrice, resProvince, resSpecialty } =
        this.props.allRequiredDoctorInFo;
      let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
      let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
      let dataSelectProvince = this.buildDataInputSelect(
        resProvince,
        "PROVINCE"
      );
      let dataSelectSpecialty = this.buildDataInputSelect(
        resSpecialty,
        "SPECIALTY"
      );
      this.setState({
        listPrice: dataSelectPrice,
        listPayment: dataSelectPayment,
        listProvince: dataSelectProvince,
        listSpecialty: dataSelectSpecialty,
      });
    }
  }
  // Finish!
  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentMarkdown: text,
      contentHTML: html,
    });
  };
  handleSaveContentMarkdown = () => {
    let { hasOldData } = this.state;
    this.props.saveDetailDoctor({
      contentHTML: this.state.contentHTML,
      contentMarkdown: this.state.contentMarkdown,
      description: this.state.description,
      doctorId: this.state.selectedDoctor.value,
      action: hasOldData === true ? CRUD_ACTION.EDIT : CRUD_ACTION.CREATE,
      selectedPrice: this.state.selectedPrice,
      selectedPayment: this.state.selectedPayment,
      selectedProvince: this.state.selectedProvince,
      nameClinic: this.state.nameClinic,
      addressClinic: this.state.addressClinic,
      note: this.state.note,
      clinicId:
        this.state.selectedClinic && this.state.selectedClinic.value
          ? this.state.selectedClinic.value
          : "",
      specialtyId: this.state.selectedSPecialty.value,
    });
  };
  handleChangeSelect = async (selectedDoctor) => {
    this.setState({ selectedDoctor });
    let { listPayment, listPrice, listProvince, listSpecialty, listClinic } =
      this.state;
    let res = await getDetailInforDoctor(selectedDoctor.value);
    if (res && res.errCode === 0 && res.data && res.data.Markdown) {
      let markdown = res.data.Markdown;
      let addressClinic = "",
        nameClinic = "",
        note = "",
        paymentId = "",
        priceId = "",
        provinceId = "",
        specialtyId = "",
        selectedPayment = "",
        selectedPrice = "",
        selectedProvince = "",
        selectedSPecialty = "";

      if (res.data.Doctor_Infor) {
        addressClinic = res.data.Doctor_Infor.addressClinic;
        nameClinic = res.data.Doctor_Infor.nameClinic;
        note = res.data.Doctor_Infor.note;
        paymentId = res.data.Doctor_Infor.paymentId;
        priceId = res.data.Doctor_Infor.priceId;
        provinceId = res.data.Doctor_Infor.provinceId;
        specialtyId = res.data.Doctor_Infor.specialtyId;
        selectedPayment = listPayment.find((item) => {
          return item && item.value === paymentId;
        });
        selectedPrice = listPrice.find((item) => {
          return item && item.value === priceId;
        });
        selectedProvince = listProvince.find((item) => {
          return item && item.value === provinceId;
        });
        selectedSPecialty = listSpecialty.find((item) => {
          return item && item.value === specialtyId;
        });
      }
      this.setState({
        contentHTML: markdown.contentHTML,
        contentMarkdown: markdown.contentMarkdown,
        description: markdown.description,
        hasOldData: true,
        addressClinic: addressClinic,
        nameClinic: nameClinic,
        note: note,
        selectedPayment: selectedPayment,
        selectedPrice: selectedPrice,
        selectedProvince: selectedProvince,
        selectedSPecialty: selectedSPecialty
      });
    } else {
      this.setState({
        contentHTML: "",
        contentMarkdown: "",
        description: "",
        hasOldData: false,
        addressClinic: "",
        nameClinic: "",
        note: "",
      });
    }
  };
  handleChangeSelectDoctorInFor = async (selectedOption, name) => {
    let stateName = name.name;
    let stateCopy = { ...this.state };
    stateCopy[stateName] = selectedOption;
    this.setState({
      ...stateCopy,
    });
  };
  handleOnChangeText = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };
  render() {
    let { hasOldData } = this.state;
    return (
      <div className="manage-doctor-container">
        <div className="manage-doctor-title">
          <FormattedMessage id={"admin.manage-doctor.title"} />
        </div>
        <div className="more-infor">
          <div className="content-left form-group">
            <label class="form-label">
              <FormattedMessage id={"admin.manage-doctor.select-doctor"} />
            </label>
            <Select
              value={this.state.selectedDoctor}
              onChange={this.handleChangeSelect}
              options={this.state.listDoctors}
              placeholder={
                <FormattedMessage id={"admin.manage-doctor.select-doctor"} />
              }
            />
          </div>
          <div className="content-right">
            <label class="form-label">
              <FormattedMessage id={"admin.manage-doctor.intro"} />
            </label>
            <textarea
              className="form-control"
              rows={4}
              onChange={(event) =>
                this.handleOnChangeText(event, "description")
              }
              value={this.state.description}></textarea>
          </div>
        </div>
        <div className="row more-infor-extra">
          <div className="col-4 form-group">
            <label class="form-label">
              <FormattedMessage id={"admin.manage-doctor.price"} />
            </label>
            <Select
              value={this.state.selectedPrice}
              onChange={this.handleChangeSelectDoctorInFor}
              options={this.state.listPrice}
              placeholder={
                <FormattedMessage id={"admin.manage-doctor.price"} />
              }
              name="selectedPrice"
            />
          </div>
          <div className="col-4 form-group">
            <label class="form-label">
              <FormattedMessage id={"admin.manage-doctor.payment"} />
            </label>
            <Select
              value={this.state.selectedPayment}
              onChange={this.handleChangeSelectDoctorInFor}
              options={this.state.listPayment}
              placeholder={
                <FormattedMessage id={"admin.manage-doctor.payment"} />
              }
              name="selectedPayment"
            />
          </div>
          <div className="col-4 form-group">
            <label class="form-label">
              <FormattedMessage id={"admin.manage-doctor.province"} />
            </label>
            <Select
              value={this.state.selectedProvince}
              onChange={this.handleChangeSelectDoctorInFor}
              options={this.state.listProvince}
              placeholder={
                <FormattedMessage id={"admin.manage-doctor.province"} />
              }
              name="selectedProvince"
            />
          </div>
          <div className="col-4 form-group">
            <label class="form-label">
              <FormattedMessage id={"admin.manage-doctor.nameClinic"} />
            </label>
            <input
              className="form-control"
              onChange={(event) => this.handleOnChangeText(event, "nameClinic")}
              value={this.state.nameClinic}
            />
          </div>
          <div className="col-4 form-group">
            <label class="form-label">
              <FormattedMessage id={"admin.manage-doctor.addressClinic"} />
            </label>
            <input
              className="form-control"
              onChange={(event) =>
                this.handleOnChangeText(event, "addressClinic")
              }
              value={this.state.addressClinic}
            />
          </div>
          <div className="col-4 form-group">
            <label class="form-label">
              <FormattedMessage id={"admin.manage-doctor.note"} />
            </label>
            <input
              className="form-control"
              onChange={(event) => this.handleOnChangeText(event, "note")}
              value={this.state.note}
            />
          </div>
          <div className="col-6 form-group">
            <label class="form-label">
              <FormattedMessage id={"admin.manage-doctor.specialty"} />
            </label>
            <Select
              value={this.state.selectedSPecialty}
              onChange={this.handleChangeSelectDoctorInFor}
              options={this.state.listSpecialty}
              placeholder={
                <FormattedMessage id={"admin.manage-doctor.specialty"} />
              }
              name="selectedSPecialty"
            />
          </div>
          <div className="col-6 form-group">
            <label class="form-label">
              <FormattedMessage id={"admin.manage-doctor.select-clinic"} />
            </label>
            <Select
              value={this.state.selectedClinic}
              onChange={this.handleChangeSelectDoctorInFor}
              options={this.state.listClinic}
              placeholder={
                <FormattedMessage id={"admin.manage-doctor.select-clinic"} />
              }
              name="selectedClinic"
            />
          </div>
        </div>
        <div className="manage-doctor-editor">
          <MdEditor
            style={{ height: "500px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
            value={this.state.contentMarkdown}
          />
        </div>
        <button
          className={
            hasOldData === true
              ? "save-content-doctor"
              : "create-content-doctor"
          }
          onClick={() => this.handleSaveContentMarkdown()}>
          {hasOldData === true ? (
            <span>
              <FormattedMessage id={"admin.manage-doctor.save"} />
            </span>
          ) : (
            <span>
              <FormattedMessage id={"admin.manage-doctor.add"} />
            </span>
          )}
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    allDoctors: state.admin.allDoctors,
    allRequiredDoctorInFo: state.admin.allRequiredDoctorInFo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    getRequiredDoctorInFor: () => dispatch(actions.getRequiredDoctorInFor()),
    saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
