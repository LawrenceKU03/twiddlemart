import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  setActivePage,
  setIsLoading,
  setTempCurrentPage,
} from "../../../Components/Navbar/Navbar.slice";
import { useEffect, useState } from "react";
import Image from "next/image";

import styles from "../../../styles/Pages/Articles/Detail/ArticleDetail.module.css";
import ArticleDetailMobileContainer from "../../../Components/Articles/ArticleDetailComponents/MobileArticleDetailComponent";
import ArticleDetailDesktopContainer from "../../../Components/Articles/ArticleDetailComponents/DesktopArticleDetailComponents";

import SEOHeader from "../../SeoHeader";
import { BASE_API_URL } from "../../../Components/utils.js";

const article_detail = ({ article }) => {
  const [is_mobile, setMobile] = useState(false);
  const dispatch = useDispatch();
  const { isdarkMode } = useSelector((state) => state.Navbar);

  useEffect(() => {
    if (window.innerWidth <= 720) {
      setMobile(!is_mobile);
    }
    dispatch(setActivePage({ page_name: "articles/detail/" }));
    dispatch(setIsLoading({ isloading: false }));
    dispatch(setTempCurrentPage({ page_name: "articles/detail/" }));
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <SEOHeader
        page_title={`${article.title} - Articles`}
        meta_desc={article.snippet}
        canonical_url={`${BASE_API_URL}/articles/${article.slug}/detail/`}
      />
      {!is_mobile && (
        <div style={{ position: "relative", zIndex: "1" }}>
          <div className={isdarkMode ? styles.wave1_dm : styles.wave1}>
            <svg
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                className={styles.wave1_shape_fill}
              ></path>
            </svg>
          </div>
          <div className={isdarkMode ? styles.wave2_dm : styles.wave2}>
            <svg
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                className={styles.wave2_shape_fill}
              ></path>
            </svg>
          </div>
          <div className={styles.wave3}>
            <svg
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                className={styles.wave3_shape_fill}
              ></path>
            </svg>
          </div>
        </div>
      )}
      <div>
        {is_mobile ? (
          <div>
            <ArticleDetailMobileContainer article={article} />
            <div className={styles.wave3}>
              <svg
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path
                  d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                  className={styles.wave3_shape_fill}
                ></path>
              </svg>
            </div>
          </div>
        ) : (
          <div className={styles.main_container}>
            <ArticleDetailDesktopContainer article={article} />
          </div>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const { slug } = context.params;

  const article_res = await fetch(
    `${BASE_API_URL}/api/articles/${slug}/detail/`,
  );
  const article_data = await article_res.json();
  return {
    props: {
      article: article_data,
    },
  };
};

export default article_detail;
