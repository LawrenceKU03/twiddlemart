//framework/third-party packages
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { motion } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";

//custom styles/varuables/functions/components
import {
  setShowProducts,
  setShowArticles,
  setActivePage,
  setIsLoading,
} from "../../Navbar/Navbar.slice";
import styles from "./styles/index.module.css";
import { addToUserActivity, BlockLoader } from "../../utils.js";
import { DotLoader, BASE_API_URL, copyText } from "../../utils.js";

//search term container component
const SearchTermContainer = ({ search_term }) => {
  //get varibales
  const { isdarkMode } = useSelector((state) => state.Navbar);

  //return code block
  return (
    //main container
    <div
      className={
        isdarkMode ? styles.term_main_container_dm : styles.term_main_container
      }
    >
      {/* sign tab container*/}
      <div className={styles.sign_tab}>
        <h1>Search Term</h1>
      </div>

      {/* search term container */}
      <div>
        <h2 style={{ fontWeight: "800" }}>{`"${search_term}"`}</h2>
      </div>
    </div>
  );
};

//search stats container component
const SearchStats = ({ articles_n, products_n, hearts_n, pins_n }) => {
  //declare/get variables
  const { isdarkMode, isactiveStore } = useSelector((state) => state.Navbar);
  const [stats, setStats] = useState(null);

  //return code block
  return (
    //main container
    <div
      className={
        isdarkMode
          ? styles.stats_main_container_dm
          : styles.stats_main_container
      }
    >
      {/* sign tab container */}
      <div className={styles.sign_tab}>
        <h1>Stats</h1>
      </div>

      {/*  stats contianer */}
      <div
        className={
          isdarkMode ? styles.stats_container_dm : styles.stats_container
        }
      >
        {/* if store is active show product stats info container */}
        {isactiveStore && (
          <div>
            <i className="fa fa-shopping-cart"></i>
            <h2>{products_n} Products</h2>
          </div>
        )}

        {/* article stats info container */}
        <div>
          <i className="fa fa-newspaper"></i>
          <h2>{articles_n} Articles</h2>
        </div>

        {/* pin stats info container */}
        <div>
          <i className="fa fa-thumb-tack"></i>
          <h2>{pins_n} Pins</h2>
        </div>

        {/* heart stats info container */}
        <div>
          <i className="fa fa-heart"></i>
          <h2>{hearts_n} Hearts</h2>
        </div>
      </div>
    </div>
  );
};

//search filter component
const SearchFilter = ({}) => {
  //declare/get variables
  const { isdarkMode, isactiveStore } = useSelector((state) => state.Navbar);
  const { isShowProducts, isShowArticles } = useSelector(
    (state) => state.Navbar
  );
  const dispatch = useDispatch();

  //return render block
  return (
    //main filter container
    <div
      className={
        isdarkMode
          ? styles.filter_main_container_dm
          : styles.filter_main_container
      }
    >
      {/* sign tab contiainer */}
      <div className={styles.sign_tab}>
        <h1>Filters</h1>
      </div>

      {/* if store is active show all filters */}
      {isactiveStore ? (
        <div>
          {/* product filter container */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItem: "center",
              margin: "20px 10px",
            }}
          >
            {/* filter button container */}
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "left",
                alignItem: "center",
                width: "50%",
              }}
            >
              <input
                style={{ opacity: "0" }}
                className={styles.chbxbtn_1}
                defaultChecked={isShowProducts}
                checked={isShowProducts}
                type="checkbox"
              />
              <span
                onClick={() =>
                  dispatch(
                    setShowProducts({
                      show_products: !isShowProducts,
                    })
                  )
                }
                className={styles.check}
              ></span>
            </div>
            {/* filter title info*/}
            <h1
              style={{
                fontFamily: "Pacifico",
                fontWeight: "500",
              }}
            >
              Products
            </h1>
          </div>

          {/* articles filter container */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItem: "center",
              margin: "20px 10px",
            }}
          >
            {/* filter container */}
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "left",
                alignItem: "center",
                width: "50%",
              }}
            >
              <input
                style={{ opacity: "0" }}
                className={styles.chbxbtn_2}
                defaultChecked={isShowArticles}
                checked={isShowArticles}
                type="checkbox"
              />
              <span
                onClick={() =>
                  dispatch(
                    setShowArticles({
                      show_articles: !isShowArticles,
                    })
                  )
                }
                className={styles.check}
              ></span>
            </div>
            {/* filter title */}
            <h1
              style={{
                fontFamily: "Pacifico",
                fontWeight: "500",
              }}
            >
              Articles
            </h1>
          </div>
        </div>
      ) : (
        // filter coming soon container
        <div style={{ padding: "20px 10px" }}>
          <h1 style={{ fontSize: "26px", fontFamily: "Pacifico" }}>
            Coming Soon!
          </h1>
        </div>
      )}
    </div>
  );
};

