//import framework and third-party packages
import { motion, useAnimationControls } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Image from "next/image";

//import custom styles and methods
import {
  setActivePage,
  logoutUser,
  toggleDarkmode,
  setAuthTokens,
  toggleStoreVisible,
  setIsLoading,
} from "./Navbar.slice";
import styles from "./index.module.css";
import { BASE_API_URL, copyText } from "../utils.js";

//Navbar component
const Navbar = () => {
  //get and declare variables
  const {
    tempCurrentPage,
    isAuthenticated,
    isactiveStore,
    isdarkMode,
    isactivePage,
    user,
  } = useSelector((state) => state.Navbar);

  const dispatch = useDispatch();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const shake = useAnimationControls();
  const [firstRender, setFirstRender] = useState(true);

  //functiom to get new updateTokens
  const updateTokens = async (refresh_token) => {
    //fetch new token/refresh token
    if (user) {
      const getRefreshToken = await fetch(
        `${BASE_API_URL}/auth/token/refresh/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh: `${refresh_token}`,
          }),
        }
      );
      const data = await getRefreshToken.json();
      //check refresh token if 200 set new token else log user out
      if (getRefreshToken.status == 200) {
        localStorage.setItem("authTokens", JSON.stringify(data));
        return true;
      } else {
        //log user out
        dispatch(logoutUser());
        router.push("/");
        toast.error("CONNECTION ERROR!!!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: `colored`,
        });

        setTimeout(() => {
          toast.error("LOGGED OUT", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: `${isdarkMode ? "dark" : "light"}`,
          });
        }, 2500);
        setTimeout(() => {
          toast.warning("PLEASE LOGIN AGAIN", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: `${isdarkMode ? "dark" : "light"}`,
          });
        }, 4000);

        return false;
      }
    }
    return false;
  };

  //run after load to get is store is activated
  //set interval to keep user connected
  useEffect(() => {
    //async function to check if store is activated
    const checkStoreActive = async () => {
      const res = await fetch(`${BASE_API_URL}/api/home/1/`);
      const data = await res.json();
      if (data.is_store_visible) {
        dispatch(toggleStoreVisible({ isactiveStore: true }));
      }
    };
    //call checkStoreActive dunction
    checkStoreActive();

    var isConnectedIntervalID;

    //check if token exists
    if (
      localStorage.getItem("authTokens") &&
      JSON.parse(localStorage.getItem("authTokens")).refresh
    ) {
      //set tokens and set interval to keep user connected
      dispatch(
        setAuthTokens({
          authTokens: JSON.parse(localStorage.getItem("authTokens")),
        })
      );

      //declare interval
      isConnectedIntervalID = setInterval(async () => {
        //variable to hold connection state
        const isConnected = await updateTokens(
          localStorage.getItem("authTokens") &&
            JSON.parse(localStorage.getItem("authTokens")).refresh
        );

        //if user disconnected clear interval
        if (!isConnected) {
          clearInterval(isConnectedIntervalID);
        }

        //call every 20 secs
      }, 20000);
    }

    return () => {
      clearInterval(isConnectedIntervalID);
    };
  }, []);

  //function to reset search field to blank
  const reset_searchTerm = () => {
    if (isactivePage != "search") {
      setSearchTerm("");
    }
  };

  //redirect user between pages and setloading layout to true
  useEffect(() => {
    //create userActivityData Obj

    if (!localStorage.getItem("userActivity")) {
      localStorage.setItem(
        "userActivity",
        JSON.stringify({
          data: [],
        })
      );
    }

    if (!firstRender) {
      switch (isactivePage) {
        case "dashboard":
          router.push("/dashboard/");
          if (tempCurrentPage != isactivePage) {
            dispatch(setIsLoading({ isloading: true }));
          }
          reset_searchTerm();
          return;
        case "articles":
          router.push("/articles/");
          if (tempCurrentPage != isactivePage) {
            dispatch(setIsLoading({ isloading: true }));
          }
          reset_searchTerm();
          return;
        case "home":
          router.push("/");
          if (tempCurrentPage != isactivePage) {
            dispatch(setIsLoading({ isloading: true }));
          }
          reset_searchTerm();
          return;
        case "signup":
          router.push("/auth/signup/");
          if (tempCurrentPage != isactivePage) {
            dispatch(setIsLoading({ isloading: true }));
          }
          reset_searchTerm();
          return;
        case "login":
          router.push("/auth/login/");
          if (tempCurrentPage != isactivePage) {
            dispatch(setIsLoading({ isloading: true }));
          }
          reset_searchTerm();
          return;
        case "store":
          router.push("/store/");
          if (tempCurrentPage != isactivePage) {
            dispatch(setIsLoading({ isloading: true }));
          }
          reset_searchTerm();
          return;
        case "about-us":
          router.push("/about-us/");
          if (tempCurrentPage != isactivePage) {
            dispatch(setIsLoading({ isloading: true }));
          }
          reset_searchTerm();
          return;
        default:
          return;
      }
    } else {
      setFirstRender(false);
    }
  }, [isactivePage]);

  return (
    //main navbar container
    <div
      className={
        isdarkMode
          ? styles.navbar_main_container_dm
          : styles.navbar_main_container
      }
    >
      {/*navbar sub container */}
      <div className={styles.navbar_main_sub_container}>
        {/* logo container */}
        <div
          className={
            isdarkMode ? styles.logo_container_dm : styles.logo_container
          }
        >
          <motion.h1
            drag
            dragConstraints={{
              top: 10,
              bottom: -10,
              left: -10,
              right: 10,
            }}
          >
            T
          </motion.h1>
          <motion.h1
            drag
            dragConstraints={{
              top: 10,
              bottom: -10,
              left: -10,
              right: 10,
            }}
          >
            M
          </motion.h1>
        </div>

        {/* toggle darkmode icon container [hidden when on desktop] */}
        <motion.div
          whileTap={{ scale: 2 }}
          onClick={() => dispatch(toggleDarkmode())}
          className={styles.dark_mode_toggle_container_m}
        >
          {isdarkMode ? (
            <i style={{ color: "#fff" }} className="fa fa-sun"></i>
          ) : (
            <i className="fa fa-moon"></i>
          )}
        </motion.div>
        {/* menu container */}
        <div className={styles.menu_container}>
          {/* mini menu container */}
          <ul
            className={
              isdarkMode
                ? styles.mini_menu_container_dm
                : styles.mini_menu_container
            }
          >
            <li>
              <a
                onClick={() => {
                  dispatch(setActivePage({ page_name: "home" }));
                }}
              >
                home
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  dispatch(setActivePage({ page_name: "articles" }));
                }}
              >
                articles
              </a>
            </li>
            {/*if store is active render store link */}
            {isactiveStore && (
              <li>
                <a
                  onClick={() => {
                    dispatch(
                      setActivePage({
                        page_name: "store",
                      })
                    );
                  }}
                >
                  store
                </a>
              </li>
            )}
            <li>
              <a
                onClick={() => {
                  dispatch(setActivePage({ page_name: "about-us" }));
                }}
              >
                about us
              </a>
            </li>
            {/* if user is logged in show dashboard link.*/}
            {isAuthenticated && (
              <li>
                <a
                  onClick={() => {
                    dispatch(
                      setActivePage({
                        page_name: "dashboard",
                      })
                    );
                  }}
                >
                  dashboard
                </a>
              </li>
            )}
          </ul>
          {/* toggle darkmodecontainer [hidden on mobile] */}
          <div className={styles.main_btn_container}>
            <motion.div
              whileTap={{ scale: 2 }}
              className={styles.dark_mode_toggle_container_w}
              onClick={() => dispatch(toggleDarkmode())}
            >
              {isdarkMode ? (
                <i style={{ color: "#fff" }} className="fa fa-sun"></i>
              ) : (
                <i className="fa fa-moon"></i>
              )}
            </motion.div>
            {/* if logged in show logout container */}
            {isAuthenticated && (
              <motion.div
                onClick={() => {
                  dispatch(logoutUser());
                  router.push("/");
                }}
                whileTap={{ scale: 2 }}
                className={styles.logout_container}
              >
                <span>log out</span>
                <i className="fa fa-sign-out"></i>
              </motion.div>
            )}
            {/* if not logged in show login container [login container ]*/}
            {!isAuthenticated && (
              <motion.div
                onClick={() => {
                  dispatch(setActivePage({ page_name: "login" }));
                }}
                whileTap={{ scale: 2 }}
                className={styles.login_container}
              >
                <span>log in</span>
                <i className="fa fa-sign-in"></i>
              </motion.div>
            )}
            {/* if not logged in show sign up container [sign up container]*/}
            {!isAuthenticated && (
              <motion.div
                onClick={() => {
                  dispatch(setActivePage({ page_name: "signup" }));
                }}
                whileTap={{ scale: 2 }}
                className={styles.signup_container}
              >
                <span>sign up</span>
                <i className="fa fa-user-plus"></i>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* search container */}
      <div
        className={
          isdarkMode ? styles.search_container_dm : styles.search_container
        }
      >
        <div>
          <motion.input
            type="text"
            placeholder="Search"
            animate={shake}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* search container */}
        <motion.div
          onClick={() => {
            if (searchTerm != "") {
              router.push(`/search/?q=${searchTerm}`);
              if (tempCurrentPage != isactivePage) {
                dispatch(setIsLoading({ isloading: true }));
              }
            } else {
              //do shake animation
              shake.start({
                rotate: [-4, 3, -3, 2, -2, 1, -1, 0],
                transition: {
                  duration: 0.5,
                  type: "spring",
                  damping: 10,
                },
              });
            }

            dispatch(setActivePage({ page_name: "search" }));
          }}
          whileTap={{ scale: 2 }}
        >
          <i className="fa fa-search"></i>
        </motion.div>
      </div>
    </div>
  );
};

//mobile nabar
const MobileNavbar = () => {
  //declare and get variables
  const {
    tempCurrentPage,
    isactivePage,
    isAuthenticated,
    isactiveStore,
    isdarkMode,
  } = useSelector((state) => state.Navbar);
  const dispatch = useDispatch();
  const router = useRouter();
  const [firstRender, setFirstRender] = useState(true);

  //redirect user between oages and setloading layout to true
  useEffect(() => {
    if (!firstRender) {
      switch (isactivePage) {
        case "dashboard":
          router.push("/dashboard/");
          if (tempCurrentPage != isactivePage) {
            dispatch(setIsLoading({ isloading: true }));
          }
          return;
        case "articles":
          router.push("/articles/");
          if (tempCurrentPage != isactivePage) {
            dispatch(setIsLoading({ isloading: true }));
          }
          return;
        case "home":
          router.push("/");
          if (tempCurrentPage != isactivePage) {
            dispatch(setIsLoading({ isloading: true }));
          }
          return;
        case "signup":
          router.push("/auth/signup/");
          if (tempCurrentPage != isactivePage) {
            dispatch(setIsLoading({ isloading: true }));
          }
          return;
        case "login":
          router.push("/auth/login/");
          if (tempCurrentPage != isactivePage) {
            dispatch(setIsLoading({ isloading: true }));
          }
          return;
        case "store":
          router.push("/store/");
          if (tempCurrentPage != isactivePage) {
            dispatch(setIsLoading({ isloading: true }));
          }
          return;
        default:
          return;
      }
    } else {
      setFirstRender(false);
    }
    dispatch(setIsLoading({ isloading: false }));
  }, [isactivePage]);

  return (
    <motion.div
      className={
        isdarkMode ? styles.mnmenu_container_dm : styles.mnmenu_container
      }
    >
      {/* mobile navbar options container*/}
      <div
        className={
          isdarkMode
            ? styles.mnmenu_options_container_dm
            : styles.mnmenu_options_container
        }
      >
        <div
          onClick={() => dispatch(setActivePage({ page_name: "articles" }))}
          className={isactivePage == "articles" && styles.mnis_active}
        >
          <motion.i
            whileTap={{ scale: 3 }}
            className="far fa-newspaper"
          ></motion.i>
        </div>
        <div
          onClick={() => dispatch(setActivePage({ page_name: "home" }))}
          className={isactivePage == "home" && styles.mnis_active}
        >
          <motion.i
            whileTap={{ scale: 3 }}
            transition={{ duration: 0.2 }}
            className="fa fa-home"
          ></motion.i>
        </div>
        {/* if store is active show store icon container */}
        {isactiveStore && (
          <div
            onClick={() => dispatch(setActivePage({ page_name: "store" }))}
            className={isactivePage == "store" && styles.mnis_active}
          >
            <motion.i
              whileTap={{ scale: 3 }}
              className="fa fa-store"
            ></motion.i>
          </div>
        )}
        {/* if user is logged in show dashboard icon container */}
        {isAuthenticated && (
          <div
            onClick={() => dispatch(setActivePage({ page_name: "dashboard" }))}
            className={isactivePage == "dashboard" && styles.mnis_active}
          >
            <motion.i whileTap={{ scale: 3 }} className="fa fa-user"></motion.i>
          </div>
        )}
      </div>
      {/* button container */}
      <div
        className={
          !isAuthenticated
            ? styles.mnmenu_btns_containers
            : styles.mnmenu_btns_containers_isauth
        }
      >
        {/* if user is not logged in show login button container */}
        {!isAuthenticated && (
          <motion.div
            whileTap={{ scale: 1.5 }}
            onClick={() => dispatch(setActivePage({ page_name: "login" }))}
            className={styles.mnlogin_container}
          >
            <span>log in</span>
            <i className="fa fa-sign-in"></i>
          </motion.div>
        )}
        {/* if user is  not logged in show sign up button container */}
        {!isAuthenticated && (
          <motion.div
            whileTap={{ scale: 1.5 }}
            onClick={() => dispatch(setActivePage({ page_name: "signup" }))}
            className={styles.mnsignup_container}
          >
            <span>sign up</span>
            <i className="fa fa-user-plus"></i>
          </motion.div>
        )}
        {/* if user is logged in show logout button */}
        {isAuthenticated && (
          <motion.div
            whileTap={{ scale: 1.5 }}
            className={styles.mnlogout_container}
            onClick={() => {
              dispatch(logoutUser());
              router.push("/");
            }}
          >
            <span>log out</span>
            <i className="fa fa-sign-out"></i>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const PartnersContainer = ({ partners }) => {
  return (
    <div className={styles.affliate_partners_container}>
      <div style={{ textAlign: "center" }}>
        <div style={{ marginBottom: "20px" }}>
          <h1>Affliate Partners</h1>
        </div>
        <div className={styles.affliates_brand_container}>
          {partners.map((partner) => (
            <div className={styles.affliate_partner}>
              <div>
                <Image
                  src={partner.logo_url}
                  alt={partner.title}
                  layout={"fill"}
                />
              </div>
              <h1>{partner.title}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
const FootNavbar = () => {
  //declare variables
  const { tempCurrentPage, isdarkMode } = useSelector((state) => state.Navbar);
  const router = useRouter();

  const dispatch = useDispatch();

  const linkHandler = (link) => {
    if (tempCurrentPage != link) {
      dispatch(setActivePage({ page_name: link }));
      dispatch(setIsLoading({ isloading: true }));
      router.push(`/${link}/`);
    }
  };

  const [partners, setPartners] = useState([]);
  useEffect(() => {
    const getPartners = async () => {
      const partners_res = await fetch(
        `${BASE_API_URL}/api/home/affliate_partners/`
      );
      const partners_json = await partners_res.json();
      setPartners(partners_json.partners);
    };

    getPartners();
  }, []);

  return (
    <div className={styles.fnmain_container}>
      {/* import info container */}
      <div className={styles.fnuseful_info_container}>
        {/* logo container */}
        <div className={styles.fnlogo_container}>
          <motion.h1
            drag
            dragConstraints={{
              top: 10,
              bottom: -10,
              left: -10,
              right: 10,
            }}
          >
            T
          </motion.h1>
          <motion.h1
            drag
            dragConstraints={{
              top: 10,
              bottom: -10,
              left: -10,
              right: 10,
            }}
          >
            M
          </motion.h1>
        </div>
        {/*  useful links container */}
        <div className={styles.fnuseful_link_container}>
          <h1>Useful</h1>
          <ul>
            <li>
              <a onClick={() => linkHandler("about-us")}>About Us</a>
            </li>
            <li>
              <a onClick={() => linkHandler("privacy-policy")}>
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/sitemap.xml">Sitemap</a>
            </li>
          </ul>
        </div>
        {/* share button container */}
        <div>
          <motion.div
            onClick={() => {
              copyText(`${BASE_API_URL}`);

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
            }}
            whileTap={{ scale: 2 }}
            className={styles.fnshare_btn}
          >
            <h1>SHARE</h1>
            <i className="fa fa-share"></i>
          </motion.div>
        </div>
      </div>
      {/* disclaimer container */}
      <div
        style={{
          fontFamily: "Open Sans",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <h1>
          <b>*Disclaimer</b>:we may get commission off some affliate links
        </h1>
      </div>
      {partners[0] && (
        <div>
          <hr />
          <PartnersContainer partners={partners} />
        </div>
      )}
      <hr />
      {/* copyright and terms & condition container */}
      <div
        style={{
          fontFamily: "Open Sans",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <p>
          <b>© 2023 Twiddlemart</b>,all rights reserved.
        </p>
        <p>
          <a
            href="/terms-and-conditions/"
            onClick={() => linkHandler("terms-and-conditions")}
          >
            Terms & Condition
          </a>
        </p>
      </div>
    </div>
  );
};

export { FootNavbar, MobileNavbar, Navbar };
