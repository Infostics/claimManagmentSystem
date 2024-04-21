import Header from "../../common/header/dashboard/Header";
import SidebarMenu from "../../common/header/dashboard/SidebarMenu_01";
import MobileMenu from "../../common/header/MobileMenu";
import ClaimStatusCards from "./ClaimStatusCard";
import DashboardView from "./DashboardView";
import SearchFields from "./SearchFields";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import axios, { all } from "axios";
import Pagination from "./Pagination";
import { useRouter } from "next/router";

const Index = () => {
  const [start, setStart] = useState(0);

  const [allClaims, setAllClaims] = useState([]);
  const [filterCardClaim, setFilterCardClaim] = useState([]);
  const [selectedCard, setSelectedCard] = useState(1);
  const [end, setEnd] = useState(10);
  const [type, setType] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();
  const [IsLoading, setIsLoading] = useState(true);
  const [filterClaims, setFilterClaims] = useState([]);
  const [majorSearch, setMajorSearch] = useState("");

  const [status, setStatus] = useState([]);
  const [isRegionChange, setIsRegionChange] = useState(false);
  const [regionSearchValue, setRegionSearchValue] = useState();

  const [filterAccordingClaim, setFilterAccordingClaim] = useState([]);
  const [showRegionClaim, setShowRegionClaim] = useState(false);

  const [lastActivityTimestamp, setLastActivityTimestamp] = useState(
    Date.now()
  );

  useEffect(() => {
    const activityHandler = () => {
      setLastActivityTimestamp(Date.now());
    };

    window.addEventListener("mousemove", activityHandler);
    window.addEventListener("keydown", activityHandler);
    window.addEventListener("click", activityHandler);

    return () => {
      window.removeEventListener("mousemove", activityHandler);
      window.removeEventListener("keydown", activityHandler);
      window.removeEventListener("click", activityHandler);
    };
  }, []);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let temp = [];
    if (selectedCard === 12) {
      temp = allClaims;
    } else {
      temp = allClaims.filter((claim, index) => {
        if (String(claim.CurrentStatus) === String(selectedCard)) {
          return true;
        } else {
          return false;
        }
      });
    }
    setFilterCardClaim(temp);
  }, [selectedCard, allClaims]);

  useEffect(() => {
    let userData = {};
    userData = JSON.parse(localStorage.getItem("userInfo"));
    if (!userData) {
      router.push("/login");
    }
    const inactivityCheckInterval = setInterval(() => {
      const currentTime = Date.now();
      const timeSinceLastActivity = currentTime - lastActivityTimestamp;
      if (timeSinceLastActivity > 1200000) {
        localStorage.removeItem("userInfo");
        router.push("/login");
      }
    }, 30000);
    return () => clearInterval(inactivityCheckInterval);
  }, [lastActivityTimestamp]);

  useEffect(() => {
    let filterClaim;
    if (type === 1) {
      filterClaim = allClaims.filter((claim, index) =>
        claim?.PolicyNo?.toLowerCase().includes(searchInput.toLowerCase())
      );
    } else if (type === 2) {
      filterClaim = allClaims.filter((claim, index) =>
        claim?.RegistrationNo?.toLowerCase().includes(searchInput.toLowerCase())
      );
    } else {
      filterClaim = allClaims.filter((claim, index) =>
        claim?.ReferenceID?.toLowerCase().includes(searchInput.toLowerCase())
      );
    }
    setFilterClaims(filterClaim);
  }, [searchInput]);

  useEffect(() => {
    const region = JSON.parse(localStorage.getItem("regionType"));
    if (region) {
      setShowRegionClaim(true);
      const filterAccordingToRegion = allClaims.filter((claim) => {
        if (claim.Region == region) {
          return true;
        } else {
          return false;
        }
      });
      setFilterClaims(filterAccordingToRegion);
      setFilterAccordingClaim(filterAccordingToRegion);
    } else {
      setShowRegionClaim(false);
    }
  }, [regionSearchValue]);

  useEffect(() => {
    let filterClaim;
    filterClaim = allClaims.filter(
      (claim, index) =>
        claim?.PolicyNo?.toLowerCase().includes(majorSearch.toLowerCase()) ||
        claim?.PolicyHolder?.toLowerCase().includes(
          majorSearch.toLowerCase()
        ) ||
        claim?.ReferenceID?.toLowerCase().includes(majorSearch.toLowerCase()) ||
        claim?.RegistrationNo?.toLowerCase().includes(
          majorSearch.toLowerCase()
        ) ||
        claim?.AssignedGarage?.toLowerCase().includes(
          majorSearch.toLowerCase()
        ) ||
        claim?.Region?.toLowerCase().includes(majorSearch.toLowerCase())
    );

    setFilterClaims(filterClaim);
  }, [majorSearch]);

  const fetchData = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo === "") {
      router.push("/login");
    } else {
      const { Region1, Region2, Region3, CalimStatus } = userInfo[0];
      toast.loading("Loading the claims!!", {
        className: "toast-loading-message",
      });
      axios
        .get("/api/getAllClaims", {
          params: {
            Region1,
            Region2,
            Region3,
            CalimStatus,
          },
          headers: {
            Authorization: `Bearer ${userInfo[0]?.Token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          toast.dismiss();
          toast.success("Successfully loaded all claims", {
            className: "toast-loading-message",
          });
          setAllClaims(res.data.data[0]);
        })
        .catch((err) => {
          toast.dismiss();
          toast.error("error while fetching all claims!");
        });

      axios
        .get("/api/getStatus", {
          headers: {
            Authorization: `Bearer ${userInfo[0]?.Token}`,
            "Content-Type": "application/json",
          },
          params: {
            leadId: "",
          },
        })
        .then((res) => {
          const temp = res.data.data;
          setStatus(temp);
        })
        .catch((err) => {
        });

      setIsLoading(false);
    }
  };

  return (
    <>
      {/* <!-- Main Header Nav --> */}
      <Header
        setIsRegionChange={setIsRegionChange}
        isDashboard={true}
        setRegionSearchValue={setRegionSearchValue}
      />
      {/* <!--  Mobile Menu --> */}
      <MobileMenu />

      <div className="dashboard_sidebar_menu">
        <div
          className="offcanvas offcanvas-dashboard offcanvas-start"
          tabIndex="-1"
          id="DashboardOffcanvasMenu"
          data-bs-scroll="true"
        >
          <SidebarMenu />
          {/* <Sidebar /> */}
        </div>
      </div>
      {/* End sidebar_menu */}

      {/* <!-- Our Dashbord --> */}
      <section className="our-dashbord dashbord bgc-f6 pb50">
        <div className="container-fluid ovh">
          <div className="row">
            <div className="col-lg-12 maxw100flex-992">
              <div className="row">
                {/* Start Dashboard Navigation */}
                <div className="col-lg-12">
                  <div className="dashboard_navigationbar dn db-1024">
                    <div className="dropdown">
                      <button
                        className="dropbtn"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#DashboardOffcanvasMenu"
                        aria-controls="DashboardOffcanvasMenu"
                      >
                        <i className="fa fa-bars pr10"></i> Dashboard Navigation
                      </button>
                    </div>
                  </div>
                </div>
                {/* End Dashboard Navigation */}
              </div>

              <div
                className="row mt-2"
                style={{ justifyContent: "space-between" }}
              >
                <ClaimStatusCards
                  allClaims={
                    searchInput || majorSearch || isRegionChange
                      ? filterClaims
                      : allClaims
                  }
                  setSelectedCard={setSelectedCard}
                />
              </div>
              {/* End .row Dashboard top statistics */}
              <div
                className=" bg-dark"
                style={{
                  width: "101%",
                  height: "3px",
                  color: "blue",
                  border: "1px solid",
                  marginBottom: "5px",
                  marginLeft: "-12px",
                }}
              ></div>
              <div className="row">
                <SearchFields
                  IsLoading={IsLoading}
                  setSearchInput={setSearchInput}
                  setType={setType}
                />
              </div>
              <div
                className="bg-dark"
                style={{
                  width: "101%",
                  height: "3px",
                  color: "blue",
                  border: "1px solid blue",
                  marginLeft: "-12px",
                }}
              ></div>
              <div className="row">
                <DashboardView
                  claims={
                    searchInput || majorSearch || isRegionChange
                      ? filterClaims
                      : selectedCard
                      ? filterCardClaim
                      : filterCardClaim
                  }
                  IsLoading={IsLoading}
                  start={start}
                  end={end}
                  setMajorSearch={setMajorSearch}
                  status={status}
                />
              </div>
              {/* End .row  */}

              <div className="row">
                <div className="col-lg-12 mt20">
                  <div className="mbp_pagination">
                    <Pagination
                      setStart={setStart}
                      setEnd={setEnd}
                      start={start}
                      end={end}
                      properties={
                        searchInput || majorSearch || isRegionChange
                          ? filterClaims
                          : selectedCard > 0
                          ? filterCardClaim
                          : showRegionClaim
                          ? filterAccordingClaim
                          : allClaims
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="row mt50">
                <div className="col-lg-12">
                  <div className="copyright-widget text-center">
                    <p>
                      {" "}
                      &copy; {new Date().getFullYear()} Infostics. Made with
                      love.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
