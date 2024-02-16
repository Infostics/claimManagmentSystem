
const db = require("../Config/dbConfig");
const axios = require('axios');

const generateUniqueToken = require("../Config/generateToken");

const addClaim =  (req, res) => {
    const {
      SurveyType,
      ReferenceNo,
      PolicyIssuingOffice,
      PolicyNumber,
      PolicyPeriodStart,
      PolicyPeriodEnd,
      ClaimNumber,
      BrokerMailAddress,
      ClaimServicingOffice,
      AddedBy,
      Region,
      InspectionType,
      IsClaimCompleted,
      IsActive,
      InsuredName,
      InsuredMobileNo1,
      InsuredMobileNo2,
      InsuredMailAddress,
      InsuredAddress,
      GarageMailAddress,
      RegisteredNumber,
      GarageNameAndAddress,
      GarageContactNo1,
      GarageContactNo2,
      PlaceOfLoss,
      NatureOfLoss,
      EstimatedLoss,
    } = req.body;
  
    const authorizationHeader = req.headers.authorization;
  
    const token = authorizationHeader.substring("Bearer ".length);
  
    const generatedToken = generateUniqueToken();
    const insertClaimDetails = `
      INSERT INTO ClaimDetails (
        SurveyType,
        ReferenceNo,
        PolicyIssuingOffice,
        PolicyNumber,
        PolicyPeriodStart,
        PolicyPeriodEnd,
        ClaimNumber,
        ClaimServicingOffice,
        AddedBy,
        Region,
        InspectionType,
        IsClaimCompleted,
        BrokerMailAddress,
        Token,
        IsActive
      ) VALUES (
        '${SurveyType}',
        '${ReferenceNo}',
        '${PolicyIssuingOffice}',
        '${PolicyNumber}',
        ${PolicyPeriodStart},
        ${PolicyPeriodEnd},
        '${ClaimNumber}',
        '${ClaimServicingOffice}',
        '${parseInt(AddedBy)}',
        '${Region}',
        '${InspectionType}',
        '${parseInt(IsClaimCompleted)}',
        '${BrokerMailAddress}',
        '${generatedToken}',
        '${parseInt(IsActive)}'
      );
    `;
  
    db.query(insertClaimDetails, (error, results) => {
      if (error) {
        console.error("Error inserting data into ClaimDetails:", error);
        return res
          .status(500)
          .json({ error: "Error inserting data into ClaimDetails." });
      }
  
      db.query(
        "SELECT LeadId FROM ClaimDetails ORDER BY LeadId DESC LIMIT 1",
        (error, results) => {
          if (error) {
            console.error("Error inserting data into ClaimDetails:", error);
            return res
              .status(500)
              .json({ error: "Error inserting data into ClaimDetails." });
          }
          console.log(results);
          const addLeadId = results[0].LeadId;
  
          const insertVehicleDetails = `
      INSERT INTO VehicleDetails (
        RegisteredNumber,
        LeadId 
      ) VALUES (
        '${RegisteredNumber}',
        '${parseInt(results[0].LeadId)}'
      );
    `;
  
          const statusDetails = `
      INSERT INTO ClaimStatus (
        Status,
        SubStatus,
        LeadId 
      ) VALUES (
        '${1}',
        '${2}',
        '${parseInt(results[0].LeadId)}'
      );
    `;
  
          const insertGarageDetails = `
      INSERT INTO GarageDetails (
        GarageNameAndAddress,
        GarageContactNo1,
        GarageContactNo2,
        GarageMailAddress,
        LeadId 
      ) VALUES (
        '${GarageNameAndAddress}',
        '${GarageContactNo1}',
        '${GarageContactNo2}',
        '${GarageMailAddress}',
        '${parseInt(results[0].LeadId)}'
      );
    `;
  
          const insertAccidentDetails = `
      INSERT INTO AccidentDetails (
        PlaceOfLoss,
        NatureOfLoss,
        EstimatedLoss,
        LeadId
      ) VALUES (
        '${PlaceOfLoss}',
        '${NatureOfLoss}',
        '${EstimatedLoss}',
        '${parseInt(results[0].LeadId)}'
      );
    `;
  
          const insertDriverDetails = `
      INSERT INTO DriverDetails (
        LeadId
      ) VALUES (
        '${parseInt(results[0].LeadId)}'
      );
    `;
  
          const insertInsuredDetails = `
      INSERT INTO InsuredDetails (
        InsuredName,
        InsuredMobileNo1,
        InsuredMobileNo2,
        InsuredMailAddress,
        LeadId
      ) VALUES (
        '${InsuredName}',
        '${InsuredMobileNo1}',
        '${InsuredMobileNo2}',
        '${InsuredMailAddress}',
        '${parseInt(results[0].LeadId)}'
      );
    `;

   
          // Execute the SQL queries individually
  
          db.query(insertVehicleDetails, (error, results) => {
            if (error) {
              console.error("Error inserting data into VehicleDetails:", error);
              return res
                .status(500)
                .json({ error: "Error inserting data into VehicleDetails." });
            }
  
            db.query(insertGarageDetails, (error, results) => {
              if (error) {
                console.error("Error inserting data into GarageDetails:", error);
                return res
                  .status(500)
                  .json({ error: "Error inserting data into GarageDetails." });
              }
  
              db.query(insertAccidentDetails, (error, results) => {
                if (error) {
                  console.error(
                    "Error inserting data into AccidentDetails:",
                    error
                  );
                  return res.status(500).json({
                    error: "Error inserting data into AccidentDetails.",
                  });
                }
  
                db.query(insertInsuredDetails, (error, results) => {
                  if (error) {
                    console.error(
                      "Error inserting data into InsuredDetails:",
                      error
                    );
                    return res.status(500).json({
                      error: "Error inserting data into InsuredDetails.",
                    });
                  }
                  db.query(statusDetails, (error, results) => {
                    db.query(insertDriverDetails, (error, results) => {
                      if (error) {
                        console.error(
                          "Error inserting data into DriverDetails:",
                          error
                        );
                        return res.status(500).json({
                          error: "Error inserting data into InsuredDetails.",
                        });
                      }
  
                      if(InsuredMailAddress !== ""){
                      axios
                        .post(
                          `${process.env.BACKEND_DOMAIN}/email/sendEmail/1`,
                          {
                            vehicleNo: RegisteredNumber,
                            PolicyNo: ReferenceNo,
                            Insured: InsuredName,
                            toMail: InsuredMailAddress,
                            Date: new Date(),
                            leadId: addLeadId,
                          },
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                              "Content-Type": "application/json",
                            },
                          }
                        )
                        .then((ressss) => {
                         
                        })
                        .catch((Er) => {
                          return res.status(500).json({
                            error:
                              "Error sending email into Acknowldegment Mail.",
                          });
                        });
                      }
                        if (GarageMailAddress !== "") {
                          axios
                            .post(
                              `${process.env.BACKEND_DOMAIN}/email/sendEmail/2`,
                              {
                                vehicleNo: RegisteredNumber,
                                PolicyNo: ReferenceNo,
                                Insured: InsuredName,
                                toMail: GarageMailAddress,
                                Date: new Date(),
                              },
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                  "Content-Type": "application/json",
                                },
                              }
                            )
                            .then((ressss) => {
                             
                            })
                            .catch((Er) => {
                              return res.status(500).json({
                                error: "Error sending email into Garage Mail.",
                              });
                            });
                        }
                        if (BrokerMailAddress !== "") {
                          axios
                            .post(
                              `${process.env.BACKEND_DOMAIN}/email/sendEmail/3`,
                              {
                                toMail: BrokerMailAddress,
                                Date: new Date(),
                              },
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                  "Content-Type": "application/json",
                                },
                              }
                            )
                            .then((ressss) => {
                              
                            })
                            .catch((Er) => {
                              return res.status(500).json({
                                error:
                                  "Error sending email into Broker Mail.",
                              });
                            });
                        }
  
                      //garage
                      return res.status(200).json({
                        message: "Data inserted successfully.",
                      });
                      //broker
                    });
                  });
                });
              });
            });
          });
        }
      );
    });
  };
  

