import styles from "../styles/Pages/ErrorPages/PageNotFound.module.css";
import { useRouter } from "next/router";
import {
  setActivePage,
  setIsLoading,
  setTempCurrentPage,
} from "../Components/Navbar/Navbar.slice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const TermsAndCondtions = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  //use useEffect to set active page
  useEffect(() => {
    dispatch(setActivePage({ page_name: "terms-and-conditions" }));
    dispatch(setIsLoading({ isloading: false }));
    dispatch(setTempCurrentPage({ page_name: "terms-and-conditions" }));
  }, []);

  return (
    <div>
      <div className={styles.main_container}>
        <h1>Terms & Conditions</h1>
        <p>
          By using this website you are bound to this agreement that we may
          store/access tokens we've stored on your device
          <br /> used for the sole purpose of providing better user experience
          and analytical purpose by the twiddlemart team
          <br />
          please note that this agreement is subject to change with out notice
          by the twiddlemart team
          <br />
          also see our <b>privacy policy</b> and <b>about us</b> page for more
          info.
        </p>
        <button
          onClick={() => {
            router.push("/");
            dispatch(setActivePage({ page_name: "home" }));
            dispatch(setIsLoading({ isloading: true }));
          }}
          className={styles.button}
        >
          Back to Home
        </button>
      </div>
      <div className={styles.wave}>
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className={styles.shape_lift}
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default TermsAndCondtions;
