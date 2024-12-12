//import frame work and third-party packages
import Image from "next/image";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";

//import custom styles and methods
import stats_styles from "./styles/stats.module.css";
import categories_styles from "./styles/categories.module.css";
import fytrends_styles from "./styles/fytrends.module.css";
import articles_container_styles from "./styles/articles_container.module.css";
import article_styles from "./styles/articles.module.css";
import { setActiveCategory } from "../Articles.slice";
import { setActivePage, setIsLoading } from "../../Navbar/Navbar.slice.js";
import {
  DotLoader,
  BASE_API_URL,
  copyText,
  BlockLoader,
  addToUserActivity,
} from "../../utils.js";

//desktop stats components
const DesktopStats = () => {
  //declare/get variables
  const { isdarkMode } = useSelector((state) => state.Navbar);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const getStats = async () => {
      const res = await fetch(`${BASE_API_URL}/api/articles/stats/`);
      const json_data = await res.json();
      setStats(json_data.stats_info);
    };

    getStats();
  }, []);

  //return render code block
  return (
    //main stats container
    <div
      className={
        isdarkMode
          ? stats_styles.stats_main_container_dm
          : stats_styles.stats_main_container
      }
    >
      <div className={stats_styles.sign_tab}>
        <h1>Stats</h1>
      </div>
      {/* stats item container */}
      <div
        className={
          isdarkMode
            ? stats_styles.stats_container_dm
            : stats_styles.stats_container
        }
      >
        <div>
          <i className="fa fa-newspaper"></i>
          <h2>{stats ? stats.articles_stats : 0} Articles</h2>
        </div>
        <div>
          <i className="fa fa-thumb-tack"></i>
          <h2>{stats ? stats.articles_pins : 0} Pins</h2>
        </div>
        <div>
          <i className="fa fa-heart"></i>
          <h2>{stats ? stats.articles_hearts : 0} Hearts</h2>
        </div>
      </div>
    </div>
  );
};