const getSpecificClaim = async (req, res) => {
    const leadId = req.query.LeadId;
  
    const executeQuery = (query, values) => {
      return new Promise((resolve, reject) => {
        db.query(query, values, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result[0]);
          }
        });
      });
    };
  
    try {
      const claimDetails = await executeQuery(
        "SELECT * FROM ClaimDetails WHERE LeadID=?",
        [leadId]
      );
      const insuredDetails = await executeQuery(
        "SELECT * FROM InsuredDetails WHERE LeadID=?",
        [leadId]
      );
      const accidentDetails = await executeQuery(
        "SELECT * FROM AccidentDetails WHERE LeadID=?",
        [leadId]
      );
      const driverDetails = await executeQuery(
        "SELECT * FROM DriverDetails WHERE LeadID=?",
        [leadId]
      );
      const vehicleDetails = await executeQuery(
        "SELECT * FROM VehicleDetails WHERE LeadID=?",
        [leadId]
      );
      const garageDetails = await executeQuery(
        "SELECT * FROM GarageDetails WHERE LeadID=?",
        [leadId]
      );
      const claimStatus = await executeQuery(
        "SELECT * FROM ClaimStatus WHERE LeadID=?",
        [leadId]
      );
  
      const commercialVehicleDetails = await executeQuery(
        "SELECT * FROM CommercialVehicleDetails WHERE LeadID=?",
        [leadId]
      );
  
      const combinedResult = {
        claimDetails,
        insuredDetails,
        accidentDetails,
        driverDetails,
        vehicleDetails,
        garageDetails,
        claimStatus,
        commercialVehicleDetails
      };
  
      console.log(combinedResult)
  
      res.json(combinedResult);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
 };


 const updateClaim = async(req, res) => {
    const leadId = req.params.leadId;
  
    const {
      InsuredName,
      InsuredMailAddress,
      InsuredMobileNo1,
      InsuredMobileNo2,
      ClaimNumber,
      PolicyIssuingOffice,
      ClaimRegion,
      ClaimServicingOffice,
      InspectionType,
      SurveyType,
      PolicyPeriodStart,
      PolicyPeriodEnd,
      InsuranceCompanyNameAddress,
      InsuredAddedBy,
      VehicleMakeVariantModelColor,
      VehicleTypeOfBody,
      VehicleRegisteredNumber,
      VehicleDateOfRegistration,
      VehiclePucNumber,
      VehicleRegisteredOwner,
      VehicleTransferDate,
      VehicleEngineNumber,
      VehicleAddedBy,
      IssuingAuthority,
      LicenseNumber,
      LicenseType,
      VehicleChassisNumber,
      VehicleFuelType,
      DriverName,
      DriverAddedDate,
      DriverTypeOfVerification,
      GarageNameAndAddress,
      GarageAddedBy,
      GarageContactNo1,
      GarageContactNo2,
      VehicleClassDescription,
      MakerDesc,
      MakerModel,
      ManufactureMonth,
      VehicleGvw,
      VehicleCubicCap,
      VehicleSeatingCapacity,
      VehiclePermanentAddress,
      FitUpto,
      PasiaModelCode,
      RcInsuranceComp,
      RcInsuranceUpto,
      RcRegisteredAt,
      RcBlacklistStatus,
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
      LeadId,
    } = req.body;
  
    const updateClaimDetails = `
    UPDATE ClaimDetails
    SET
    PolicyIssuingOffice = '${PolicyIssuingOffice}',
    Region = '${ClaimRegion}',
    ClaimServicingOffice = '${ClaimServicingOffice}',
    InspectionType = '${InspectionType}',
    SurveyType = '${SurveyType}',
    PolicyPeriodStart = CAST('${PolicyPeriodStart}' AS DATETIME),
    PolicyPeriodEnd = CAST('${PolicyPeriodEnd}' AS DATETIME),
    InsuranceCompanyNameAddress = '${InsuranceCompanyNameAddress}'
      WHERE LeadId = ${LeadId};
    `;

  
    // Update ClaimDetails
    const updateDriverDetails = `
      UPDATE DriverDetails
      SET
      IssuingAuthority = '${IssuingAuthority}',
      LicenseNumber = '${LicenseNumber}',
      LicenseType = '${LicenseType}',
      DriverName = '${DriverName}',
      AddedDate = CAST('${DriverAddedDate}' AS DATETIME),
      TypeOfVerification = '${DriverTypeOfVerification}'
        WHERE LeadId = ${LeadId};
    `;
  
    // Update VehicleDetails
    const updateVehicleDetails = `
      UPDATE VehicleDetails
      SET 
        RegisteredNumber = '${VehicleRegisteredNumber}',
        MakeVariantModelColor='${VehicleMakeVariantModelColor}',
        TypeOfBody='${VehicleTypeOfBody}',
        DateOfRegistration=CAST('${VehicleDateOfRegistration}' AS DATETIME),
        PucNumber='${VehiclePucNumber}',
        TransferDate=CAST('${VehicleTransferDate}' AS DATETIME),
        EngineNumber='${VehicleEngineNumber}',
        AddedBy='${VehicleAddedBy}',
        ChassisNumber='${VehicleChassisNumber}',
        FuelType='${VehicleFuelType}',
        MakerDesc='${MakerDesc}',
        MakerModel='${MakerModel}',
        CubicCapacity='${VehicleCubicCap}',
        FitUpto=CAST('${FitUpto}' AS DATETIME),
        PasiaModelCode='${PasiaModelCode}',
        VehicleType='${RcVehicleType}',
        BancsModelCode='${BancsModelCode}',
        BancsMakeCode='${BancsMakeCode}',
        BancsSubtypeCode='${BancsSubtypeCode}',
        BancsBodyType='${BancsBodyType}',
        BancsVehicleClass='${BancsVehicleClass}',
        BancsVehicleSegment='${BancsVehicleSegment}',
        RcRtoCode='${RcRtoCode}',
        VehicleRcStatus='${VehicleRcStatus}',
        VehicleBlackListStatus='${VehicleBlackListStatus}',
        VehicleRegistedAt='${VehicleRegistedAt}',
        VehicleInsuranceCompany='${VehicleInsuranceCompany}',
        ManufactureMonthYear='${ManufactureMonthYear}',
        PermanentAddress='${PermanentAddress}',
        ClassOfVehicle='${ClassOfVehicle}',
        RegisteredOwner='${VehicleRegisteredOwner}',
        VehicleInsuranceUpto=CAST('${RcInsuranceUpto}' AS DATETIME)
      WHERE LeadId = ${LeadId};
    `;
    // Update GarageDetails
    const updateGarageDetails = `
      UPDATE GarageDetails
      SET
        GarageNameAndAddress = '${GarageNameAndAddress}',
        GarageContactNo1 = '${GarageContactNo1}',
        GarageContactNo2 = '${GarageContactNo2 || ""}',
        AddedBy = '${GarageAddedBy}'
        WHERE LeadId = ${LeadId};
    `;
  
    // Update InsuredDetails
    const updateInsuredDetails = `
      UPDATE InsuredDetails
      SET
        InsuredName = '${InsuredName}',
        InsuredMobileNo1 = '${InsuredMobileNo1}',
        InsuredMobileNo2 = '${InsuredMobileNo2}',
        InsuredMailAddress = '${InsuredMailAddress}',
        AddedBy='${insuredAddedBy}'
      WHERE LeadId = ${LeadId};
    `;

  
    db.query(updateClaimDetails, (error, results) => {
      if (error) {
        console.error("Error updating data in ClaimDetails:", error);
        return res
          .status(500)
          .json({ error: "Error updating data in ClaimDetails." });
      }
  
      db.query(updateDriverDetails, (error, results) => {
        if (error) {
          console.error("Error updating data in ClaimDetails:", error);
          return res
            .status(500)
            .json({ error: "Error updating data in ClaimDetails." });
        }
  
        db.query(updateVehicleDetails, (error, results) => {
          if (error) {
            console.error("Error updating data in VehicleDetails:", error);
            return res
              .status(500)
              .json({ error: "Error updating data in VehicleDetails." });
          }
  
          db.query(updateGarageDetails, (error, results) => {
            if (error) {
              console.error("Error updating data in GarageDetails:", error);
              return res
                .status(500)
                .json({ error: "Error updating data in GarageDetails." });
            }
  
            db.query(updateInsuredDetails, (error, results) => {
              if (error) {
                console.error("Error updating data in InsuredDetails:", error);
                return res
                  .status(500)
                  .json({ error: "Error updating data in InsuredDetails." });
              }
  
              res.status(200).json({ message: "Data updated successfully." });
            });
          });
        });
      });
    });
  };


  const getAllClaims = (req, res) => {
    const region = req.query.region;
    const sql = "CALL GetPolicyInfoByRegion(?)";
    db.query(sql, [region], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.send(result);
    });
  };

  const getClaimDetails = (req, res) => {
    const { token, leadId } = req.body;
    const sql = "SELECT Token FROM ClaimDetails WHERE LeadId =?";
    db.query(sql, [leadId], (err, result2) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }
      if (result2[0]?.Token === token) {
        // console.log(result2[0].Token === token);
        res.status(200).send("Successfully found!!");
      } else {
        res.status(403).send("Forbidden Access!");
      }
    });
  };


