//import third-party and framework packages
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";

//import styles,variables and packages
import styles from "../../styles/Pages/StorePage/StorePage.module.css";
import MainDesktopProductsContainer from "../../Components/StorePage/MainDesktopProductsContainer";
import MainMobileProductsContainer from "../../Components/StorePage/MainMobileProductsContainer";
import {
  setActivePage,
  setTempCurrentPage,
  setIsLoading,
  setIsFiltered,
} from "../../Components/Navbar/Navbar.slice";
import { BASE_API_URL } from "../../Components/utils.js";
import SEOHeader from "../SeoHeader";

//store page component
const store = ({ data, categories }) => {
  //declare/get variables
  const [ismobile, setIsMobile] = useState(false);
  const [products, setProducts] = useState(data);
  const dispatch = useDispatch();

  const { user, isdarkMode } = useSelector((state) => state.Navbar);
  const { activeCategory } = useSelector((state) => state.Store);

  //use useEffect check if is mobile screen and cudtom queryset if user is logged
  useEffect(() => {
    //default isFiltered to false
    dispatch(setIsFiltered({ is_filtered: false }));

    //function to get custom queryset
    const getFilteredProducts = async () => {
      const res_prod = await fetch(
        `${BASE_API_URL}/api/store/?${
          user ? `uid=${user.user_id}&` : ``
        }page_num=1`,
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
      setProducts(json_data_prod);
      dispatch(setIsFiltered({ is_filtered: true }));
    };

    //function call
    getFilteredProducts();

    //check if is mobile or desktop screen
    if (window.innerWidth <= 720) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }

    //set variables
    dispatch(setActivePage({ page_name: "store" }));
    dispatch(setIsLoading({ isloading: false }));
    dispatch(setTempCurrentPage({ page_name: "store" }));
  }, []);

  //slugify method
  const slugify = (string) => {
    return string.toLowerCase().replace(/\s+/g, "-");
  };

  //use useEffect to watch for category change
  useEffect(() => {
    //category querydet load function
    const categoryChange = async () => {
      //if category is general fetch geberal queryset
      if (activeCategory[1] == -1) {
        const res_prod = await fetch(
          `${BASE_API_URL}/api/store/?${
            user ? `uid=${user.user_id}&` : ``
          }page_num=1`,
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
        setProducts(json_data_prod);
      } else {
        //get category queryset
        const res_art = await fetch(
          `${BASE_API_URL}/api/store/categories/${slugify(
            activeCategory[0]
          )}/products/?page_num=1`
        );
        const json_data_prod = await res_art.json();
        setProducts(json_data_prod.products);
      }
    };

    //call function
    categoryChange();
  }, [activeCategory[0]]);

  //return render code block
  return (
    //main container
    <div style={{ position: "relative" }}>
      {/* SEO component */}
      <SEOHeader
        page_title={"Store"}
        meta_desc={
          "Here are TwiddleMart,we do our best to bring you the best of products according to your taste,bringing the fun to you."
        }
        canonical_url={`${BASE_API_URL}/store`}
      />
      {/* wave container */}
      <div>
        {/* wave 1 container */}
        <div className={styles.wave1}>
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className={
                isdarkMode
                  ? styles.wave1_shape_fill_dm
                  : styles.wave1_shape_fill
              }
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
              className={styles.wave2_shape_fill}
            ></path>
          </svg>
        </div>

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
              className={styles.wave3_shape_fill}
            ></path>
          </svg>
        </div>
      </div>

      {/* components container */}
      <div className={styles.main_container}>
        {/* if is mobile show only mobile store componet  else show desktop store component */}
        {!ismobile ? (
          <MainDesktopProductsContainer
            product_arr={products}
            categories={categories}
          />
        ) : (
          <MainMobileProductsContainer
            product_arr={products}
            categories={categories}
          />
        )}
      </div>
    </div>
  );
};

//server side props
export const getServerSideProps = async () => {
  //fetch store products data
  const products_res = await fetch(`${BASE_API_URL}/api/store/?page_num=1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: [],
    }),
  });
  const product_data = await products_res.json();

  //fetch store categories data
  const products_categories_res = await fetch(
    `${BASE_API_URL}/api/store/categories/`
  );
  const product_categories_data = await products_categories_res.json();

  return {
    props: {
      //props obj
      data: product_data,
      categories: product_categories_data,
    },
  };
};

export default store;