//desktop categories component
const DesktopCategories = ({ Categories }) => {
  //declare/get variables
  const { isdarkMode } = useSelector((state) => state.Navbar);
  const { activeCategory } = useSelector((state) => state.Articles);

  const dispatch = useDispatch();

  //return render code block
  return (
    //main categories container
    <div
      className={
        isdarkMode
          ? categories_styles.categories_main_container_dm
          : categories_styles.categories_main_container
      }
    >
      <div className={categories_styles.sign_tab}>
        <h1>Categories</h1>
      </div>
      {/* catgories container */}
      <div
        className={
          isdarkMode
            ? categories_styles.categories_container_dm
            : categories_styles.categories_container
        }
      >
        {/* general category item */}
        <motion.div
          key={"general"}
          onClick={() =>
            dispatch(
              setActiveCategory({
                category_info: ["general", -1, "general"],
              })
            )
          }
          className={
            activeCategory[0] == "general" && categories_styles.is_active
          }
          whileTap={{ scale: 1.5 }}
        >
          <h2>General</h2>
        </motion.div>
        {/* forloop for categories */}
        {Categories.map((category, index) => (
          <motion.div
            key={category.title}
            onClick={() =>
              dispatch(
                setActiveCategory({
                  category_info: [category.title, index, category.slug],
                })
              )
            }
            className={
              activeCategory[0] == category.title && categories_styles.is_active
            }
            whileTap={{ scale: 1.5 }}
          >
            <h2>{category.title}</h2>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

//desktop user specific trends component
const DesktopFYTrends = () => {
  //get/declare variable
  const { isdarkMode } = useSelector((state) => state.Navbar);
  const [trend_data, setTrendData] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const data_res = await fetch(`${BASE_API_URL}/api/articles/trending/`);
      const data_json = await data_res.json();

      setTrendData(data_json.articles);
    };

    getData();
  }, []);
  //return render code block
  return (
    //main fytrends container
    <div
      className={
        isdarkMode
          ? fytrends_styles.main_trends_container_dm
          : fytrends_styles.main_trends_container
      }
    >
      {/* sign tab container -_- */}
      <div className={fytrends_styles.sign_tab}>
        <h2>Trending</h2>
      </div>
      {/* trends article item */}
      <div>
        {trend_data[0] ? (
          trend_data.map((article, index) => (
            <motion.div
              onClick={() => {
                addToUserActivity(article.category_slug);
                router.push(`articles/${article.slug}/detail`);
                dispatch(setActivePage({ page_name: `article/detail/` }));
                dispatch(setIsLoading({ isloading: true }));
              }}
              style={{
                background: `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.7)),url(${article.cover_photo_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
              }}
              className={fytrends_styles.main_article_container}
              key={index}
              whileTap={{ scale: 1.5 }}
            >
              <h1>
                #{index + 1} {article.title}
              </h1>
            </motion.div>
          ))
        ) : (
          <div
            style={{
              height: "18vh",
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

//desktop article component
const Article = ({
  title,
  snippet,
  image_url,
  id,
  _pins,
  _hearts,
  slug,
  category,
}) => {
  //declare/get variables
  const { user, isdarkMode, tempCurrentPage } = useSelector(
    (state) => state.Navbar
  );
  const router = useRouter();
  const dispatch = useDispatch();

  //heart function to talk with backend
  const _heartArticle = async () => {
    //if user logged in send pin request
    if (user) {
      const hearted_res = await fetch(
        `${BASE_API_URL}/api/articles/utils/ishearted/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            article_id: id,
            user_id: user.user_id,
            isChecking: false,
          }),
        }
      );
    }
  };

  //main heart function to talk with front-end/backend
  const heartArticle = () => {
    _heartArticle();

    //check if hearted - if hearted reduce by -1 and terminate else continue
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
    //if user is logged in send pin request
    if (user) {
      const ispinned_res = await fetch(
        `${BASE_API_URL}/api/articles/utils/ispinned/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            article_id: id,
            user_id: user.user_id,
            isChecking: false,
          }),
        }
      );
    }
  };

  //main pin function to talk with backend and frontend
  const pinArticle = () => {
    _pinArticle();

    //if user pinned reduce by -1 and terminate else continue
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
    //if user logged in send share request
    if (user) {
      const ispinned_res = await fetch(
        `${BASE_API_URL}/api/articles/utils/isshared/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            article_id: id,
            prevShared: isShared,
          }),
        }
      );
    }
  };

  //main share function talk with frontend and backend
  const shareArticle = () => {
    _shareArticle();
    copyText(`${BASE_API_URL}/articles/${slug}/detail`);

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

  const [pins, setPins] = useState(_pins);
  const [hearts, setHearts] = useState(_hearts);

  // use useEffect hook to check if pinned and get article stats
  useEffect(() => {
    //function to check if article is hearted and get article stats
    const checkisHeartedPinned_GetStats = async () => {
      //check if user is logged in to check if user hearted/pinned article
      if (user) {
        const hearted_res = await fetch(
          `${BASE_API_URL}/api/articles/utils/ishearted/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              article_id: id,
              user_id: user.user_id,
              isChecking: true,
            }),
          }
        );
        const hearted_json = await hearted_res.json();
        setHearted(hearted_json.ishearted);

        const pinned_res = await fetch(
          `${BASE_API_URL}/api/articles/utils/ispinned/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              article_id: id,
              user_id: user.user_id,
              isChecking: true,
            }),
          }
        );
        const pinned_json = await pinned_res.json();
        setPinned(pinned_json.ispinned);
      }

      //safety check for if article stats has being set
      if (!isSet) {
        const article_info_res = await fetch(
          `${BASE_API_URL}/api/articles/utils/stats-info/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              article_id: id,
            }),
          }
        );

        const article_info_json = await article_info_res.json();
        setHearts(article_info_json.hearts);
        setPins(article_info_json.pins);
        setSet(true);
      }
    };

    //function call
    checkisHeartedPinned_GetStats();
  }, []);

  //return render code block
  return (
    //main article container
    <div className={article_styles.main_article_container}>
      {/* article container */}
      <div
        style={{ cursor: "pointer" }}
        onClick={() => {
          addToUserActivity(category);
          router.push(`articles/${slug}/detail`);
          dispatch(setActivePage({ page_name: `article/detail/` }));
          dispatch(setIsLoading({ isloading: true }));
        }}
      >
        <h1>{title}</h1>
        {/* image container */}
        <div className={article_styles.image_container}>
          <Image
            src={image_url}
            alt="image"
            layout="fill"
            style={{ objectFit: "cover" }}
          />
        </div>
        <p>{snippet}</p>
      </div>
      {/* article utils container */}
      <div className={article_styles.utils_container}>
        <motion.div whileTap={{ scale: 2 }} onClick={() => heartArticle()}>
          <p>{hearts > 999 ? `${(hearts / 1000).toFixed(1)}k` : hearts}</p>
          {isHearted ? (
            <i className="fa fa-heart text-rose-400"></i>
          ) : (
            <i className="fa fa-heart opacity-[0.5] text-rose-400"></i>
          )}
        </motion.div>
        <motion.div whileTap={{ scale: 2 }} onClick={() => pinArticle()}>
          <p>{pins > 999 ? `${(pins / 1000).toFixed(1)}k` : pins}</p>
          {isPinned ? (
            <i className="fa fa-thumb-tack"></i>
          ) : (
            <i className="fa fa-thumb-tack opacity-[0.5]"></i>
          )}
        </motion.div>
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

//desktop articles component
const DesktopMiniArticlesContainer = ({ articles }) => {
  //declare/get variables
  const { isdarkMode, user, isFiltered } = useSelector((state) => state.Navbar);
  const { activeCategory } = useSelector((state) => state.Articles);

  const [tempArticles, setTempArticles] = useState(articles.result);
  const [current_page, setCurrentPage] = useState(articles.current_page);
  const [total_pages, setTotalPages] = useState(articles.total_pages);

  const [hasMore, setHasMore] = useState(true);
  const [containerHeight, setContainerHeight] = useState(400);

  //slugify function
  const slugify = (string) => {
    return string.toLowerCase().replace(/\s+/g, "-");
  };

  //get more articles function
  const getMoreArticles = async () => {
    //check if current_page less than total_pages
    if (current_page < total_pages) {
      //check if articles are filtered
      if (isFiltered) {
        //check if current category index is general
        if (activeCategory[1] == -1) {
          const res_art = await fetch(
            //if user logged in fetch custom queryset else fetch regular queryset
            `${BASE_API_URL}/api/articles/?${
              user ? `uid=${user.user_id}&` : ""
            }page_num=${current_page + 1}`,
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
            }
          );
          const json_data_art = await res_art.json();

          //set variables
          setCurrentPage(json_data_art.current_page);
          setTempArticles(tempArticles.concat(json_data_art.result));
        } else {
          //fetch !(not)general category
          const res_art = await fetch(
            `${BASE_API_URL}/api/articles/categories/${slugify(
              activeCategory[0]
            )}/articles/?page_num=${current_page + 1}`
          );
          const json_data_art = await res_art.json();

          //set variables
          setCurrentPage(json_data_art.articles.current_page);
          setTempArticles(tempArticles.concat(json_data_art.articles.result));
        }
      }
    } else {
      //set has more articles to fetch to false
      setHasMore(false);
    }
  };

  //use useEffect hook to track for changes
  useEffect(() => {
    //set infinite scroll component height to 50% of device screen height
    setContainerHeight(window.innerHeight * 0.9);
    const scrollComponent = document.querySelector("#scrollComponent");
    //set default scroll position top:0
    scrollComponent.scrollTo({
      top: 0,
      left: 0,
    });

    //set variables
    setTempArticles(articles.result);
    setCurrentPage(articles.current_page);
    setTotalPages(articles.total_pages);

    //check if current_page less than total_pages to set has more articles variables to true/false
    if (articles.current_page < articles.total_pages) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }

    //bind to watch for articles change
  }, [articles]);

  //return render code block
  return (
    //main articles container
    <div
      className={
        isdarkMode
          ? articles_container_styles.main_articles_container_dm
          : articles_container_styles.main_articles_container
      }
      id="scrollComponent"
    >
      {/* react infinite scroll component */}
      <InfiniteScroll
        dataLength={tempArticles ? tempArticles.length : 0}
        next={getMoreArticles}
        hasMore={hasMore}
        height={containerHeight}
        loader={tempArticles && <DotLoader />}
        className={
          isdarkMode
            ? articles_container_styles.infinite_scroll_dm
            : articles_container_styles.infinite_scroll
        }
        scrollableTarget={"scrollComponent"}
      >
        {/* articles container */}
        <div>
          {/* forloop through articles */}
          {tempArticles && tempArticles[0] ? (
            tempArticles.map((article) => (
              <Article
                title={article.title}
                image_url={article.cover_photo_url}
                snippet={article.snippet}
                id={article.pk}
                _hearts={article.hearts}
                _pins={article.pins}
                slug={article.slug}
                key={article.pk}
                category={article.category_slug}
              />
            ))
          ) : (
            //no articles display banner
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "Pacifico",
                height: "100%",
                width: "100%",
                textTransform: "capitalize",
                fontSize: "26px",
                minHeight: "300px",
              }}
            >
              <h1>Coming soon,folks!!!</h1>
            </div>
          )}
        </div>
      </InfiniteScroll>
    </div>
  );
};

//export components
export {
  DesktopMiniArticlesContainer,
  DesktopFYTrends,
  DesktopStats,
  DesktopCategories,
};