//product component
const Product = ({ product }) => {
  //declare/get variables
  const [isShared, setShared] = useState(false);
  const [isHearted, setHearted] = useState(false);
  const [isPinned, setPinned] = useState(false);
  const [heartVal, setHeartVal] = useState(product.hearts);
  const [pinVal, setPinVal] = useState(product.pins);
  const { user, isdarkMode } = useSelector((state) => state.Navbar);
  const router = useRouter();
  const dispatch = useDispatch();

  //share function to talk with backend
  const _shareProduct = async () => {
    if (!isShared) {
      //send share+ request to the backend
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
      //send share- request to the backend
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

    //toggle share function
    setShared(!isShared);
  };

  //heart function to talk with backend
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

  //heart function to talk with backend/frontend
  const heartProduct = () => {
    _heartProduct();
    setHearted(!isHearted);
    if (isHearted) {
      setHeartVal(heartVal - 1);
    } else {
      setHeartVal(heartVal + 1);
    }
  };

  //pin function to talk with backend
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

  //pin function to talk with backend/frontend
  const pinProduct = () => {
    _pinProduct();
    setPinned(!isPinned);
    if (isPinned) {
      setPinVal(pinVal - 1);
    } else {
      setPinVal(pinVal + 1);
    }
  };

  //use useEffect check hearted/pinnned
  useEffect(() => {
    const checkHeartPin = async () => {
      if (user) {
        //fetch heart bool
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

        //fetch pin bool
        const Pinned_res = await fetch(`${BASE_API_URL}/store/`, {
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

    //function call
    checkHeartPin();
  }, []);

  //return code block
  return (
    //main container
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
          alt={product.title}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      {/* product date/vendor container */}
      <div className={styles.product_date_container}>
        <p
          style={{
            color: `${product.is_white_date_color ? "#fff" : "#000"}`,
          }}
        >
          {product.created} - {product.vendor}
        </p>
      </div>

      {/* product heart utils container */}
      <div className={styles.product_main_utils_container}>
        {/* product heart util container */}
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
            <p>{heartVal > 999 ? `${heartVal / 1000}k` : heartVal}</p>
            <i className="fa fa-heart text-red-600"></i>
          </div>
        </motion.div>

        {/* product pin utils container */}
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
            <p>{pinVal > 999 ? `${(heartVal / 1000).toFixed(1)}k` : pinVal}</p>
            <i className="fa fa-thumb-tack" style={{ color: "#0ea5e9" }}></i>
          </div>
        </motion.div>
      </div>

      {/* product info container */}
      <div className={styles.product_info_container}>
        <h1>{product.title}</h1>
        <p>{product.snippet}</p>
        <p>
          <b>Price</b>: ${product.price}
        </p>

        {/* product button container */}
        <div style={{ display: "flex" }}>
          <motion.div style={{ width: "100%" }} whileTap={{ scale: 2 }}>
            <div
              onClick={() => {
                addToUserActivity(product.category);
                router.push(product.vendor_affliate_link);
              }}
              className={
                isdarkMode
                  ? styles.product_btn_container_dm
                  : styles.product_btn_container
              }
            >
              <h1>buy now</h1>
            </div>
          </motion.div>

          {/* product question button container */}
          <motion.div style={{ height: "100%" }} whileTap={{ scale: 2 }}>
            <div
              className={
                isdarkMode
                  ? styles.product_share_container_dm
                  : styles.product_share_container
              }
              onClick={() => {
                addToUserActivity(product.category);
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

          {/* product share button container */}
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

//article component
const Article = ({ article }) => {
  //declare/get function
  const { user, isdarkMode } = useSelector((state) => state.Navbar);
  const dispatch = useDispatch();
  const router = useRouter();

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

  //heart functiom to talk with backend/frontend
  const heartArticle = () => {
    _heartArticle();
    if (isHearted) {
      setHearts(hearts - 1);
      setHearted(!isHearted);
      return;
    }
    setHearted(!isHearted);
    setHearts(hearts + 1);
  };

  //pin function to talk with backend
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

  //pin function to talk with backend/frontend
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

  //share function to talk with backrnd/frontend
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

  //share function to talk with backend/frontend
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

  //declare function
  const [isHearted, setHearted] = useState(false);
  const [isPinned, setPinned] = useState(false);
  const [isShared, setShared] = useState(false);
  const [isSet, setSet] = useState(false);
  const [pins, setPins] = useState(article.pins);
  const [hearts, setHearts] = useState(article.hearts);

  //use useEffect to check if pinned/hearted
  useEffect(() => {
    //function to check hearted/pinned status
    const checkisHeartedPinned_GetStats = async () => {
      if (user) {
        //fetch heart bool status
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
        setHearted(hearted_json.ishearted);

        //fetch pin bool status
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
        setPinned(pinned_json.ispinned);
      }

      //check if stats set
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

        //set variables
        const article_info_json = await article_info_res.json();
        setHearts(article_info_json.hearts);
        setPins(article_info_json.pins);
        setSet(true);
      }
    };

    //functiin call
    checkisHeartedPinned_GetStats();
  }, []);

  //return code block
  return (
    //main container
    <div className={styles.main_article_container}>
      {/* article info container */}
      <div
        onClick={() => {
          addToUserActivity(article.category_slug);
          router.push(`articles/${article.slug}/detail`);
          dispatch(setActivePage({ page_name: `store/detail/` }));
          dispatch(setIsLoading({ isloading: true }));
        }}
      >
        <h1>{article.title}</h1>
        <div className={styles.article_image_container}>
          <Image
            src={article.cover_photo_url}
            alt={article.title}
            style={{ objectFit: "cover" }}
            layout="fill"
          />
        </div>
        <p>{article.snippet}</p>
      </div>

      {/* article utils container */}
      <div className={styles.article_utils_container}>
        {/* heart util container */}
        <motion.div whileTap={{ scale: 2 }} onClick={() => heartArticle()}>
          <p>{hearts > 999 ? `${(hearts / 1000).toFixed(1)}k` : hearts}</p>
          {isHearted ? (
            <i className="fa fa-heart text-rose-400"></i>
          ) : (
            <i className="fa fa-heart opacity-[0.5] text-rose-400"></i>
          )}
        </motion.div>

        {/* pin util container */}
        <motion.div whileTap={{ scale: 2 }} onClick={() => pinArticle()}>
          <p>{pins > 999 ? `${(pins / 1000).toFixed(1)}k` : pins}</p>
          {isPinned ? (
            <i className="fa fa-thumb-tack"></i>
          ) : (
            <i className="fa fa-thumbtack opacity-[0.5]"></i>
          )}
        </motion.div>

        {/* share util container */}
        <motion.div onClick={() => shareArticle()} whileTap={{ scale: 2 }}>
          {isShared ? (
            <i className="fa fa-share"></i>
          ) : (
            <i className="fa fa-share opacity-[0.5]"></i>
          )}
        </motion.div>
      </div>
      <hr />
    </div>
  );
};

//search component
const SearchResultContainer = ({ q, search_res, isLoading }) => {
  //declare/get variables
  const { isactiveStore, isdarkMode, isShowProducts, isShowArticles } =
    useSelector((state) => state.Navbar);
  const [tempSearchResult, setTempSearchResult] = useState(
    search_res.search_result.result
  );
  const [current_page, setCurrentPage] = useState(
    search_res.search_result.current_page
  );
  const [total_pages, setTotalPages] = useState(
    search_res.search_result.total_pages
  );
  const [containerHeight, setContainerHeight] = useState(300);
  const [containerWidth, setContainerWidth] = useState(400);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState(q);

  //get more search results function
  const getMoreResults = async () => {
    if (current_page < total_pages) {
      const search_res = await fetch(
        `${BASE_API_URL}/api/home/search/?q=${query}&page_num=${
          current_page + 1
        }`
      );
      const search_data = await search_res.json();
      setTempSearchResult(
        tempSearchResult.concat(search_data.search_result.result)
      );
      setCurrentPage(search_data.search_result.current_page);
    } else {
      setHasMore(false);
    }
  };

  //use useEffect to setwidth/height of infinite-scroll component
  useEffect(() => {
    setContainerHeight(window.innerHeight * 0.85);
    setContainerWidth(window.innerWidth * 0.6);

    setTempSearchResult(search_res.search_result.result);
    if (
      search_res.search_result.current_page <
      search_res.search_result.total_pages
    ) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }

    setCurrentPage(search_res.search_result.current_page);
    setTotalPages(search_res.search_result.total_pages);

    document.querySelector("#scrollComponent").scrollTo({
      top: 0,
      left: 0,
      behaviour: "smooth",
    });
    setQuery(q);
  }, [search_res]);

  //return code block
  return (
    //main container
    <div style={{ position: "relative", height: "85%" }}>
      {/* search container */}
      <div
        className={
          isdarkMode
            ? styles.search_main_container_dm
            : styles.search_main_container
        }
        id="scrollComponent"
      >
        {/* infinite scroll component */}
        <InfiniteScroll
          height={containerHeight}
          dataLength={tempSearchResult ? tempSearchResult.length : 0}
          next={getMoreResults}
          hasMore={hasMore}
          loader={tempSearchResult && <DotLoader />}
          className={
            isdarkMode ? styles.infinite_scroll_dm : styles.infinite_scroll
          }
          scrollableTarget={"scrollComponent"}
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          {/* if not loading show search results */}
          {/* loop through search result */}
          {!isLoading && tempSearchResult && tempSearchResult[0] ? (
            tempSearchResult.map((res) =>
              res.price
                ? isShowProducts &&
                  isactiveStore && <Product product={res} key={res.title} />
                : isShowArticles && <Article article={res} key={res.title} />
            )
          ) : (
            // no articles display banner
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "Pacifico",
                height: "100%",
                textTransform: "capitalize",
                fontSize: "26px",
                padding: "20px",
              }}
            >
              <h1>We've got nothing,folks!!!</h1>
            </div>
          )}
        </InfiniteScroll>
        {/* loading container */}
        {isLoading && (
          <div
            style={{
              positiom: "absolute",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <BlockLoader />
          </div>
        )}
      </div>
    </div>
  );
};

//export components
export {
  SearchTermContainer,
  SearchStats,
  SearchResultContainer,
  SearchFilter,
};
