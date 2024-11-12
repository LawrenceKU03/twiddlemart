//imoort framework and third-party packages
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";

//import cudtom styles,variables and methods
import categories_styles from "./styles/categories.module.css";
import product_styles from "./styles/product.module.css";
import product_container_styles from "./styles/product_container.module.css";
import { setActiveCategory } from "../Store.slice";
import { setActivePage, setIsLoading } from "../../Navbar/Navbar.slice";
import {
  BASE_API_URL,
  DotLoader,
  copyText,
  addToUserActivity,
} from "../../utils.js";

//categories component
const MobileCategories = ({ categories }) => {
  //declare/get variables
  const dispatch = useDispatch();
  const { isdarkMode } = useSelector((state) => state.Navbar);
  const { activeCategory } = useSelector((state) => state.Store);

  //return method code block
  return (
    //main container
    <div
      className={
        isdarkMode
          ? categories_styles.categories_main_container_dm
          : categories_styles.categories_main_container
      }
    >
      {/* categories item container */}
      <div
        className={
          isdarkMode
            ? categories_styles.category_items_container_dm
            : categories_styles.category_items_container
        }
      >
        {/* category filler container */}
        <div
          className={
            isdarkMode
              ? categories_styles.category_item_dm
              : categories_styles.category_item
          }
        ></div>

        {/* general category container */}
        <motion.div
          whileTap={{ scale: 1.5 }}
          onClick={() =>
            dispatch(
              setActiveCategory({
                active_category: ["general", -1],
              })
            )
          }
          className={
            isdarkMode
              ? activeCategory[0] == "general"
                ? categories_styles.category_item_tapped
                : categories_styles.category_item_dm
              : activeCategory[0] == "general"
              ? categories_styles.category_item_tapped
              : categories_styles.category_item
          }
          key={"general"}
        >
          <h1>General</h1>
        </motion.div>

        {/* forloop through categories to category items*/}
        {categories.map((category, index) => (
          <motion.div
            onClick={() =>
              dispatch(
                setActiveCategory({
                  active_category: [category.title, index],
                })
              )
            }
            key={category.title}
            whileTap={{ scale: 1.5 }}
            className={
              isdarkMode
                ? activeCategory[0] == category.title
                  ? categories_styles.category_item_tapped
                  : categories_styles.category_item_dm
                : activeCategory[0] == category.title
                ? categories_styles.category_item_tapped
                : categories_styles.category_item
            }
          >
            <h1>{category.title}</h1>
          </motion.div>
        ))}

        {/* category filler item container */}
        <div
          className={
            isdarkMode
              ? categories_styles.category_item_dm
              : categories_styles.category_item
          }
        ></div>
      </div>
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
    //if shared send share+ request to the backend else send share- request
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
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: `${isdarkMode ? "dark" : "light"}`,
    });

    //toggle share
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

  //pin function to talk with backend and frontend
  const pinProduct = () => {
    _pinProduct();
    setPinned(!isPinned);
    if (isPinned) {
      setPinVal(pinVal - 1);
    } else {
      setPinVal(pinVal + 1);
    }
  };

  //use useEffect to check if user heartee/pinned product
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

    //call function
    checkHeartPin();
  }, []);

  //return render  code block
  return (
    <div
      className={
        isdarkMode
          ? product_styles.main_container_dm
          : product_styles.main_container
      }
    >
      {/* product image container */}
      <div className={product_styles.image_container}>
        <Image
          src={product.image}
          alt={product.title}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>

      {/* product date container */}
      <div className={product_styles.date_container}>
        <p
          style={{
            color: `${product.is_white_date_color ? "#fff" : "#000"}`,
          }}
        >
          {product.created} - {product.vendor}
        </p>
      </div>

      {/* product utils container */}
      <div className={product_styles.main_utils_container}>
        {/* product heart util container */}
        <motion.div whileTap={{ scale: 2 }}>
          <div
            onClick={() => heartProduct()}
            style={{ opacity: isHearted ? "1" : "0.6" }}
            className={
              isdarkMode
                ? product_styles.utils_container_dm
                : product_styles.utils_container
            }
          >
            <p>
              {heartVal > 999 ? `${(heartVal / 1000).toFixed(1)}k` : heartVal}
            </p>
            <i className="fa fa-heart text-red-600"></i>
          </div>
        </motion.div>

        {/* product pin util container */}
        <motion.div whileTap={{ scale: 2 }}>
          <div
            onClick={() => pinProduct()}
            style={{ opacity: isPinned ? "1" : "0.6" }}
            className={
              isdarkMode
                ? product_styles.utils_container_dm
                : product_styles.utils_container
            }
          >
            <p>{pinVal > 999 ? `${(pinVal / 1000).toFixed(1)}k` : pinVal}</p>
            <i className="fa fa-thumb-tack" style={{ color: "#0ea5e9" }}></i>
          </div>
        </motion.div>
      </div>

      {/* product info container */}
      <div className={product_styles.info_container}>
        <h1>{product.title}</h1>
        <p>{product.snippet}</p>
        <p>
          <b>Price</b>: ${product.price}
        </p>
        {/* product buttons container */}
        <div style={{ display: "flex" }}>
          {/* product buy button container */}
          <motion.div style={{ width: "100%" }} whileTap={{ scale: 2 }}>
            <div
              onClick={() => {
                addToUserActivity(product.category);
                router.push(product.vendor_affliate_link);
              }}
              className={
                isdarkMode
                  ? product_styles.btn_container_dm
                  : product_styles.btn_container
              }
            >
              <h1>buy now</h1>
            </div>
          </motion.div>

          {/* product detail button container */}
          <motion.div style={{ height: "100%" }} whileTap={{ scale: 2 }}>
            <div
              className={
                isdarkMode
                  ? product_styles.share_container_dm
                  : product_styles.share_container
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
                isdarkMode
                  ? product_styles.share_container_dm
                  : product_styles.share_container
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

//main products components
const MainMobileProductsContainer = ({ product_arr, categories }) => {
  //declare/get products
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
    //check if current_page less than total_pages
    if (current_page < total_pages) {
      //check if products is filtered
      if (isFiltered) {
        //check if activeCategory is "general"
        if (activeCategory[1] == -1) {
          const res_prod = await fetch(
            //fetch custom queryset if user is signed in else fetch regular queryset
            `${BASE_API_URL}/api/store/?${
              user ? `uid=${user.user_id}&` : ``
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
          //fetch products from selected category
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

  //set variable
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

  //use useEffect to watch for changes in product_arr
  useEffect(() => {
    //set variables
    setContainerHeight(
      window.innerHeight * 0.25 * (product_arr.result.length + 1)
    );
    setTempProducts(product_arr.result);
    setCurrentPage(product_arr.current_page);

    //check if current_page less than total_pages to set hasMore
    if (product_arr.current_page < product_arr.total_pages) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }

    //set scrollComponent to top:0
    document.querySelector("#scrollComponent").scrollTo({
      top: 0,
      left: 0,
      behaviour: "smooth",
    });
  }, [product_arr]);

  return (
    //main store container
    <div style={{ height: "70%" }}>
      {/* categories component */}
      <MobileCategories categories={categories} />

      {/* products container */}
      <div
        className={
          isdarkMode
            ? product_container_styles.product_container_dm
            : product_container_styles.product_container
        }
        id="scrollComponent"
      >
        {/* react infinte scroll component */}
        <InfiniteScroll
          className={product_container_styles.infinte_scroll}
          height={containerHeight}
          dataLength={tempProducts.length}
          next={getMoreProducts}
          hasMore={hasMore}
          loader={tempProducts && <DotLoader />}
          scrollableTarget={"scrollComponent"}
        >
          {/* forloop throught products */}
          {tempProducts && tempProducts[0] ? (
            tempProducts.map((product) => (
              <Product product={product} key={product.pk} />
            ))
          ) : (
            //return empty products blank banner
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
    </div>
  );
};

//export default component
export default MainMobileProductsContainer;
