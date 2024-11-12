//third-party packages/framework  packages
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";

//custom styles/components
import styles from "../styles/Pages/DashboardPage/DashboardPage.module.css";
import {
  setActivePage,
  setIsLoading,
  setTempCurrentPage,
} from "../Components/Navbar/Navbar.slice";
import { store } from "../store";
import DesktopDashboardContainer from "../Components/DashboardPage/DesktopDashboardComponents/";
import MobileDashboardContainer from "../Components/DashboardPage/MobileDashboardComponents/";
import SEOHeader from "./SeoHeader";
import { BASE_API_URL } from "../Components/utils.js";

//page component
const Dashboard = () => {
  //declare and get variables
  const { user, isdarkMode } = useSelector((state) => state.Navbar);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  //check device width using useEffect
  useEffect(() => {
    if (window.innerWidth <= 720) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }

    dispatch(setActivePage({ page_name: "dashboard" }));
    dispatch(setIsLoading({ isloading: false }));
    dispatch(setTempCurrentPage({ page_name: "dashboard" }));
  }, []);

  useEffect(() => {
    //set timeout
    //to check if user does not exist
    //if true redirect to login page
    setTimeout(() => {
      //get user variable
      const state = store.getState();
      let user = state.Navbar.user;

      //check if user exist
      if (!user) {
        router.push("auth/login");
      }

      //fire after 1sec
    }, 1000);

    //watch for user
  }, [user]);

  return (
    <div>
      {/* SEO handler component*/}
      <SEOHeader
        page_title={"Dashboard"}
        meta_desc={
          "Here at your Dashboard you can keep track of your pins of your favourite articles and products from all over TwiddleMart"
        }
        canonical_url={`${BASE_API_URL}/dashboard`}
      />
      {/* Wave 1*/}
      <div className={styles.wave1}>
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className={
              isdarkMode ? styles.wave1_shapefill_dm : styles.wave1_shapefill
            }
          ></path>
        </svg>
      </div>
      {/*Wave 2*/}
      <div className={styles.wave2}>
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className={styles.wave2_shapefill}
          ></path>
        </svg>
      </div>
      {/*Wave 3*/}
      <div className={styles.wave3}>
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className={styles.wave3_shapefill}
          ></path>
        </svg>
      </div>
      {/* Main dashboard  component container */}
      <div
        style={{
          width: "100%",
          height: isMobile ? "100%" : "70%",
          position: "absolute",
          top: "0",
          display: "flex",
        }}
      >
        {isMobile ? (
          /* Mobile dashboard component */
          <MobileDashboardContainer />
        ) : (
          /* Desktop dashboard component*/
          <DesktopDashboardContainer />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
