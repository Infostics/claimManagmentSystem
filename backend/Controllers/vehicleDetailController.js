const db = require("../Config/dbConfig");
const axios = require("axios");

 const getOnlineVehicleData = (req, res) => {

  const vehicleNo=req.query.vehicleNo;


    axios.get("https://api.apiseva.co.in/api/verification_pv2/rc_verify",{
      params:{
        apikey:process.env.API_KEY_VEHICLE_DETAIL,
        agent_code:process.env.AGENT_CODE,
        client_order_id:process.env.CLIENT_ORDER_ID,
        vehicle_number:vehicleNo
      }
    })
    .then((result)=>{
     
      return res.status(200).send(result.data);
    })
    .catch((Err)=>{
      return res.status(500).send("Internal Server Error");
    })
    // const responseData = {
    //   error_code: "SPC-200",
    //   message: "success",
    //   status: "Success",
    //   soft_ref_id: "SPRCV24012001234601797EOPBPB6B",
    //   vehicleDetails: {
    //     Validation: null,
    //     Service: null,
    //     UniqueTransID: "A7D9533E200120240123495732",
    //     Data: {
    //       id: "127f8472-8b05-45a6-aa41-368c99c9fcf2",
    //       env: 2,
    //       response_code: "101",
    //       response_msg: "Success",
    //       transaction_status: 0,
    //       result: {
    //         state_cd: "RJ",
    //         rc_regn_no: "RJ13CD0927",
    //         rc_regn_dt: "25-Feb-2020",
    //         rc_chasi_no: "MA3NYFB1SKM612415",
    //         rc_eng_no: "D13A-5883689",
    //         rc_vh_class_desc: "Motor Car(LMV)",
    //         rc_maker_desc: "MARUTI SUZUKI INDIA LTD",
    //         rc_maker_model: "MARUTI VITARA BREZZA ZDI",
    //         rc_manu_month_yr: "12/2019",
    //         rc_gvw: "1680",
    //         rc_cubic_cap: "1248.0",
    //         rc_seat_cap: "5",
    //         rc_owner_name: "MUTNEJA TECH INS SUR & LOSS ASS P L",
    //         rc_permanent_address: "58 , GANDHI NAGAR,, Ganganagar -335001",
    //         rc_fit_upto: "24-Feb-2035",
    //         rc_pasia_model_code: "ma0536",
    //         rc_insurance_comp: "National Insurance Co. Ltd.",
    //         rc_insurance_upto: "23-Feb-2024",
    //         rc_registered_at: "SRI GANGANAGAR DTO, Rajasthan",
    //         rc_blacklist_status: "NA",
    //         rc_status: "ACTIVE",
    //         rc_vehicle_type: "4W",
    //         bancs_model_code: "0928031",
    //         bancs_make_code: "0928",
    //         bancs_Subtype_code: "0928031015",
    //         bancs_Fuel_Type: "Diesel(D)",
    //         bancs_Body_Type: "SALOON",
    //         bancs_Vehicle_class: "22",
    //         bancs_Vehicle_Segment: null,
    //         rc_rto_code: null,
    //       },
    //       request_timestamp: "0001-01-01T00:00:00",
    //       response_timestamp: "0001-01-01T00:00:00",
    //       task_id: "6ccb3019-277f-410c-967b-5554c37bb8fe",
    //     },
    //     StatusCode: "0",
    //     ErrorMessage: "",
    //   },
    // };
  
    // // Extracting relevant information from the response
    // const {
    //   vehicleDetails: {
    //     Data: {
    //       result: {
    //         state_cd,
    //         rc_regn_no,
    //         rc_regn_dt,
    //         rc_chasi_no,
    //         rc_eng_no,
    //         rc_vh_class_desc,
    //         rc_maker_desc,
    //         rc_maker_model,
    //         rc_manu_month_yr,
    //         rc_gvw,
    //         rc_cubic_cap,
    //         rc_seat_cap,
    //         rc_owner_name,
    //         rc_permanent_address,
    //         rc_fit_upto,
    //         rc_pasia_model_code,
    //         rc_insurance_comp,
    //         rc_insurance_upto,
    //         rc_registered_at,
    //         rc_blacklist_status,
    //         rc_status,
    //         rc_vehicle_type,
    //         bancs_model_code,
    //         bancs_make_code,
    //         bancs_Subtype_code,
    //         bancs_Fuel_Type,
    //         bancs_Body_Type,
    //         bancs_Vehicle_class,
    //         bancs_Vehicle_Segment,
    //         rc_rto_code,
    //       },
    //     },
    //   },
    // } = responseData;
  
    // // Creating a new object with extracted information
    // const integratedData = {
    //   state_cd,
    //   rc_regn_no,
    //   rc_regn_dt,
    //   rc_chasi_no,
    //   rc_eng_no,
    //   rc_vh_class_desc,
    //   rc_maker_desc,
    //   rc_maker_model,
    //   rc_manu_month_yr,
    //   rc_gvw,
    //   rc_cubic_cap,
    //   rc_seat_cap,
    //   rc_owner_name,
    //   rc_permanent_address,
    //   rc_fit_upto,
    //   rc_pasia_model_code,
    //   rc_insurance_comp,
    //   rc_insurance_upto,
    //   rc_registered_at,
    //   rc_blacklist_status,
    //   rc_status,
    //   rc_vehicle_type,
    //   bancs_model_code,
    //   bancs_make_code,
    //   bancs_Subtype_code,
    //   bancs_Fuel_Type,
    //   bancs_Body_Type,
    //   bancs_Vehicle_class,
    //   bancs_Vehicle_Segment,
    //   rc_rto_code,
    // };
    // res.json(integratedData);
  };

  module.exports={getOnlineVehicleData}
  