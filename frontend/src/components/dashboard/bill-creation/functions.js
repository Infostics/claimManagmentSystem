const roundOff = (value) => {
  const roundedValue = parseFloat(value).toFixed();
  return roundedValue;
};

const calculateTotalAssessed = (allInfo, setAssessed, setEstimate) => {
  let total_assessed = 0,
    total_assessed2 = 0,
    total_estimate = 0,
    total_estimate2 = 0;
  const allNewParts = allInfo?.newPartsDetails;
  const allLabourer = allInfo?.labourDetails;

  allNewParts?.map((part, index) => {
    //assessed
    const assessed = part.NewPartsIsActive
      ? Number(part.NewPartsAssessed) * Number(part.QA)
      : 0;
    const depreciation =
      String(allInfo?.otherInfo[0]?.PolicyType) === "Regular"
        ? (Number(assessed) * Number(part.NewPartsDepreciationPct)) / 100
        : 0;

    const assessed_gst =
      String(part.NewPartsWithTax) === "1" ||
      String(part.NewPartsWithTax) === "3"
        ? (Number(assessed - depreciation) * Number(part.NewPartsGSTPct)) / 100
        : 0;
    const current_Assessed = assessed - depreciation + assessed_gst;
    total_assessed = total_assessed + current_Assessed;

    //estimate
    const current_Estimate = part.NewPartsIsActive
      ? Number(part.NewPartsEstimate) * Number(part.QE)
      : 0;
    const estimate_gst =
      String(part.NewPartsWithTax) === "1" ||
      String(part.NewPartsWithTax) === "2"
        ? (Number(current_Estimate) * Number(part.NewPartsGSTPct)) / 100
        : 0;
    const current_EstimateValue = current_Estimate + estimate_gst;

    total_estimate = total_estimate + current_EstimateValue;
  });

  allLabourer?.map((part, index) => {
    //assessed
    const assessed = part.LabourIsActive ? Number(part.Assessed) : 0;
    const depreciation_of_paint =
      String(part.JobType) === "1" &&
      String(allInfo?.otherInfo[0].PolicyType) === "Regular"
        ? (Number(assessed) * 12.5) / 100
        : 0;
    const assessed_gst =
      part.IsGSTIncluded % 2 !== 0
        ? (Number(assessed - depreciation_of_paint) *
            Number(part.GSTPercentage)) /
          100
        : 0;
    const current_Assessed = assessed - depreciation_of_paint + assessed_gst;
    total_assessed2 = total_assessed2 + current_Assessed;

    const current_Estimate = part.LabourIsActive ? Number(part.Estimate) : 0;
    const estimate_gst =
      part.IsGSTIncluded % 2 !== 0
        ? (Number(current_Estimate) * Number(part.GSTPercentage)) / 100
        : 0;
    const current_EstimateValue = current_Estimate + estimate_gst;

    total_estimate2 = total_estimate2 + current_EstimateValue;
  });

  const LessExcess = Number(allInfo?.SummaryDetails?.LessExcess);
  const lessImposed = Number(allInfo?.SummaryDetails?.LessImposed);

  const expectedSalvage = Number(allInfo?.SummaryDetails?.ExpectedSalvage);

  setAssessed(
    total_assessed +
      total_assessed2 -
      (lessImposed + LessExcess + expectedSalvage)
  );
  setEstimate(total_estimate2 + total_estimate);
};

const calculateProfessionalFees = (allInfo) => {
  let prof = 0;
  return String(allInfo?.otherInfo[0]?.VehicleType)
    .toLowerCase()
    .includes("4W".toLowerCase())
    ? 700
    : 500;
};

const addCommasToNumber = (number) => {
  if (Number(number) <= 100 || number === undefined) return number;
  return number.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

module.exports = {
  roundOff,
  calculateTotalAssessed,
  calculateProfessionalFees,
  addCommasToNumber,
};