//   app.get("/claim-details/:claimNo", authenticateUser, (req, res) => {
    //   const sql = "SELECT * FROM claim_details WHERE claim_no = ?";
    //   db.query(sql, [req.params.claimNo], (err, result) => {
    //     if (err) {
    //       console.error(err);
    //       res.status(500).send("Internal Server Error");
    //       return;
    //     }
    //     res.send(result);
    //   });
    // });


    // app.get("/vehicle-details/:claimNo", authenticateUser, (req, res) => {
    //     const sql = "SELECT * FROM vehicle_details WHERE claim_no = ?";
    //     db.query(sql, [req.params.claimNo], (err, result) => {
    //       if (err) {
    //         console.error(err);
    //         res.status(500).send("Internal Server Error");
    //         return;
    //       }
    //       res.send(result);
    //     });
    //   });
      
    //   app.get("/driver-details/:claimNo", authenticateUser, (req, res) => {
    //     const sql = "SELECT * FROM driver_details WHERE claim_no = ?";
    //     db.query(sql, [req.params.claimNo], (err, result) => {
    //       if (err) {
    //         console.error(err);
    //         res.status(500).send("Internal Server Error");
    //         return;
    //       }
    //       res.send(result);
    //     });
    //   });
      
      // Update
    //   app.put("/claim-details/:claimNo", authenticateUser, (req, res) => {
    //     const sql = "UPDATE claim_details SET ? WHERE claim_no = ?";
    //     db.query(sql, [req.body, req.params.claimNo], (err) => {
    //       if (err) {
    //         console.error(err);
    //         res.status(500).send("Internal Server Error");
    //         return;
    //       }
    //       res.send("Claim Details updated");
    //     });
    //   });
      
    //   app.put("/vehicle-details/:claimNo", authenticateUser, (req, res) => {
    //     const sql = "UPDATE vehicle_details SET ? WHERE claim_no = ?";
    //     db.query(sql, [req.body, req.params.claimNo], (err) => {
    //       if (err) {
    //         console.error(err);
    //         res.status(500).send("Internal Server Error");
    //         return;
    //       }
    //       res.send("Vehicle Details updated");
    //     });
    //   });
      
    //   app.put("/driver-details/:claimNo", authenticateUser, (req, res) => {
    //     const sql = "UPDATE driver_details SET ? WHERE claim_no = ?";
    //     db.query(sql, [req.body, req.params.claimNo], (err) => {
    //       if (err) {
    //         console.error(err);
    //         res.status(500).send("Internal Server Error");
    //         return;
    //       }
    //       res.send("Driver Details updated");
    //     });
    //   });


module.exports={addClaim,getSpecificClaim,updateClaim,getAllClaims,getClaimDetails}