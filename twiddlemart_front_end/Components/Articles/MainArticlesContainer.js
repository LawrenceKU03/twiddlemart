//imoort framework/third-party methods
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

//imoort custom styles,variables and methods
import styles from "./MainArticlesContainer.module.css";
import { BASE_API_URL } from "../utils.js";

//import mobile article components
import {
  MobileCategories,
  MobileMiniArticlesContainer,
} from "./MobileComponents";

//mobile main parent article component
const MobileArticlesContainer = ({ articleArray, Categories }) => {
  //declare variables
  const { activeCategory } = useSelector((state) => state.Articles);
  const [activeCategoryArticles, setActiveCategoryArticles] = useState([
    ...articleArray.result,
  ]);

  //use useEffect react hook to track changes
  useEffect(() => {
    if (activeCategory[1] != -1) {
      setActiveCategoryArticles(Categories[activeCategory[1]].articles);
    } else {
      setActiveCategoryArticles(articleArray);
    }
    console.log("done.m");
  }, [articleArray, activeCategory[0], activeCategoryArticles]);

  //return render
  return (
    //main container
    <div className={styles.main_mobile_articles_container}>
      {/* main articles container */}
      <div className={styles.main_articles_container}>
        {/* mobile article catgeories component */}
        <MobileCategories Categories={Categories} />
        {/* mobile articles component */}
        <MobileMiniArticlesContainer
          articles={activeCategoryArticles}
          currentPage={articleArray.current_page}
          totalPages={articleArray.total_pages}
        />
      </div>
    </div>
  );
};

// import custom desktop articles components
import {
  DesktopMiniArticlesContainer,
  DesktopStats,
  DesktopCategories,
  DesktopFYTrends,
} from "./DesktopComponents";

//desktop main article parent component
const DesktopArticlesContainer = ({ articleArray, Categories }) => {
  //get redux variables
  const { activeCategory } = useSelector((state) => state.Articles);
  const { user } = useSelector((state) => state.Navbar);

  //declare variables
  const [tempArticles, setTempArticles] = useState(articleArray);

  //slugify function
  const slugify = (string) => {
    return string.toLowerCase().replace(/\s+/g, "-");
  };

  //use useEffect react hook to track changes
  useEffect(() => {
    //category change function
    const categoryChange = async () => {
      // check if active category index is -1 i.e general
      if (activeCategory[1] == -1) {
        const res_art = await fetch(
          //if user is logged in get custom queryset else return regular
          `${BASE_API_URL}/api/articles/?${
            user ? `uid=${user.user_id}&` : ""
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

        //set tempArticles to gotten data
        setTempArticles(json_data_art);
      } else {
        //get !(not)general category articles
        const res_art = await fetch(
          `${BASE_API_URL}/api/articles/categories/${slugify(
            activeCategory[0],
          )}/articles/?page_num=1`,
        );
        const json_data_art = await res_art.json();

        //set tempArticles to gotten articles
        setTempArticles(json_data_art.articles);
      }
    };
    console.log("done mm");

    //call function if change detect
    categoryChange();
  }, [activeCategory[0]]);

  //return render block
  return (
    //main desktop article container
    <div className={styles.main_desktop_articles_container}>
      {/* main desktop article container */}
      <div className={styles.main_desktop_container}>
        {/* desktop articles categories and stats component container */}
        <div>
          <DesktopCategories Categories={Categories} />
          <DesktopStats />
        </div>
        {/* desktop articles container */}
        <DesktopMiniArticlesContainer articles={tempArticles} />
        {/* desktop fytrends component */}
        <DesktopFYTrends />
      </div>
    </div>
  );
};

//named export for mobile and desktop components
export { MobileArticlesContainer, DesktopArticlesContainer };
