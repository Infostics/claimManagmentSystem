import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import SVGArrowDown from "./icons/SVGArrowDown";
import SVGArrowUp from "./icons/SVGArrowUp";
import SVGChevronLeft from "./icons/SVGChevronLeft";
import SVGChevronRight from "./icons/SVGChevronRight";
import Loader from "../../common/Loader";

function DashboardTableView(props) {
  const [loading, setLoading] = useState(false);
  const [sortDesc, setSortDesc] = useState({});
  const [tableWidth, setTableWidth] = useState(1000);
  const [data, setData] = useState(props.data);

  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(props.rowsPerPage ?? 10);
  const [rowsPerPageOptions] = useState(
    props.rowsPerPageOptions ?? [5, 10, 25, 50]
  );
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(props.total ?? 0);

  const fetchData = useCallback(
    async (queryString) => {
      setLoading(true);

      try {
        const response = await fetch(
          props.url + (queryString ? queryString : ""),
          {
            method: "get",
          }
        );
        const data = await response.json();
        if (data && data.data) {
          setData(data.data.result ?? []);
          setTotal(data.data.total, 0);
        }
      } catch (e) {
      }
      setLoading(false);
    },
    [props.url]
  );

  const tableWidthFunc = useCallback(() => {
    let tempTableWidth = 0;
    props.headCells.map((cell) => (tempTableWidth += cell.width));

    if (tempTableWidth) setTableWidth(tempTableWidth);
  }, [props.headCells]);

  useEffect(() => {
    tableWidthFunc();
    if (props.url && !props.data)
      fetchData(`?limit=${props.rowsPerPage ?? 10}`);
  }, [
    props.url,
    props.data,
    props.rowsPerPage,
    props.headCells,
    tableWidthFunc,
    fetchData,
  ]);

  const buildQueryString = (search, page, rowsPerPage) => {
    const queries = [];

    if (page) queries.push(`page=${page}`);
    if (rowsPerPage) queries.push(`limit=${rowsPerPage}`);
    if (search) queries.push(`search=${search.toLowerCase()}`);

    const queryString = queries.join("&");

    return queryString ? `?${queryString}` : "";
  };

  const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  };

  const handleSearch = debounce((event) => {
    const { value } = event.target;
    setSearch(value);
    if (props.url) {
      fetchData(buildQueryString(value, page, rowsPerPage));
    } else {
      let bool = false;
      let tempData = props.data.filter((row) => {
        bool = false;
        Object.keys(row).forEach((key) => {
          if (row[key].toLowerCase().includes(value.toLowerCase())) bool = true;
        });
        return bool;
      });
      setData(tempData);
    }
  }, props.searchDebounceTime ?? 800);

  const sortData = (cell) => {
    let tempData = data.length > 0 ? [...data] : [...props.data];

    tempData.sort((a, b) => {
      const valueA =
        typeof a[cell] === "string" ? a[cell].toLowerCase() : a[cell];
      const valueB =
        typeof b[cell] === "string" ? b[cell].toLowerCase() : b[cell];

      if (sortDesc[cell]) {
        return valueA < valueB ? 1 : -1;
      } else {
        return valueA > valueB ? 1 : -1;
      }
    });
    setSortDesc({ [cell]: !sortDesc[cell] });

    setData(tempData);
  };

  return (
    <div className="col-12 p-2">
      <div className="smartTable-container row">
        <div className="col-12">
          {loading && (
            <div className="smartTable-loaderContainer text-primary">
              <div className="spinner-border" role="status"></div>
            </div>
          )}
          <div className="row">
            <div className="col-9 h3">{props.title}</div>
            <div className="col-lg-3">
              <input
                style={{ height: "40px" }}
                type="text"
                className="form-control"
                placeholder="Search..."
                disabled={props.IsLoading}
                onChange={(e) => props.setMajorSearch(e.target.value)}
              />
            </div>
          </div>
          {props.data.length > 0 ? (
            <div className="row mt-3">
              <div className="smartTable-tableContainer">
                <table
                  className={"smartTable-table table table-striped border"}
                  style={{ minWidth: tableWidth }}
                >
                  <thead className="smartTable-thead">
                    <tr>
                      {props.headCells.map((headCell) => {
                        return (
                          <th
                            id={headCell.id}
                            key={headCell.id}
                            scope="col"
                            style={{
                              width: headCell.width ?? "auto",
                              backgroundColor: "#2e008b",
                              color: "white",
                            }}
                            className={
                              headCell.sortable !== false
                                ? "smartTable-pointer"
                                : ""
                            }
                            onClick={() =>
                              headCell.sortable !== false
                                ? sortData(headCell.id)
                                : {}
                            }
                          >
                            {headCell.label}
                            {sortDesc[headCell.id] ? (
                              <SVGArrowDown />
                            ) : sortDesc[headCell.id] === undefined ? (
                              ""
                            ) : (
                              <SVGArrowUp />
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {props.IsLoading ? (
                      <Loader />
                    ) : data.length > 0 ? (
                      data.map((row, idx) => {
                        if (idx >= props.start && idx <= props.end) {
                          return (
                            <tr key={"tr_" + idx}>
                              {props.headCells.map((headCell, idxx) => {
                                return (
                                  <td key={"td_" + idx + "_" + idxx}>
                                    {headCell.render
                                      ? headCell.render(row)
                                      : row[headCell.id]}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        } else {
                          return null; // Skip rendering rows that don't meet the condition
                        }
                      })
                    ) : (
                      props.data.map((row, idx) => {
                        if (idx >= props.start && idx <= props.end) {
                          return (
                            <tr key={"tr_" + idx}>
                              {props.headCells.map((headCell, idxx) => {
                                return (
                                  <td key={"td_" + idx + "_" + idxx}>
                                    {headCell.render
                                      ? headCell.render(row)
                                      : row[headCell.id]}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        } else {
                          return null; // Skip rendering rows that don't meet the condition
                        }
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            // <div className="row">
            //   <div
            //     className="smartTable-noDataFound col-12"
            //     style={{ marginTop: "110px", marginBottom: "40px" }}
            //   >
            //     <div className="ring">
            //       Loading
            //       <span className="load"></span>
            //     </div>
            //   </div>
            // </div>
            <div className="row">
              <div className="row mt-3">
                <div className="smartTable-tableContainer">
                  <table
                    className={"smartTable-table table table-striped border"}
                    style={{ minWidth: tableWidth }}
                  >
                    <thead className="smartTable-thead">
                      <tr>
                        {props.headCells.map((headCell) => {
                          return (
                            <th
                              id={headCell.id}
                              key={headCell.id}
                              scope="col"
                              style={{
                                width: headCell.width ?? "auto",
                                backgroundColor: "#2e008b",
                                color: "white",
                              }}
                              className={
                                headCell.sortable !== false
                                  ? "smartTable-pointer"
                                  : ""
                              }
                              onClick={() =>
                                headCell.sortable !== false
                                  ? sortData(headCell.id)
                                  : {}
                              }
                            >
                              {headCell.label}
                              {sortDesc[headCell.id] ? (
                                <SVGArrowDown />
                              ) : sortDesc[headCell.id] === undefined ? (
                                ""
                              ) : (
                                <SVGArrowUp />
                              )}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>
              <div className="col-lg-12 text-center mt-5">
                <h4>NO DATA FOUND</h4>
              </div>
            </div>
          )}
          {props.noPagination || data.length === 0 || !props.url ? (
            <div className="row">
              {/* <div className="col-12 text-end p-3">
                {props.data.length > 0 ? props.data.length : 0} Rows
              </div> */}
            </div>
          ) : (
            <div className="row">
              <div className="col-12 text-end p-3">
                <span>
                  Rows per page:{" "}
                  <select
                    name="rowsPerPage"
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(e.target.value);
                      fetchData(buildQueryString(search, page, e.target.value));
                    }}
                  >
                    {rowsPerPageOptions.map((nbr, idx) => {
                      return (
                        <option key={"rowsPerPageOptions_" + idx} value={nbr}>
                          {nbr}
                        </option>
                      );
                    })}
                  </select>
                </span>
                <span className="ms-4">
                  {(page - 1) * rowsPerPage + 1}-
                  {(page - 1) * rowsPerPage + data.length} of {total}
                </span>
                <span
                  className={page === 1 ? "ms-4" : "smartTable-pointer ms-4"}
                  onClick={(e) => {
                    e.preventDefault();
                    if (page === 1) return;
                    setPage(page - 1);
                    fetchData(buildQueryString(search, page - 1, rowsPerPage));
                  }}
                >
                  <SVGChevronLeft
                    color={page === 1 ? "lightgray" : undefined}
                  />
                </span>
                <span
                  className={
                    page * rowsPerPage >= total
                      ? "ms-4"
                      : "smartTable-pointer ms-4"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    if ((page - 1) * rowsPerPage > total) return;
                    setPage(page + 1);
                    fetchData(buildQueryString(search, page + 1, rowsPerPage));
                  }}
                >
                  <SVGChevronRight
                    color={
                      page * rowsPerPage >= total ? "lightgray" : undefined
                    }
                  />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

DashboardTableView.propTypes = {
  data: PropTypes.arrayOf(PropTypes.Object),
  rowsPerPage: PropTypes.number,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  total: PropTypes.number,
  url: PropTypes.string,
  headCells: PropTypes.arrayOf(
    //means Object
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      width: PropTypes.number, //px
      sortable: PropTypes.bool,
      render: PropTypes.func,
    })
  ),
};

export default DashboardTableView;
