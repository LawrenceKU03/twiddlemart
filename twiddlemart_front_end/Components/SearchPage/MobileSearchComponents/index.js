//framework/third-party functions/components
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";

//custom styles/variables/functions/componehtz
import styles from "./styles/index.module.css";
import {
  setShowProducts,
  setShowArticles,
  setActivePage,
  setIsLoading,
} from "../../Navbar/Navbar.slice";
import {
  BASE_API_URL,
  DotLoader,
  BlockLoader,
  copyText,
  addToUserActivity,
} from "../../utils.js";

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

  //function to talk with the backend
  const _shareProduct = async () => {
    if (!isShared) {
      //send share+ request if not hearted
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
      //send share- request if hearted
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
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: `${isdarkMode ? "dark" : "light"}`,
    });

    //toggle share state
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

  //heart function to talk with frontend/backend
  const heartProduct = () => {
    _heartProduct();
    setHearted(!isHearted);
    if (isHearted) {
      setHeartVal(heartVal - 1);
    } else {
      setHeartVal(heartVal + 1);
    }
  };

  //pin functiom to talknwith backend
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

  //pin functiom to talk with backend/frontend
  const pinProduct = () => {
    _pinProduct();
    setPinned(!isPinned);
    if (isPinned) {
      setPinVal(pinVal - 1);
    } else {
      setPinVal(pinVal + 1);
    }
  };

  //useEffect hook function to check if hearted/pinned and get stats
  useEffect(() => {
    //function to check if hearted/pinned and get stats
    const checkHeartPin = async () => {
      if (user) {
        //fetch pinned bool info
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

        //fetch pinned bool info
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

  //return code
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
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          alt={product.title}
        />
      </div>
      {/* date/vendor container */}
      <div className={styles.product_date_container}>
        <p
          style={{
            color: `${product.is_white_date_color ? "#fff" : "#000"}`,
          }}
        >
          {product.created} - {product.vendor}
        </p>
      </div>

      {/* product utils container */}
      <div className={styles.product_main_utils_container}>
        {/* heart util container */}
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

        {/* pin util container */}
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
        {/* info tags */}
        <h1>{product.title}</h1>
        <p style={{ fontSize: "15px" }}>{product.snippet}</p>
        <p>
          <b>Price</b>: ${product.price}
        </p>

        {/* buttons container  */}
        <div style={{ display: "flex" }}>
          {/* buy button container */}
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

          {/* question button container */}
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

          {/* share button container */}
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
  //declare/get variables
  const { user, isdarkMode } = useSelector((state) => state.Navbar);
  const router = useRouter();
  const dispatch = useDispatch();

  //function to talk with backend
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

  //heart function to talk with backend/frontend
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

  //pin function to talk with
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

  //share function to talk with backend
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
      position: "top-center",
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

  //use useEffect hook to check if hearted/pinned
  useEffect(() => {
    const checkisHeartedPinned = async () => {
      if (user) {
        //fetch hearted bool
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

        //fetch pinned bool
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

      //check if info stats is set
      if (!isSet) {
        //fetch info stats
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

    //function call
    checkisHeartedPinned();
  }, []);

  //return code block
  return (
    //main article container
    <div className={styles.article_main_article_container}>
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

        {/* article image container */}
        <div className={styles.article_image_container}>
          <Image
            src={article.cover_photo_url}
            alt={article.title}
            layout="fill"
            style={{ objectFit: "cover" }}
          />
        </div>
        <p style={{ fontSize: "15px" }}>{article.snippet}</p>
      </div>

      {/* articles utils container */}
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

        {/* pin utils container */}
        <motion.div whileTap={{ scale: 2 }} onClick={() => pinArticle()}>
          <p>{pins > 999 ? `${(pins / 1000).toFixed(1)}k` : pins}</p>
          {isPinned ? (
            <i className="fa fa-thumb-tack"></i>
          ) : (
            <i className="fa fa-thumbtack opacity-[0.5]"></i>
          )}
        </motion.div>

        {/* share utils container */}
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

//search filter component
const SearchInfoFilter = ({ search_term, products_n, articles_n }) => {
  //declare/get variables
  const { isactiveStore, isShowArticles, isShowProducts, isdarkMode } =
    useSelector((state) => state.Navbar);
  const dispatch = useDispatch();

  //return code block
  return (
    //main container
    <div
      className={
        isdarkMode
          ? styles.infofilter_main_container_dm
          : styles.infofilter_main_container
      }
    >
      {/* srarch term container */}
      <div>
        <h1 style={{ fontFamily: "Roboto", fontWeight: "400" }}>
          Search Term:
          <span style={{ fontWeight: "600" }}>{`"${search_term}"`}</span>
        </h1>
      </div>

      {/* show content if store is active */}
      {isactiveStore && (
        <div style={{ display: "flex", width: "100%" }}>
          {/*  products sub filter container */}
          <div
            style={{
              width: "50%",
              marginLeft: "-5px",
              margin: "5px",
            }}
          >
            {/* button/product_size container */}
            <div
              style={{
                position: "relative",
                display: "flex",
                width: "80%",
              }}
            >
              {/* product toggle button container */}

              <div style={{ display: "flex", width: "90%" }}>
                <input
                  type="checkbox"
                  defaultChecked={isShowProducts}
                  checked={isShowProducts}
                  className={styles.infofilter_chbxbtn_1}
                />
                <span
                  onClick={() =>
                    dispatch(
                      setShowProducts({
                        show_products: !isShowProducts,
                      })
                    )
                  }
                  className={styles.infofilter_check}
                ></span>
              </div>

              {/* number of products container */}
              <div style={{ width: "30%" }}>
                <h1
                  style={{
                    marginLeft: "-14px",
                    fontWeight: "400",
                    fontFamily: "Pacifico",
                    fontSize: "16px",
                  }}
                >
                  Products {products_n}
                </h1>
              </div>
            </div>
          </div>

          {/* article filter sub container */}
          <div
            style={{
              width: "50%",
              marginLeft: "-5px",
              margin: "5px",
            }}
          >
            {/*  button/article_size container */}
            <div
              style={{
                position: "relative",
                display: "flex",
                width: "80%",
              }}
            >
              {/* toggle button container */}
              <div style={{ display: "flex", width: "90%" }}>
                <input
                  type="checkbox"
                  defaultChecked={isShowArticles}
                  checked={isShowArticles}
                  className={styles.infofilter_chbxbtn_1}
                />
                <span
                  onClick={() =>
                    dispatch(
                      setShowArticles({
                        show_articles: !isShowArticles,
                      })
                    )
                  }
                  className={styles.infofilter_check}
                ></span>
              </div>

              {/* articles size contaiber */}
              <div style={{ width: "30%" }}>
                <h1
                  style={{
                    marginLeft: "-14px",
                    fontWeight: "400",
                    fontFamily: "Pacifico",
                    fontSize: "16px",
                  }}
                >
                  Articles {articles_n}
                </h1>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SearchMobileResultContainer = ({ q, search_res, isLoading }) => {
  //declsre/get variables
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

  //function to get more results
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

  //use useEffect to get width/height for infinite-scroll component/set variabels
  useEffect(() => {
    setContainerHeight(window.innerHeight * 0.6);
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
    <div style={{ position: "relative", height: "100%" }}>
      {/* search container */}
      <div
        className={
          isdarkMode
            ? styles.searchcontainer_main_container_dm
            : styles.searchcontainer_main_container
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
          scrollableTarget={"scrollComponent"}
        >
          {/* if not loading show search results -- loop through articles*/}
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

        {/* show loading container */}
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
            {/* block loader component */}
            <BlockLoader />
          </div>
        )}
      </div>
    </div>
  );
};

export { SearchInfoFilter, SearchMobileResultContainer };
