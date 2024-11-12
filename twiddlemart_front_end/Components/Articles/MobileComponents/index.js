//framework/third-party packages
import Image from "next/image";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";

//import custom styles,variables and methods
import category_styles from "./styles/category.module.css";
import article_styles from "./styles/article.module.css";
import article_container_styles from "./styles/article_container.module.css";
import { setActivePage, setIsLoading } from "../../Navbar/Navbar.slice.js";
import { setActiveCategory } from "../Articles.slice";
import {
  DotLoader,
  BASE_API_URL,
  copyText,
  addToUserActivity,
  addToUserArticleActivity,
} from "../../utils.js";

//mobile categories component
const MobileCategories = ({ Categories }) => {
  //declare/get variables
  const dispatch = useDispatch();
  const { isdarkMode } = useSelector((state) => state.Navbar);
  const { activeCategory } = useSelector((state) => state.Articles);
  const { isactivePage } = useSelector((state) => state.Navbar);

  //return render code block
  return (
    //main categories container
    <div
      className={
        isdarkMode
          ? category_styles.categories_main_container_dm
          : category_styles.categories_main_container
      }
    >
      {/* categories items containers */}
      <div
        className={
          isdarkMode
            ? category_styles.category_items_container_dm
            : category_styles.category_items_container
        }
      >
        {/* filler category item container */}
        <div
          className={
            isdarkMode
              ? category_styles.category_item_dm
              : category_styles.category_item
          }
        ></div>

        {/* category item container */}
        <motion.div
          whileTap={{ scale: 1.5 }}
          onClick={() =>
            dispatch(
              setActiveCategory({
                category_info: ["general", -1],
              })
            )
          }
          className={
            isdarkMode
              ? activeCategory[0] == "general"
                ? category_styles.category_item_tapped
                : category_styles.category_item_dm
              : activeCategory[0] == "general"
              ? category_styles.category_item_tapped
              : category_styles.category_item
          }
          key={"general"}
        >
          <h1>General</h1>
        </motion.div>
        {/* forloop through categories */}
        {/* category item container */}

        {Categories.map((category, index) => (
          <motion.div
            onClick={() =>
              dispatch(
                setActiveCategory({
                  category_info: [category.title, index],
                })
              )
            }
            key={category.title}
            whileTap={{ scale: 1.5 }}
            className={
              isdarkMode
                ? activeCategory[0] == category.title
                  ? category_styles.category_item_tapped
                  : category_styles.category_item_dm
                : activeCategory[0] == category.title
                ? category_styles.category_item_tapped
                : category_styles.category_item
            }
          >
            <h1>{category.title}</h1>
          </motion.div>
        ))}
        {/* filler category item container */}
        <div
          className={
            isdarkMode
              ? category_styles.category_item_dm
              : category_styles.category_item
          }
        ></div>
      </div>
    </div>
  );
};

//article component
const Article = ({
  title,
  snippet,
  image_url,
  id,
  _pins,
  _hearts,
  slug,
  tag,
}) => {
  //declare/get variables
  const { user, isdarkMode } = useSelector((state) => state.Navbar);
  const router = useRouter();

  //heart function to talk with the backend
  const _heartArticle = async () => {
    //check if user is logged in to send data
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

  //main heart function to talk with the front-end/backend
  const heartArticle = () => {
    _heartArticle();
    //if article is hearted reduces by -1 and terminated else continue
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

  //main pin function to talk with front-end/backend
  const pinArticle = () => {
    _pinArticle();
    //if article is pinned reduced by -1 and terminated else continue
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
    //if user is logged in send share request
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

  //main share function to talk with backend and front-end
  const shareArticle = () => {
    _shareArticle();
    copyText(`${BASE_API_URL}/articles/${slug}/detail/`);

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

  const [pins, setPins] = useState(_pins);
  const [hearts, setHearts] = useState(_hearts);

  const dispatch = useDispatch();

  //use useEffect react hook to check if user hearted or pinned
  useEffect(() => {
    //function to check if logged in user hearted or pinned article
    const checkisHeartedPinned_GetArticleStats = async () => {
      //if user is logged in check if articles is hearted/pinned
      if (user) {
        //fetch user hearted article state
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

        //fetch user pinned article state
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

      //saftey check if stats is set else set stats
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

    //call function
    checkisHeartedPinned_GetArticleStats();
  }, []);

  //return render block
  return (
    //main article container
    <div className={article_styles.main_article_container}>
      {/* article body main container */}
      <div
        onClick={() => {
          addToUserActivity(tag);
          addToUserArticleActivity(slug);
          router.push(`articles/${slug}/detail/`);
          dispatch(setActivePage({ page_name: `article/detail` }));
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

      {/* article utility container */}
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
            <i className="fa fa-thumbtack opacity-[0.5]"></i>
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

//main articles container component
const MobileMiniArticlesContainer = ({ articles }) => {
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
    //check if articles are filtered
    if (isFiltered) {
      //check if current_page hasn't exceeded total_pages
      if (current_page < total_pages) {
        //check if general or different category
        if (activeCategory[1] == -1) {
          const res_art = await fetch(
            //check if user logged in return regular queryset else return custom queryset
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
          //fetch articles from !(not)general category
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
      } else {
        //set has more articles to fetch to false
        setHasMore(false);
      }
    }
  };

  //use useEffect hook to track changes in main/global articles
  useEffect(() => {
    //set scroll component height varibale to 85% of the window width
    setContainerHeight(window.innerHeight * 0.85);

    //set scroll component default to top:0
    const scrollComponent = document.querySelector("#scrollComponent");
    scrollComponent.scrollTo({
      top: 0,
      left: 0,
    });

    //set variables
    setTempArticles(articles.result);
    setCurrentPage(articles.current_page);
    setTotalPages(articles.total_pages);

    //check if current_page < total_pages
    if (articles.current_page < articles.total_pages) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }

    //bind to watch for articles changes
  }, [articles]);

  //return render code block
  return (
    //main articles container
    <div
      className={
        isdarkMode
          ? article_container_styles.main_articles_container_dm
          : article_container_styles.main_articles_container
      }
      id="scrollComponent"
    >
      {/* react infinite scroll component */}
      <InfiniteScroll
        dataLength={tempArticles ? tempArticles.length : 0}
        next={isFiltered ? getMoreArticles : null}
        hasMore={hasMore}
        height={containerHeight}
        loader={tempArticles && <DotLoader />}
        scrollableTarget={"scrollComponent"}
      >
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
              tag={article.tag}
            />
          ))
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
            }}
          >
            <h1>Coming soon,folks!!!</h1>
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
};

//export components
export { MobileMiniArticlesContainer, MobileCategories };
