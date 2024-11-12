import styles from "../styles/Pages/AboutUsPage/AboutUsPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import SEOHeader from "./SeoHeader";
import { useEffect } from "react";
import {
  setActivePage,
  setIsLoading,
  setTempCurrentPage,
} from "../Components/Navbar/Navbar.slice";
import { BASE_API_URL } from "../Components/utils";

const PrivacyPolicy = () => {
  const { isdarkMode } = useSelector((state) => state.Navbar);
  const dispatch = useDispatch();

  //use useEffect to set active page
  useEffect(() => {
    dispatch(setActivePage({ page_name: "privacy-policy" }));
    dispatch(setIsLoading({ isloading: false }));
    dispatch(setTempCurrentPage({ page_name: "privacy-policy" }));
  }, []);

  return (
    <div>
      <SEOHeader
        page_title={"Privacy Policy"}
        meta_desc={
          "Welcome! to Twiddlemart!,By voluntarily proving your information and creating an account you have agreed to allow us track your activity on our website in order to give and recommend to you products and articles,which we see as fitting to your taste thus creating a better user..."
        }
        canonical={`${BASE_API_URL}/privacy-policy`}
      />
      <div style={{ zIndex: "1" }}>
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
        <div className={styles.wave2}>
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
              className={styles.wave2_shapefill}
            ></path>
          </svg>
        </div>
        <div className={styles.wave3} style={{ position: "rel", zIndex: "-1" }}>
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className={styles.wave3_shapefill}
            ></path>
          </svg>
        </div>
      </div>
      <div className={styles.info_container}>
        <div
          className={
            isdarkMode
              ? styles.main_about_us_container_dm
              : styles.main_about_us_container
          }
        >
          <h1>Privacy Policy</h1>
          <div
            style={{
              width: "100%",
              textAlign: "left",
              padding: "15px 10px",
            }}
          >
            <p>
              Welcome! to
              <b
                style={{
                  fontFamily: "Pacifico",
                  color: "#0ea5e9",
                  fontWeight: "600",
                }}
              >
                Twiddle
                <span
                  style={{
                    color: isdarkMode ? "#fff" : "#000",
                  }}
                >
                  mart
                </span>
              </b>
              ,
              <br />
              <br />
              <div
                style={{ height: "250px" }}
                className={
                  isdarkMode
                    ? styles.main_info_container_dm
                    : styles.main_info_container
                }
              >
                By creating an account/using our website
                you have agreed to allow us track your activity on our website
                in order to all us give and recommend to you products and articles
                which we see as fitting to your interest thus creating a better
                user experience for you solely.
                <br />
                <br />
                We also automatically save tokens which we use to
                enable us automatically log you in on your next visit to the website,making
                your time on our website optimal and getting rid of the sign up hassle.
              </div>
            </p>
          </div>
          <div
            style={{
              width: "100%",
              padding: "15px 10px",
              textAlign: "right",
            }}
          >
            <b>
              --by{" "}
              <span style={{ fontFamily: "Pacifico" }}>Twiddlemart Team</span>
            </b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
