import { useState } from "react";

const CreateList = ({ setSearchInput, setType, IsLoading }) => {
  const [currentType, setCurrentType] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const handleInputChange = (value, type) => {
    setCurrentType(type);
    setSearchValue(value);
  };

  const searchHandler = () => {
    setType(currentType);
    setSearchInput(searchValue);
  };
  return (
    <>
      <div className="col-lg-12">
        <div
          className="row my_profile_setting_input form-group"
          style={{ marginLeft: "-25px" }}
        >
          <div className="col-lg-3">
            <input
              type="text"
              className="form-control"
              id="propertyTitle"
              placeholder="Enter Policy No."
              disabled={IsLoading}
              onChange={(e) => handleInputChange(e.target.value, 1)}
            />
          </div>
          <div className="col-lg-3">
            <input
              type="text"
              className="form-control"
              id="propertyTitle"
              placeholder="Enter Registration No."
              disabled={IsLoading}
              onChange={(e) => handleInputChange(e.target.value, 1)}
            />
          </div>
          <div className="col-lg-3">
            <input
              type="text"
              className="form-control"
              id="propertyTitle"
              placeholder="Enter MT Reference ID"
              disabled={IsLoading}
              onChange={(e) => handleInputChange(e.target.value, 1)}
            />
          </div>
          <div className="col-lg-2">
            <input
              type="date"
              className="form-control"
              id="propertyTitle"
              placeholder="Enter Reference No."
            />
          </div>
          <div className="col-lg-1">
            <div className="my_profile_setting_input">
              <button
                disabled={IsLoading}
                className="btn float-end btn-color mt-0"
                onClick={searchHandler}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* End .col */}
    </>
  );
};

export default CreateList;
