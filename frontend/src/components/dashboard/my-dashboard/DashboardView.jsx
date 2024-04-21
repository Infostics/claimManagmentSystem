import Link from "next/link";
import DashboardTableView from "./DashboardTableView";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

const headCells = [
  {
    id: "lead_id",
    numeric: false,
    label: "Lead Id",
    width: 100,
  },
  {
    id: "reference_id",
    numeric: false,
    label: "MT Reference ID",
    width: 100,
  },
  {
    id: "policy_holder",
    numeric: false,
    label: "Insured Name",
    width: 150,
  },
  {
    id: "policy_no",
    numeric: false,
    label: "Policy No.",
    width: 150,
  },
  {
    id: "region",
    numeric: false,
    label: "Region",
    width: 100,
  },
  {
    id: "added_date",
    numeric: false,
    label: "Date",
    width: 100,
  },
  {
    id: "assigned_garage",
    numeric: false,
    label: "Assigned Garage",
    width: 100,
  },
  {
    id: "case_age",
    numeric: false,
    label: "Garage Contact. No.",
    width: 150,
  },
  {
    id: "tat",
    numeric: false,
    label: "TAT(Days)",
    width: 150,
  },
  {
    id: "repairer_mail_id",
    numeric: false,
    label: "Repairer Mail Id",
    width: 150,
  },
  {
    id: "document",
    numeric: false,
    label: "Upload Document",
    width: 100,
  },
];

export default function DashboardView({
  claims,
  setMajorSearch,
  status,
  start,
  IsLoading,
  end,
}) {
  const [updatedData, setUpdatedData] = useState([]);

  const updatedFormatDate = (dateString) => {
    const isValidDate = (date) => {
      return (
        date !== null &&
        date !== undefined &&
        date !== "null" &&
        date !== "undefined"
      );
    };

    if (!isValidDate(dateString)) {
      return null;
    }

    const separator = dateString.includes("/") ? "/" : "-";
    const parts = dateString.split(separator);
    let formattedDate;

    if (parts.length === 3 && parts[0].length === 4) {
      // YYYY-MM-DD format
      const [year, month, day] = parts;
      formattedDate = `${day.padStart(2, "0")}-${month.padStart(
        2,
        "0"
      )}-${year}`;
    } else {
      // MM-DD-YYYY format
      const [month, day, year] = parts;
      formattedDate = `${day.padStart(2, "0")}-${month.padStart(
        2,
        "0"
      )}-${year}`;
    }

    return formattedDate;
  };

  const getValue = (leadId) => {
    let val = "";
    status.map((stat, index) => {
      if (String(stat.LeadId) === String(leadId)) {
        val = stat.Status;
      }
    });
    return val;
  };

  function convertToIST(utcTimestamp) {
    const utcDate = new Date(utcTimestamp);
    const istDate = new Date(
      utcDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    const formattedISTDateTime = istDate.toLocaleString("en-US", options);

    // Return the formatted IST date and time as a string
    return formattedISTDateTime;
  }

  const sortObjectsByOrderIdDescending = (data) => {
    return data.sort((a, b) => b.lead_id - a.lead_id);
  };

  let tempData = [];
  useEffect(() => {
    const region = JSON.parse(localStorage.getItem("regionType"));
    const today = new Date();
    claims?.map((claim, index) => {
      const tempValue = getValue(claim.LeadID);
      const addedDate = new Date(claim.AddedDate);
      const tatInDays = Math.floor((today - addedDate) / (1000 * 60 * 60 * 24));
      const tempGarage = claim?.AssignedGarage?.split(",").map((item) =>
        item.trim()
      );

      const updatedRow = {
        lead_id: claim.LeadID,
        reference_id: claim.ReferenceID,
        policy_holder: claim.PolicyHolder,
        policy_no: (
          <div
            style={{ textDecorationLine: "underline", color: "lightskyblue" }}
          >
            <a href={`/claim-details?leadId=${claim.LeadID}`}>
              {claim.PolicyNo}
            </a>
          </div>
        ),
        registration_no: claim.RegistrationNo,
        region: claim.Region,
        added_date: updatedFormatDate(convertToIST(claim.AddedDate)),
        city: tempGarage ? tempGarage[1] : "N.Aa",
        state: tempGarage ? tempGarage[2] : "N.A.",
        assigned_garage: tempGarage ? tempGarage[0] : "N.A.",
        case_age: "N.A.",
        tat: `${claim.TAT} days`,
        repairer_mail_id: claim.RepairerMailId ? claim.RepairerMailId : "N.A.",
        document:
          claim.IsDocumentUploaded > 0 ? (
            <span className="text-success" style={{ marginLeft: "40px" }}>
              <FaCheckCircle />
            </span>
          ) : (
            <span
              className="flaticon-close text-danger"
              style={{ marginLeft: "40px" }}
            ></span>
          ),
      };
      tempData.push(updatedRow);
    });
    setUpdatedData(tempData);
  }, [status, claims]);
  return (
    <DashboardTableView
      title="My Claims"
      data={sortObjectsByOrderIdDescending(updatedData)}
      start={start}
      end={end}
      IsLoading={IsLoading}
      headCells={headCells}
      setMajorSearch={setMajorSearch}
    />
  );
}
