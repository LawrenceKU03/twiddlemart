//import animation package ine framer-motion
import { motion } from "framer-motion";

//import framework packages
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

//import custom variables,components,methods and styles
import SEOHeader from "./SeoHeader";
import styles from "../styles/Pages/HomePage/HomePage.module.css";
import {
  setActivePage,
  setIsLoading,
  setTempCurrentPage,
} from "../Components/Navbar/Navbar.slice";
import {
  BASE_API_URL,
  copyText,
  addToUserActivity,
} from "../Components/utils.js";

//article component
const Article = ({ article }) => {
  //declare and get variables
  const { user, isdarkMode } = useSelector((state) => state.Navbar);
  const router = useRouter();
  const dispatch = useDispatch();

  //heart function to talk with backend
  const _heartArticle = async () => {
    if (user) {
      const hearted_res = await fetch(
        `${BASE_API_URL}/api/articles/utils/ishearted/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            article_id: article.pk,
            user_id: user.user_id,
            isChecking: false,
          }),
        }
      );
    }
  };

  //heary function for both frontend and backend
  const heartArticle = () => {
    _heartArticle();
    if (isHearted) {
      setHearts(hearts - 1);
      setHearted(!isHearted);
      dispatch(AddORSubUserHearts({ actionCharge: -1 }));
      return;
    }
    setHearted(!isHearted);
    setHearts(hearts + 1);
    dispatch(AddORSubUserHearts({ actionCharge: 1 }));
  };

  //pin function to talk with the backend
  const _pinArticle = async () => {
    if (user) {
      const ispinned_res = await fetch(
        `${BASE_API_URL}/api/articles/utils/ispinned/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            article_id: article.pk,
            user_id: user.user_id,
            isChecking: false,
          }),
        }
      );
    }
  };

  //pin function to talk with frontend and backend
  const pinArticle = () => {
    _pinArticle();
    if (isPinned) {
      setPins(pins - 1);
      setPinned(!isPinned);
      return;
    }
    setPinned(!isPinned);
    setPins(pins + 1);
  };

  //share function  to talk with backend
  const _shareArticle = async () => {
    if (user) {
      const ispinned_res = await fetch(
        `${BASE_API_URL}/api/articles/utils/isshared/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            article_id: article.pk,
            prevShared: isShared,
          }),
        }
      );
    }
  };

  //share function to talk with frontend and backend
  const shareArticle = () => {
    _shareArticle();
    copyText(`${BASE_API_URL}/articles/${article.slug}/detail`);

    toast.success("LINK COPIED", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: `${isdarkMode ? "dark" : "light"}`,
    });

    setShared(!isShared);
  };

  //declare variables
  const [isHearted, setHearted] = useState(false);
  const [isPinned, setPinned] = useState(false);
  const [isShared, setShared] = useState(false);
  const [isSet, setSet] = useState(false);

  const [pins, setPins] = useState(article.pins);
  const [hearts, setHearts] = useState(article.hearts);

  //check if user is login and render right heart and pin icon
  useEffect(() => {
    //function to check user is logged in and hearted or pinned article
    const checkisHeartedPinned = async () => {
      //check if user exist or logged in
      if (user) {
        //query for if hearted
        const hearted_res = await fetch(
          `${BASE_API_URL}/api/articles/utils/ishearted/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              article_id: article.pk,
              user_id: user.user_id,
              isChecking: true,
            }),
          }
        );
        const hearted_json = await hearted_res.json();
        //set hearted
        setHearted(hearted_json.ishearted);

        //query for if pinned
        const pinned_res = await fetch(
          `${BASE_API_URL}/api/articles/utils/ispinned/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              article_id: article.pk,
              user_id: user.user_id,
              isChecking: true,
            }),
          }
        );
        const pinned_json = await pinned_res.json();
        //set pinned
        setPinned(pinned_json.ispinned);
      }

      //check if inverse of stats for article isSet
      if (!isSet) {
        const article_info_res = await fetch(
          `${BASE_API_URL}/api/articles/utils/stats-info/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              article_id: article.pk,
            }),
          }
        );

        const article_info_json = await article_info_res.json();
        setHearts(article_info_json.hearts);
        setPins(article_info_json.pins);
        setSet(true);
      }
    };

    //run function
    checkisHeartedPinned();
  }, []);

  return (
    <div
      className={
        isdarkMode
          ? styles.main_article_container_dm
          : styles.main_article_container
      }
    >
      {/* article info container */}
      <div
        onClick={() => {
          addToUserActivity(article.category_slug);
          router.push(`articles/${article.slug}/detail`);
          dispatch(setActivePage({ page_name: `article/detail/` }));
          dispatch(setIsLoading({ isloading: true }));
        }}
      >
        <h1>{article.title}</h1>
        <div className={styles.article_image_container}>
          <Image
            src={article.cover_photo_url}
            layout="fill"
            alt={article.slug}
          />
        </div>
        <p>{article.snippet}</p>
      </div>
      <div className={styles.article_utils_container}>
        {/* article heart icon */}
        <motion.div whileTap={{ scale: 2 }} onClick={() => heartArticle()}>
          <p>{hearts > 999 ? `${(hearts / 1000).toFixed(1)}k` : hearts}</p>
          {isHearted ? (
            <i className="fa fa-heart text-rose-400"></i>
          ) : (
            <i className="fa fa-heart opacity-[0.5] text-rose-400"></i>
          )}
        </motion.div>
        {/* article pin icon */}
        <motion.div whileTap={{ scale: 2 }} onClick={() => pinArticle()}>
          <p>{pins > 999 ? `${(pins / 1000).toFixed(1)}k` : pins}</p>
          {isPinned ? (
            <i className="fa fa-thumb-tack"></i>
          ) : (
            <i className="fa fa-thumbtack opacity-[0.5]"></i>
          )}
        </motion.div>
        {/* article share icon*/}
        <motion.div onClick={() => shareArticle()} whileTap={{ scale: 2 }}>
          {isShared ? (
            <i className="fa fa-share"></i>
          ) : (
            <i className="fa fa-share opacity-[0.5]"></i>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const Product = ({ product }) => {
  //decleare and get varuiables
  const [isShared, setShared] = useState(false);

  const [isHearted, setHearted] = useState(false);
  const [isPinned, setPinned] = useState(false);
  const [heartVal, setHeartVal] = useState(product.hearts);
  const [pinVal, setPinVal] = useState(product.pins);

  const { user, isdarkMode } = useSelector((state) => state.Navbar);
  const router = useRouter();
  const dispatch = useDispatch();

  //share function to talk with the backend
  const _shareProduct = async () => {
    if (!isShared) {
      fetch(`${BASE_API_URL}/api/store/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pk: product.pk,
          type: "share+",
          checking: false,
        }),
      });
    } else {
      fetch(`${BASE_API_URL}/api/store/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pk: product.pk,
          type: "share-",
          checking: false,
        }),
      });
    }

    copyText(`${BASE_API_URL}/store/${product.pk}/detail`);

    toast.success("LINK COPIED", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: `${isdarkMode ? "dark" : "light"}`,
    });

    setShared(!isShared);
  };

  //heart functiom to talk with the backend
  const _heartProduct = async () => {
    if (user) {
      fetch(`${BASE_API_URL}/api/store/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pk: product.pk,
          user_id: user.user_id,
          type: "heart",
          checking: false,
        }),
      });
    }
  };

  //heart functiom to talk with the frontend and backend
  const heartProduct = () => {
    _heartProduct();
    setHearted(!isHearted);
    if (isHearted) {
      setHeartVal(heartVal - 1);
    } else {
      setHeartVal(heartVal + 1);
    }
  };

  //pin function to talk with the backend
  const _pinProduct = async () => {
    if (user) {
      fetch(`${BASE_API_URL}/api/store/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pk: product.pk,
          user_id: user.user_id,
          type: "pin",
          checking: false,
        }),
      });
    }
  };

  //pin function to talk with frontend and backend
  const pinProduct = () => {
    _pinProduct();
    setPinned(!isPinned);
    if (isPinned) {
      setPinVal(pinVal - 1);
    } else {
      setPinVal(pinVal + 1);
    }
  };

  //check if user is login and render right heart and pin icon
  useEffect(() => {
    const checkHeartPin = async () => {
      //check if user is logged in.
      if (user) {
        const isHearted_res = await fetch(`${BASE_API_URL}/api/store/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pk: product.pk,
            user_id: user.user_id,
            type: "heart",
            checking: true,
          }),
        });
        const Hearted_data = await isHearted_res.json();
        setHearted(Hearted_data["hearted"]);

        const Pinned_res = await fetch(`${BASE_API_URL}/api/store/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pk: product.pk,
            user_id: user.user_id,
            type: "pin",
            checking: true,
          }),
        });
        const Pinned_data = await Pinned_res.json();
        setPinned(Pinned_data["pinned"]);
      }
    };

    //call function
    checkHeartPin();
  }, []);

  return (
    <div
      className={
        isdarkMode
          ? styles.product_main_container_dm
          : styles.product_main_container
      }
    >
      {/* product image container */}
      <div className={styles.product_image_container}>
        <Image
          src={product.image}
          layout="fill"
          objectFit="center"
          objectPosition="center"
          alt={product.title}
        />
      </div>
      {/* product datae container */}
      <div className={styles.product_date_container}>
        <p
          style={{
            color: `${product.is_white_date_color ? "#fff" : "#000"}`,
          }}
        >
          {product.created} - {product.vendor}
        </p>
      </div>
      {/* product heart pin container */}
      <div className={styles.product_main_utils_container}>
        <motion.div whileTap={{ scale: 2 }}>
          <div
            onClick={() => heartProduct()}
            style={{ opacity: isHearted ? "1" : "0.6" }}
            className={
              isdarkMode
                ? styles.product_utils_container_dm
                : styles.product_utils_container
            }
          >
            <p>
              {heartVal > 999 ? `${(heartVal / 1000).toFixed(1)}k` : heartVal}
            </p>
            <i className="fa fa-heart text-red-600"></i>
          </div>
        </motion.div>
        <motion.div whileTap={{ scale: 2 }}>
          <div
            onClick={() => pinProduct()}
            style={{ opacity: isPinned ? "1" : "0.6" }}
            className={
              isdarkMode
                ? styles.product_utils_container_dm
                : styles.product_utils_container
            }
          >
            <p>{pinVal > 999 ? `${(pinVal / 1000).toFixed(1)}k` : pinVal}</p>
            <i className="fa fa-thumb-tack" style={{ color: "#0ea5e9" }}></i>
          </div>
        </motion.div>
      </div>
      {/* product info container */}
      <div className={styles.product_info_container}>
        <h1>{product.title}</h1>
        <p style={{ fontSize: "15px" }}>{product.snippet}</p>
        <p>
          <b>Price</b>: ${product.price}
        </p>
        <div style={{ display: "flex" }}>
          {/* buy now button */}
          <motion.div style={{ width: "100%" }} whileTap={{ scale: 2 }}>
            <div
              className={
                isdarkMode
                  ? styles.product_btn_container_dm
                  : styles.product_btn_container
              }
              onClick={() => {
                addToUserActivity(product.slug);
                router.push(product.vendor_affliate_link);
              }}
            >
              <h1>buy now</h1>
            </div>
          </motion.div>
          {/* product detail info container */}
          <motion.div style={{ height: "100%" }} whileTap={{ scale: 2 }}>
            <div
              className={
                isdarkMode
                  ? styles.product_share_container_dm
                  : styles.product_share_container
              }
              onClick={() => {
                addToUserActivity(product.slug);
                router.push(`store/${product.pk}/detail`);
                dispatch(setActivePage({ page_name: `store/detail/` }));
                dispatch(setIsLoading({ isloading: true }));
              }}
            >
              <h1>
                <i className="fa fa-question-circle"></i>
              </h1>
            </div>
          </motion.div>

          {/* product share container */}
          <motion.div style={{ height: "100%" }} whileTap={{ scale: 2 }}>
            <div
              style={{ opacity: isShared ? "1" : "0.5" }}
              className={
                isdarkMode
                  ? styles.product_share_container_dm
                  : styles.product_share_container
              }
              onClick={() => _shareProduct()}
            >
              <h1>
                <i className="fa fa-share"></i>
              </h1>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

//page component
const Home = ({ data, products, articles }) => {
  //declare and get variables
  const { isdarkMode } = useSelector((state) => state.Navbar);
  const [homeData, setHomeData] = useState(data);
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState([false]);
  const router = useRouter();

  //check if device is desktop or mobile
  //set active oage to homepage
  //setloading back to false
  //set active page to "home"
  //stop loading layout [false]
  //set temparory current page to "home"

  useEffect(() => {
    if (window.innerWidth <= 720) {
      setIsMobile([true, window.innerWidth - 20]);
    } else {
      setIsMobile([false]);
    }
  }, []);

  useEffect(() => {
    dispatch(setActivePage({ page_name: "home" }));
    dispatch(setIsLoading({ isloading: false }));
    dispatch(setTempCurrentPage({ page_name: "home" }));
  }, []);

  return (
    <div>
      {/*SEO header ibfo */}
      <SEOHeader meta_desc={homeData.snippet} />
      <div
        className={
          isdarkMode ? styles.main_container_dm : styles.main_container
        }
      >
        {/*info container */}
        <div className={styles.info_container}>
          <h1>
            Hi welcome to{" "}
            <span>
              Twiddle
              <span style={{ color: isdarkMode ? "#fff" : "#000" }}>mart</span>
            </span>
            ,
          </h1>
          {/* if data loaded show data catch phrase else use default phrase*/}
          {homeData ? (
            <h1>{homeData.catch_phrase}</h1>
          ) : (
            <h1>a fun place to read & shop on the web.</h1>
          )}
          {/* if data loaded show data description else use default description */}
          {!homeData ? (
            <p>
              Here at twiddlemart we always strive to give the best in user
              satisfaction using techniques to better improve user experience
              and keep you engaged.
            </p>
          ) : (
            <p>{homeData.desc}</p>
          )}
          {/* explore button container */}
          <motion.div
            whileTap={{ scale: 1.5 }}
            className={styles.xplore_container}
            onClick={() => {
              router.push(`/articles/`);
              dispatch(setActivePage({ page_name: `articles` }));
              dispatch(setIsLoading({ isloading: true }));
            }}
          >
            <span>Xplore</span>
            <i className="fa fa-angle-double-right"></i>
          </motion.div>
        </div>
        {/* portalish image container */}
        <div>
          {/* if data loaded successfully use home image  else use pexel image */}
          {homeData ? (
            <motion.div
              drag
              dragConstraints={{
                top: 10,
                bottom: -10,
                right: 10,
                left: -10,
              }}
              className={styles.image_container}
              style={{
                background: `url(${homeData.image_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            ></motion.div>
          ) : (
            <motion.div
              drag
              dragConstraints={{
                top: 10,
                bottom: -10,
                right: 10,
                left: -10,
              }}
              className={styles.image_container}
              style={{
                background:
                  "url('https://images.pexels.com/photos/4946956/pexels-photo-4946956.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
              }}
            ></motion.div>
          )}
        </div>
      </div>
      {/* articles and products container */}
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          position: "absolute",
          zIndex: "10",
        }}
      >
        {/* product container */}
        <div className={styles.products_articles_main_container}>
          {/* if mobile hide if overflow else show all */}
          <div
            className={styles.products_articles_container}
            style={{
              width: isMobile[0] ? `${isMobile[1]}px` : "100%",
            }}
          >
            {homeData.is_store_visible ? (
              products.map((product) => (
                <Product product={product} key={product.pk} />
              ))
            ) : (
              <h1></h1>
            )}
          </div>
        </div>

        {/* article container */}
        <div className={styles.products_articles_main_container}>
          {/* if mobile hide if overflow else show all */}

          <div
            className={styles.products_articles_container}
            style={{
              width: isMobile[0] ? `${isMobile[1]}px` : "100%",
            }}
          >
            {articles.map((article) => (
              <Article article={article} key={article.pk} />
            ))}
          </div>
        </div>
      </div>

      {/* wave container */}
      <div className={styles.wave_container}>
        {/* wave1 container */}
        <div className={styles.wave}>
          <svg
            data-name="Layer 1"
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
        {/* wave 2 container */}
        <div className={styles.wave2}>
          <svg
            data-name="Layer 1"
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
      {/* wave 3 parent container */}
      <div className={styles.term_condition_container}>
        {/* wave 3 container */}
        <div className={styles.wave3}>
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className={styles.shape_fill3}
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

//Nextjs functiom for serverside rendering
export const getServerSideProps = async () => {
  //fetch home page data
  const home_data_res = await fetch(`${BASE_API_URL}/api/home/1/`);
  const home_data_json = await home_data_res.json();

  //homepage articles and.products to display
  const home_products_articles_res = await fetch(
    `${BASE_API_URL}/api/home/products_articles/`
  );
  const home_products_articles_json = await home_products_articles_res.json();
  console.log(home_data_json);
  // add to props for.page component
  return {
    props: {
      data: home_data_json,
      products: home_products_articles_json.products,
      articles: home_products_articles_json.articles,
    },
  };
};

//export Home page conponent
export default Home;
