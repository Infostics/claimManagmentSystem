import Link from "next/link";
import Form from "./Form";
import Image from "next/image";
import { Dropdown } from "react-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef, useState } from "react";

const ErrorPageContent = ({ allInfo }) => {
  const pdfRef = useRef();

  const downloadPDF = () => {
    const input = pdfRef.current;
    const pdf = new jsPDF("p", "mm", "a4", true);

    const generatePage = (pageNumber) => {
      return new Promise((resolve) => {
        html2canvas(input, {
          useCORS: true,
          scale: 2,
          logging: true,
          allowTaint: true,
        }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
          const imgX = (pdfWidth - imgWidth * ratio) / 2;
          const imgY = 30;

          pdf.addImage(
            imgData,
            "PNG",
            imgX,
            imgY,
            imgWidth * ratio,
            imgHeight * ratio
          );

          if (pageNumber < totalPages) {
            pdf.addPage(); // Add a new page for the next iteration
            resolve();
          } else {
            resolve(); // Resolve when all pages are generated
          }
        });
      });
    };

    const totalPages = 3;

    let currentPage = 1;

    const generateAllPages = () => {
      if (currentPage <= totalPages) {
        generatePage(currentPage).then(() => {
          currentPage++;
          generateAllPages(); // Recursively generate the next page
        });
      } else {
        pdf.save("invoice.pdf");
      }
    };

    generateAllPages();
  };

  //   const input = pdfRef.current;

  //   html2canvas(input).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4", true);
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = pdf.internal.pageSize.getHeight();
  //     const imgWidth = canvas.width;
  //     const imgHeight = canvas.height;
  //     const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  //     const imgX = (pdfWidth - imgWidth * ratio) / 2;
  //     const imgY = 30;

  //     pdf.addImage(
  //       imgData,
  //       "PNG",
  //       imgX,
  //       imgY,
  //       imgWidth * ratio,
  //       imgHeight * ratio
  //     );
  //     pdf.save("invoice.pdf");
  //   });
  // };

  const formatDate = (dateString) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    const dateParts = new Date(dateString)
      .toLocaleDateString("en-GB", options)
      .split("/");
    const formattedDate =
      dateParts[0] + "-" + dateParts[1] + "-" + dateParts[2];
    return formattedDate;
  };

  const formatDateTime = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    const formattedDate = new Date(dateString).toLocaleString("en-US", options);
    return formattedDate;
  };

  //*******************functions******************************//

  const calculateGlassDept = (part) => {
    const assessed = Number(part.NewPartsAssessed) * Number(part.QA);
    const Depreciation =
      (assessed * Number(part.NewPartsDepreciationPct)) / 100;
    if (
      String(part.NewPartsTypeOfMaterial === "Glass") &&
      part.NewPartsIsActive
    ) {
      return assessed;
    }
    return 0;
  };

  const calculateMetalDept = (part) => {
    const assessed = Number(part.NewPartsAssessed) * Number(part.QA);
    const Depreciation =
      (assessed * Number(part.NewPartsDepreciationPct)) / 100;
    if (
      String(part.NewPartsTypeOfMaterial === "Metal") &&
      part.NewPartsIsActive
    ) {
      return assessed;
    }
    return 0;
  };

  const calculateNonMetalDept = (part) => {
    const assessed = Number(part.NewPartsAssessed) * Number(part.QA);
    const Depreciation =
      (assessed * Number(part.NewPartsDepreciationPct)) / 100;
    if (
      String(
        part.NewPartsTypeOfMaterial !== "Glass" &&
          String(
            part.NewPartsTypeOfMaterial !== "Metal" && part.NewPartsIsActive
          )
      )
    ) {
      return assessed;
    }
    return 0;
  };

  const getTotalEstimate = () => {
    let total = 0;
    allInfo?.newPartsDetails.map((part, index) => {
      const assessed = Number(part.NewPartsEstimate) * Number(part.QE);
      total = total + part.NewPartsIsActive ? assessed : 0;
    });
    return total;
  };

  const getTotalGlassAssessed = () => {
    let total = 0;
    allInfo?.newPartsDetails.map((part, index) => {
      const assessed = Number(part.NewPartsAssessed) * Number(part.QA);

      if (
        String(part.NewPartsTypeOfMaterial) === "Glass" &&
        part.NewPartsIsActive
      ) {
        total = total + assessed;
      }
    });
    return total;
  };

  const getTotalMetalAssessed = () => {
    let total = 0;
    allInfo?.newPartsDetails.map((part, index) => {
      const assessed = Number(part.NewPartsAssessed) * Number(part.QA);
      const Depreciation =
        (assessed * Number(part.NewPartsDepreciationPct)) / 100;
      if (
        String(part.NewPartsTypeOfMaterial) === "Metal" &&
        part.NewPartsIsActive
      ) {
        total = total + assessed;
      }
    });
    return total;
  };

  function convertToReadable(timeStr) {
    try {
      // Split the time string into hours and minutes
      const [hours, minutes] = timeStr.split(":");

      // Convert hours and minutes to numbers
      const hour = parseInt(hours, 10);
      const minute = parseInt(minutes, 10);

      // Format the time in readable format
      const formattedHour = (hour % 12 || 12).toString().padStart(2, "0"); // Convert to 12-hour format
      const period = hour < 12 ? "AM" : "PM";
      const readableTime = `${formattedHour}:${minutes} ${period}`; // Example: 09:49 AM
      return readableTime;
    } catch (error) {
      return "Invalid time format. Please provide time in HH:MM format.";
    }
  }

  function addCommasToNumber(number) {
    if (Number(number) <= 100 || number === undefined) return number;
    return number.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function convertToBulletPointsAndParseHTML(text) {
    // Convert HTML tags to plain text
    const plainText = text.replace(/<[^>]*>?/gm, "");

    // Split the text into sentences
    const sentences = plainText
      .split(/\d+\./)
      .filter((sentence) => sentence.trim() !== "");

    // Convert sentences into bullet points
    const bulletPoints = sentences.map(
      (sentence) => `<li>${sentence.trim()}</li>`
    );

    // Join bullet points into an unordered list
    const bulletList = `<ul>${bulletPoints.join("")}</ul>`;

    return bulletList;
  }

  const getTotalOtherMetalAssesses = () => {
    let total = 0;
    allInfo?.newPartsDetails.map((part, index) => {
      const assessed = Number(part.NewPartsAssessed) * Number(part.QA);

      if (
        String(part.NewPartsTypeOfMaterial) !== "Glass" &&
        String(part.NewPartsTypeOfMaterial) !== "Metal" &&
        part.NewPartsIsActive
      ) {
        total = total + assessed;
      }
    });
    return total;
  };

  const getTotalDepreciation = (type, other) => {
    let total = 0;
    allInfo?.newPartsDetails?.map((part, index) => {
      const assessed = Number(part.NewPartsAssessed) * Number(part.QA);
      const Depreciation =
        (assessed * Number(part.NewPartsDepreciationPct)) / 100;

      if (
        String(part.NewPartsTypeOfMaterial) === String(type) &&
        part.NewPartsIsActive
      ) {
        total = total + Depreciation;
      }
    });
    return total;
  };

  const getTotalNonMetaDepreciation = () => {
    let total = 0;
    allInfo?.newPartsDetails?.map((part, index) => {
      const assessed = Number(part.NewPartsAssessed) * Number(part.QA);
      const Depreciation =
        (assessed * Number(part.NewPartsDepreciationPct)) / 100;
      if (
        String(part.NewPartsTypeOfMaterial) !== "Glass" &&
        String(part.NewPartsTypeOfMaterial) !== "Metal" &&
        part.NewPartsIsActive
      ) {
        total = total + Depreciation;
      }
    });
    return total;
  };

  const calculateTypeNewPartsGST = (type) => {
    let total = 0;
    allInfo?.newPartsDetails?.map((part, index) => {
      const assessed = Number(part.NewPartsAssessed) * Number(part.QA);
      const gst = (assessed * Number(part.NewPartsGSTPct)) / 100;

      if (
        String(part.NewPartsTypeOfMaterial) === String(type) &&
        part.NewPartsIsActive
      ) {
        total = total + gst;
      }
    });
    return total;
  };

  const calculateOtherTypeNewPartsGST = () => {
    let total = 0;
    allInfo?.newPartsDetails?.map((part, index) => {
      const assessed = Number(part.NewPartsAssessed) * Number(part.QA);
      const gst = (assessed * Number(part.NewPartsGSTPct)) / 100;

      if (
        String(part.NewPartsTypeOfMaterial) !== "Glass" &&
        String(part.NewPartsTypeOfMaterial) !== "Metal" &&
        part.NewPartsIsActive
      ) {
        total = total + gst;
      }
    });
    return total;
  };

  const calculateEstimateNewPartsGST = (type) => {
    let total = 0;
    allInfo?.newPartsDetails?.map((part, index) => {
      const assessed = Number(part.NewPartsEstimate) * Number(part.QE);
      const gst = (assessed * Number(part.NewPartsGSTPct)) / 100;

      total = total + part.NewPartsIsActive ? gst : 0;
    });
    return total;
  };

  const getTotalEvaluationOfAssessedForNewParts = () => {
    const glassValue =
      calculateTypeNewPartsGST("Glass") +
      getTotalGlassAssessed() -
      getTotalDepreciation("Glass", false);
    const metalValue =
      calculateTypeNewPartsGST("Metal") +
      getTotalMetalAssessed() -
      getTotalDepreciation("Metal", false);
    const nonMetalValue =
      calculateOtherTypeNewPartsGST() +
      getTotalOtherMetalAssesses() -
      getTotalNonMetaDepreciation();

    return glassValue + metalValue + nonMetalValue;
  };

  ///******************Labour *********************888*/

  const getTotalLabourEstimate = () => {
    let total = 0;
    allInfo?.labourDetails?.map((part, index) => {
      const estimate = Number(part.Estimate);

      if (part.LabourIsActive) {
        total = total + estimate;
      }
    });
    return total;
  };

  const getTotalLabourAssessed = () => {
    let total = 0;
    allInfo?.labourDetails?.map((part, index) => {
      const assessed = Number(part.Assessed);

      if (part.LabourIsActive) {
        total = total + assessed;
      }
    });
    return total;
  };

  const getTotalLabourEstimateGST = () => {
    let total = 0;
    allInfo?.labourDetails?.map((part, index) => {
      const estimate = Number(part.Estimate);

      const gst = (estimate * Number(part.GSTPercentage)) / 100;
      if (part.LabourIsActive) {
        total = total + gst;
      }
    });
    return total;
  };

  const getTotalLabourAssessedGST = () => {
    let total = 0;
    allInfo?.labourDetails?.map((part, index) => {
      const assessed = Number(part.Assessed);

      const gst = (assessed * Number(part.GSTPercentage)) / 100;
      if (part.LabourIsActive) {
        total = total + gst;
      }
    });
    return total;
  };

  //*************SUMMARY**************** *//

  const lessExcess = Number(allInfo?.summaryReport[0]?.LessExcess) || 0;
  const lessSalvage = Number(allInfo?.summaryReport[0]?.ExpectedSalvage) || 0;

  const getSummaryTotalWithLessExcess = () => {
    return (
      getTotalLabourAssessed() +
      getTotalLabourAssessedGST() +
      getTotalEvaluationOfAssessedForNewParts() +
      lessExcess
    );
  };

  function convertToProperHTML(htmlString) {
    // Create a new DOMParser
    const parser = new DOMParser();

    // Parse the HTML string
    const doc = parser.parseFromString(htmlString, "text/html");

    // Extract the text content from the parsed document
    const plainText = doc.body.textContent || "";

    return plainText;
  }

  const getSummaryTotalWithLessSalvage = () => {
    return (
      getTotalLabourAssessed() +
      getTotalLabourAssessedGST() +
      getTotalEvaluationOfAssessedForNewParts() +
      lessExcess +
      lessSalvage
    );
  };

  //********Value********* */

  const newPartsGST = () => {
    let gst = 0;
    allInfo?.newPartsDetails.map((part, index) => {
      gst = part.NewPartsGSTPct;
    });
    return gst;
  };

  const labourGST = () => {
    let gst = 0;
    allInfo?.labourDetails.map((part, index) => {
      gst = part.GSTPercentage;
    });
    return gst;
  };

  const roundOff = (number) => {
    return Math.round(number * 100) / 100;
  };

  function calculateAge() {
    
    const birthDate = (allInfo.otherInfo[0].DateOfBirth)
    if (!birthDate) {
      return "Invalid date";
    }
  
    // Split the birthDate string into day, month, and year components
  var dateComponents = birthDate?.split('/');
  var birthDay = parseInt(dateComponents[0]);
  var birthMonth = parseInt(dateComponents[1]);
  var birthYear = parseInt(dateComponents[2]);
  
  // Get the current date
  var currentDate = new Date();
  
  // Calculate the difference in years and months
  var yearsDiff = currentDate.getFullYear() - birthYear;
  var monthsDiff = currentDate.getMonth() - (birthMonth - 1);
  
  // Adjust years and months if the current month is before the birth month
  if (monthsDiff < 0 || (monthsDiff === 0 && currentDate.getDate() < birthDay)) {
    yearsDiff--;
    monthsDiff += 12;
  }
  
  // Construct the age string
  var ageString = yearsDiff + " years ";
  if (monthsDiff > 0) {
    ageString += monthsDiff + " months";
  }
  return ageString;
  }

  function numberToWords(number) {
    const units = [
      "",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
    ];
    const teens = [
      "",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
    ];
    const tens = [
      "",
      "ten",
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
    ];

    const convertLessThanThousand = (num) => {
      if (num === 0) {
        return "";
      }

      let result = "";

      if (num >= 100) {
        result += units[Math.floor(num / 100)] + " hundred ";
        num %= 100;
      }

      if (num >= 11 && num <= 19) {
        result += teens[num - 11];
      } else {
        result += tens[Math.floor(num / 10)];
        num %= 10;

        if (num > 0) {
          result += " " + units[num];
        }
      }

      return result;
    };

    const convert = (num) => {
      if (num === 0) {
        return "zero";
      }

      let result = "";

      if (num >= 1e9) {
        result += convertLessThanThousand(Math.floor(num / 1e9)) + " billion ";
        num %= 1e9;
      }

      if (num >= 1e6) {
        result += convertLessThanThousand(Math.floor(num / 1e6)) + " million ";
        num %= 1e6;
      }

      if (num >= 1e3) {
        result += convertLessThanThousand(Math.floor(num / 1e3)) + " thousand ";
        num %= 1e3;
      }

      result += convertLessThanThousand(num);

      return result.trim();
    };

    const roundedNumber = roundOff(number);

    const wholePart = Math.floor(roundedNumber);
    const decimalPart = Math.round((roundedNumber - wholePart) * 100);

    const wordsWholePart = convert(wholePart);
    const wordsDecimalPart = convert(decimalPart);

    return wordsWholePart + " Rupees and " + wordsDecimalPart + " paisa";
  }

  //*************************** */

  return (
    <div
      className="text-dark"
      style={{ width: "", color: "black", fontSize: "12px" }}
      ref={pdfRef}
    >
      {/* common header for all page */}
      {/* <div className="col-lg-12 d-flex justify-content-between">
        <div>
          <h5 >MT Engineer</h5>
        </div>
        <div>
          <span>MSL/HMH/2024/11/10043 - RJ31CA6796</span>
        </div>
      </div>
      <div style={{ border: "1px solid black" }} className="mb-2"></div> */}
      {/* common header for all page */}

      {/* Header Content */}
      {/* <div style={{ width: "", color: "black" }}>
        <h3 className="text-dark">MT Engineer</h3>{" "}
        <span>
          {" "}
          <div
            style={{ position: "absolute", top: "10px", right: "10px" }}
          ></div>
        </span>
        <p className="fw-bold text-dark">Legal Investigator Pvt. Ltd.</p>
        <p className="text-dark">
          69-Modal Town (1st), Behind U.I.T., Office, Sri Ganganagar -
          335001(Rajasthan )
        </p>
        <div className="d-flex gap-5 text-dark">
          {" "}
          <p className="text-dark">Tel. No. : +91 94688-81222</p>{" "}
          <p className="text-dark">Email: legalmt04@gmail.com</p>
        </div>
        <p className="text-dark">GSTIN : 08AAPCM1051K1Z9</p>
      </div> */}
      <div>
        <Image
          width={561}
          height={169}
          priority
          className="w50"
          src="/assets/images/header.jpg"
          alt="1.jpg"
        />
      </div>
      <hr style={{ border: "2px solid black" }} />
      {/* Header Content */}

      <div className="d-flex justify-content-between">
        <div>
          <label htmlFor="" className="fw-bold text-dark">
            Ref No. :
          </label>
          <span> {allInfo?.otherInfo[0]?.ReferenceNo}</span>
        </div>
        <div>
          <label htmlFor="" className="fw-bold text-dark">
            Date :{" "}
          </label>
          <span className="text-dark">
            {" "}
            {formatDate(allInfo?.otherInfo[0]?.AddedDateTime)}
          </span>
        </div>
      </div>
      <div className="text-center text-dark">
        <h4>
          {allInfo?.otherInfo[0]?.SurveyType}{" "}
          {allInfo?.otherInfo[0]?.InspectionType} SURVEY REPORT (
          {Number(allInfo?.summaryReport[0]?.CashLess) === 1
            ? "CASH LESS"
            : "NON CASHLESS"}
          )- (
          {allInfo?.otherInfo[0]?.PolicyType
            ? (allInfo?.otherInfo[0]?.PolicyType).toUpperCase()
            : "REGULAR"}
          )
        </h4>
      </div>
      <div>
        <p className="text-dark">
          This report is issued by me/us as a licensed Surveyor(s) without
          prejudice in respect of cause, nature and extent of loss/damages and
          subject to the terms and conditions of the insurance policy.
        </p>
      </div>
      <hr style={{ border: "2px solid black" }} />
      <div>
        <h5 className="text-dark">INSURANCE PARTICULARS :</h5>
        <div className=" text-start d-flex text-dark">
          <div className="d-flex gap-5">
            <label htmlFor="">(a) Policy / Cover Note No. </label>
            <span> : </span>
            <span className="fw-bold text-dark">
              {" "}
              {allInfo?.otherInfo[0]?.PolicyNumber}
            </span>
          </div>
          <div className="d-flex gap-4" style={{ marginLeft: "82px" }}>
            <div className="">
              <label htmlFor="">IDV</label>
            </div>
            <div>
              <span>:</span>
            </div>
            <span> ₹ {addCommasToNumber(allInfo?.otherInfo[0]?.IDV)}</span>
          </div>
        </div>
        <div className="d-flex gap-5">
          <div className="d-flex gap-4">
            <label htmlFor="">(b) Period of Insurance</label>
            <span style={{ marginLeft: "42px" }}> : </span>
            <span>
              {" "}
              {formatDate(allInfo?.otherInfo[0]?.PolicyPeriodStart)} to{" "}
              {formatDate(allInfo?.otherInfo[0]?.PolicyPeriodEnd)}
            </span>
          </div>
          <div className="d-flex gap-4" style={{ marginLeft: "20px" }}>
            <label htmlFor="">Claim No. </label>
            <span>:</span>
            <span> {allInfo?.otherInfo[0]?.ClaimNumber} </span>
          </div>
        </div>
        <div className="d-flex gap-5">
          <div className="d-flex gap-4">
            <label htmlFor="">(c) Endorsement </label>
            <span style={{ marginLeft: "74px" }}>:</span>
            <span> --</span>
          </div>
        </div>
        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-4">
            <label htmlFor="">(d) Insurers </label>
            <span style={{ marginLeft: "101px" }}>:</span>
            <span> {allInfo?.otherInfo[0]?.InsuranceCompanyNameAddress}</span>
          </div>
        </div>
        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-4">
            <label htmlFor="">(e) Insured </label>
            <span style={{ marginLeft: "105px" }}>:</span>
            <span>
              {" "}
              {allInfo?.otherInfo[0]?.InsuredName},{" "}
              {allInfo?.otherInfo[0]?.InsuredMobileNo1}, <br />
              {allInfo?.otherInfo[0]?.InsuredAddress}
            </span>
          </div>
        </div>
        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-4">
            <label htmlFor="">(f) H.P.A. </label>
            <span style={{ marginLeft: "112px" }}>:</span>
            <span>
              {" "}
              {allInfo?.otherInfo[0]?.HPA
                ? allInfo?.otherInfo[0]?.HPA
                : "-"}{" "}
            </span>
          </div>
        </div>
        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-4">
            <label htmlFor="">(g) Appointed By </label>
            <span style={{ marginLeft: "69px" }}>:</span>
            <span> {allInfo?.otherInfo[0]?.ClaimServicingOffice}</span>
          </div>
        </div>
      </div>
      <hr style={{ border: "2px solid black" }} />
      <div>
        <div className="d-flex gap-5">
          <h5 className="text-dark">VEHICLE PARTICULARS :</h5>
          <span style={{ marginLeft: "130px" }}>
            {allInfo?.otherInfo[0]?.Remark}
          </span>
        </div>
        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-5">
            <label htmlFor="">(a) Registered Number</label>
            <span style={{ marginLeft: "100px" }}>:</span>
            <span className="fw-bold text-dark">
              {" "}
              {allInfo?.otherInfo[0]?.RegisteredNumber}
            </span>
          </div>
        </div>
        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-5">
            <label htmlFor="">(b) Registered Owner </label>
            <span style={{ marginLeft: "106px" }}>:</span>
            <span> {allInfo?.otherInfo[0]?.RegisteredOwner}</span>
          </div>
        </div>

        {/* common header for all page */}
        {/* <div className="col-lg-12 d-flex justify-content-between mt-5">
          <div>
            <h5>MT Engineer</h5>
          </div>
          <div>
            <span>MSL/HMH/2024/11/10043 - RJ31CA6796</span>
          </div>
        </div>
        <div style={{ border: "1px solid black" }} className="mb-2"></div> */}
        {/* common header for all page */}

        <div className="text-start d-flex gap-5">
          <div className="d-flex gap-5">
            <label htmlFor="">Owner Serial No. / Transfer Date</label>
            <span style={{ marginLeft: "47px" }}>:</span>
            <span>
              {" "}
              {allInfo?.otherInfo[0]?.TransferDate
                ? formatDate(allInfo?.otherInfo[0]?.TransferDate)
                : "-"}
            </span>
          </div>
        </div>

        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-5">
            <label htmlFor="">(c) Date of Registration </label>
            <span style={{ marginLeft: "97px" }}>:</span>
            <span>
              {" "}
              {formatDate(allInfo?.otherInfo[0]?.DateOfRegistration)}
            </span>
          </div>
        </div>

        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-5">
            <label htmlFor="">(d) Chassis Number </label>
            <span style={{ marginLeft: "115px" }}>:</span>
            <span className="fw-bold text-dark">
              {" "}
              {allInfo?.otherInfo[0]?.ChassisNumber}
            </span>
          </div>
        </div>

        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-5">
            <label htmlFor="">(e) Engine Number </label>
            <span style={{ marginLeft: "120px" }}>:</span>
            <span className="fw-bold text-dark">
              {" "}
              {allInfo?.otherInfo[0]?.EngineNumber}
            </span>
          </div>
        </div>

        <div className=" text-start d-flex">
          <div className="text-start d-flex gap-5">
            <label htmlFor="">(f) Make / Variant/ Model /Color </label>
            <span style={{ marginLeft: "52px" }}>:</span>
            <span> {allInfo?.otherInfo[0]?.MakeVariantModelColor}</span>
          </div>
        </div>

        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-5">
            <label htmlFor="">(g) Type of Body and Class of vehicle</label>
            <span style={{ marginLeft: "23px" }}>:</span>
            <span>
              {" "}
              {allInfo?.otherInfo[0]?.TypeOfBody} (S) -{" "}
              {allInfo?.otherInfo[0]?.ClassOfVehicle}
            </span>
          </div>
        </div>

        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-5">
            <label htmlFor="">(h) Pre Accident Condition </label>
            <span style={{ marginLeft: "80px" }}>:</span>
            <span> {allInfo?.otherInfo[0]?.PreAccidentCondition}</span>
          </div>
        </div>

        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-5">
            <label htmlFor="">(k) Seating Capacity </label>
            <span style={{ marginLeft: "113px" }}>:</span>
            <span> {allInfo?.otherInfo[0]?.SeatingCapacity} Nos.</span>
          </div>
        </div>

        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-5">
            <label htmlFor="">(l) Cubic Capacity </label>
            <span style={{ marginLeft: "126px" }}>:</span>
            <span>{allInfo?.otherInfo[0]?.CubicCapacity} CC</span>
          </div>
          <div className="d-flex gap-5" style={{ marginLeft: "14px" }}>
            <label htmlFor=""> Fuel Used </label>
            <span style={{ marginLeft: "px" }}>:</span>
            <span>{allInfo?.otherInfo[0]?.FuelUsed}</span>
          </div>
        </div>

        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-5">
            <label htmlFor="">(m) Tax particulars </label>
            <span style={{ marginLeft: "120px" }}>:</span>
            <span> {formatDate(allInfo?.otherInfo[0]?.TaxParticulars)}</span>
          </div>
        </div>
      </div>
      <hr style={{ border: "2px solid black" }} />
      <div>
        <div className="d-flex gap-5">
          <h5 className="text-dark">DRIVER PARTICULARS :</h5>
          <span style={{ marginLeft: "135px" }}>
            {allInfo?.otherInfo[0]?.Remark}
          </span>
        </div>
        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-5">
            <label htmlFor="" className="text-dark">
              (a) Name of Driver
            </label>
            <span style={{ marginLeft: "102px" }}>:</span>
            <span className="fw-bold text-dark">
              {" "}
              {allInfo?.otherInfo[0]?.DriverName}
              {String(allInfo?.otherInfo[0]?.Gender) === "Female"
                ? ` D/o allInfo?.otherInfo[0].FatherName`
                : ` S/o ${allInfo?.otherInfo[0].FatherName}`}
            </span>
          </div>
        </div>
        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-5">
            <label htmlFor="">Age </label>
            <span style={{ marginLeft: "178px" }}>:</span>
            <span>
              {" "}
              {allInfo?.otherInfo?.DateOfBirth !== null
                ? calculateAge(allInfo?.otherInfo?.DateOfBirth)
                : "-"}{" "}
              old ({" "}
              {allInfo?.otherInfo[0]?.DateOfBirth
                ? formatDate(allInfo?.otherInfo[0]?.DateOfBirth)
                : ""}
              )
            </span>
          </div>
        </div>

        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-5">
            <label htmlFor="">(b) Motor Driver License Number </label>
            <span style={{ marginLeft: "25px" }}>:</span>
            <span className="fw-bold text-dark">
              {allInfo?.otherInfo[0]?.LicenseNumber}{" "}
            </span>
          </div>
        </div>

        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-5">
            <label htmlFor="">Date of Issue </label>
            <span style={{ marginLeft: "129px" }}>:</span>
            <span>
              {" "}
              {allInfo?.otherInfo[0]?.DateOfIssue
                ? formatDate(allInfo?.otherInfo[0]?.DateOfIssue)
                : "-"}
            </span>
          </div>
         
        </div>

        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-5">
            <label htmlFor="">Valid from </label>
            <span style={{ marginLeft: "144px" }}>:</span>
            <span>
              {" "}
              {allInfo?.otherInfo[0]?.ValidFrom !== "undefined"
                ? formatDate(allInfo?.otherInfo[0]?.ValidFrom)
                : "-"}
            </span>
          </div>
         
        </div>

        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-5">
            <label htmlFor="">(c) Issuing Authority </label>
            <span style={{ marginLeft: "92px" }}>:</span>
            <span> {allInfo?.otherInfo[0]?.IssuingAuthority}</span>
          </div>
        </div>

        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-5">
            <label htmlFor="">(d) Type of License </label>
            <span style={{ marginLeft: "99px" }}>:</span>
            <span>{allInfo?.otherInfo[0]?.LicenseType}</span>
          </div>
        </div>

        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-5">
            <label htmlFor="">(e) Badge Number </label>
            <span style={{ marginLeft: "100px" }}>:</span>
            <span> {allInfo?.otherInfo[0]?.BadgeNumber}</span>
          </div>
        </div>
      </div>
      <hr style={{ border: "2px solid black" }} />
      <div>
        <div className="d-flex gap-5">
          <h5 className="text-dark">ACCIDENT & SURVEY PARTICULARS :</h5>
        </div>
        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-5">
            <label htmlFor="">(a) Date & Time of Accident </label>
            <span style={{ marginLeft: "48px" }}>:</span>
            <span>
              {" "}
              {formatDate(allInfo?.otherInfo[0]?.DateOfAccident)},
              {convertToReadable(allInfo?.otherInfo[0]?.TimeOfAccident)}
            </span>
          </div>
        </div>
        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-5">
            <label htmlFor="">(b) Place of Accident </label>
            <span style={{ marginLeft: "85px" }}>:</span>
            <span> {allInfo?.otherInfo[0]?.PlaceOfLoss}</span>
          </div>
        </div>
        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-5">
            <label htmlFor="">(c) Place of Survey </label>
            <span style={{ marginLeft: "95px" }}>:</span>
            <span>{allInfo?.otherInfo[0]?.PlaceOfSurvey}</span>
          </div>
        </div>
        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-5">
            <label htmlFor="">(d) Date of Allotment of Survey </label>
            <span style={{ marginLeft: "26px" }}>:</span>
            <span>
              {" "}
              {allInfo?.otherInfo[0]?.SurveyAllotmentDate
                ? formatDate(allInfo?.otherInfo[0]?.SurveyAllotmentDate)
                : "--"}
            </span>
          </div>
        </div>

        {/* common header for all page */}
        {/* <div className="col-lg-12 d-flex justify-content-between">
          <div>
            <h5 className="text-dark">MT Engineer</h5>
          </div>
          <div>
            <span>MSL/HMH/2024/11/10043 - RJ31CA6796</span>
          </div>
        </div>
        <div style={{ border: "1px solid black" }} className="mb-2"></div> */}
        {/* common header for all page */}

        <div className=" text-start d-flex gap-5">
          <div className="d-flex gap-5">
            <label htmlFor="">(e) Date & Time of Survey </label>
            <span style={{ marginLeft: "57px" }}>:</span>
            <span>
              {" "}
              {allInfo?.otherInfo[0]?.SurveyConductedDate
                ? formatDate(allInfo?.otherInfo[0]?.SurveyConductedDate)
                : "-"}
            </span>
          </div>
        </div>
        <div className=" text-start d-flex gap-5" style={{ marginTop: "0px" }}>
          <div className="d-flex gap-5">
            <label htmlFor="">(f) Date of Receipt of Spot Survey Report</label>
            <span style={{ marginLeft: "10px" }}>:</span>
            <span> Not Conducted, As stated by the insured.</span>
          </div>
        </div>
      </div>
      <hr style={{ border: "2px solid black" }} />
      <div>
        <h5 className="text-dark">CAUSE & NATURE OF ACCIDENT :</h5>
        <span>
          As filled in the claim form and discussion with the Insured that on
          the day and time of accident{" "}
          <b>{allInfo?.otherInfo[0]?.InsuredName}</b> was driving the subject
          vehicle. &quot; {allInfo?.otherInfo[0]?.CauseOfAccident} , causing
          damages.
        </span>
        <hr style={{ border: "2px solid black" }} />
        <div className="d-flex gap-5">
          <span htmlFor="" className="text-dark fw-bold">
            POLICE ACTION
          </span>
          <span>:</span>
          <span> {allInfo?.otherInfo[0]?.PoliceAction}</span>
        </div>
        <hr style={{ border: "2px solid black" }} />
        <div className=" text-start d-flex gap-5">
          <span htmlFor="" className="text-dark fw-bold">
            DETAILS OF LOAD / PASSENGER
          </span>
          <span>:</span>
          <span> {allInfo?.otherInfo[0]?.DetailsOfLoads}</span>
        </div>
        <hr style={{ border: "2px solid black" }} />
        <div className=" text-start d-flex gap-5">
          <span htmlFor="" className="text-dark fw-bold">
            THIRD PARTY LOSS/ INJURIES
          </span>
          <span>:</span>
          <span> {allInfo?.otherInfo[0]?.ThirdPartyLoss}</span>
        </div>
        <hr style={{ border: "2px solid black" }} />
      </div>
      <div>
        <h5 className="text-dark">PARTICULARS OF LOSS/DAMAGES :</h5>
        <span className="">
          In accordance with the instructions received from{" "}
          <b>
            {allInfo?.otherInfo[0]?.InsuranceCompanyNameAddress}{" "}
            {allInfo?.otherInfo[0]?.HPA}- SGNR
          </b>{" "}
          dated <b>{formatDate(allInfo?.otherInfo[0]?.AddedDateTime)}</b> I
          visited <b>{allInfo?.otherInfo[0]?.InsuredName}</b> and inspected the
          subject vehicle, reported to have met with an accident on{" "}
          <b>{formatDate(allInfo?.otherInfo[0]?.AddedDateTime)}</b> Between{" "}
          {allInfo?.otherInfo[0]?.PlaceOfLoss} and snapped the vehicle from
          different angles before and after dismantling. <br />
          <br />
          <span className="">
            Loss was discussed with the repairer and finally settled as under
            subject to policy terms, conditions and approval of the Insurers
            keeping in view the cause & nature of accident and my physical
            inspection before and after dismantling.{" "}
          </span>
        </span>
      </div>
      <hr />
      <div className="">
        <span>
          <b>Observation : </b> Subject with good condition overall. No other
          damages except as mentioned above were observed over vehicle. Police
          report of accident not carried out by Insured.
        </span>
      </div>
      <br />

      <div className="">
        <h4 className="text-dark">New Parts :</h4>
        <table border={1}>
          <tr>
            <th
              rowSpan={2}
              style={{ border: "1px solid black", padding: "10px" }}
            >
              E. No.
            </th>
            <th
              rowSpan={2}
              style={{ border: "1px solid black", padding: "10px" }}
            >
              Parts Description
            </th>
            <th
              rowSpan={2}
              style={{ border: "1px solid black", padding: "10px" }}
            >
              HSN Code
            </th>
            <th
              rowSpan={2}
              style={{ border: "1px solid black", padding: "10px" }}
            >
              Bill S. No
            </th>
            <th
              rowSpan={2}
              style={{ border: "1px solid black", padding: "10px" }}
            >
              Remark
            </th>
            <th
              rowSpan={2}
              style={{ border: "1px solid black", padding: "10px" }}
            >
              Estimated
            </th>
            <th
              colSpan={3}
              style={{
                border: "1px solid black",
                padding: "10px",
                textAlign: "center",
              }}
            >
              Assessed
            </th>
            <th
              rowSpan={2}
              style={{ border: "1px solid black", padding: "10px" }}
            >
              GST
            </th>
          </tr>

          <tr>
            <th style={{ border: "1px solid black", padding: "10px" }}>
              Glass/ 2nd Hand/ Repair
            </th>
            <th style={{ border: "1px solid black", padding: "10px" }}>
              Metal (40)
            </th>
            <th style={{ border: "1px solid black", padding: "10px" }}>
              Non Metal
            </th>
          </tr>
          <tr>
            <th colSpan={2}>Parts with 28.00 % GST</th>
            <th style={{ border: "1px solid black", padding: "10px" }}></th>
            <th style={{ border: "1px solid black", padding: "10px" }}></th>
            <th style={{ border: "1px solid black", padding: "10px" }}></th>
            <th style={{ border: "1px solid black", padding: "10px" }}></th>
            <th style={{ border: "1px solid black", padding: "10px" }}></th>
            <th style={{ border: "1px solid black", padding: "10px" }}></th>
            <th style={{ border: "1px solid black", padding: "10px" }}></th>
          </tr>

          {allInfo?.newPartsDetails.map((part, index) => {
            return part.NewPartsIsActive === 1 ? (
              <tr>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  {part.NewPartsReportID}
                </td>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  {" "}
                  {part.NewPartsItemName}
                </td>
                <td style={{ border: "1px solid black", padding: "5px" }}></td>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  {part.NewPartsBillSr}
                </td>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  {part.NewPartsRemark}
                </td>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  {roundOff(part.NewPartsEstimate)}
                </td>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  {String(part.NewPartsTypeOfMaterial) === "Glass"
                    ? roundOff(calculateGlassDept(part))
                    : 0}
                </td>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  {String(part.NewPartsTypeOfMaterial) === "Metal"
                    ? roundOff(calculateMetalDept(part))
                    : 0}
                </td>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  {String(part.NewPartsTypeOfMaterial) !== "Metal" &&
                  String(part.NewPartsTypeOfMaterial) !== "Glass"
                    ? roundOff(calculateNonMetalDept(part))
                    : 0}
                </td>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  {" "}
                  {roundOff(part.NewPartsGSTPct)}.00
                </td>
              </tr>
            ) : null;
          })}
          {/*<tr>
            <td style={{ border: "1px solid black", padding: "5px" }}>1</td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {" "}
              Carriar assy-front end modul
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}></td>
            <td style={{ border: "1px solid black", padding: "5px" }}>671-1</td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              Damaged
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              6419.54
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}></td>
            <td style={{ border: "1px solid black", padding: "5px" }}></td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              6419.54
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {" "}
              28.00
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "5px" }}>1</td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {" "}
              Carriar assy-front end modul
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}></td>
            <td style={{ border: "1px solid black", padding: "5px" }}>671-1</td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              Damaged
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              6419.54
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}></td>
            <td style={{ border: "1px solid black", padding: "5px" }}></td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              6419.54
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {" "}
              28.00
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "5px" }}>1</td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {" "}
              Carriar assy-front end modul
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}></td>
            <td style={{ border: "1px solid black", padding: "5px" }}>671-1</td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              Damaged
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              6419.54
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}></td>
            <td style={{ border: "1px solid black", padding: "5px" }}></td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              6419.54
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {" "}
              28.00
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "5px" }}>1</td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {" "}
              Carriar assy-front end modul
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}></td>
            <td style={{ border: "1px solid black", padding: "5px" }}>671-1</td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              Damaged
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              6419.54
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}></td>
            <td style={{ border: "1px solid black", padding: "5px" }}></td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              6419.54
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {" "}
              28.00
            </td>
          </tr>
          <tr>
            <td
              rowSpan={3}
              style={{ border: "1px solid black", padding: "5px" }}
            ></td>
            <td
              colSpan={5}
              rowSpan={3}
              className="text-end"
              style={{ border: "1px solid black", padding: "5px" }}
            >
              Total :<br />
              GST @ 28.00 % :<br />
              Sub Total :
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>000</td>
            <td style={{ border: "1px solid black", padding: "5px" }}>000</td>
            <td style={{ border: "1px solid black", padding: "5px" }}>98977</td>
            <td style={{ border: "1px solid black", padding: "5px" }}></td>
        </tr>*/}
          <tr>
            <td style={{ border: "1px solid black", padding: "5px" }}>000</td>
            <td style={{ border: "1px solid black", padding: "5px" }}>000</td>
            <td style={{ border: "1px solid black", padding: "5px" }}>98977</td>
            <td style={{ border: "1px solid black", padding: "5px" }}></td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "5px" }}>000</td>
            <td style={{ border: "1px solid black", padding: "5px" }}>000</td>
            <td style={{ border: "1px solid black", padding: "5px" }}>98977</td>
            <td style={{ border: "1px solid black", padding: "5px" }}></td>
          </tr>
          <tr>
            <td
              colSpan={5}
              rowSpan={6}
              style={{ border: "1px solid black", padding: "5px" }}
              className="text-end"
            >
              Total : <br />
              Less: Depreciation : <br />
              Total : <br />
              Add : Applicable GST : <br />
              Net Total F :
              <br />
              Grand Total F : <br />
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {roundOff(getTotalEstimate())}
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {roundOff(getTotalGlassAssessed())}
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {roundOff(getTotalMetalAssessed())}
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {roundOff(getTotalOtherMetalAssesses())}
            </td>
            <td
              rowSpan={5}
              style={{ border: "1px solid black", padding: "5px" }}
            ></td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "5px" }}>----</td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {roundOff(getTotalDepreciation("Glass", false))}
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {roundOff(getTotalDepreciation("Metal", false))}
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {roundOff(getTotalNonMetaDepreciation())}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {roundOff(getTotalEstimate())}
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {roundOff(
                getTotalGlassAssessed() - getTotalDepreciation("Glass", false)
              )}
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {roundOff(
                getTotalMetalAssessed() - getTotalDepreciation("Metal", false)
              )}
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {roundOff(
                getTotalOtherMetalAssesses() - getTotalNonMetaDepreciation()
              )}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {roundOff(calculateEstimateNewPartsGST())}
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {roundOff(calculateTypeNewPartsGST("Glass"))}
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {roundOff(calculateTypeNewPartsGST("Metal"))}
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {roundOff(calculateOtherTypeNewPartsGST())}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {roundOff(getTotalEstimate() + calculateEstimateNewPartsGST())}
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {roundOff(
                calculateTypeNewPartsGST("Glass") +
                  getTotalGlassAssessed() -
                  getTotalDepreciation("Glass", false)
              )}
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {roundOff(
                calculateTypeNewPartsGST("Metal") +
                  getTotalMetalAssessed() -
                  getTotalDepreciation("Metal", false)
              )}
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {roundOff(
                calculateOtherTypeNewPartsGST() +
                  getTotalOtherMetalAssesses() -
                  getTotalNonMetaDepreciation()
              )}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {addCommasToNumber(
                roundOff(getTotalEstimate() + calculateEstimateNewPartsGST())
              )}
            </td>
            <td
              colSpan={3}
              style={{
                border: "1px solid black",
                padding: "5px",
                textAlign: "center",
              }}
            >
              {addCommasToNumber(
                roundOff(getTotalEvaluationOfAssessedForNewParts())
              )}
            </td>
          </tr>
        </table>
      </div>
      <br />
      <div className="" style={{ marginTop: "20px" }}>
        <h4 className="text-dark">LABOUR & REPAIRS :</h4>
        <table>
          <tr>
            <th style={{ border: "1px solid black", padding: "10px" }}>S.No</th>
            <th style={{ border: "1px solid black", padding: "10px" }}>SAC</th>
            <th style={{ border: "1px solid black", padding: "10px" }}>
              Bill S.No.
            </th>
            <th
              style={{
                border: "1px solid black",
                padding: "10px",
                textAlign: "center",
              }}
            >
              Labour Description
            </th>
            <th style={{ border: "1px solid black", padding: "10px" }}>
              Estimated
            </th>
            <th style={{ border: "1px solid black", padding: "10px" }}>
              Assessed
            </th>
          </tr>
          {allInfo?.labourDetails.map((labour, index) => {
            return labour.LabourIsActive === 1 ? (
              <tr>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  {index + 1}
                </td>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  {labour.SAC}
                </td>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  {labour.BillSr}
                </td>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  {labour.Description}
                </td>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  {roundOff(labour.Estimate)}
                </td>
                <td style={{ border: "1px solid black", padding: "5px" }}>
                  {roundOff(labour.Assessed)}
                </td>
              </tr>
            ) : null;
          })}
          {/*<tr>
            <td style={{ border: "1px solid black", padding: "5px" }}>1</td>
            <td style={{ border: "1px solid black", padding: "5px" }}></td>
            <td style={{ border: "1px solid black", padding: "5px" }}></td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              Ac Condenser Opening Fitting & Ac Charge (Condenser 2000.00 300.00
              Opening Fitting)
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>700</td>
            <td style={{ border: "1px solid black", padding: "5px" }}>300</td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "5px" }}>1</td>
            <td style={{ border: "1px solid black", padding: "5px" }}></td>
            <td style={{ border: "1px solid black", padding: "5px" }}></td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              Tie- Member Opening Fitting
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>700</td>
            <td style={{ border: "1px solid black", padding: "5px" }}>300</td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "5px" }}>1</td>
            <td style={{ border: "1px solid black", padding: "5px" }}></td>
            <td style={{ border: "1px solid black", padding: "5px" }}></td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              Bumper Opening Fitting
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>700</td>
            <td style={{ border: "1px solid black", padding: "5px" }}>300</td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "5px" }}>1</td>
            <td style={{ border: "1px solid black", padding: "5px" }}></td>
            <td style={{ border: "1px solid black", padding: "5px" }}></td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              Head Light Opening Fitting (Not Allowed)
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>700</td>
            <td style={{ border: "1px solid black", padding: "5px" }}>300</td>
              </tr>*/}
          <tr>
            <td
              rowSpan={3}
              style={{ border: "1px solid black", padding: "5px" }}
            ></td>
            <td
              colSpan={3}
              rowSpan={3}
              style={{
                border: "1px solid black",
                padding: "10px",
                textAlign: "end",
              }}
            >
              Sub Total Labour Charges : ₹ <br />
              Add : GST on ₹ 0.00 @ 18.00% : <br />
              Total Labour Charges : ₹
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {addCommasToNumber(roundOff(getTotalLabourEstimate()))}
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {addCommasToNumber(roundOff(getTotalLabourAssessed()))}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {addCommasToNumber(roundOff(getTotalLabourEstimateGST()))}
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {addCommasToNumber(roundOff(getTotalLabourAssessedGST()))}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {addCommasToNumber(
                roundOff(getTotalLabourEstimate() + getTotalLabourEstimateGST())
              )}
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {addCommasToNumber(
                roundOff(getTotalLabourAssessed() + getTotalLabourAssessedGST())
              )}
            </td>
          </tr>
        </table>
      </div>
      <div className="" style={{ marginTop: "20px" }}>
        <h4 className="text-dark">SUMMARY OF ASSESSMENT</h4>
        <table border={1} style={{ width: "100%" }}>
          <tr>
            <th
              style={{
                border: "1px solid black",
                paddingRight: "30px",
                paddingLeft: "20px",
              }}
            >
              PARTICULARS
            </th>
            <th
              style={{
                border: "1px solid black",
                paddingRight: "30px",
                paddingLeft: "20px",
              }}
            >
              ORIGINAL ESTIMATE
            </th>
            <th
              style={{
                border: "1px solid black",
                paddingRight: "30px",
                paddingLeft: "20px",
              }}
            >
              ASSESSED FOR
            </th>
          </tr>
          <tr>
            <td style={{ paddingRight: "30px", paddingLeft: "20px" }}>
              Total Labour Charges
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {addCommasToNumber(
                roundOff(getTotalLabourEstimate() + getTotalLabourEstimateGST())
              )}
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {addCommasToNumber(
                roundOff(getTotalLabourAssessed() + getTotalLabourAssessedGST())
              )}
            </td>
          </tr>
          <tr>
            <td style={{ paddingRight: "30px", paddingLeft: "20px" }}>
              Total Cost of Parts
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {addCommasToNumber(
                roundOff(getTotalEstimate() + calculateEstimateNewPartsGST())
              )}
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {addCommasToNumber(
                roundOff(getTotalEvaluationOfAssessedForNewParts())
              )}
            </td>
          </tr>
          <tr>
            <td
              colSpan={2}
              rowSpan={6}
              style={{
                border: "1px solid black",
                padding: "5px",
                textAlign: "end",
              }}
            >
              Total : <br />
              Less : Excess <br />
              Total : <br />
              Less : Salvage
            </td>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {addCommasToNumber(
                roundOff(
                  getTotalLabourAssessed() +
                    getTotalLabourAssessedGST() +
                    getTotalEvaluationOfAssessedForNewParts()
                )
              )}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {lessExcess}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {addCommasToNumber(roundOff(getSummaryTotalWithLessExcess()))}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "5px" }}>
              {lessSalvage}
            </td>
          </tr>
          <tr>
            <td>
              {addCommasToNumber(roundOff(getSummaryTotalWithLessSalvage()))}
            </td>
          </tr>
        </table>
      </div>
      <div className="" style={{ marginTop: "20px" }}>
        <h4 className="text-dark">GST Summary Tax Wise</h4>
        <table style={{ width: "100%" }}>
          <tr>
            <th
              style={{
                border: "1px solid black",
                paddingRight: "30px",
                paddingLeft: "20px",
              }}
            >
              Sr.No.
            </th>
            <th
              style={{
                border: "1px solid black",
                paddingRight: "30px",
                paddingLeft: "20px",
              }}
            >
              Tax Percentage
            </th>
            <th
              style={{
                border: "1px solid black",
                paddingRight: "30px",
                paddingLeft: "20px",
              }}
            >
              Actual Allowed
            </th>
            <th
              style={{
                border: "1px solid black",
                paddingRight: "30px",
                paddingLeft: "20px",
              }}
            >
              C GST
            </th>
            <th
              style={{
                border: "1px solid black",
                paddingRight: "30px",
                paddingLeft: "20px",
              }}
            >
              S GST
            </th>
            <th
              style={{
                border: "1px solid black",
                paddingRight: "30px",
                paddingLeft: "20px",
              }}
            >
              I GST
            </th>
            <th
              style={{
                border: "1px solid black",
                paddingRight: "30px",
                paddingLeft: "20px",
              }}
            >
              Total
            </th>
          </tr>
          <tr>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              1
            </td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              {addCommasToNumber(roundOff(newPartsGST()))}
            </td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              {addCommasToNumber(
                roundOff(
                  calculateOtherTypeNewPartsGST() +
                    getTotalOtherMetalAssesses() -
                    getTotalNonMetaDepreciation()
                )
              )}
            </td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              {addCommasToNumber(
                roundOff(
                  (calculateTypeNewPartsGST("Glass") +
                    calculateTypeNewPartsGST("Metal") +
                    calculateOtherTypeNewPartsGST()) /
                    2
                )
              )}
            </td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              {addCommasToNumber(
                roundOff(
                  (calculateTypeNewPartsGST("Glass") +
                    calculateTypeNewPartsGST("Metal") +
                    calculateOtherTypeNewPartsGST()) /
                    2
                )
              )}
            </td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              ----
            </td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              {addCommasToNumber(
                roundOff(
                  calculateTypeNewPartsGST("Glass") +
                    calculateTypeNewPartsGST("Metal") +
                    calculateOtherTypeNewPartsGST() +
                    calculateOtherTypeNewPartsGST() +
                    getTotalOtherMetalAssesses() -
                    getTotalNonMetaDepreciation()
                )
              )}
            </td>
          </tr>
          <tr>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            ></td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
                textAlign: "center",
              }}
            >
              Grand Total
            </td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              {addCommasToNumber(
                roundOff(
                  calculateOtherTypeNewPartsGST() +
                    getTotalOtherMetalAssesses() -
                    getTotalNonMetaDepreciation()
                )
              )}
            </td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              {addCommasToNumber(
                roundOff(
                  (calculateTypeNewPartsGST("Glass") +
                    calculateTypeNewPartsGST("Metal") +
                    calculateOtherTypeNewPartsGST()) /
                    2
                )
              )}
            </td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              {addCommasToNumber(
                roundOff(
                  (calculateTypeNewPartsGST("Glass") +
                    calculateTypeNewPartsGST("Metal") +
                    calculateOtherTypeNewPartsGST()) /
                    2
                )
              )}
            </td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              ---
            </td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              {addCommasToNumber(
                roundOff(
                  calculateTypeNewPartsGST("Glass") +
                    calculateTypeNewPartsGST("Metal") +
                    calculateOtherTypeNewPartsGST() +
                    calculateOtherTypeNewPartsGST() +
                    getTotalOtherMetalAssesses() -
                    getTotalNonMetaDepreciation()
                )
              )}
            </td>
          </tr>
          <tr>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            ></td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            ></td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              Total Tax
            </td>
            <td
              colSpan={3}
              style={{
                border: "1px solid black",
                paddingRight: "5px",
                textAlign: "center",
              }}
            >
              {addCommasToNumber(
                roundOff(
                  calculateTypeNewPartsGST("Glass") +
                    calculateTypeNewPartsGST("Metal") +
                    calculateOtherTypeNewPartsGST()
                )
              )}
            </td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            ></td>
          </tr>
        </table>
      </div>
      <div className="mt-2 mb-5">
        <table style={{ width: "100%" }}>
          <tr>
            <th
              style={{
                border: "1px solid black",
                paddingRight: "30px",
                paddingLeft: "20px",
              }}
            >
              Sr.No.
            </th>
            <th
              style={{
                border: "1px solid black",
                paddingRight: "30px",
                paddingLeft: "20px",
              }}
            >
              Service Acc. Code
            </th>
            <th
              style={{
                border: "1px solid black",
                paddingRight: "30px",
                paddingLeft: "20px",
              }}
            >
              GST %
            </th>
            <th
              style={{
                border: "1px solid black",
                paddingRight: "30px",
                paddingLeft: "20px",
              }}
            >
              Actual Allowed
            </th>
            <th
              style={{
                border: "1px solid black",
                paddingRight: "30px",
                paddingLeft: "20px",
              }}
            >
              C GST
            </th>
            <th
              style={{
                border: "1px solid black",
                paddingRight: "30px",
                paddingLeft: "20px",
              }}
            >
              S GST
            </th>
            <th
              style={{
                border: "1px solid black",
                paddingRight: "30px",
                paddingLeft: "20px",
              }}
            >
              I GST
            </th>
            <th
              style={{
                border: "1px solid black",
                paddingRight: "30px",
                paddingLeft: "20px",
              }}
            >
              Total
            </th>
          </tr>
          <tr>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              1
            </td>
            <td
              colSpan={2}
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              {addCommasToNumber(roundOff(labourGST()))}
            </td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              {addCommasToNumber(roundOff(getTotalLabourAssessed()))}
            </td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              {addCommasToNumber(roundOff(getTotalLabourAssessedGST() / 2))}
            </td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              {addCommasToNumber(roundOff(getTotalLabourAssessedGST() / 2))}
            </td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              0000
            </td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              {addCommasToNumber(
                roundOff(getTotalLabourAssessedGST() + getTotalLabourAssessed())
              )}
            </td>
          </tr>
          <tr>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            ></td>
            <td
              colSpan={2}
              style={{
                border: "1px solid black",
                paddingRight: "5px",
                textAlign: "center",
              }}
            >
              Grand Total
            </td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              {addCommasToNumber(roundOff(getTotalLabourAssessed()))}
            </td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              {addCommasToNumber(roundOff(getTotalLabourAssessedGST() / 2))}
            </td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              {addCommasToNumber(roundOff(getTotalLabourAssessedGST() / 2))}
            </td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              0000
            </td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              {addCommasToNumber(
                roundOff(getTotalLabourAssessedGST() + getTotalLabourAssessed())
              )}
            </td>
          </tr>
          <tr>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            ></td>
            <td
              colSpan={2}
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            ></td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            >
              Total Tax
            </td>
            <td
              colSpan={3}
              style={{
                border: "1px solid black",
                paddingRight: "5px",
                textAlign: "center",
              }}
            >
              {addCommasToNumber(roundOff(getTotalLabourAssessedGST()))}
            </td>
            <td
              style={{
                border: "1px solid black",
                paddingRight: "5px",
              }}
            ></td>
          </tr>
        </table>
      </div>

      <div>
        <span>
          Based on details provided above, the liability under the subject
          policy of insurance works out to{" "}
          <b>
            ₹ {addCommasToNumber(roundOff(getSummaryTotalWithLessSalvage()))}{" "}
            <br /> ({numberToWords(roundOff(getSummaryTotalWithLessSalvage()))}){" "}
          </b>{" "}
          The assessment of loss, as detailed above, is subject to the terms and
          conditions of the policy of insurance.
        </span>
      </div>
      <div>
        <h4 className="text-dark">Notes :</h4>
        <ul>
          {convertToProperHTML(allInfo?.summaryReport[0]?.SummaryNotes)}
          {/*<li>
            <h4>1. Vehicle Re-inspected by me & photogarphs of same .</h4>
          </li>
          <li>
            <h4>
              2. Parts & Labour allowed as per local market but note more than
              to authorize dealer.
            </h4>
          </li>
          <li>
            <h4>3 Bills of repairs/replacement checked by me & enclosed. </h4>
          </li>
          <li>
            <h4>
              4. The loss or damage or liability has arisen proximately caused
              by Insured peril{" "}
            </h4>
          </li>
          <li>
            <h4>
              5. None of the exclusions under Ins. policy has caused loss or
              damage or liability.
            </h4>
            </li>*/}
        </ul>

        <span className="text-dark">
          Thanking you and assuring you of my best services at all times,
        </span>
        <br />
        <br />
        <div
          className="d-flex justify-content-between"
          style={{ marginBottom: "" }}
        >
          <div>
            <span>
              Enclosures :{" "}
              {allInfo?.summaryReport[0]?.Endurance === undefined
                ? allInfo?.summaryReport[0]?.Endurance
                : "--"}
            </span>
          </div>
          <div className="text-end">
            <Image
              width={261}
              height={89}
              priority
              className="w50"
              src="/assets/images/stamp.jpg"
              alt="1.jpg"
            />
          </div>
        </div>
      </div>

      {/* common footer content */}
      {/* <hr style={{ border: "2px solid black" }} />
      <div className="text-dark">
        <h5 className="text-center text-dark">
          H.O. Address : 58-Gandhi Nagar,Near Bal Niketan School ,Sri
          Ganganagar(Raj.)-335001
        </h5>
        <h5 className="text-center text-dark">
          Ofce: B-43,NFL Society,Sector-PI,Gr Noida-201310./E-201,MAPSKO
          Mountville,Sector-79,Gurugram(Hr)
        </h5>
      </div> */}
      {/* common footer content */}
    </div>
  );
};

export default ErrorPageContent;
