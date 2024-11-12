//import framework / third-party packages
import { useSelector, useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";
import { useState, useEffect } from "react";

//import custom methods,components and styles
import {
  DesktopArticlesContainer,
  MobileArticlesContainer,
} from "../../Components/Articles/MainArticlesContainer";
import {
  setActivePage,
  setIsLoading,
  setTempCurrentPage,
  setIsFiltered,
} from "../../Components/Navbar/Navbar.slice";
import SEOHeader from "../SeoHeader";
import styles from "../../styles/Pages/Articles/Articles.module.css";
import { BASE_API_URL } from "../../Components/utils.js";

//page component
const articles = ({ articles_, categories }) => {
  //declare variables
  const { isdarkMode, user } = useSelector((state) => state.Navbar);
  const [is_mobile, setIsMobile] = useState(null);
  const [articles, setArticles] = useState(articles_);

  const dispatch = useDispatch();

  //check if user is logged in to get cutsomized articles
  //set active oage to article page
  //setloading back to false
  //set active page to "articles"
  //stop loading layout [false]
  //set temparory current page to "articles"

  useEffect(() => {
    //default is filtered to false;
    dispatch(setIsFiltered({ is_filtered: false }));

    const getFilteredArticles = async () => {
      const res_art = await fetch(
        `${BASE_API_URL}/api/articles/?${
          user ? `uid=${user.user_id}&` : ``
        }page_num=1`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userInterests: localStorage.getItem("userActivity")
              ? JSON.parse(localStorage.getItem("userActivity"))
              : { data: [] },
            userClickedArticles: localStorage.getItem("userArticleActivity")
              ? JSON.parse(localStorage.getItem("userArticleActivity"))
              : { data: [] },
          }),
        },
      );
      const json_data_art = await res_art.json();
      setArticles(json_data_art);
      dispatch(setIsFiltered({ is_filtered: true }));
    };

    //function call
    getFilteredArticles();

    //check if device is desktop or mobile
    if (window.innerWidth <= 720) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }

    dispatch(setActivePage({ page_name: "articles" }));
    dispatch(setIsLoading({ isloading: false }));
    dispatch(setTempCurrentPage({ page_name: "articles" }));
  }, []);

  //render for mobile
  if (is_mobile) {
    return (
      //main container
      <div className="relative">
        {/* seo component */}
        <SEOHeader
          page_title="Articles"
          meta_desc={
            "Welcome to Twiddlemart!,where you can read the best articles that should give a fun time reading it and give your brain a pleasant tim..."
          }
          canonical_url={`${BASE_API_URL}/articles`}
        />
        {/* main articles container */}
        <div>
          {/* filler container */}
          <div
            className={
              isdarkMode
                ? styles.filler_container_dm
                : styles.filler_container_wm
            }
          ></div>

          {/* wave 1 container */}
          <div className={styles.wave}>
            <svg
              articles-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                className={
                  isdarkMode ? styles.shape_fill_dm : styles.shape_fill
                }
              ></path>
            </svg>
          </div>

          {/* blue block containee */}
          <div style={{ background: "#0ea5e9", height: "150px" }}></div>

          {/* wave 2 container */}
          <div className={styles.wave2}>
            <svg
              articles-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                className={styles.shape_fill2}
              ></path>
            </svg>
          </div>
        </div>

        {/* wave 3 container */}
        <div className={styles.wave3}>
          <svg
            articles-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className={styles.shapefill3}
            ></path>
          </svg>
        </div>

        {/* mobile article main component */}
        <MobileArticlesContainer
          articleArray={articles}
          Categories={categories}
        />
      </div>
    );
  }

  //render if desktop
  if (!is_mobile) {
    return (
      //main container
      <div className="relative">
        {/* seo component */}
        <SEOHeader
          page_title="Articles"
          meta_desc={
            "Welcome to TwiddleMart!,where you can read the best articles that should give a fun time reading it and give your brain a pleasant tim..."
          }
          canonical_url={`${BASE_API_URL}/articles`}
        />

        {/* articles container */}
        <div>
          <div
            className={
              isdarkMode
                ? styles.filler_container_dm
                : styles.filler_container_wm
            }
          ></div>

          {/* wave 1 container */}
          <div className={styles.wave}>
            <svg
              articles-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                className={
                  isdarkMode ? styles.shape_fill_dm : styles.shape_fill
                }
              ></path>
            </svg>
          </div>

          {/* blue block container */}
          <div style={{ background: "#0ea5e9", height: "150px" }}></div>

          {/* wave 2 container */}
          <div className={styles.wave2}>
            <svg
              articles-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                className={styles.shape_fill2}
              ></path>
            </svg>
          </div>
        </div>

        {/* wave 3 container */}
        <div className={styles.wave3}>
          <svg
            articles-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className={styles.shapefill3}
            ></path>
          </svg>
        </div>

        {/* desktop main articles component */}
        <DesktopArticlesContainer
          articleArray={articles}
          Categories={categories}
        />
      </div>
    );
  }

  //default return render
  return (
    //main container
    <div className="relative">
      <div>
        {/* filler block container */}
        <div
          className={
            isdarkMode ? styles.filler_container_dm : styles.filler_container_wm
          }
        ></div>

        {/* wave 1 container */}
        <div className={styles.wave}>
          <svg
            articles-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className={isdarkMode ? styles.shape_fill_dm : styles.shape_fill}
            ></path>
          </svg>
        </div>

        {/* blue block container */}
        <div style={{ background: "#0ea5e9", height: "150px" }}></div>

        {/* wave 2 container */}
        <div className={styles.wave2}>
          <svg
            articles-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className={styles.shape_fill2}
            ></path>
          </svg>
        </div>
      </div>

      {/* wave 3 container */}
      <div className={styles.wave3}>
        <svg
          articles-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className={styles.shapefill3}
          ></path>
        </svg>
      </div>
    </div>
  );
};

//server side rendering code block
export const getServerSideProps = async () => {
  //fetch default articles
  const res_art = await fetch(`${BASE_API_URL}/api/articles/?page_num=1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userInterests: { data: [] },
      userClickedArticles: { data: [] },
    }),
  });
  const json_data_art = await res_art.json();

  //fetch articles categories
  const res_cat = await fetch(`${BASE_API_URL}/api/articles/categories/`);
  const json_data_cat = await res_cat.json();

  //return fetched data from props
  return {
    props: {
      articles_: json_data_art,
      categories: json_data_cat,
    },
  };
};

//export page
export default articles;
