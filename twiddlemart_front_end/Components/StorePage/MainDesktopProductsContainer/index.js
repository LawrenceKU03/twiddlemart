//import third-party and framework methods
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

//import custom  variables,styles and methods
import { setActiveCategory } from "../Store.slice";
import { setActivePage, setIsLoading } from "../../Navbar/Navbar.slice";
import {
  DotLoader,
  BASE_API_URL,
  copyText,
  addToUserActivity,
} from "../../utils.js";
import styles from "./styles/index.module.css";

//product component
const Product = ({ product }) => {
  //declare/get variables
  const [isShared, setShared] = useState(false);
  const [isHearted, setHearted] = useState(false);
  const [isPinned, setPinned] = useState(false);
  const [heartVal, setHeartVal] = useState(product.hearts);
  const [pinVal, setPinVal] = useState(product.pins);

  const { user, isdarkMode } = useSelector((state) => state.Navbar);
  const dispatch = useDispatch();
  const router = useRouter();

  //share function to talk with backend
  const _shareProduct = async () => {
    //if shared send share+ request to the backend
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
      //else send share- request to the backend
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

    //toggle share variables
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

  //heart function to talk with backend and frontend
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

  //use useEffect hook to check if user hearted/pinned the product
  useEffect(() => {
    const checkHeartPin = async () => {
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

    checkHeartPin();
  }, []);

  return (
    //main product containee
    <div
      className={isdarkMode ? styles.main_container_dm : styles.main_container}
    >
      {/* product image container */}
      <div className={styles.image_container}>
        <Image
          src={product.image}
          alt={product.title}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      {/* product date container */}
      <div className={styles.date_container}>
        <p
          style={{
            color: `${product.is_white_date_color ? "#fff" : "#000"}`,
          }}
        >
          {product.created} - {product.vendor}
        </p>
      </div>
      {/* product utils container */}
      <div className={styles.main_utils_container}>
        {/* heart utils container */}
        <motion.div whileTap={{ scale: 2 }}>
          <div
            onClick={() => heartProduct()}
            style={{ opacity: isHearted ? "1" : "0.6" }}
            className={
              isdarkMode ? styles.utils_container_dm : styles.utils_container
            }
          >
            <p>
              {heartVal > 999 ? `${(heartVal / 1000).toFixed(1)}k` : heartVal}
            </p>
            <i className="fa fa-heart text-red-600"></i>
          </div>
        </motion.div>

        {/* pin utils container */}
        <motion.div whileTap={{ scale: 2 }}>
          <div
            onClick={() => pinProduct()}
            style={{ opacity: isPinned ? "1" : "0.6" }}
            className={
              isdarkMode ? styles.utils_container_dm : styles.utils_container
            }
          >
            <p>{pinVal > 999 ? `${(pinVal / 1000).toFixed(1)}k` : pinVal}</p>
            <i className="fa fa-thumb-tack" style={{ color: "#0ea5e9" }}></i>
          </div>
        </motion.div>
      </div>

      {/* product info container */}
      <div className={styles.info_container}>
        <h1>{product.title}</h1>
        <p>{product.snippet}</p>
        <p>
          <b>Price</b>: ${product.price}
        </p>

        {/* product button container */}
        <div style={{ display: "flex" }}>
          {/* product buy now button container */}
          <motion.div style={{ width: "100%" }} whileTap={{ scale: 2 }}>
            <div
              onClick={() => {
                addToUserActivity(product.category);
                router.push(product.vendor_affliate_link);
              }}
              className={
                isdarkMode ? styles.btn_container_dm : styles.btn_container
              }
            >
              <h1>buy now</h1>
            </div>
          </motion.div>

          {/* product detail button container */}
          <motion.div style={{ height: "100%" }} whileTap={{ scale: 2 }}>
            <div
              className={
                isdarkMode ? styles.share_container_dm : styles.share_container
              }
              onClick={() => {
                addToUserActivity(product.category);
                router.push(`store/${product.pk}/detail`);
                dispatch(setActivePage({ page_name: "store/detail" }));
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
                isdarkMode ? styles.share_container_dm : styles.share_container
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

//category component
const Categories = ({ categories }) => {
  //declare/get variables
  const { isdarkMode } = useSelector((state) => state.Navbar);
  const { activeCategory } = useSelector((state) => state.Store);

  const dispatch = useDispatch();

  //return render code block
  return (
    <div
      className={
        isdarkMode
          ? styles.categories_main_container_dm
          : styles.categories_main_container
      }
    >
      {/* sign container */}
      <div className={styles.sign_tab}>
        <h1>Categories</h1>
      </div>

      {/* categories container */}
      <div
        className={
          isdarkMode
            ? styles.categories_container_dm
            : styles.categories_container
        }
      >
        {/* categories item container */}
        <motion.div
          key={"general"}
          onClick={() =>
            dispatch(
              setActiveCategory({
                active_category: ["general", -1],
              })
            )
          }
          className={activeCategory[0] == "general" && styles.is_active}
          whileTap={{ scale: 1.5 }}
        >
          <h2>General</h2>
        </motion.div>

        {/* forloop to generate other categories item */}
        {categories.map((category, index) => (
          <motion.div
            key={category.title}
            onClick={() =>
              dispatch(
                setActiveCategory({
                  active_category: [category.title, index],
                })
              )
            }
            className={activeCategory[0] == category.title && styles.is_active}
            whileTap={{ scale: 1.5 }}
          >
            <h2>{category.title}</h2>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

//stats component
const DesktopStats = () => {
  //declare/get variables
  const { isdarkMode } = useSelector((state) => state.Navbar);
  const [stats, setStats] = useState(null);

  //use useEffect code block to get stats info
  useEffect(() => {
    const getStats = async () => {
      const res = await fetch(`${BASE_API_URL}/api/store/stats/`);
      const json_data = await res.json();
      setStats(json_data);
    };
    getStats();
  }, []);

  //return render code block
  return (
    //main container
    <div
      className={
        isdarkMode
          ? styles.stats_main_container_dm
          : styles.stats_main_container
      }
    >
      {/* title container */}
      <div className={styles.sign_tab}>
        <h1>Stats</h1>
      </div>

      {/* stats container */}
      <div
        className={
          isdarkMode ? styles.stats_container_dm : styles.stats_container
        }
      >
        <div>
          <i className="fa fa-shopping-cart"></i>
          <h2>{stats ? stats.products : 0} Products</h2>
        </div>
        <div>
          <i className="fa fa-thumb-tack"></i>
          <h2>{stats ? stats.pins : 0} Pins</h2>
        </div>
        <div>
          <i className="fa fa-heart"></i>
          <h2>{stats ? stats.hearts : 0} Hearts</h2>
        </div>
      </div>
    </div>
  );
};

const MainProductsContainer = ({ product_arr, categories }) => {
  //declare/get variables
  const [tempProducts, setTempProducts] = useState(product_arr.result);
  const [containerHeight, setContainerHeight] = useState(400);
  const [current_page, setCurrentPage] = useState(product_arr.current_page);
  const [total_pages, setTotalPages] = useState(product_arr.total_pages);
  const [hasMore, setHasMore] = useState(true);

  const { activeCategory } = useSelector((state) => state.Store);
  const { user, isdarkMode, isFiltered } = useSelector((state) => state.Navbar);

  //slugify function
  const slugify = (string) => {
    return string.toLowerCase().replace(/\s+/g, "-");
  };

  //get more products function
  const getMoreProducts = async () => {
    //if current_page < total_pages fetch more products
    if (current_page < total_pages) {
      //check if products is filtered
      if (isFiltered) {
        //check if active category is "general"
        if (activeCategory[1] == -1) {
          const res_prod = await fetch(
            //fetch custom queryset if user is signed in else fetch regular queryset
            `${BASE_API_URL}/api/store/?${
              user ? `uid=${user.user_id}&` : ""
            }page_num=${current_page + 1}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(
                JSON.parse(localStorage.getItem("userActivity"))
              ),
            }
          );
          const json_data_prod = await res_prod.json();

          //set variables
          setCurrentPage(json_data_prod.current_page);
          setTempProducts(tempProducts.concat(json_data_prod.result));
        } else {
          //fetch products in choose category
          const res_prod = await fetch(
            `${BASE_API_URL}/api/store/categories/${slugify(
              activeCategory[0]
            )}/products/?page_num=${current_page + 1}`
          );
          const json_data_prod = await res_prod.json();

          //set variables
          setCurrentPage(json_data_prod.products.current_page);
          setTempProducts(tempProducts.concat(json_data_prod.products.result));
        }
      }
    } else {
      //set has more to false
      setHasMore(false);
    }
  };

  //set string array
  const [blankCategoriesTexts, setBlankCategoriesTexts] = useState([
    "a pretty empty category,innit!",
    "keep moving nothing to see here!",
    "you saw nothing,next!",
    "-blank by nothing",
    "hey,your not suppose to be here!",
    "can't someone working in secret anymore",
    "man,no privacy anywhere!",
    "dude or dudess pick another cati-gori",
    "still underconstruction,move man!",
    "pretty spacious here!",
  ]);

  //use useEffect hook to track product_arr change
  useEffect(() => {
    //set height accoring to  results length
    //set products
    setContainerHeight(window.innerHeight * 0.79);
    setTempProducts(product_arr.result);
    //set hasMore
    if (product_arr.current_page < product_arr.total_pages) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }

    //set current_page variable
    setCurrentPage(product_arr.current_page);

    //set scrollComponent to top:0
    document.querySelector("#scrollComponent").scrollTo({
      top: 0,
      left: 0,
      behaviour: "smooth",
    });

    //watch product_arr for change
  }, [product_arr]);

  //return render code block
  return (
    //main container
    <div
      style={{
        display: "flex",
        height: "100%",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      {/*scroll component container */}
      <div
        className={
          isdarkMode ? styles.product_container_dm : styles.product_container
        }
        id="scrollComponent"
      >
        {/* react infinite scroll component */}
        <InfiniteScroll
          className={
            isdarkMode ? styles.infinite_scroll_dm : styles.infinite_scroll
          }
          height={containerHeight}
          dataLength={tempProducts.length}
          next={getMoreProducts}
          hasMore={hasMore}
          loader={tempProducts && <DotLoader />}
          scrollableTarget={"scrollComponent"}
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          {/* forloop through products */}
          {tempProducts && tempProducts[0] ? (
            tempProducts.map((product) => (
              <Product product={product} key={product.pk} />
            ))
          ) : (
            // return empty container banner
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                fontFamily: "Pacifico",
                alignItems: "center",
                fontSize: "35px",
              }}
            >
              <h1>{blankCategoriesTexts[parseInt(Math.random() * 10)]}</h1>
            </div>
          )}
        </InfiniteScroll>
      </div>

      {/* categories and stats components container */}
      <div style={{ height: "100%", marginTop: "8px" }}>
        <Categories categories={categories} />
        <DesktopStats />
      </div>
    </div>
  );
};

//export default component
export default MainProductsContainer;
