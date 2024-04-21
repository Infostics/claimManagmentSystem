import axios, { all } from "axios";
import { useEffect } from "react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

import {
  getTotalValue,
  calculateProfessionalFees,
  calculateTotalAssessed,
  roundOff,
  addCommasToNumber,
} from "./functions";

const BillCreation = ({ allInfo, leadID }) => {
  const router = useRouter();

  const [Bill, setBill] = useState("");
  const currentDate = new Date();
  const [disable, setDisable] = useState(false);
  const formattedDate = currentDate.toLocaleDateString("en-GB");
  console.log(formattedDate);
  const [BillDate, setBillDate] = useState(new Date());
  const [Insurer, setInsurer] = useState(
    "United India Insurance Company Limited"
  );
  const [Branch, setBranch] = useState("");
  const [Others, setOthers] = useState("");
  const [Estimate, setEstimate] = useState("");
  const [DetailsKM, setDetailsKM] = useState("");
  const [Assessed, setAssessed] = useState("");
  const [DetailsPhotoRate, setDetailsPhotoRate] = useState("");
  const [DetailsFee, setDetailsFee] = useState("");
  const [DetailsRemark, setDetailsRemark] = useState("");
  const [show, setShow] = useState(false);
  const [defaultProfFees, setDefaultProfFees] = useState(0);

  const [BillTo, setBillTo] = useState("");

  const [currentSelectedInsprectiontype, setcurrentSelectedInsprectiontype] =
    useState(1);

  const [FinalProfFees, setFinalProfFees] = useState(0);
  const [FinalTotalKM, setFinalTotalKM] = useState("");
  const [FinalVisit, setFinalVisit] = useState("");
  const [FinalConveyance, setFinalConveyance] = useState("");
  const [FinalPhotos, setFinalPhotos] = useState("");
  const [FinalCharges, setFinalCharges] = useState("");
  const [FinalPhotosCD, setFinalPhotoCD] = useState("");
  const [FinalRemark, setFinalRemark] = useState("");

  const [ReInsprectionProfFees, setReInsprectionProfFees] = useState("");
  const [ReInsprectionTotalKM, setReInsprectionTotalKM] = useState("");
  const [ReInsprectionVisit, setReInsprectionVisit] = useState("");
  const [ReInsprectionConveyance, setReInsprectionConveyance] = useState("");
  const [ReInsprectionPhotos, setReInsprectionPhotos] = useState("");
  const [ReInsprectionCharges, setReInsprectionCharges] = useState("");
  const [ReInsprectionPhotosCD, setReInsprectionPhotoCD] = useState("");
  const [ReInsprectionRemark, setReInsprectionRemark] = useState("");

  const [SpotProfFees, setSpotProfFees] = useState("");
  const [SpotTotalKM, setSpotTotalKM] = useState("");
  const [SpotVisit, setSpotVisit] = useState("");
  const [SpotConveyance, setSpotConveyance] = useState("");
  const [SpotPhotos, setSpotPhotos] = useState("");
  const [SpotCharges, setSpotCharges] = useState("");
  const [SpotPhotosCD, setSpotPhotoCD] = useState("");
  const [SpotRemark, setSpotRemark] = useState("");
  const [allServicingOffice, setAllServicingOffice] = useState([]);

  const [OtherTotal, setOtherTotal] = useState("");

  const [CGST, setCGST] = useState(0);
  const [SGST, setSGST] = useState(0);
  const [IGST, setIGST] = useState(18);

  const [allInsurer, setAllInsurer] = useState([]);

  const [CGSTValue, setCGSTValue] = useState("");
  const [SGSTValue, setSGSTValue] = useState("");
  const [IGSTValue, setIGSTValue] = useState("");

  const [Cash, setCash] = useState("");
  const [NetPay, setNetPay] = useState(0);

  useEffect(() => {
    axios
      .get("/api/getClaimServicingOffice")
      .then((res) => {
        setAllServicingOffice(res.data.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    axios
      .get("/api/getAllInsurers", {
        headers: {
          Authorization: `Bearer ${userInfo[0]?.Token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("insurerdata", res.data.InsurerData.result);
        setAllInsurer(res.data.InsurerData.result);
      })
      .catch((err) => {
        toast.dismiss();
        toast.error("Got error while fetching Insurer Info!");
      });
  }, []);

  useEffect(() => {
    if (!allInfo?.feesDetails) {
    } else {
      setBill(allInfo?.feesDetails?.BillSno);

      setInsurer(allInfo?.feesDetails?.InsuranceCompanyName);
      setBillTo(allInfo?.feesDetails?.BillTo);
      setBranch(allInfo?.feesDetails?.Branch);
      setOthers(allInfo?.feesDetails?.Others);
      setDetailsKM(allInfo?.feesDetails?.KmRate);
      setDetailsPhotoRate(allInfo?.feesDetails?.PhotsRate);
      setDetailsFee(allInfo?.feesDetails?.FeebasedOn);
      setDetailsRemark(allInfo?.feesDetails?.Remrk);

      setcurrentSelectedInsprectiontype(
        String(allInfo?.feesDetails?.Type) === "Final"
          ? 1
          : String(allInfo?.feesDetails?.Type) === "Spot"
          ? 3
          : 2
      );

      setCGST(allInfo?.feesDetails?.Cgst);
      setIGST(allInfo?.feesDetails?.Igst);
      setSGST(allInfo?.feesDetails?.Sgst);

      if (String(allInfo?.feesDetails?.Type) === "Final") {
        setFinalTotalKM(allInfo?.feesDetails?.TotalKm);
        setFinalVisit(allInfo?.feesDetails?.Visits);
        setFinalConveyance(allInfo?.feesDetails?.Conveyance);
        setFinalPhotos(allInfo?.feesDetails?.Photos);
        setFinalCharges(allInfo?.feesDetails?.Charge);
        setFinalPhotoCD(allInfo?.feesDetails?.Photos_cd);
        setFinalRemark(allInfo?.feesDetails?.Remrk);
      } else if (String(allInfo?.feesDetails?.Type) === "Spot") {
        setSpotTotalKM(allInfo?.feesDetails?.TotalKm);
        setSpotVisit(allInfo?.feesDetails?.Visits);
        setSpotConveyance(allInfo?.feesDetails?.Conveyance);
        setSpotPhotos(allInfo?.feesDetails?.Photos);
        setSpotCharges(allInfo?.feesDetails?.Charge);
        setSpotPhotoCD(allInfo?.feesDetails?.Photos_cd);
        setSpotRemark(allInfo?.feesDetails?.Remrk);
      } else {
        setReInsprectionTotalKM(allInfo?.feesDetails?.TotalKm);
        setReInsprectionVisit(allInfo?.feesDetails?.Visits);
        setReInsprectionConveyance(allInfo?.feesDetails?.Conveyance);
        setReInsprectionPhotos(allInfo?.feesDetails?.Photos);
        setReInsprectionCharges(allInfo?.feesDetails?.Charge);
        setReInsprectionPhotoCD(allInfo?.feesDetails?.Photos_cd);
        setReInsprectionRemark(allInfo?.feesDetails?.Remrk);
      }
    }
  }, [allInfo]);

  useEffect(() => {}, [currentSelectedInsprectiontype]);

  useEffect(() => {
    if (
      String(BillTo) === "Appointing Office" ||
      String(BillTo) === "Insurer"
    ) {
      let requiredStateCode = {};
      let searchCode =
        String(BillTo) === "Appointing Office"
          ? allInfo?.otherInfo[0]?.ClaimServicingOffice
          : String(BillTo) === "Insurer"
          ? allInfo?.otherInfo[0]?.PolicyIssuingOffice
          : "";
      allServicingOffice.map((office, index) => {
        if (String(office.OfficeNameWithCode) === String(searchCode)) {
          requiredStateCode = office.StateCode;
        }
      });
      if (String(requiredStateCode) === "8") {
        setCGST(9);
        setSGST(9);
        setIGST(0);
      } else {
        setCGST(0);
        setSGST(0);
        setIGST(18);
      }
    } else {
      setCGST(0);
      setSGST(0);
      setIGST(0);
    }
  }, [BillTo, allInfo, allServicingOffice]);

  useEffect(() => {
    const fees = String(allInfo?.otherInfo[0]?.VehicleType)
      .toLowerCase()
      .includes("4W".toLowerCase())
      ? 700
      : 500;
    setFinalProfFees(fees);
    setReInsprectionProfFees(fees);
    setSpotProfFees(fees);
  }, [allInfo]);

  useEffect(() => {
    const professionalFees = all;
    String(allInfo?.VehicleOnlineDetails?.VehicleType) === "2W" ? 500 : 700;

    const Conveyance =
      allInfo?.feesDetails?.Conveyance !== undefined &&
      allInfo?.feesDetails?.Conveyance !== null &&
      allInfo?.feesDetails?.Conveyance !== ""
        ? allInfo?.feesDetails?.Conveyance
        : 0;

    const PhotoCD =
      allInfo?.feesDetails?.Photos_cd !== undefined &&
      allInfo?.feesDetails?.Photos_cd !== null &&
      allInfo?.feesDetails?.Photos_cd !== ""
        ? allInfo?.feesDetails?.Photos_cd
        : 0;

    const total =
      Number(professionalFees) + Number(Conveyance) + Number(PhotoCD);

    const calculate_cgst = (Number(total) * Number(CGST)) / 100;
    const calculate_igst = (Number(total) * Number(IGST)) / 100;

    const calculate_sgst = (Number(total) * Number(SGST)) / 100;
    setNetPay(total + calculate_cgst + calculate_igst + calculate_sgst);
  }, [allInfo]);

  useEffect(() => {
    setNetPay(getTotalValue(allInfo, currentSelectedInsprectiontype));
  }, [CGST, IGST, SGST, OtherTotal, currentSelectedInsprectiontype]);

  useEffect(() => {}, [currentSelectedInsprectiontype]);

  useEffect(() => {
    setInsurer(allInfo?.otherInfo[0]?.InsuranceCompanyNameAddress);
    setBranch(allInfo?.otherInfo[0]?.Region);
    calculateTotalAssessed(allInfo, setAssessed, setEstimate);

    const professionalFees =
      String(currentSelectedInsprectiontype) === "1"
        ? FinalProfFees
        : String(currentSelectedInsprectiontype) === "2"
        ? ReInsprectionProfFees
        : SpotProfFees;

    const totalKM =
      String(currentSelectedInsprectiontype) === "1"
        ? FinalTotalKM
        : String(currentSelectedInsprectiontype) === "2"
        ? ReInsprectionTotalKM
        : SpotTotalKM;

    const Visits =
      String(currentSelectedInsprectiontype) === "1"
        ? FinalVisit
        : String(currentSelectedInsprectiontype) === "2"
        ? ReInsprectionVisit
        : SpotVisit;

    const Conveyance =
      String(currentSelectedInsprectiontype) === "1"
        ? FinalConveyance
        : String(currentSelectedInsprectiontype) === "2"
        ? ReInsprectionConveyance
        : SpotConveyance;

    const Photos =
      String(currentSelectedInsprectiontype) === "1"
        ? FinalPhotos
        : String(currentSelectedInsprectiontype) === "2"
        ? ReInsprectionPhotos
        : SpotPhotos;

    const charges =
      String(currentSelectedInsprectiontype) === "1"
        ? FinalCharges
        : String(currentSelectedInsprectiontype) === "2"
        ? ReInsprectionCharges
        : SpotCharges;

    const PhotoCD =
      String(currentSelectedInsprectiontype) === "1"
        ? FinalPhotosCD
        : String(currentSelectedInsprectiontype) === "2"
        ? ReInsprectionPhotosCD
        : SpotPhotosCD;

    console.log(defaultProfFees, PhotoCD, Conveyance);
    const total =
      Number(professionalFees) + Number(Conveyance) + Number(PhotoCD);

    const calculate_cgst = (Number(total) * Number(CGST)) / 100;
    const calculate_igst = (Number(total) * Number(IGST)) / 100;

    const calculate_sgst = (Number(total) * Number(SGST)) / 100;

    setIGSTValue(calculate_igst);
    setCGSTValue(calculate_cgst);
    setSGSTValue(calculate_sgst);

    setNetPay(total + calculate_cgst + calculate_igst + calculate_sgst);
  }, [
    allInfo,
    FinalConveyance,
    FinalPhotosCD,
    FinalProfFees,
    SpotConveyance,
    SpotPhotosCD,
    SpotProfFees,
    ReInsprectionConveyance,
    ReInsprectionPhotosCD,
    ReInsprectionProfFees,
    currentSelectedInsprectiontype,
  ]);

  const onSubmitHnadler = () => {
    setDisable(true);
    const payload = {
      LeadId: leadID,
      Type:
        String(currentSelectedInsprectiontype) === "1"
          ? "Final"
          : String(currentSelectedInsprectiontype) === "2"
          ? "ReInspection"
          : "Spot",
      ProfessionalFees: calculateProfessionalFees(allInfo),
      TotalKM:
        String(currentSelectedInsprectiontype) === "1"
          ? FinalTotalKM
          : String(currentSelectedInsprectiontype) === "2"
          ? ReInsprectionTotalKM
          : SpotTotalKM,
      Visits:
        String(currentSelectedInsprectiontype) === "1"
          ? FinalVisit
          : String(currentSelectedInsprectiontype) === "2"
          ? ReInsprectionVisit
          : SpotVisit,
      Conveyance:
        String(currentSelectedInsprectiontype) === "1"
          ? FinalConveyance
          : String(currentSelectedInsprectiontype) === "2"
          ? ReInsprectionConveyance
          : SpotConveyance,
      Photos:
        String(currentSelectedInsprectiontype) === "1"
          ? FinalPhotos
          : String(currentSelectedInsprectiontype) === "2"
          ? ReInsprectionPhotos
          : SpotPhotos,
      Charge:
        String(currentSelectedInsprectiontype) === "1"
          ? FinalCharges
          : String(currentSelectedInsprectiontype) === "2"
          ? ReInsprectionCharges
          : SpotCharges,
      Photos_cd:
        String(currentSelectedInsprectiontype) === "1"
          ? FinalPhotosCD
          : String(currentSelectedInsprectiontype) === "2"
          ? ReInsprectionPhotosCD
          : SpotPhotosCD,
      Cgst: CGST,
      Igst: IGST,
      Sgst: SGST,
      Total: NetPay,
      ModeOfPayement: "",
      BillID: Number(allInfo?.feesDetails?.BillSno),
      FeebasedOn: DetailsFee,
      Remrk: DetailsRemark,
      KmRate: DetailsKM,
      PhotsRate: DetailsPhotoRate,
      EstimateAmt: Estimate,
      AssessedAmt: Assessed,
      InsuranceCompanyName: allInfo?.otherInfo[0]?.InsuranceCompanyNameAddress,
      Branch: Branch,
      BillTo: BillTo,
      Others: Others,
      BillDate: BillDate,
      BillId: allInfo?.feesDetails ? allInfo?.feesDetails?.BillSno : null,
    };

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    toast.loading(
      allInfo?.feesDetails?.BillID
        ? "Updating the bill !!"
        : "Adding the bill !!",
      {
        // position: toast.POSITION.BOTTOM_LEFT,
        className: "toast-loading-message",
      }
    );

    axios
      .post("/api/uploadFeeReport", payload, {
        headers: {
          Authorization: `Bearer ${userInfo[0].Token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        toast.dismiss();
        toast.success(
          `Successfully ${
            allInfo?.feesDetails?.BillID ? "updated" : "added"
          } !`,
          {
            className: "toast-loading-message",
          }
        );
        router.push(`/claim-details?leadId=${leadID}`);
      })
      .catch((Err) => {
        console.log(Err);
        toast.dismiss();
        toast.error("Got error while adding claim!");
      });
    setDisable(false);
  };

  const getTotalValue = () => {
    const professionalFees = Number(calculateProfessionalFees(allInfo));

    const totalKM =
      String(currentSelectedInsprectiontype) === "1"
        ? FinalTotalKM
        : String(currentSelectedInsprectiontype) === "2"
        ? ReInsprectionTotalKM
        : SpotTotalKM;

    const Visits =
      String(currentSelectedInsprectiontype) === "1"
        ? FinalVisit
        : String(currentSelectedInsprectiontype) === "2"
        ? ReInsprectionVisit
        : SpotVisit;

    const Conveyance =
      String(currentSelectedInsprectiontype) === "1"
        ? FinalConveyance
        : String(currentSelectedInsprectiontype) === "2"
        ? ReInsprectionConveyance
        : SpotConveyance;

    const Photos =
      String(currentSelectedInsprectiontype) === "1"
        ? FinalPhotos
        : String(currentSelectedInsprectiontype) === "2"
        ? ReInsprectionPhotos
        : SpotPhotos;

    const charges =
      String(currentSelectedInsprectiontype) === "1"
        ? FinalCharges
        : String(currentSelectedInsprectiontype) === "2"
        ? ReInsprectionCharges
        : SpotCharges;

    const PhotoCD =
      String(currentSelectedInsprectiontype) === "1"
        ? FinalPhotosCD
        : String(currentSelectedInsprectiontype) === "2"
        ? ReInsprectionPhotosCD
        : SpotPhotosCD;

    const total =
      Number(professionalFees) + Number(Conveyance) + Number(PhotoCD);

    const calculate_cgst = (Number(total) * Number(CGST)) / 100;
    const calculate_igst = (Number(total) * Number(IGST)) / 100;

    const calculate_sgst = (Number(total) * Number(SGST)) / 100;

    setIGSTValue(calculate_igst);
    setCGSTValue(calculate_cgst);
    setSGSTValue(calculate_sgst);

    setNetPay(
      total +
        calculate_cgst +
        calculate_igst +
        calculate_sgst +
        Number(OtherTotal)
    );
    return (
      total +
      calculate_cgst +
      calculate_igst +
      calculate_sgst +
      Number(OtherTotal)
    );
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-6" style={{ borderRight: "1px solid grey" }}>
          <div className="col-lg-12">
            <div className="row mt-1 mb-1">
              <div className="col-lg-1 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Bill#
                </label>
              </div>
              <div className="col-lg-4">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={allInfo?.feesDetails?.BillSno}
                />
              </div>
              <div className="col-lg-1 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Date
                </label>
              </div>
              <div className="col-lg-4">
                <DatePicker
                  className="form-control"
                  id="propertyTitle"
                  dateFormat="dd/MM/yyyy"
                  selected={
                    BillDate !== null && !isNaN(new Date(BillDate))
                      ? new Date(BillDate)
                      : ""
                  }
                  onChange={(date) => setBillDate(date)}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="row mt-1">
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    // paddingTop: "15px",
                    color: "#2e008b",
                    fontWeight: "",
                    // marginTop: "-13px",
                  }}
                >
                  Insurer
                </label>
              </div>
              <div className="col-lg-7">
                <select
                  style={{ padding: "2px", marginTop: "3px" }}
                  className="selectpicker form-select"
                  data-live-search="true"
                  data-width="100%"
                  value={Insurer}
                  onChange={(e) => setInsurer(e.target.value)}
                >
                  {allInsurer.map((insurer, index) => {
                    return (
                      <option
                        key={index}
                        data-tokens="Status1"
                        value={insurer.name}
                      >
                        {insurer.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="row mt-1">
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    // paddingTop: "15px",
                    color: "#2e008b",
                    fontWeight: "",
                    // marginTop: "-13px",
                  }}
                >
                  Branch
                </label>
              </div>
              <div className="col-lg-7">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={Branch}
                  onChange={(e) => setBranch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="row mt-1">
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    // paddingTop: "15px",
                    color: "#2e008b",
                    fontWeight: "",
                    marginTop: "5px",
                  }}
                >
                  Bill To
                </label>
              </div>
              <div className="col-lg-7">
                <select
                  className="selectpicker form-select"
                  data-live-search="true"
                  data-width="100%"
                  value={BillTo}
                  onChange={(e) => setBillTo(e.target.value)}
                >
                  <option data-tokens="Status1" value={""}>
                    Select Type
                  </option>
                  <option data-tokens="Status1" value={"Insured"}>
                    Insured
                  </option>
                  <option data-tokens="Status2" value={"Appointing Office"}>
                    Appointing office
                  </option>
                  <option data-tokens="Status3" value={"Insurer"}>
                    Insurer
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="row mt-1">
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    // paddingTop: "15px",
                    color: "#2e008b",
                    fontWeight: "",
                    // marginTop: "-13px",
                  }}
                >
                  Others
                </label>
              </div>
              <div className="col-lg-7">
                <input
                  type="text"
                  className="form-control"
                  id="propertyTitle"
                  value={Others}
                  onChange={(e) => setOthers(e.target.value)}
                />

                {/* <MyDatePicker /> */}
              </div>
            </div>
          </div>
          <h4>Details</h4>
          <hr />
          <div className="col-lg-12">
            <div className="row mt-1 mb-1">
              <div className="col-lg-3 my_profile_setting_input form-group text-end">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontSize: "14px",
                  }}
                >
                  Estimate Amt.
                </label>
              </div>
              <div className="col-lg-3">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={addCommasToNumber(roundOff(Estimate))}
                />
              </div>
              <div className="col-lg-3 my_profile_setting_input form-group text-end">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontSize: "14px",
                  }}
                >
                  KM Rate
                </label>
              </div>
              <div className="col-lg-3">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={DetailsKM}
                  onChange={(e) => setDetailsKM(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="row mt-1 mb-1">
              <div className="col-lg-3 my_profile_setting_input form-group text-end">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontSize: "14px",
                  }}
                >
                  Assessed Amt.
                </label>
              </div>
              <div className="col-lg-3">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={addCommasToNumber(roundOff(Assessed))}
                />
              </div>
              <div className="col-lg-3 my_profile_setting_input form-group text-end">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontSize: "14px",
                  }}
                >
                  Photos Rate
                </label>
              </div>
              <div className="col-lg-3">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={DetailsPhotoRate}
                  onChange={(e) => setDetailsPhotoRate(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="row mt-1">
              <div className="col-lg-3 my_profile_setting_input form-group text-end">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    // paddingTop: "15px",
                    color: "#2e008b",
                    fontSize: "14px",
                    // marginTop: "-13px",
                  }}
                >
                  Fee Based on
                </label>
              </div>
              <div className="col-lg-9">
                <select
                  type="text"
                  className="form-select"
                  id="broker_mail_id"
                  value={DetailsFee}
                  onChange={(e) => setDetailsFee(e.target.value)}
                >
                  <option>Choose..</option>
                  <option>Estimate</option>
                  <option>Assessed</option>
                  <option>IDV</option>
                </select>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="row mt-1">
              <div className="col-lg-3 text-end my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    // paddingTop: "15px",
                    color: "#2e008b",
                    fontSize: "14px",
                    // marginTop: "-13px",
                  }}
                >
                  Remark
                </label>
              </div>
              <div className="col-lg-7">
                <textarea
                  name=""
                  id=""
                  cols="50"
                  rows="3"
                  value={DetailsRemark}
                  onChange={(e) => setDetailsRemark(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
          <hr />
          <div className="row">
            <table style={{ border: "1px solid black" }}>
              <tr>
                <th style={{ border: "1px solid black" }}></th>
                <th style={{ border: "1px solid black" }}>
                  <div className="col-lg-12 text-center">Report</div>
                </th>
                <th style={{ border: "1px solid black" }}>
                  <div className="col-lg-12 text-center">Name</div>
                </th>
                <th style={{ border: "1px solid black" }}>
                  <div className="col-lg-12 text-center">Reg.No.</div>
                </th>
                <th style={{ border: "1px solid black" }}>
                  <div className="col-lg-12 text-center">S.No.</div>
                </th>
              </tr>
              <tr>
                <td>
                  <div className="col-lg-12 text-center">
                    <input type="checkbox" className="" id="broker_mail_id" />
                  </div>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="row">
            <h5>[Final]</h5>
            <hr />
          </div>
          <div className="col-lg-12">
            <div className="row mt-1 mb-1">
              <div className="col-lg-4">
                <input
                  type="checkbox"
                  className=""
                  id="broker_mail_id"
                  checked={
                    String(currentSelectedInsprectiontype) === "1"
                      ? true
                      : false
                  }
                  onChange={() => setcurrentSelectedInsprectiontype(1)}
                />
              </div>
              <div className="col-lg-3 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Professional Fees
                </label>
              </div>
              <div className="col-lg-5">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={FinalProfFees}
                />
              </div>
            </div>
            <div className="row mt-1 mb-1">
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Total KM
                </label>
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={FinalTotalKM}
                  onChange={(e) => setFinalTotalKM(e.target.value)}
                />
              </div>
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Visits
                </label>
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={FinalVisit}
                  onChange={(e) => setFinalVisit(e.target.value)}
                />
              </div>
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Conveyance
                </label>
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={FinalConveyance}
                  onChange={(e) => setFinalConveyance(e.target.value)}
                />
              </div>
            </div>
            <div className="row mt-1 mb-1">
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Photos
                </label>
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={FinalPhotos}
                  onChange={(e) => setFinalPhotos(e.target.value)}
                />
              </div>
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Chrg.
                </label>
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={FinalCharges}
                  onChange={(e) => setFinalCharges(e.target.value)}
                />
              </div>
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Photos/CD
                </label>
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={FinalPhotosCD}
                  onChange={(e) => setFinalPhotoCD(e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-12">
              <div className="row mt-1">
                <div className="col-lg-2 text-end my_profile_setting_input form-group">
                  <label
                    htmlFor=""
                    className="text-color"
                    style={{
                      // paddingTop: "15px",
                      color: "#2e008b",
                      fontSize: "14px",
                      // marginTop: "-13px",
                    }}
                  >
                    Remark
                  </label>
                </div>
                <div className="col-lg-9">
                  <textarea
                    name=""
                    id=""
                    cols="60"
                    rows="2"
                    value={FinalRemark}
                    onChange={(e) => setFinalRemark(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <h5>[ReInspection]</h5>
            <hr />
          </div>
          <div className="col-lg-12">
            <div className="row mt-1 mb-1">
              <div className="col-lg-4">
                <input
                  type="checkbox"
                  className=""
                  id="broker_mail_id"
                  checked={
                    String(currentSelectedInsprectiontype) === "2"
                      ? true
                      : false
                  }
                  onChange={() => setcurrentSelectedInsprectiontype(2)}
                />
              </div>
              <div className="col-lg-3 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Professional Fees
                </label>
              </div>
              <div className="col-lg-5">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={FinalProfFees}
                />
              </div>
            </div>
            <div className="row mt-1 mb-1">
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Total KM
                </label>
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={ReInsprectionTotalKM}
                  onChange={(e) => setReInsprectionTotalKM(e.target.value)}
                />
              </div>
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Visits
                </label>
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={ReInsprectionVisit}
                  onChange={(e) => setReInsprectionVisit(e.target.value)}
                />
              </div>
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Conveyance
                </label>
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={ReInsprectionConveyance}
                  onChange={(e) => setReInsprectionConveyance(e.target.value)}
                />
              </div>
            </div>
            <div className="row mt-1 mb-1">
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Photos
                </label>
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={ReInsprectionPhotos}
                  onChange={(e) => setReInsprectionPhotos(e.target.value)}
                />
              </div>
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Chrg.
                </label>
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={ReInsprectionCharges}
                  onChange={(e) => setReInsprectionCharges(e.target.value)}
                />
              </div>
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Photos/CD
                </label>
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={ReInsprectionPhotosCD}
                  onChange={(e) => setReInsprectionPhotoCD(e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-12">
              <div className="row mt-1">
                <div className="col-lg-2 text-end my_profile_setting_input form-group">
                  <label
                    htmlFor=""
                    className="text-color"
                    style={{
                      // paddingTop: "15px",
                      color: "#2e008b",
                      fontSize: "14px",
                      // marginTop: "-13px",
                    }}
                  >
                    Remark
                  </label>
                </div>
                <div className="col-lg-9">
                  <textarea
                    name=""
                    id=""
                    cols="60"
                    rows="2"
                    value={ReInsprectionRemark}
                    onChange={(e) => setReInsprectionRemark(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <h5>[Spot]</h5>
            <hr />
          </div>
          <div className="col-lg-12">
            <div className="row mt-1 mb-1">
              <div className="col-lg-4">
                <input
                  type="checkbox"
                  className=""
                  id="broker_mail_id"
                  checked={
                    String(currentSelectedInsprectiontype) === "3"
                      ? true
                      : false
                  }
                  onChange={() => setcurrentSelectedInsprectiontype(3)}
                />
              </div>
              <div className="col-lg-3 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Professional Fees
                </label>
              </div>
              <div className="col-lg-5">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={FinalProfFees}
                />
              </div>
            </div>
            <div className="row mt-1 mb-1">
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Total KM
                </label>
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={SpotTotalKM}
                  onChange={(e) => setSpotTotalKM(e.target.value)}
                />
              </div>
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Visits
                </label>
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={SpotVisit}
                  onChange={(e) => setSpotVisit(e.target.value)}
                />
              </div>
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Conveyance
                </label>
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={SpotConveyance}
                  onChange={(e) => setSpotConveyance(e.target.value)}
                />
              </div>
            </div>
            <div className="row mt-1 mb-1">
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Photos
                </label>
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={SpotPhotos}
                  onChange={(e) => setSpotPhotos(e.target.value)}
                />
              </div>
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Chrg.
                </label>
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={SpotCharges}
                  onChange={(e) => setSpotCharges(e.target.value)}
                />
              </div>
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Photos/CD
                </label>
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={SpotPhotosCD}
                  onChange={(e) => setSpotPhotoCD(e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-12">
              <div className="row mt-1">
                <div className="col-lg-2 text-end my_profile_setting_input form-group">
                  <label
                    htmlFor=""
                    className="text-color"
                    style={{
                      // paddingTop: "15px",
                      color: "#2e008b",
                      fontSize: "14px",
                      // marginTop: "-13px",
                    }}
                  >
                    Remark
                  </label>
                </div>
                <div className="col-lg-9">
                  <textarea
                    name=""
                    id=""
                    cols="60"
                    rows="2"
                    value={SpotRemark}
                    onChange={(e) => setSpotRemark(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="row mt-1 mb-1">
              <div className="col-lg-5">
                {/* <input type="checkbox" className="" id="broker_mail_id" /> */}
              </div>
              <div className="col-lg-3 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Other Total
                </label>
                <input type="checkbox" className="m-2" id="broker_mail_id" />
              </div>
              <div className="col-lg-4">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={OtherTotal}
                  onChange={(e) => setOtherTotal(e.target.value)}
                />
              </div>
            </div>
            <div className="row mt-1 mb-1">
              <div className="col-lg-3"></div>
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  C GST @ :
                </label>
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={CGST}
                  onChange={(e) => setCGST(e.target.value)}
                />
              </div>
              <div className="col-lg-1">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  %
                </label>
              </div>
              <div className="col-lg-4">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={addCommasToNumber(roundOff(CGSTValue))}
                />
              </div>
            </div>
            <div className="row mt-1 mb-1">
              <div className="col-lg-3"></div>
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  S GST @ :
                </label>
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={addCommasToNumber(roundOff(SGST))}
                  onChange={(e) => setSGST(e.target.value)}
                />
              </div>
              <div className="col-lg-1">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  %
                </label>
              </div>
              <div className="col-lg-4">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={addCommasToNumber(roundOff(SGSTValue))}
                />
              </div>
            </div>
            <div className="row mt-1 mb-1">
              <div className="col-lg-3"></div>
              <div className="col-lg-2 my_profile_setting_input form-group">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  I GST @ :
                </label>
              </div>
              <div className="col-lg-2">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={IGST}
                  onChange={(e) => setIGST(e.target.value)}
                />
              </div>
              <div className="col-lg-1">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  %
                </label>
              </div>
              <div className="col-lg-4">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={addCommasToNumber(roundOff(IGSTValue))}
                />
              </div>
            </div>
            <div className="row mt-1 mb-1">
              <div className="col-lg-4">
                <input type="checkbox" className="" id="broker_mail_id" />
                <label
                  htmlFor=""
                  className="text-color m-2"
                  style={{
                    color: "#2e008b",
                    fontWeight: "bold",
                  }}
                >
                  Cash Recieved
                </label>
              </div>
              <div className="col-lg-3 my_profile_setting_input form-group text-end">
                <label
                  htmlFor=""
                  className="text-color"
                  style={{
                    color: "#2e008b",
                    fontWeight: "",
                  }}
                >
                  Net Payable :
                </label>
              </div>
              <div className="col-lg-5">
                <input
                  type="text"
                  className="form-control"
                  id="broker_mail_id"
                  value={addCommasToNumber(roundOff(NetPay))}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="my_profile_setting_input">
            <button
              disabled={disable}
              className="btn float-end btn-color"
              onClick={onSubmitHnadler}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillCreation;
