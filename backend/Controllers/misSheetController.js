 
const db = require("../Config/dbConfig");


const getMISSheet = async (req, res) => {
    const startDate = req.query.startDate;
    const EndDate=req.query.EndDate;
    const DateType = req.query.DateType;

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

      const misSheetDetails = DateType === "intimation" ? await executeQuery(
        "CALL GetMisSheetByDateOfIntimation(?,?)",
        [startDate,EndDate]
      )
      : DateType === "submit" ? await executeQuery(
        "CALL GetMisSheetByDateOfIntimation(?,?)",
        [startDate,EndDate]
      )
      : await executeQuery(
        "CALL GetMisSheetByDateOfIntimation(?,?)",
        [startDate,EndDate]
      );
        
     
    
      const combinedResult = {
        misSheetDetails
      };

      res.json(combinedResult);
      res.status(200).send()
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
 };

  module.exports={getMISSheet};