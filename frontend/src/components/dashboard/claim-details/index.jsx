import Header from "../../common/header/dashboard/Header_01";
import { useEffect, useState } from "react";
import SidebarMenu from "../../common/header/dashboard/SidebarMenu";
import MobileMenu from "../../common/header/MobileMenu";
import ChatboxContent from "./ChatboxContent";
// import CreateList from "./CreateList";
import Form from "./Form";
import Form_01 from "./Form_01";
import Form_02 from "./Form_02";
import axios from "axios";
import StatusLog from "./StatusLog";
import Exemple from "./Exemple";
import UploadReort from "./UploadReport";
import PaymentDetails from "./PaymentDetails";
import GarageDetails from "./GarageDetails";
import CreateList from "./CreateList";
import CreateList_01 from "./CreateList_01";
import Video from "./Video";
import EstimateList from "./EstimateList";
import CreateList_02 from "./CreateList_02";
import CreateList_03 from "./CreateList_03";
import { toast } from "react-hot-toast";
import CreateList_04 from "./CreateList_04";
import Loader from "../../common/Loader";
import { useRouter } from "next/router";
// import FloorPlans from "./FloorPlans";
// import LocationField from "./LocationField";
// import PropertyMediaUploader from "./PropertyMediaUploader";

const Index = ({}) => {
  const url = window.location.href;
  const leadId = url.split("/claim-details?leadId=")[1];
  const [claim, setClaim] = useState({});

  console.log("GETSPACIFIEDCLAIMS", claim);

  const [videosList, setVideosList] = useState([]);

  const [reload, setReload] = useState(false);

  const [policyIssuingOffice, setPolicyIssuingOffice] = useState(
    claim?.claimDetails?.PolicyIssuingOffice
      ? claim?.claimDetails?.PolicyIssuingOffice
      : ""
  );

  const [claimRegion, setClaimRegion] = useState(
    claim?.claimDetails?.ClaimRegion ? claim?.claimDetails?.ClaimRegion : ""
  );

  const [claimServicingOffice, setClaimServicingOffice] = useState(
    claim?.claimDetails?.ClaimServicingOffice
      ? claim?.claimDetails?.ClaimServicingOffice
      : ""
  );

  const [policyStartDate, setPolicyStartDate] = useState(
    claim?.claimDetails?.PolicyPeriodStart
      ? claim?.claimDetails?.PolicyPeriodStart
      : ""
  );
  const [policyEndDate, setPolicyEndDate] = useState(
    claim?.claimDetails?.PolicyPeriodEnd
      ? claim?.claimDetails?.PolicyPeriodEnd
      : ""
  );
  const [insuranceCompanyNameAddress, setInsuranceCompanyNameAddress] =
    useState(
      claim?.claimDetails?.InsuranceCompanyNameAddress
        ? claim?.claimDetails?.InsuranceCompanyNameAddress
        : ""
    );
  const [insuredAddedBy, setInsuredAddedBy] = useState(
    claim?.insuredDetails?.InsuredAddedBy
      ? claim?.insuredDetails?.InsuredAddedBy
      : ""
  );

  const [InsuredName, setInsuredName] = useState(
    claim?.insuredDetails?.InsuredName ? claim?.insuredDetails?.InsuredName : ""
  );
  const [InsuredMailAddress, setInsuredMailAddress] = useState(
    claim?.insuredDetails?.InsuredMailAddress
      ? claim?.insuredDetails?.InsuredMailAddress
      : ""
  );
  const [InsuredMobileNo1, setInsuredMobileNo1] = useState(
    claim?.insuredDetails?.InsuredMobileNo1
      ? claim?.insuredDetails?.InsuredMobileNo1
      : ""
  );
  const [InsuredMobileNo2, setInsuredMobileNo2] = useState(
    claim?.insuredDetails?.InsuredMobileNo2
      ? claim?.insuredDetails?.InsuredMobileNo2
      : ""
  );

  const [subType, setSubType] = useState("Motor");
  const [inspectionType, setInspectionType] = useState(
    claim?.claimDetails?.InspectionType
      ? claim?.claimDetails?.InspectionType
      : "Final"
  );

  const [documents, setDocuments] = useState([]);

  const [ClaimNumber, setClaimNumber] = useState(
    claim?.claimDetails?.ClaimNumber ? claim?.ClaimNumber?.ClaimNumber : ""
  );

  const [VehicleModel, setVehicleModel] = useState(
    claim.vehicleDetails?.VehicleTypeOfBody
      ? claim.vehicleDetails?.VehicleTypeOfBody
      : ""
  );

  const [EngineType, setEngineType] = useState(
    claim?.vehicleDetails?.VehicleModeOfCheck
      ? claim?.vehicleDetails?.VehicleModeOfCheck
      : ""
  );
  const [VehicleRegisteredOwner, setVehicleRegisteredOwner] = useState(
    claim?.vehicleDetails?.VehicleRegisteredOwner
      ? claim?.vehicleDetails?.VehicleRegisteredOwner
      : ""
  );
  const [DateRegistration, setDateRegistration] = useState(
    claim?.claimDetails?.ReferenceNo ? claim?.claimDetails?.ReferenceNo : ""
  );
  const [PUCNumber, setPUCNumber] = useState(
    claim?.vehicleDetails?.VehiclePucNumber
      ? claim?.vehicleDetails?.VehiclePucNumber
      : ""
  );
  const [TransferDate, setTransferDate] = useState(
    claim?.vehicleDetails?.VehicleTransferDate
      ? claim?.vehicleDetails?.VehicleTransferDate
      : ""
  );

  const [VehicleInsuranceUpto, setVehicleInsuranceUpto] = useState(
    claim?.vehicleDetails?.VehicleInsuranceUpto
      ? claim?.vehicleDetails?.VehicleInsuranceUpto
      : ""
  );

  const [EngineNumber, setEngineNumber] = useState(
    claim?.vehicleDetails?.VehicleEngineNumber
      ? claim?.vehicleDetails?.VehicleEngineNumber
      : ""
  );
  const [AddedBy, setAddedBy] = useState(
    claim?.vehicleDetails?.VehicleAddedBy
      ? claim?.vehicleDetails?.VehicleAddedBy
      : ""
  );
  const [IssuingAuthority, setIssuingAuthority] = useState(
    claim?.driverDetails?.IssuingAuthority
      ? claim?.vehicleDetails?.IssuingAuthority
      : ""
  );

  const [LicenseNumber, setLicenseNumber] = useState(
    claim?.driverDetails?.LicenseNumber
      ? claim?.vehicleDetails?.LicenseNumber
      : ""
  );
  const [LicenseType, setLicenseType] = useState(
    claim?.driverDetails?.LicenseType ? claim?.vehicleDetails?.LicenseType : ""
  );
  const [VehicleChassisNumber, setVehicleChassisNumber] = useState(
    claim?.vehicleDetails?.VehicleChassisNumber
      ? claim?.vehicleDetails?.VehicleChassisNumber
      : ""
  );
  const [VehicleFuelType, setVehicleFuelType] = useState(
    claim?.vehicleDetails?.VehicleFuelType
      ? claim?.vehicleDetails?.VehicleFuelType
      : ""
  );

  const [DriverName, setDriverName] = useState(
    claim?.driverDetails?.DriverName ? claim?.driverDetails?.DriverName : ""
  );
  const [DriverAddedDate, setDriverAddedDate] = useState(
    claim?.driverDetails?.DriverAddedDate
      ? claim?.driverDetails?.DriverAddedDate
      : ""
  );
  const [Verification, setVerification] = useState(
    claim?.driverDetails?.DriverTypeOfVerification
      ? claim?.driverDetails?.DriverTypeOfVerification
      : "verified By Online"
  );

  const [status, setStatus] = useState(
    claim?.claimStatus?.ClaimStatus ? claim?.claimStatus?.ClaimStatus : ""
  );

  const [GarageNameAndAddress, setGarageNameAndAddress] = useState(
    claim?.garageDetails?.GarageNameAndAddress
      ? claim?.garageDetails?.GarageNameAndAddress
      : ""
  );
  const [GarageContactNo1, setGarageContactNo1] = useState(
    claim?.garageDetails?.GarageContactNo1
      ? claim?.garageDetails?.GarageContactNo1
      : ""
  );
  const [GarageContactNo2, setGarageContactNo2] = useState(
    claim?.garageDetails?.GarageContactNo2
      ? claim?.garageDetails?.GarageContactNo2
      : ""
  );
  const [GarageAddedBy, setGarageAddedBy] = useState(
    claim?.garageDetails?.GarageAddedBy
      ? claim?.garageDetails?.GarageAddedBy
      : ""
  );

  const [editCase, setEditCase] = useState(false);
  const [editCase_01, setEditCase_01] = useState(false);
  const [editCase_02, setEditCase_02] = useState(false);
  const [editVechile, setEditVehichle] = useState(false);
  const [edit, setEdit] = useState(false);

  const getNextYear = () => {
    const oneYearLater = new Date(policyStartDate);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    oneYearLater.setMonth(oneYearLater.getMonth());
    oneYearLater.setDate(oneYearLater.getDate() - 1);

    return oneYearLater;
  };

  const getDateConversion = (date) => {
    const formattedOneYearLater = date?.split("T")[0];
    return formattedOneYearLater;
  };

  //New Fields
  const [VehicleClassDescription, setVehicleClassDescription] = useState("");
  const [MakerDesc, setMakerDesc] = useState("");
  const [MakerModel, setMakerModel] = useState(
    claim?.vehicleOnlineDetails?.MakerModel
  );

  // console.log("CONTANT11111", MakerModel);

  const [ManufactureMonthYear, setManufactureMonthYear] = useState("");
  const [VehicleGvw, setVehicleGvw] = useState("");
  const [CubicCapacity, setCubicCapacity] = useState(
    claim?.vehicleDetails?.VehicleCubicCapacity
  );
  const [BancsBodyType, setBancsBodyType] = useState("");
  const [BancsMakeCode, setBancsMakeCode] = useState("");
  const [BancsModelCode, setBancsModelCode] = useState("");
  const [BancsSubtypeCode, setBancsSubtypeCode] = useState("");
  const [BancsVehicleClass, setBancsVehicleClass] = useState("");
  const [BancsVehicleSegment, setBancsVehicleSegment] = useState("");
  const [FitUpto, setFitUpto] = useState("");
  const [PasiaModelCode, setPasiaModelCode] = useState("");
  const [VehiclePermanentAddress, setVehiclePermanentAddress] = useState("");
  const [RcRtoCode, setRcRtoCode] = useState("");
  const [VehicleInsuranceCompany, setVehicleInsuranceCompany] = useState("");
  const [VehicleSeatingCapacity, setVehicleSeatingCapacity] = useState("");
  const [RcInsuranceComp, setRcInsuranceComp] = useState("");
  const [RcInsuranceUpto, setRcInsuranceUpto] = useState("");
  const [RcVehicleType, setRcVehicleType] = useState("");
  const [VehicleRcStatus, setVehicleRcStatus] = useState("");
  const [VehicleBlackListStatus, setVehicleBlackListStatus] = useState("");
  const [VehicleRegistedAt, setVehicleRegistedAt] = useState("");
  const [PermanentAddress, setPermanentAddress] = useState("");
  const [ClassOfVehicle, setClassOfVehicle] = useState("");
  VehicleInsuranceUpto;

  //driver fetch details
  const [FatherName, setFatherName] = useState("");
  const [Gender, setGender] = useState("");
  const [BloodGroup, setBloodGroup] = useState("");
  const [Mobile, setMobile] = useState("");
  const [Address, setAddress] = useState("");
  const [RtoName, setRtoName] = useState("");
  const [ValidUpto, setValidUpto] = useState("");

  console.log("ValidUptoFROMINDEX", claim.driverDetails?.VaildUpto);
  const [DateOfBirth, setDateOfBirth] = useState("");
  const [DateOfIssue, setDateOfIssue] = useState("");
  const [Vov, setVov] = useState("");
  const [Pht, setPht] = useState("");
  const [Photo, setPhoto] = useState("");

  const [IsRcDetailsFetched, setIsRcDetailsFetched] = useState(1);
  const [IsDriverDetailsFetched, setIsDriverDetailsFetched] = useState(1);

  const statusOptions = [
    {
      id: 1,
      value: "Claim Appointment",
    },
    {
      id: 2,
      value: "Estimate Approval Pending",
    },
    {
      id: 3,
      value: "Vehicle Under repair",
    },
    {
      id: 4,
      value: "Invoice Approval Pending",
    },
    {
      id: 5,
      value: "Surveyor Report Pending",
    },
    {
      id: 6,
      value: "Hard Copies Pending",
    },
    {
      id: 7,
      value: "Soft Copy Completed",
    },
    {
      id: 8,
      value: "Payment Pending",
    },
    {
      id: 9,
      value: "Settled Cases",
    },
    {
      id: 10,
      value: "Withdrawl/Rejected",
    },
    {
      id: 11,
      value: "More Info Required",
    },
    {
      id: 12,
      value: "My Claims",
    },
  ];

  const subStatus = [
    {
      id: 1,
      value: "Withdrawl/Reject",
    },
    {
      id: 2,
      value: "More Info Required",
    },
    {
      id: 3,
      value: "More forward!",
    },
  ];

  useEffect(() => {
    // const oneYearLater = (policyStartDate);
    // oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    // oneYearLater.setMonth(oneYearLater.getMonth());
    // oneYearLater.setDate(oneYearLater.getDate() - 1);
    // const formattedOneYearLater = oneYearLater.toISOString().split("T")[0];
    // setPolicyEndDate(formattedOneYearLater);
  }, [policyStartDate]);


  useEffect(() => {
    setPolicyIssuingOffice(claim?.claimDetails?.PolicyIssuingOffice);
    setClaimRegion(claim?.claimDetails?.Region);
    setClaimServicingOffice(claim?.claimDetails?.ClaimServicingOffice);

    setPolicyStartDate(claim?.claimDetails?.PolicyPeriodStart);
    setPolicyEndDate(claim?.claimDetails?.PolicyPeriodEnd);

    setInsuranceCompanyNameAddress(
      claim?.claimDetails?.InsuranceCompanyNameAddress
    );
    setSubType(claim?.claimDetails?.SurveyType);
    setLicenseNumber(claim?.driverDetails?.LicenseNumber);
    setIssuingAuthority(claim?.driverDetails?.IssuingAuthority);
    setInsuredAddedBy(claim?.insuredDetails?.AddedBy);
    setVehicleRegisteredNumber(claim?.vehicleDetails?.RegisteredNumber || "");
    setInsuredName(claim?.insuredDetails?.InsuredName);
    setInsuredMailAddress(claim?.insuredDetails?.InsuredMailAddress);
    setInsuredMobileNo1(claim?.insuredDetails?.InsuredMobileNo1);
    setInsuredMobileNo2(claim?.insuredDetails?.InsuredMobileNo2);
    setSubType(claim?.claimDetails?.SurveyType);
    setInspectionType(claim?.claimDetails?.InspectionType);
    setVehicleModel(claim.vehicleDetails?.TypeOfBody);
    setEngineType(claim?.vehicleDetails?.ModeOfCheck);
    setVehicleRegisteredOwner(claim?.vehicleDetails?.RegisteredOwner);
    setDateRegistration(claim?.vehicleDetails?.DateOfRegistration);
    setPUCNumber(claim?.vehicleDetails?.PucNumber);
    setTransferDate(claim?.vehicleDetails?.TransferDate);
    setEngineNumber(claim?.vehicleDetails?.EngineNumber);
    setAddedBy(claim?.vehicleDetails?.AddedBy);
    setIssuingAuthority(claim?.driverDetails?.IssuingAuthority);
    setLicenseNumber(claim?.driverDetails?.LicenseNumber);
    setLicenseType(claim?.driverDetails?.LicenseType);
    setVehicleChassisNumber(claim?.vehicleDetails?.ChassisNumber);
    setVehicleFuelType(
      claim?.vehicleDetails?.FuelType || claim?.vehicleDetails?.BancsFuelType
    );

    setVehicleRegisteredOwner(claim.vehicleDetails?.RegisteredOwner);
    setDriverName(claim?.driverDetails?.DriverName);
    setDriverAddedDate(claim?.driverDetails?.AddedDate);
    setVerification(
      claim?.driverDetails?.TypeOfVerification === 0
        ? "Verified By Online"
        : "Verified Manually"
    );
    setGarageNameAndAddress(claim?.garageDetails?.GarageNameAndAddress);
    setGarageContactNo1(claim?.garageDetails?.GarageContactNo1);
    setGarageContactNo2(claim?.garageDetails?.GarageContactNo2);
    setGarageAddedBy(claim?.garageDetails?.AddedBy);

    // New Fields
    setVehicleClassDescription(claim?.vehicleDetails?.ClassDescription);
    setMakerDesc(claim?.vehicleDetails?.MakerDesc);
    setMakerModel(claim?.vehicleDetails?.MakerModel);
    setManufactureMonthYear(claim?.vehicleDetails?.ManufactureMonthYear);
    setVehicleGvw(claim?.vehicleDetails?.VehicleGvw);
    setCubicCapacity(claim?.vehicleDetails?.VehicleCubicCapacity);
    setBancsBodyType(claim?.vehicleDetails?.BancsBodyType);
    setBancsMakeCode(claim?.vehicleDetails?.BancsMakeCode);
    setBancsModelCode(claim?.vehicleDetails?.BancsModelCode);
    setBancsSubtypeCode(claim?.vehicleDetails?.BancsSubtypeCode);
    setBancsVehicleClass(claim?.vehicleDetails?.BancsVehicleClass);
    setBancsVehicleSegment(claim?.vehicleDetails?.BancsVehicleSegment);
    setFitUpto(claim?.vehicleDetails?.FitUpto);
    setPasiaModelCode(claim?.vehicleDetails?.PasiaModelCode);
    setVehiclePermanentAddress(claim?.vehicleDetails?.PermanentAddress);
    setRcRtoCode(claim?.vehicleDetails?.RcRtoCode);
    setVehicleInsuranceCompany(claim?.vehicleDetails?.VehicleInsuranceCompany);
    setVerification(
      claim?.driverDetails?.TypeOfVerification || "Verified By Online"
    );
    setVehicleSeatingCapacity(claim?.vehicleDetails?.SeatingCapacity);
    setRcInsuranceComp(claim?.vehicleDetails?.VehicleInsuranceCompany);
    setRcInsuranceUpto(claim?.vehicleDetails?.VehicleInsuranceUpto);
    setRcVehicleType(claim?.vehicleDetails?.VehicleType);
    setVehicleRcStatus(claim?.vehicleDetails?.VehicleRcStatus);
    setVehicleBlackListStatus(claim?.vehicleDetails?.VehicleBlackListStatus);
    setVehicleRegistedAt(claim?.vehicleDetails?.VehicleRegistedAt);
    setPermanentAddress(claim?.vehicleDetails?.PermanentAddress);
    setClassOfVehicle(claim?.vehicleDetails?.ClassOfVehicle);
    // getNextYear();

    //driver details fetched
    setFatherName(claim?.driverDetails?.FatherName);
    setGender(claim?.driverDetails?.Gender || "");
    setBloodGroup(claim?.driverDetails?.BloodGroup);
    setAddress(claim?.driverDetails?.Address);
    setRtoName(claim?.driverDetails?.RtoName);
    setVov(claim?.driverDetails?.Vov);
    setPht(claim?.driverDetails?.Pht);
    setPhoto(claim?.driverDetails?.Photo);
    setValidUpto(claim.driverDetails?.VaildUpto);

    setDateOfBirth(claim?.driverDetails?.DateOfBirth || "");
    setDateOfIssue(claim?.driverDetails?.DateOfIssue || "");

    setIsDriverDetailsFetched(claim?.claimDetails?.IsDriverDetailsFetched);
    setIsRcDetailsFetched(claim?.claimDetails?.IsRcDetailsFetched);
  }, [claim]);

  // console.log("datat ", VehicleInsuranceCompany);

  const generateRegion = (region) => {
    const firstThreeLetters = region?.slice(0, 3);

    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-indexed
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    const result = `${firstThreeLetters}/${mm}/${dd}${hh}${min}${ss}`;

    return result;
  };
  console.log("policyStartDate", policyStartDate);

  const [VehicleRegisteredNumber, setVehicleRegisteredNumber] = useState(
    claim?.VehicleRegisteredNumber ? claim?.VehicleRegisteredNumber : ""
  );

  const calculateTheUpdateType=(type)=>{
    if(String(type) === "1")
     return "updateClaimDetails";
    else if(String(type) === "2")
     return "updateVehicleDetails";
     else if(String(type) === "3")
     return "updateDriverDetails";
    return "updategarageDetails";
  }

  const [isClaimLoading,setIsClaimLoading]=useState(false)

  const onSaveHandler = (APItype,func,func2) => {

    const type = calculateTheUpdateType(APItype);

    console.log(insuranceCompanyNameAddress);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const vehicleParts = VehicleModel?.split(",");

    const region = JSON.parse(localStorage.getItem("regionType"));

    const payload = {
      InsuredName: InsuredName
        ? InsuredName
        : claim.insuredDetails?.InsuredName,
      InsuredMailAddress: InsuredMailAddress
        ? InsuredMailAddress
        : claim.insuredDetails?.InsuredMailAddress,
      InsuredMobileNo1: InsuredMobileNo1
        ? InsuredMobileNo1
        : claim.insuredDetails?.InsuredMobileNo1,
      PolicyIssuingOffice: policyIssuingOffice
        ? policyIssuingOffice
        : claim.claimDetails?.PolicyIssuingOffice,
      ClaimRegion: claimRegion ? claimRegion : claim.claimDetails?.ClaimRegion,
      ClaimServicingOffice: claimServicingOffice
        ? claimServicingOffice
        : claim.claimDetails?.ClaimServicingOffice,
      PolicyPeriodStart: policyStartDate,
      PolicyPeriodEnd: policyEndDate
        ? policyEndDate
        : claim?.claimDetails?.PolicyPeriodEnd,
      InsuranceCompanyNameAddress: insuranceCompanyNameAddress
        ? insuranceCompanyNameAddress
        : claim.claimDetails?.InsuranceCompanyNameAddress,
      InsuredAddedBy: insuredAddedBy
        ? insuredAddedBy
        : claim.claimDetails?.InsuredAddedBy,
      InsuredMobileNo2: InsuredMobileNo2
        ? InsuredMobileNo2
        : claim.insuredDetails?.InsuredMobileNo2,
      ClaimNumber: ClaimNumber ? ClaimNumber : claim.claimDetails?.ClaimNumber,
      VehicleTypeOfBody: VehicleModel
        ? VehicleModel
        : claim.claimDetails?.VehicleModel,
      SurveyType: subType ? subType : "Final",
      InspectionType: inspectionType ? inspectionType : "Motor",
      VehicleDateOfRegistration: DateRegistration,
      VehiclePucNumber: PUCNumber
        ? PUCNumber
        : claim.vehicleDetails?.VehiclePucNumber,
      VehicleTransferDate: TransferDate,
      VehicleEngineNumber: EngineNumber
        ? EngineNumber
        : claim.vehicleDetails?.VehicleEngineNumber,
      VehicleAddedBy: AddedBy ? AddedBy : claim.vehicleDetails?.VehicleAddedBy,
      IssuingAuthority: IssuingAuthority
        ? IssuingAuthority
        : claim.driverDetails?.IssuingAuthority,
      LicenseNumber: LicenseNumber
        ? LicenseNumber
        : claim.driverDetails?.LicenseNumber,
      LicenseType: LicenseType ? LicenseType : claim.driverDetails?.LicenseType,
      VehicleChassisNumber: VehicleChassisNumber
        ? VehicleChassisNumber
        : claim.vehicleDetails?.VehicleChassisNumber,
      VehicleFuelType: VehicleFuelType
        ? VehicleFuelType
        : claim.vehicleDetails?.VehicleFuelType,
      DriverName: DriverName ? DriverName : claim.driverDetails?.DriverName,
      DriverAddedDate: DriverAddedDate,
      DriverTypeOfVerification: Verification
        ? Verification
        : claim.driverDetails?.DriverTypeOfVerification,
      GarageNameAndAddress: GarageNameAndAddress
        ? GarageNameAndAddress
        : claim.garageDetails?.GarageNameAndAddress,
      GarageAddedBy: GarageAddedBy
        ? GarageAddedBy
        : claim.garageDetails?.GarageAddedBy,
      GarageContactNo1: GarageContactNo1
        ? GarageContactNo1
        : claim.garageDetails?.GarageContactNo1,
      GarageContactNo2: GarageContactNo2
        ? GarageContactNo2
        : claim.garageDetails?.GarageContactNo2,
      LeadId: claim.claimDetails?.LeadID,

      VehicleClassDescription,
      MakerDesc,
      MakerModel,
      VehicleGvw,
      CubicCapacity,
      VehicleSeatingCapacity,
      VehiclePermanentAddress,
      FitUpto: FitUpto !== "" ? FitUpto : claim?.vehicleDetails?.FitUpto,
      PasiaModelCode,
      RcInsuranceComp,
      RcInsuranceUpto,
      RcVehicleType,
      BancsModelCode,
      BancsMakeCode,
      BancsSubtypeCode,
      BancsBodyType,
      BancsVehicleClass,
      BancsVehicleSegment,
      RcRtoCode,
      VehicleRcStatus,
      VehicleBlackListStatus,
      VehicleRegistedAt,
      VehicleInsuranceCompany,
      ManufactureMonthYear,
      PermanentAddress,
      ClassOfVehicle,
      insuredAddedBy,
      VehicleRegisteredNumber,
      VehicleRegisteredOwner,

      FatherName,
      Gender,
      BloodGroup,
      Mobile,
      Address,
      RtoName,
      ValidUpto,
      Vov,
      Photo,
      Pht,
      DateOfBirth,
      ClassOfVehicle,
      DateOfIssue,
      SeatingCapacity: VehicleSeatingCapacity,
      IsDriverDetailsFetched,
      IsRcDetailsFetched,

      token: userInfo[0].Token,
    };

    axios
      .put("/api/updateClaimDetails", payload, {
        headers: {
          Authorization: `Bearer ${userInfo[0].Token}`,
          "Content-Type": "application/json",
        },
        params:{
          type:type
        }
      })
      .then((res) => {
        toast.success("Successfully fetched!");
        alert("Successfully Updated the Information !!");
      })
      .catch((err) => {
        console.log(err);
        alert("Caught into Error ! Try Again.");
      });
    if (func) {
      func(false);
    } else {
      setEditCase((prop) => !prop);
    }

    axios
      .get("/api/getSpecificClaim", {
        headers: {
          Authorization: `Bearer ${userInfo[0].Token}`,
          "Content-Type": "application/json",
        },
        params: {
          LeadId: leadId,
        },
      })
      .then((res) => {
        console.log(res.data.data);
        setClaim(res.data.data);
      })
      .catch((err) => {
        toast.error(err);
      });

    func(false);
    func2(false)

    // setEditCase((prop) => !prop);
    // window.location.reload();
  };

  const editHandler = (value) => {
    if (value === 1) {
      setEditCase((prop) => !prop);
    } else if (value === 2) {
      setEditCase_01((prop) => !prop);
    } else if (value === 3) {
      setEditCase_02((prop) => !prop);
    }
  };

  const subTypeTypes = [
    { id: 1, type: "Motor", value: "Motor" },
    { id: 1, type: "Non-Motor", value: "Non-Motor" },
    { id: 1, type: "Motor-2W", value: "Motor-2W" },
    { id: 1, type: "Motor-4W", value: "Motor-4W" },
  ];

  const requestTypeTypes = [
    { id: 1, type: "SPOT", value: "SPOT" },
    { id: 1, type: "Final", value: "Final" },
    { id: 1, type: "re-inspection", value: "re-inspection" },
  ];

  const [isStatusModal, setIsStatusModal] = useState(false);

  const [isLoading,setIsLoading]=useState(true);

  const handleStatusUpdateHandler = () => {};

  const router = useRouter();

  const closeStatusUpdateHandler = () => {
    setIsStatusModal(false);
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if(!userInfo){
      router.push("/login")
    }
    else{
    axios
      .get("/api/getSpecificClaim", {
        headers: {
          Authorization: `Bearer ${userInfo[0].Token}`,
          "Content-Type": "application/json",
        },
        params: {
          LeadId: leadId,
        },
      })
      .then((res) => {
        console.log(res.data.data);
        setClaim(res.data.data);
      })
      .catch((err) => {
        toast.error(err);
      });

    axios
      .get("/api/getDocumentList", {
        headers: {
          Authorization: `Bearer ${userInfo[0].Token}`,
          "Content-Type": "application/json",
        },
        params: {
          leadId: leadId,
        },
      })
      .then((res) => {
        console.log(res.data.data);
        const tempList = res.data.data;
        let requiredVideos = [];
        tempList.map((list, index) => {
          if (
            list.Attribute1.toLowerCase().includes(".mp4") ||
            list.Attribute1.toLowerCase().includes(".mp3")
          ) {
            requiredVideos.push({
              name: list.Attribute1,
              url: list.Photo1,
            });
          }
          if (
            list.Attribute2.toLowerCase().includes(".mp4") ||
            list.Attribute2.toLowerCase().includes(".mp3")
          ) {
            requiredVideos.push({
              name: list.Attribute2,
              url: list.Photo2,
            });
          }
          if (
            list.Attribute3.toLowerCase().includes(".mp4") ||
            list.Attribute3.toLowerCase().includes(".mp3")
          ) {
            requiredVideos.push({
              name: list.Attribute3,
              url: list.Photo3,
            });
          }
          if (
            list.Attribute4.toLowerCase().includes(".mp4") ||
            list.Attribute4.toLowerCase().includes(".mp3")
          ) {
            requiredVideos.push({
              name: list.Attribute4,
              url: list.Photo4,
            });
          }
          if (
            list.Attribute5.toLowerCase().includes(".mp4") ||
            list.Attribute5.toLowerCase().includes(".mp3")
          ) {
            requiredVideos.push({
              name: list.Attribute5,
              url: list.Photo5,
            });
          }
          if (
            list.Attribute6.toLowerCase().includes(".mp4") ||
            list.Attribute6.toLowerCase().includes(".mp3")
          ) {
            requiredVideos.push({
              name: list.Attribute6,
              url: list.Photo6,
            });
          }
        });
        setVideosList(requiredVideos);
        setDocuments(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("/api/getStatus", {
        headers: {
          Authorization: `Bearer ${userInfo[0].Token}`,
          "Content-Type": "application/json",
        },
        params: {
          leadId: leadId,
        },
      })
      .then((res) => {
        const temp = res.data.data;
        let selectiveStat = [];
        temp.map((stat, index) => {
          if (String(stat.LeadId) === String(leadId)) {
            selectiveStat.push(stat);
          }
        });
        setStatus(selectiveStat);
      })
      .catch((err) => {
        console.log(err);
      });
    }
     
  }, [leadId]);

  useEffect(()=>{
    setIsLoading(false);
  },[claim]);
  return (
    <>
      {/* <!-- Main Header Nav --> */}
      <Header region={claim ? claim?.claimDetails?.ClaimRegion : "N.A."} />

      {/* <!--  Mobile Menu --> */}
      <MobileMenu />

      <div className="dashboard_sidebar_menu">
        <div
          className="offcanvas offcanvas-dashboard offcanvas-start"
          tabIndex="-1"
          id="DashboardOffcanvasMenu"
          data-bs-scroll="true"
        >
          <SidebarMenu
            leadId={leadId}
            email={claim.insuredDetails?.InsuredMailAddress}
            policyNo={claim.claimDetails?.ClaimNumber}
            vehicleNo={claim.vehicleDetails?.VehicleEngineNumber}
            Insured={claim.insuredDetails?.InsuredName}
          />
        </div>
      </div>
      {/* End sidebar_menu */}

      {/* <!-- Our Dashbord --> */}
      <section
        className="our-dashbord dashbord bgc-f7 pb50"
        style={{ marginRight: "-10px" }}
      >
        <div className="container-fluid ovh">
          <div className="row">
            <div className="col-lg-12 maxw100flex-992">
              <div className="row">
                {/* Start Dashboard Navigation */}
                <div className="col-lg-12">
                  <div className="dashboard_navigationbar dn db-1024">
                    <div className="dropdown">
                      <button
                        className="dropbtn"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#DashboardOffcanvasMenu"
                        aria-controls="DashboardOffcanvasMenu"
                      >
                        <i className="fa fa-bars pr10"></i> Dashboard Navigation
                      </button>
                    </div>
                  </div>
                </div>
                {/* End Dashboard Navigation */}

                {/* <div className="col-lg-12 mb-2">
                  <div className="style2">
                    <button className="btn btn-color" onClick={editHandler}>
                      {edit ? "Save" : "Edit"}
                    </button>
                  </div>
                </div> */}
                {/* End .col */}

                { isLoading ?
                  <Loader/>
                  :claim.claimDetails?.InsuredName ? (
                  <div className="row">
                    <div
                      className="smartTable-noDataFound col-12"
                      style={{ marginTop: "110px", marginBottom: "40px" }}
                    >
                      <div className="ring">
                        Loading
                        <span className="load"></span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    <div className="col-lg-9">
                      <div className="">
                        <div className="my_dashboard_review mb-2">
                          <div className="col-lg-12">
                            <div className="row">
                              <div className="col-lg-2">
                                <h4 className="mt-2">CASE DETAILS</h4>
                              </div>
                              {editCase ? (
                                <div className="col-lg-2">
                                  {" "}
                                  <button
                                    className="btn-thm m-1"
                                    style={{}}
                                    onClick={() =>{
                                      setIsClaimLoading(true)
                                      onSaveHandler(1,setEditCase,setIsClaimLoading)
                                    }}
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={()=>setEditCase(false)}
                                    className="btn-thm flaticon-close"
                                    style={{ fontSize: "14px" }}
                                  ></button>
                                </div>
                              ) : (
                                 claim?.claimDetails?.PolicyNumber && <button
                                  className="col-lg-1 btn-thm m-1"
                                  style={{}}
                                  onClick={() => editHandler(1)}
                                >
                                  <span
                                    className="flaticon-edit"
                                    style={{ fontSize: "14px" }}
                                  ></span>
                                </button>
                              )}
                            </div>
                          </div>
                          <div
                            className=" bg-dark"
                            style={{
                              width: "100%",
                              height: "3px",
                              color: "blue",
                              border: "1px solid",
                              marginBottom: "5px",
                            }}
                          ></div>
                          {isClaimLoading ? 
                            <Loader/>
                            
                            :(!editCase ? (
                            <div className="col-lg-12">
                              <CreateList_02
                                claim={claim}
                                InsuredName={InsuredName}
                                VehicleRegisteredNumber={
                                  VehicleRegisteredNumber
                                }
                                subType={subType}
                                InsuredMobileNo1={InsuredMobileNo1}
                                ClaimNumber={ClaimNumber}
                                InsuredMailAddress={InsuredMailAddress}
                                requestType={inspectionType}
                              />
                            </div>
                          ) : (
                            <CreateList
                              claim={claim}
                              inspectionType={inspectionType}
                              setInspectionType={setInspectionType}
                              InsuredName={InsuredName}
                              setInsuredName={setInsuredName}
                              InsuredMailAddress={InsuredMailAddress}
                              setInsuredMailAddress={setInsuredMailAddress}
                              InsuredMobileNo1={InsuredMobileNo1}
                              setInsuredMobileNo1={setInsuredMobileNo1}
                              InsuredMobileNo2={InsuredMobileNo2}
                              setInsuredMobileNo2={setInsuredMobileNo2}
                              requestTypeTypes={requestTypeTypes}
                              subTypeTypes={subTypeTypes}
                              setRequestType={setInspectionType}
                              requestType={inspectionType}
                              setSubType={setSubType}
                              subType={subType}
                              ClaimNumber={ClaimNumber}
                              setClaimNumber={setClaimNumber}
                              edit={editCase}
                              setIsStatusModal={setIsStatusModal}
                              policyIssuingOffice={policyIssuingOffice}
                              setPolicyIssuingOffice={setPolicyIssuingOffice}
                              claimRegion={claimRegion}
                              setClaimRegion={setClaimRegion}
                              claimServicingOffice={claimServicingOffice}
                              setClaimServicingOffice={setClaimServicingOffice}
                              policyStartDate={policyStartDate}
                              setPolicyStartDate={setPolicyStartDate}
                              policyEndDate={policyEndDate}
                              setPolicyEndDate={setPolicyEndDate}
                              insuranceCompanyNameAddress={
                                insuranceCompanyNameAddress
                              }
                              setInsuranceCompanyNameAddress={
                                setInsuranceCompanyNameAddress
                              }
                              insuredAddedBy={insuredAddedBy}
                              setInsuredAddedBy={setInsuredAddedBy}
                              VehicleRegisteredNumber={VehicleRegisteredNumber}
                              setVehicleRegisteredNumber={
                                setVehicleRegisteredNumber
                              }
                            />)
                          )}
                        </div>
                        <div
                          className="row mt-2 mb-2"
                          style={{ marginLeft: "-15px" }}
                        >
                          <div className="col-lg-12">
                            <Video videos={videosList} />
                          </div>
                        </div>
                        {/* <div className="my_dashboard_review mb-2">
                        <div className="col-lg-12">
                          <div className="row">
                            <h4 className="">
                              Vehicle Details
                              {editCase_01 ? (
                                <button
                                  className="btn-thm m-1"
                                  style={{}}
                                  onClick={() => onSaveHandler()}
                                >
                                  Save
                                </button>
                              ) : (
                                <button
                                  className="btn-thm m-1"
                                  style={{}}
                                  onClick={() => editHandler(2)}
                                >
                                  <span
                                    className="flaticon-edit"
                                    style={{ fontSize: "14px" }}
                                  ></span>
                                </button>
                              )}
                            </h4>
                          </div>
                        </div>
                        <div
                          className=" bg-dark"
                          style={{
                            width: "100%",
                            height: "3px",
                            color: "blue",
                            border: "1px solid",
                            marginBottom: "5px",
                          }}9
                        ></div>
                        {!editCase_01 ? (
                          <div className="col-lg-12">
                            <CreateList_02
                              claim={claim}
                              InsuredName={InsuredName}
                              RegisteredNumber={RegisteredNumber}
                              subType={subType}
                              InsuredMobileNo1={InsuredMobileNo1}
                              ClaimNumber={ClaimNumber}
                              InsuredMailAddress={InsuredMailAddress}
                              requestType={requestType}
                            />
                          </div>
                        ) : (
                          <Form
                            claim={claim}
                            edit={editCase_01}
                            editHandler={editHandler}
                            VehicleModel={VehicleModel}
                            setVehicleModel={setVehicleModel}
                            RegisteredNumber={RegisteredNumber}
                            setRegisteredNumber={setRegisteredNumber}
                            setEngineType={setEngineType}
                            EngineType={EngineType}
                            RegisteredOwner={RegisteredOwner}
                            setRegisteredOwner={setRegisteredOwner}
                            DateRegistration={DateRegistration}
                            setDateRegistration={setDateRegistration}
                            PUCNumber={PUCNumber}
                            setPUCNumber={setPUCNumber}
                            TransferDate={TransferDate}
                            setTransferDate={setTransferDate}
                            EngineNumber={EngineNumber}
                            setEngineNumber={setEngineNumber}
                            AddedBy={AddedBy}
                            setAddedBy={setAddedBy}
                            IssuingAuthority={IssuingAuthority}
                            setIssuingAuthority={setIssuingAuthority}
                            LicenseNumber={LicenseNumber}
                            setLicenseNumber={setLicenseNumber}
                            LicenseType={LicenseType}
                            setLicenseType={setLicenseType}
                            VehicleChassisNumber={VehicleChassisNumber}
                            setVehicleChassisNumber={setVehicleChassisNumber}
                            VehicleFuelType={VehicleFuelType}
                            setVehicleFuelType={setVehicleFuelType}
                          />
                        )}
                      </div> */}
                        <div
                          className="row mt-2 mb-2"
                          style={{ marginLeft: "-15px" }}
                        >
                          <div className="col-lg-12">
                            {/* <h4 className="mb10">Case Details</h4> */}

                            {/* <div
                          className=" bg-dark"
                          style={{
                            width: "100%",
                            height: "3px",
                            color: "blue",
                            border: "1px solid",
                            marginBottom: "5px",
                          }}
                        ></div> */}
                            <Form
                              onSaveHandler={onSaveHandler}
                              claim={claim}
                              edit={editCase_01}
                              editHandler={editHandler}
                              VehicleModel={VehicleModel}
                              setVehicleModel={setVehicleModel}
                              setEngineType={setEngineType}
                              EngineType={EngineType}
                              VehicleRegisteredNumber={VehicleRegisteredNumber}
                              setVehicleRegisteredNumber={
                                setVehicleRegisteredNumber
                              }
                              VehicleRegisteredOwner={VehicleRegisteredOwner}
                              setVehicleRegisteredOwner={
                                setVehicleRegisteredOwner
                              }
                              DateRegistration={DateRegistration}
                              setDateRegistration={setDateRegistration}
                              PUCNumber={PUCNumber}
                              setPUCNumber={setPUCNumber}
                              TransferDate={TransferDate}
                              setTransferDate={setTransferDate}
                              EngineNumber={EngineNumber}
                              setEngineNumber={setEngineNumber}
                              AddedBy={AddedBy}
                              setAddedBy={setAddedBy}
                              IssuingAuthority={IssuingAuthority}
                              setIssuingAuthority={setIssuingAuthority}
                              LicenseNumber={LicenseNumber}
                              setLicenseNumber={setLicenseNumber}
                              LicenseType={LicenseType}
                              setLicenseType={setLicenseType}
                              VehicleChassisNumber={VehicleChassisNumber}
                              setVehicleChassisNumber={setVehicleChassisNumber}
                              VehicleFuelType={VehicleFuelType}
                              setVehicleFuelType={setVehicleFuelType}
                              // New Fields
                              setVehicleClassDescription={
                                setVehicleClassDescription
                              }
                              setMakerDesc={setMakerDesc}
                              setMakerModel={setMakerModel}
                              setVehicleGvw={setVehicleGvw}
                              setCubicCapacity={setCubicCapacity}
                              setVehicleSeatingCapacity={
                                setVehicleSeatingCapacity
                              }
                              setVehiclePermanentAddress={
                                setVehiclePermanentAddress
                              }
                              setFitUpto={setFitUpto}
                              setPasiaModelCode={setPasiaModelCode}
                              setRcInsuranceComp={setRcInsuranceComp}
                              setRcInsuranceUpto={setRcInsuranceUpto}
                              setRcVehicleType={setRcVehicleType}
                              setBancsModelCode={setBancsModelCode}
                              setBancsMakeCode={setBancsMakeCode}
                              setBancsSubtypeCode={setBancsSubtypeCode}
                              setBancsBodyType={setBancsBodyType}
                              setBancsVehicleClass={setBancsVehicleClass}
                              setBancsVehicleSegment={setBancsVehicleSegment}
                              setRcRtoCode={setRcRtoCode}
                              VehicleClassDescription={VehicleClassDescription}
                              MakerDesc={MakerDesc}
                              MakerModel={MakerModel}
                              ManufactureMonthYear={ManufactureMonthYear}
                              setManufactureMonthYear={setManufactureMonthYear}
                              VehicleGvw={VehicleGvw}
                              CubicCapacity={CubicCapacity}
                              VehicleSeatingCapacity={VehicleSeatingCapacity}
                              VehiclePermanentAddress={VehiclePermanentAddress}
                              FitUpto={FitUpto}
                              PasiaModelCode={PasiaModelCode}
                              RcInsuranceComp={RcInsuranceComp}
                              RcInsuranceUpto={RcInsuranceUpto}
                              RcVehicleType={RcVehicleType}
                              BancsModelCode={BancsModelCode}
                              BancsMakeCode={BancsMakeCode}
                              BancsSubtypeCode={BancsSubtypeCode}
                              BancsBodyType={BancsBodyType}
                              BancsVehicleClass={BancsVehicleClass}
                              BancsVehicleSegment={BancsVehicleSegment}
                              RcRtoCode={RcRtoCode}
                              setVehicleRcStatus={setVehicleRcStatus}
                              VehicleRcStatus={VehicleRcStatus}
                              VehicleBlackListStatus={VehicleBlackListStatus}
                              setVehicleBlackListStatus={
                                setVehicleBlackListStatus
                              }
                              setVehicleRegistedAt={setVehicleRegistedAt}
                              VehicleRegistedAt={VehicleRegistedAt}
                              setVehicleInsuranceCompany={
                                setVehicleInsuranceCompany
                              }
                              VehicleInsuranceCompany={VehicleInsuranceCompany}
                              PermanentAddress={PermanentAddress}
                              setPermanentAddress={setPermanentAddress}
                              ClassOfVehicle={ClassOfVehicle}
                              setClassOfVehicle={setClassOfVehicle}
                              VehicleInsuranceUpto={VehicleInsuranceUpto}
                              setVehicleInsuranceUpto={setVehicleInsuranceUpto}
                            />
                          </div>
                        </div>
                        <div
                          className="row mt-2"
                          style={{ marginLeft: "-15px" }}
                        >
                          <div className="col-lg-12">
                            {/* <h4 className="mb10">Case Details</h4> */}

                            {/* <div
                          className=" bg-dark"
                          style={{
                            width: "100%",
                            height: "3px",
                            color: "blue",
                            border: "1px solid",
                            mar`ginBottom: "5px",
                          }}
                        ></div> */}
                            <Form_01
                              onSaveHandler={onSaveHandler}
                              claim={claim}
                              edit={editCase_02}
                              LicenseNumber={LicenseNumber}
                              setLicenseNumber={setLicenseNumber}
                              LicenseType={LicenseType}
                              setLicenseType={setLicenseType}
                              IssuingAuthority={IssuingAuthority}
                              setIssuingAuthority={setIssuingAuthority}
                              editHandler={editHandler}
                              DriverName={DriverName}
                              setDriverName={setDriverName}
                              DriverAddedDate={DriverAddedDate}
                              setDriverAddedDate={setDriverAddedDate}
                              Verification={Verification}
                              setVerification={setVerification}
                              FatherName={FatherName}
                              setFatherName={setFatherName}
                              Gender={Gender}
                              setGender={setGender}
                              BloodGroup={BloodGroup}
                              setBloodGroup={setBloodGroup}
                              setAddress={setAddress}
                              Address={Address}
                              setRtoName={setRtoName}
                              RtoName={RtoName}
                              Mobile={Mobile}
                              setMobile={setMobile}
                              ValidUpto={ValidUpto}
                              setValidUpto={setValidUpto}
                              Vov={Vov}
                              setVov={setVov}
                              setPht={setPht}
                              Pht={Pht}
                              Photo={Photo}
                              setPhoto={setPhoto}
                              DateOfBirth={DateOfBirth}
                              setDateOfBirth={setDateOfBirth}
                              setDateOfIssue={setDateOfIssue}
                              DateOfIssue={DateOfIssue}
                              setIsDriverDetailsFetched={
                                setIsDriverDetailsFetched
                              }
                            />
                          </div>
                        </div>

                        <div
                          className="row mb-2"
                          style={{ marginLeft: "-15px" }}
                        >
                          {/* {editCase && */}
                          <div className="col-lg-12">
                            {/* <h4 className="mb10">Case Details</h4> */}

                            {/* <div
                          className=" bg-dark"
                          style={{
                            width: "100%",
                            height: "3px",
                            color: "blue",
                            border: "1px solid",
                            marginBottom: "5px",
                          }}
                        ></div> */}
                            <Form_02
                              onSaveHandler={onSaveHandler}
                              claim={claim}
                              editHandler={editHandler}
                              GarageNameAndAddress={GarageNameAndAddress}
                              setGarageNameAndAddress={setGarageNameAndAddress}
                              GarageContactNo1={GarageContactNo1}
                              setGarageContactNo1={setGarageContactNo1}
                              GarageContactNo2={GarageContactNo2}
                              setGarageContactNo2={setGarageContactNo2}
                              GarageAddedBy={GarageAddedBy}
                              setGarageAddedBy={setGarageAddedBy}
                            />
                          </div>
                        </div>

                        <div
                          className="row mb-2"
                          style={{ marginLeft: "-15px" }}
                        >
                          <div className="col-lg-12">
                            <EstimateList onSaveHandler={onSaveHandler} />
                          </div>
                        </div>

                        <div
                          className="row mb-2"
                          style={{ marginLeft: "-15px" }}
                        >
                          <div className="col-lg-12 text-center">
                            {/* <ErrorPageContent /> */}
                            <Exemple documents={documents} />
                          </div>
                        </div>
                        <div
                          className="row mb-2"
                          style={{ marginLeft: "-15px" }}
                        >
                          <div className="col-lg-12 text-center">
                            {/* <ErrorPageContent /> */}
                            <UploadReort leadId={leadId} />
                          </div>
                        </div>
                        <div
                          className="row mb-2"
                          style={{ marginLeft: "-15px" }}
                        >
                          <div className="col-lg-12 text-center">
                            {/* <ErrorPageContent /> */}
                            <PaymentDetails />
                          </div>
                        </div>
                        {/* <div className="row mb-2" style={{ marginLeft: "-15px" }}>
                        <div className="col-lg-12 text-center">
                          <ErrorPageContent />
                          <GarageDetails />
                        </div>
                      </div> */}
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="">
                        <div className="row" style={{ marginLeft: "0px" }}>
                          <div className="row mb-2 my_dashboard_review">
                            <div className="col-lg-12">
                              <h4 className="mb10">Status Log</h4>
                            </div>
                            <div
                              className=" bg-dark"
                              style={{
                                width: "100%",
                                height: "3px",
                                color: "blue",
                                border: "1px solid",
                                marginBottom: "5px",
                              }}
                            ></div>
                            <StatusLog
                              leadId={leadId}
                              status={status}
                              statusOptions={statusOptions}
                              subStatus={subStatus}
                              claim={claim}
                            />
                            {/* <CreateList /> */}
                          </div>
                          {/* <hr /> */}
                          <div className="row mt-2 mb-2 my_dashboard_review">
                            <div className="col-lg-12">
                              <h4 className="mb10">Comment Log</h4>
                            </div>
                            <div
                              className=" bg-dark"
                              style={{
                                width: "100%",
                                height: "3px",
                                color: "blue",
                                border: "1px solid",
                                marginBottom: "5px",
                              }}
                            ></div>
                            <ChatboxContent />
                          </div>
                          {/* <hr /> */}
                          <div className="row mt-2 my_dashboard_review">
                            <div className="col-lg-12">
                              <h4 className="mb10">Previous Year Policy</h4>
                            </div>
                            <div
                              className=" bg-dark"
                              style={{
                                width: "100%",
                                height: "3px",
                                color: "blue",
                                border: "1px solid",
                                marginBottom: "5px",
                              }}
                            ></div>
                          </div>

                          {isStatusModal && (
                            <div className="modal">
                              <div className="modal-content">
                                <h3 className="text-center">
                                  Broker Status Update
                                </h3>
                                <hr />
                                <div className="d-flex justify-content-center">
                                  <select
                                    className="form-select"
                                    data-live-search="true"
                                    data-width="100%"
                                    // value={buildinRef}
                                    // onChange={(e) => setBuildinRef(e.target.value)}
                                    // onChange={(e) => setBuildinRef(e.target.value)}
                                    // disabled={isDisable}
                                    style={{
                                      paddingTop: "10px",
                                      paddingBottom: "10px",
                                      backgroundColor: "#E8F0FE",
                                      width: "300px",
                                    }}
                                  >
                                    {/* {BrokerStatus.map((item, index) => {
                          return (
                            <option key={item.id} value={item.value}>
                              {item.type}
                            </option>
                          );
                        })} */}
                                  </select>
                                </div>
                                <hr />
                                {/* <p>Are you sure you want to delete the property: {property.area}?</p> */}
                                <div className="text-center" style={{}}>
                                  <button
                                    className="btn w-25 btn-color"
                                    onClick={closeStatusUpdateHandler}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    className="btn btn-color w-25"
                                    style={{ marginLeft: "12px" }}
                                    onClick={handleStatusUpdateHandler}
                                  >
                                    Submit
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* End .row */}

              <div className="row mt200">
                <div className="col-lg-12">
                  <div className="copyright-widget text-center">
                    {/* <p>© 2020 Find House. Made with love.</p> */}
                  </div>
                </div>
              </div>
              {/* End .row */}
            </div>
            {/* End .col */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
