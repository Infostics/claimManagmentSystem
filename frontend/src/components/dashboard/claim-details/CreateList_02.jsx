import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

const CreateList_02 = ({
  claim,
  InsuredName,
  RegisteredNumber,
  subType,
  InsuredMobileNo1,
  ClaimNumber,
  InsuredMailAddress,
  requestType

}) => {

  const formatDate = (val) => {
    const date = new Date(val);
    const formattedDate = date.toLocaleDateString("en-GB");
    return formattedDate;
  };


  const statusOptions = [
    {
      id : 1,
      value : "Claim Appointment"
    },
    {
      id : 2,
      value : "Estimate Approval Pending"
    },
    {
      id : 3,
      value : "Vehicle Under repair"
    },
    {
      id : 4,
      value : "Invoice Approval Pending"
    },
    {
      id : 5,
      value : "Surveyor Report Pending"
    },
    {
      id : 6,
      value : "Hard Copies Pending"
    },
    {
      id : 7,
      value : "Soft Copy Completed"
    },
    {
      id : 8,
      value : "Payment Pending"
    },
    {
      id : 9,
      value : "Settled Cases"
    },
    {
      id : 10,
      value : "Withdrawl/Rejected"
    },
    {
      id : 11,
      value : "More Info Required"
    },
    {
      id : 12,
      value : "My Claims"
    },
  ]

  const checkStatus = (val)=>{
    let status = "";
    statusOptions.map((stat,index)=>{
      if(String(stat.id ) === String(val))
       status = stat.value;
    });
    return status;
  }
  
  return (
    <>
      <div className="col-lg-12 m-2">
        <div className="row">
          <div className="row">
            <table className="m-1" style={{ border: "1px solid grey" }}>
              <tr>
                <td style={{ border: "1px solid grey", padding: "3px" }}>
                  <div className="row">
                    <label
                      htmlFor=""
                      className="col-lg-4 text-color"
                      style={{
                        color: "black",
                        fontSize:"15px",
                        fontWeight:"bold",
                        marginRight: "50px",
                      }}
                    >
                      Name
                    </label>
                    <label
                      htmlFor=""
                      className="col-lg-6 text-color text-end"
                      style={{
                        color: "#1560bd",
                        fontSize:"15px",
                        fontWeight:"bold",
                      }}
                    >
                      {claim?.insuredDetails?.InsuredName}
                    </label>
                  </div>
                </td>
                <td style={{ border: "1px solid grey", padding: "3px" }}>
                  <div className="row">
                    <label
                      htmlFor=""
                      className="col-lg-4 text-color"
                      style={{
                        color: "black",
                        fontSize:"15px",
                        fontWeight:"bold",

                        marginRight: "50px",
                      }}
                    >
                      Phone
                    </label>
                    <label
                      htmlFor=""
                      className="col-lg-6 text-color text-end"
                      style={{
                        color: "#1560bd",
                        fontSize:"15px",
                        fontWeight:"bold",
                      }}
                    >
                      {claim?.insuredDetails?.InsuredMobileNo1}
                    </label>
                  </div>
                </td>
                <td style={{ border: "1px solid grey", padding: "3px" }}>
                  <div className="row">
                    <label
                      htmlFor=""
                      className="col-lg-2 text-color"
                      style={{
                        color: "black",
                        fontSize:"15px",
                        fontWeight:"bold",

                        marginRight: "50px",
                      }}
                    >
                      Email
                    </label>
                    <label
                      htmlFor=""
                      className="col-lg-6 text-color text-end"
                      style={{
                        color: "#1560bd",
                        fontSize:"15px",
                        fontWeight:"bold",
                      }}
                    >
                      {claim.insuredDetails?.InsuredMailAddress}
                    </label>
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ border: "1px solid grey", padding: "3px" }}>
                  <div className="row">
                    <label
                      htmlFor=""
                      className="col-lg-6 text-color"
                      style={{
                        color: "black",
                        fontSize:"15px",
                        fontWeight:"bold",

                        marginRight: "50px",
                      }}
                    >
                      Registration No.
                    </label>
                    <label
                      htmlFor=""
                      className="col-lg-4 text-color text-end"
                      style={{
                        color: "#1560bd",
                        fontSize:"15px",
                        fontWeight:"bold",
                      }}
                    >
                     {claim.claimDetails?.ReferenceNo}
                    </label>
                  </div>
                </td>
                <td style={{ border: "1px solid grey", padding: "3px" }}>
                  <div className="row">
                    <label
                      htmlFor=""
                      className="col-lg-5 text-color"
                      style={{
                        color: "black",
                        fontSize:"15px",
                        fontWeight:"bold",

                        marginRight: "50px",
                      }}
                    >
                      Insurer ClaimID
                    </label>
                    <label
                      htmlFor=""
                      className="col-lg-5 text-color text-end"
                      style={{
                        color: "#1560bd",
                        fontSize:"15px",
                        fontWeight:"bold",
                      }}
                    >
                      {claim.claimDetails?.ClaimNumber}
                    </label>
                  </div>
                </td>
                <td style={{ border: "1px solid grey", padding: "3px" }}>
                  <div className="row">
                    <label
                      htmlFor=""
                      className="col-lg-4 text-color"
                      style={{
                        color: "black",
                        fontSize:"15px",
                        fontWeight:"bold",

                        marginRight: "50px",
                      }}
                    >
                      Status
                    </label>
                    <label
                      htmlFor=""
                      className="col-lg-6 text-color text-end"
                      style={{
                        color: "#1560bd",
                        fontSize:"15px",
                        fontWeight:"bold",
                      }}
                    >
                      {checkStatus(claim?.claimStatus?.ClaimStatus)}
                    </label>
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ border: "1px solid grey", padding: "3px" }}>
                  <div className="row">
                    <label
                      htmlFor=""
                      className="col-lg-5 text-color"
                      style={{
                        color: "black",
                        fontSize:"15px",
                        fontWeight:"bold",
                        marginRight: "50px",
                      }}
                    >
                      Survey Type
                    </label>
                    <label
                      htmlFor=""
                      className="col-lg-5 text-color text-end"
                      style={{
                        color: "#1560bd",
                        fontSize:"15px",
                        fontWeight:"bold",
                      }}
                    >
                      {subType}
                    </label>
                  </div>
                </td>
                <td style={{ border: "1px solid grey", padding: "3px" }}>
                  <div className="row">
                    <label
                      htmlFor=""
                      className="col-lg-6 text-color"
                      style={{
                        color: "black",
                        fontSize:"15px",
                        fontWeight:"bold",

                        marginRight: "50px",
                      }}
                    >
                      Intimation Date
                    </label>
                    <label
                      htmlFor=""
                      className="col-lg-4 text-color text-end"
                      style={{
                        color: "#1560bd",
                        fontSize:"15px",
                        fontWeight:"bold",
                      }}
                    >
                      {formatDate(claim.claimDetails?.ClaimAddedDateTime)}
                    </label>
                  </div>
                </td>
                <td style={{ border: "1px solid grey", padding: "3px" }}>
                  <div className="row">
                    <label
                      htmlFor=""
                      className="col-lg-4 text-color"
                      style={{
                        color: "black",
                        fontSize:"15px",
                        fontWeight:"bold",

                        marginRight: "50px",
                      }}
                    >
                      Request Type
                    </label>
                    <label
                      htmlFor=""
                      className="col-lg-6 text-color text-end"
                      style={{
                        color: "#1560bd",
                        fontSize:"15px",
                        fontWeight:"bold",
                      }}
                    >
                      SPOT
                    </label>
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ border: "1px solid grey", padding: "3px" }}>
                  <div className="row">
                    <label
                      htmlFor=""
                      className="col-lg-6 text-color"
                      style={{
                        color: "black",
                        fontSize:"15px",
                        fontWeight:"bold",

                        marginRight: "50px",
                      }}
                    >
                      Endorsement Doc.
                    </label>
                    <label
                      htmlFor=""
                      className="col-lg-4 text-color text-end"
                      style={{
                        color: "#1560bd",
                        fontSize:"15px",
                        fontWeight:"bold",
                      }}
                    ></label>
                  </div>
                </td>
                <td style={{ border: "1px solid grey", padding: "3px" }}>
                  <div className="row">
                    <label
                      htmlFor=""
                      className="col-lg-4 text-color"
                      style={{
                        color: "black",
                        fontSize:"15px",
                        fontWeight:"bold",

                        marginRight: "50px",
                      }}
                    >
                      SPOC Name
                    </label>
                    <label
                      htmlFor=""
                      className="col-lg-6 text-color text-end"
                      style={{
                        color: "#1560bd",
                        fontSize:"15px",
                        fontWeight:"bold",
                      }}
                    >
                      Estimate Amount
                    </label>
                  </div>
                </td>
                <td style={{ border: "1px solid grey", padding: "3px" }}>
                  <div className="row">
                    <label
                      htmlFor=""
                      className="col-lg-4 text-color"
                      style={{
                        color: "black",
                        fontSize:"15px",
                        fontWeight:"bold",
                        marginRight: "50px",
                      }}
                    >
                      SPOC Name
                    </label>
                    <label
                      htmlFor=""
                      className="col-lg-6 text-color text-end"
                      style={{
                        color: "#1560bd",
                        fontSize:"15px",
                        fontWeight:"bold",
                      }}
                    >
                      Estimate Amount
                    </label>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateList_02;
