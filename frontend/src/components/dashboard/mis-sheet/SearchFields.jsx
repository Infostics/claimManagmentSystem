import { useState } from "react";

const SearchFields = ({
  setSearchInput,
  setType,
  changeHandler,
  setStart,
  setEnd,
  allInsurer,
  reloadHandler,
  InsurerType,
  RegionType,
  setRegionType,
  setInsurerType,
  DateType,
  setDateType,
  changeInRegion,
  setChangeInRegion,
  start,
  end,
}) => {
  const [currentType, setCurrentType] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const handleInputChange = (value, type) => {
    setCurrentType(type);
    setSearchValue(value);
  };

  console.log("all_insurer", allInsurer);
  //console.log("InsurenceType",setInsurerType)

  const handleRegionType = (value) => {
    setRegionType(value);
    setChangeInRegion(true);
  };

  const searchHandler = ({}) => {
    setType(currentType);
    setSearchInput(searchValue);
  };

  console.log(InsurerType, setInsurerType);
  return (
    <>
      <div className="col-lg-12">
        <div className="row my_profile_setting_input form-group">
          <div className="col-lg-3">
            <div className="row">
              <div className="col-lg-12">
                <label htmlFor="" className="">
                  Insurer Name
                </label>
              </div>
              <div className="col-lg-12">
                <select
                  style={{ padding: "2px", marginTop: "" }}
                  className="selectpicker form-select"
                  data-live-search="true"
                  data-width="100%"
                  value={InsurerType}
                  onChange={(e) => setInsurerType(e.target.value)}
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

          <div className="col-lg-2">
            <div className="row">
              <div className="col-lg-12">
                <label htmlFor="" className="">
                  Type Of Date
                </label>
              </div>
              <div className="col-lg-12">
                <select
                  // style={{ padding: "2px", marginTop: "3px" }}
                  className="selectpicker form-select"
                  data-live-search="true"
                  data-width="100%"
                  value={DateType}
                  onChange={(e) => setDateType(e.target.value)}
                >
                  <option value={"intimation"}>Date Of Intimation </option>
                  <option value={"submit"}> Date Of Submit</option>
                </select>
              </div>
            </div>
          </div>
          <div className="col-lg-2">
            <div className="row">
              <div className="col-lg-12">
                <label htmlFor="" className="">
                  Region
                </label>
              </div>
              <div className="col-lg-12">
                <select
                  // style={{ padding: "2px", marginTop: "3px" }}
                  className="selectpicker form-select"
                  data-live-search="true"
                  data-width="100%"
                  value={RegionType}
                  onChange={(e) => handleRegionType(e.target.value)}
                >
                  <option value={"All"}>All</option>
                  <option value={"Delhi"}>Delhi</option>
                  <option value={"Chandigarh"}>Chandigarh</option>
                  <option value={"Jodhpur"}>Jodhpur</option>
                </select>
              </div>
            </div>
          </div>
          <div className="col-lg-2">
            <div className="row">
              <div className="col-lg-12">
                <label htmlFor="" className="">
                  From
                </label>
              </div>
              <div className="col-lg-12">
                <input
                  type="date"
                  className="form-control"
                  id="propertyTitle"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  placeholder="Enter Reference No."
                />
              </div>
            </div>
          </div>
          <div className="col-lg-2">
            <div className="row">
              <div className="col-lg-12">
                <label htmlFor="" className="">
                  To
                </label>
              </div>
              <div className="col-lg-12">
                <input
                  type="date"
                  className="form-control"
                  id="propertyTitle"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  placeholder="Enter Reference No."
                />
              </div>
            </div>
          </div>
          <div className="col-lg-1">
            <div className="my_profile_setting_input">
              <button
                className="btn float-end btn-color mt-0"
                onClick={reloadHandler}
              >
                Reload
              </button>
            </div>
            <div className="my_profile_setting_input">
              <button
                className="btn float-end btn-color mt-1"
                onClick={changeHandler}
              >
                Save
              </button>
            </div>
          </div>
          <div className="col-lg-1"></div>
        </div>
      </div>
      {/* End .col */}
    </>
  );
};

export default SearchFields;
