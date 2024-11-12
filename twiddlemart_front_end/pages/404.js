import styles from "../styles/Pages/ErrorPages/PageNotFound.module.css";
import { useRouter } from "next/router";
import { setActivePage, setIsLoading } from "../Components/Navbar/Navbar.slice";
import { useDispatch } from "react-redux";

const PageNotFound = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <div>
      <div className={styles.main_container}>
        <h1>
          <span>4</span>
          <span>0</span>
          <span>4</span>
        </h1>
        <h2>Oops... we've lost this page.</h2>
        <div className={styles.fix_container}>
          <h1>Possible Fix</h1>
          <p>remove any trailing backslash "/" at the end of the url.</p>
        </div>

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

export default PageNotFound;
