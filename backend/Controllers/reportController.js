const db = require("../Config/dbConfig");
const getAllInfo = async(req,res)=>{
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
      const labourDetails = await executeQuery(
        "CALL GetLabourReport(?)",
        [leadId]
      );
      const newPartsDetails = await executeQuery(
        "CALL GetNewPartsReport(?)",
        [leadId]
      );
      const otherInfo = await executeQuery(
        "CALL GetOtherTables(?)",
        [leadId]
      );
     
  
      const combinedResult = {
        labourDetails,
        newPartsDetails,
        otherInfo
      };
  
      console.log(combinedResult)
  
      res.json(combinedResult);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
}

module.exports={getAllInfo};