//franework/third-party packages
import InfiniteScroll from "react-infinite-scroll-component";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

//custom styles/functions/variables/components
import styles from "./styles/index.module.css";
import {
  setAccountKillDay,
  logoutUser,
  setIsLoading,
  setActivePage,
} from "../../Navbar/Navbar.slice";
import {
  BASE_API_URL,
  DotLoader,
  BlockLoader,
  copyText,
  addToUserActivity,
} from "../../utils.js";

//user profile component
const UserProfile = () => {
  //declare/get variables
  const { user, isdarkMode, isAccountKillDay } = useSelector(
    (state) => state.Navbar
  );

  const dispatch = useDispatch();
  const shakeScaleText = useAnimationControls();
  const [isloading, setLoading] = useState(false);
  const [isSending, setSending] = useState(false);
  const [is_verified, setIsVerified] = useState(false);
  const [pins, setPins] = useState(user ? user.total_user_pins : 0);
  const [hearts, setHearts] = useState(user ? user.total_user_hearts : 0);

  //function to resend verification email
  const resendVerificationEmail = () => {
    setLoading(true);
    setSending(true);

    fetch(`${BASE_API_URL}/api/home/resend_verification_email/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: user.user_id }),
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.success) {
          setSending(false);
        }
      });
  };

  useEffect(() => {
    setIsVerified(user ? user.is_verified : false);
  }, [user]);

  useEffect(() => {
    //set shake interval
    const interval = setInterval(() => {
      shakeScaleText.start({
        rotate: [-8, 8, 6, -6, 4, -4, 2, -2, 0],
        transition: {
          duration: 2,
          ease: "easeInOut",
        },
      });
    }, 30000);

    //set interval to get stats
    const stats_update_interval = setInterval(async () => {
      if (user) {
        const profile_stats_res = await fetch(
          `${BASE_API_URL}/api/home/user_hearts_pins_stats/?uid=${user.user_id}`
        );
        const profile_stats_json = await profile_stats_res.json();

        setHearts(profile_stats_json.hearts_n);
        setPins(profile_stats_json.pins_n);
      }
    }, 30000);

    return () => {
      //clear interval
      clearInterval(interval);
      clearInterval(stats_update_interval);
    };
  }, [user]);

  //return code block
  return (
    //main container
    <div
      className={
        isdarkMode
          ? styles.main_userprofile_container_dm
          : styles.main_userprofile_container
      }
    >
      {/* sign tab container */}
      <div
        className={styles.sign_container}
        style={!is_verified ? { background: "#ef4444" } : {}}
      >
        <motion.div whileTap={{ scale: 1.8 }}>
          <div
            className={
              isdarkMode
                ? styles.username_icon_container_dm
                : styles.username_icon_container
            }
          >
            <h1>{user ? user.username[0] : "T"}</h1>
          </div>
        </motion.div>

        {/* delete account icon container */}
        <div>
          <div
            onClick={() =>
              dispatch(
                setAccountKillDay({
                  isKillDay: !isAccountKillDay,
                })
              )
            }
            className={
              isdarkMode
                ? isAccountKillDay
                  ? styles.trash_can_activated_container
                  : styles.trash_can_container_dm
                : isAccountKillDay
                ? styles.trash_can_activated_container
                : styles.trash_can_container
            }
          >
            <motion.i
              whileTap={{ scale: 1.8 }}
              className="fa fa-trash-can"
            ></motion.i>
          </div>
        </div>
        {/* email snipper container */}
        <div>
          <p
            style={{
              color: "#fff",
              fontFamily: "Pacifico",
              margin: "10px 0",
              textAlign: "center",
            }}
          >
            {user ? user.email_snippet : "nobody@..."}
            {is_verified ? (
              <i className="fa fa-check-circle text-white ml-[5px]"></i>
            ) : (
              <i className="fa fa-circle-exclamation text-white ml-[5px]"></i>
            )}
          </p>

          {!is_verified && (
            <p>
              {!isloading ? (
                <>
                  <i
                    className="fa fa-hand-pointer animate-bounce text-white animate-ping"
                    style={{
                      position: "relative",
                      fontSize: "18px",
                      top: "-1px",
                      right: "-6.2px",
                    }}
                  ></i>
                  <i
                    className="fa fa-hand-pointer text-white"
                    style={{
                      fontSize: "18px",
                      position: "relative",
                      left: "-10px",
                    }}
                  ></i>
                  <motion.button
                    whileTap={{ scale: 1.8 }}
                    animate={shakeScaleText}
                    style={{
                      color: "#fff",
                      fontFamily: "'Roboto'",
                      texTransform: "uppercase",
                      outline: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => resendVerificationEmail()}
                  >
                    unverified
                  </motion.button>
                </>
              ) : (
                <div>
                  <b
                    style={{
                      color: "#fff",
                      fontFamily: "Roboto",
                      marginRight: "10px",
                    }}
                  >
                    {isSending ? "Sending..." : "Email sent"}
                  </b>
                  {isSending ? (
                    <i className="relative top-[8px] text-white fa fa-envelope animate_bounce"></i>
                  ) : (
                    <motion.i
                      className="fa fa-paper-plane text-white"
                      animate={{
                        rotate: [20, -20, 10, -10, 5, -5, 0],
                        transition: { duration: 1 },
                      }}
                    ></motion.i>
                  )}
                </div>
              )}
            </p>
          )}
        </div>
      </div>

      {/* user stats container */}
      <div className={styles.user_stats_container}>
        {/* total heart container */}
        <div>
          <i className="fa fa-heart"></i>

          <h1>{hearts} Hearts</h1>
        </div>

        {/* total pin container */}
        <div>
          <i className="fa fa-thumb-tack" />
          <h1>{pins} Pins</h1>
        </div>
      </div>
    </div>
  );
};

//category component
const Category = ({ title, space, addtoCategoryArray, isInterested }) => {
  //declare/get variables
  const [isClicked, setClicked] = useState(isInterested);
  const { isdarkMode } = useSelector((state) => state.Navbar);

  const Clicked = () => {
    setClicked(!isClicked);
    addtoCategoryArray(title);
  };

  //return filler category if space true else regular category
  return space ? (
    //filler category
    <div style={{ padding: "0 30px" }}></div>
  ) : (
    // category body container
    <motion.div
      whileTap={{ scale: 1.5 }}
      onClick={() => Clicked()}
      className={
        isClicked
          ? styles.mini_category_container_clicked
          : isdarkMode
          ? styles.mini_category_container_dm
          : styles.mini_category_container
      }
    >
      <h2>{title}</h2>
    </motion.div>
  );
};

//account delete component
const DeleteAccount = () => {
  //declare/get variables
  const { user, isAccountKillDay, isdarkMode } = useSelector(
    (state) => state.Navbar
  );
  const [desc, setDesc] = useState("");
  const [currentState, setCurrentState] = useState(0);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const shake = useAnimationControls();

  //delete account function
  const deleteAccount = async () => {
    setCurrentState(1);
    if (password != "") {
      const delete_res = await fetch(`${BASE_API_URL}/api/home/delete_user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          desc: desc,
          user_id: user.user_id,
          password: password,
        }),
      });
      const delete_json = await delete_res.json();
      if (delete_json.account_deleted) {
        dispatch(logoutUser());
        router.push("/");
      } else {
        shake.start({
          rotate: [-2, 2, -2, 2, -2, 2, -2, 0],
          transition: {
            duration: 0.5,
            type: "spring",
          },
        });
        setCurrentState(0);
      }
    } else {
      shake.start({
        rotate: [-2, 2, -2, 2, -2, 2, -2, 0],
        transition: {
          duration: 0.5,
          type: "spring",
        },
      });
      setCurrentState(0);
    }
  };

  return (
    //main container
    <div
      className={
        isdarkMode
          ? styles.delete_main_container_dm
          : styles.delete_main_container
      }
    >
      {/* title container */}
      <div className={styles.delete_main_title_container}>
        <h1>Delete</h1>
      </div>

      {/* info container */}
      <div>
        {/* warning container */}
        <div className={styles.delete_info_container}>
          <h2>Also not that this is not a reversible,once done.</h2>
        </div>

        {/* input field contianer */}
        <div className={styles.delete_input_container}>
          <textarea
            cols="4"
            rows="3"
            placeholder="Please,write short note before you leave,so we can know why you left."
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div>

        {/* authentication container */}
        <div className={styles.delete_password_container}>
          <motion.input
            onChange={(e) => setPassword(e.target.value)}
            className={styles.delete_container_input}
            type={showPassword ? "text" : "password"}
            placeholder="password"
            animate={shake}
          />
          {showPassword ? (
            <i
              onClick={() => setShowPassword(!showPassword)}
              className="fa fa-eye"
            ></i>
          ) : (
            <i
              onClick={() => setShowPassword(!showPassword)}
              className="fa fa-eye-slash"
            ></i>
          )}
        </div>
        {/* proceed button container */}
        {currentState == 0 && (
          <div className={styles.delete_btn_container_red}>
            <motion.button
              onClick={() => deleteAccount()}
              whileTap={{ scale: 1.8 }}
            >
              Proceed
            </motion.button>
          </div>
        )}

        {/* loading button container */}
        {currentState == 1 && (
          <motion.div
            whileTap={{ scale: 1.8 }}
            className={styles.delete_btn_container_blue}
          >
            <div></div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

//setting compnonet
const Settings = () => {
  //declare/get variables
  const { user, isdarkMode } = useSelector((state) => state.Navbar);
  const [categories, setCategories] = useState({});
  const [interested_categories, setInterestedCategories] = useState([]);
  const [currentState, setCurrentState] = useState(0);
  const [email, setEmail] = useState(user ? user.email : "");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswod, setShowPassword] = useState(false);
  const [isRequestSent, setRequestSent] = useState(false);
  const [is_verified, setIsVerified] = useState(false);

  const shake = useAnimationControls();

  //user authentication function
  const AuthUser = async () => {
    if (password != "") {
      setCurrentState(1);

      const isauth_res = await fetch(`${BASE_API_URL}/api/home/auth_user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const isauth_json = await isauth_res.json();
      //if the user is authenticate activate request update button
      //else shake to indicate not
      if (isauth_json.Authenticated) {
        setIsAuthenticated(true);
        setCurrentState(2);
      } else {
        setCurrentState(0);
        shake.start({
          rotate: [-2, 2, -2, 2, -2, 2, -2, 0],
          transition: {
            duration: 0.5,
            type: "spring",
          },
        });
      }
    } else {
      shake.start({
        rotate: [-2, 2, -2, 2, -2, 2, -2, 0],
        transition: {
          duration: 0.5,
          type: "spring",
        },
      });
    }
  };

  //check if categories exist utility function
  const isExists = (title, icategories) => {
    let exists = false;
    for (let indx in icategories) {
      if (icategories[indx] == title) {
        return true;
      }
    }
    return false;
  };

  //add new categorybl to array if not in
  //else remove category
  const addtoCategoryArray = (title) => {
    if (!isExists(title, interested_categories)) {
      setInterestedCategories([...interested_categories, title]);
    } else {
      setInterestedCategories(
        interested_categories.filter((category) => category != title)
      );
    }
  };

  //use useEffect to fetch category
  //set user email
  useEffect(() => {
    setEmail(user ? user.email : "");
    setInterestedCategories(user ? user.interested_categories : []);
    const getCategories = async () => {
      const cat_res = await fetch(`${BASE_API_URL}/api/home/categories/`);
      const cat_json = await cat_res.json();
      setCategories(cat_json);
    };
    getCategories();
  }, []);

  //function to send update requesy
  const updateRequest = async () => {
    setRequestSent(true);
    const update_res = await fetch(`${BASE_API_URL}/api/home/update_user/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user.username,
        email: email,
        interested_categories: interested_categories,
      }),
    });
    const update_json = await update_res.json();

    //reset function
    const reset = () => {
      setIsAuthenticated(false);
      setRequestSent(false);
      setCurrentState(0);
    };

    //if updated reset states
    if (update_json.updated) {
      toast.success("UPDATE SUCCESSFUL", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      reset();
    }
  };

  //reset function
  const reset_password = async () => {
    if (email != "") {
      toast.success("RESET EMAIL SENT", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      //send reset request
      const send_reset_res = await fetch(
        `${BASE_API_URL}/api/home/reset_user_password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );
    }
  };

  useEffect(() => {
    setIsVerified(user ? user.is_verified : false);
  }, [user]);

  //return code block
  return (
    //main container
    <div
      className={
        isdarkMode ? styles.settings_container_dm : styles.settings_container
      }
      style={!is_verified ? { pointerEvents: "none", opacity: "0.7" } : {}}
    >
      {/* sign container */}
      <div className={styles.sign_container}>
        <h1>Settings</h1>
      </div>
      {/* email container */}
      <div>
        <div className={styles.email_contiainer}>
          <label>Email:</label>
          <input
            type="email"
            placeholder={`${user ? user.email : "nobody@fakemail.com"}`}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* line */}
        <hr />

        {/* category contianer */}
        <div className={styles.categories_container}>
          {categories[0] &&
            categories.map((category, index) => (
              <Category
                title={category.title}
                key={index}
                isInterested={isExists(category.title, interested_categories)}
                addtoCategoryArray={addtoCategoryArray}
              />
            ))}
        </div>

        {/* line */}
        <hr />

        {/*  authentication container */}
        <div className={styles.password_container}>
          {/* password input field */}
          <motion.input
            onChange={(e) => setPassword(e.target.value)}
            type={showPasswod ? "text" : "password"}
            placeholder="Password"
            animate={shake}
          />

          {/* password visibilty container */}
          <div
            onClick={() => setShowPassword(!showPasswod)}
            className={styles.password_visibilty_container}
          >
            {showPasswod ? (
              <i className="fa fa-eye gray-200"></i>
            ) : (
              <i className="fa fa-eye-slash gray-200"></i>
            )}
          </div>

          {/* loading button */}
          {currentState == 1 && (
            <motion.button
              whileTap={{ scale: 1.8 }}
              className={styles.password_container_blue}
            >
              <div></div>
            </motion.button>
          )}

          {/* veirfy button */}
          {currentState == 0 && (
            <motion.button
              whileTap={{ scale: 1.8 }}
              className={styles.password_container_red}
              onClick={() => AuthUser()}
            >
              verify
            </motion.button>
          )}

          {/* verified */}
          {currentState == 2 && (
            <motion.button
              className={styles.password_container_green}
              whileTap={{ scale: 1.8 }}
            >
              verified
            </motion.button>
          )}
        </div>

        {/* update container */}
        <div>
          {/* update button */}
          <motion.button
            onClick={() => isAuthenticated && updateRequest()}
            whileTap={{ scale: 1.8 }}
            className={styles.request_container}
            style={{ opacity: isAuthenticated ? "1" : "0.5" }}
          >
            {isRequestSent ? "request sent" : "update"}
          </motion.button>
        </div>

        {/* notice tag */}
        <p style={{ margin: "10px 0px", color: "grey" }}>
          *changes will reflect on your next login.
        </p>

        {/* reset password container */}
        <div className={styles.reset_password}>
          <h1>
            Change Password? ,
            <span>
              <a onClick={() => reset_password()}>Reset</a>
            </span>
            .
          </h1>
        </div>
      </div>
    </div>
  );
};

//article component
const Article = ({ article, unPin }) => {
  //declare/get variables
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

  //heart function to talk with frontend/backend
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
      unPin(article.pk);
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

  //share function to talk with frontend/backend
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

  //use useEffect to check if is pinned/heart
  //alos get stats
  useEffect(() => {
    //function to check if pinned/hearted
    const checkisHeartedPinned = async () => {
      if (user) {
        //fetch heart data
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

        //fetch pin data
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

      //if stats not set  get/set stast
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

    //call function
    checkisHeartedPinned();
  }, []);

  //return code block
  return (
    //main article container
    <div className={styles.main_article_container}>
      {/* artixle container */}
      <div
        onClick={() => {
          addToUserActivity(article.category_slug);
          router.push(`articles/${article.slug}/detail`);
          dispatch(setActivePage({ page_name: `articles/detail` }));
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

      {/* line */}
      <hr />
    </div>
  );
};

//product component
const Product = ({ product, unPin }) => {
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
    //if !shared send share+ request
    //else send share- request
    if (!isShared) {
      fetch(`${BASE_API_URL}/store/`, {
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
      dispatch(AddORSubUserHearts({ actionCharge: -1 }));
    } else {
      setHeartVal(heartVal + 1);
      dispatch(AddORSubUserHearts({ actionCharge: -1 }));
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
      unPin(product.pk);
    } else {
      setPinVal(pinVal + 1);
    }
  };

  //use useEffect to check if pinned/hearted
  useEffect(() => {
    //function to check pinned/hearted
    const checkHeartPin = async () => {
      if (user) {
        //fetch heart data
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

        //fetch pin data
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
      {/* image container */}
      <div className={styles.product_image_container}>
        <Image
          src={product.image}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
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

      {/* utils container */}
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

      {/* info container */}
      <div className={styles.product_info_container}>
        <h1>{product.title}</h1>
        <p>{product.snippet}</p>
        <p>
          <b>Price</b>: ${product.price}
        </p>

        {/* button container */}
        <div style={{ display: "flex" }}>
          {/* buy button-div container */}
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

          {/* info button-div container */}
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
                dispatch(setActivePage({ page_name: `store/detail` }));
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

//pinned articles component
const PinnedArticlesContainer = () => {
  //declare/get variables
  const { user, isdarkMode, isactiveStore } = useSelector(
    (state) => state.Navbar
  );

  const [articles, setArticles] = useState(null);
  const [total_pages, setTotalPages] = useState(1);
  const [current_page, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [containerHeight, setContainerHeight] = useState(300);
  const [isEmpty, setIsEmpty] = useState(false);

  const dispatch = useDispatch();

  //function to unpin an article
  const unPin = (pk) => {
    setArticles(articles.filter((item) => item.pk != pk));
  };

  //function to get more pinned results
  const getMoreArticles = async () => {
    if (current_page < total_pages) {
      const pinned_articles_res = await fetch(
        `${BASE_API_URL}/api/articles/user_pinned_articles/?page_num=${
          current_page + 1
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.user_id,
          }),
        }
      );
      const pinned_articles_json = await pinned_articles_res.json();
      setArticles(articles.concat(pinned_articles_json.result));
      setTotalPages(pinned_articles_json.total_pages);
      setCurrentPage(pinned_articles_json.current_page);
    } else {
      setHasMore(false);
    }
  };

  //user useEffect to get oinned articles
  //set result depenedent variables
  useEffect(() => {
    const getArticles = async () => {
      const pinned_articles_res = await fetch(
        `${BASE_API_URL}/api/articles/user_pinned_articles/?page_num=1`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.user_id,
          }),
        }
      );
      const pinned_articles_json = await pinned_articles_res.json();
      setArticles(pinned_articles_json.result);
      setTotalPages(pinned_articles_json.total_pages);
      setCurrentPage(pinned_articles_json.current_page);

      setContainerHeight(window.innerHeight * 0.5 * 0.75);

      //check if more result exist
      if (
        pinned_articles_json.current_page < pinned_articles_json.total_pages
      ) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }

      //set emptt to true if nothing is pinned
      if (pinned_articles_json.result.length == 0) {
        setIsEmpty(true);
      }
    };

    //call function
    if (user) {
      getArticles();
    }
  }, [user]);

  //return code block
  return (
    //main container
    <div
      className={
        isdarkMode
          ? styles.main_pinned_container_dm
          : styles.main_pinned_container
      }
      style={{
        maxHeight: `${isactiveStore ? "42%" : "90%"}`,
      }}
    >
      {/* title container */}
      <div className={styles.pinned_title_container}>
        <h1>Pinned Articles</h1>
      </div>

      {/* infinite scroll component container */}
      <div>
        {/* infinite scroll component */}
        <InfiniteScroll
          dataLength={articles ? articles.length : 0}
          height={containerHeight}
          next={getMoreArticles}
          hasMore={hasMore}
          loader={articles && <DotLoader />}
          className={
            isdarkMode ? styles.infinite_scroll_dm : styles.infinite_scroll
          }
        >
          {/* empty pinned articles banner container */}
          {isEmpty && (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "30px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <i style={{ fontSize: "80px" }} className="fa fa-sad-tear"></i>
                <h1 style={{ fontFamily: "Pacifico", marginTop: "20px" }}>
                  Nothing Pinned
                </h1>
              </div>
            </div>
          )}

          {/* load articles if article else show loader icon */}
          {articles ? (
            articles.map((article) => (
              <Article article={article} unPin={unPin} key={article.pk} />
            ))
          ) : (
            // loader container
            <div
              style={{
                position: "absolute",
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
        </InfiniteScroll>
      </div>
    </div>
  );
};

//products pinned component
const PinnedProductsContainer = () => {
  //get/declare method
  const { user, isdarkMode } = useSelector((state) => state.Navbar);

  const [products, setProducts] = useState(null);
  const [total_pages, setTotalPages] = useState(1);
  const [current_page, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [containerHeight, setContainerHeight] = useState(350);
  const [isEmpty, setIsEmpty] = useState(false);

  const dispatch = useDispatch();

  //function to unPim product
  const unPin = (pk) => {
    setProducts(products.filter((item) => item.pk != pk));
  };

  //function to get more results
  const getMoreProducts = async () => {
    if (current_page < total_pages) {
      const pinned_products_res = await fetch(
        `${BASE_API_URL}/api/store/user_pinned_products/?page_num=${
          current_page + 1
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.user_id,
          }),
        }
      );
      const pinned_products_json = await pinned_products_res.json();

      setProducts(products.concat(pinned_products_json.result));
      setTotalPages(pinned_products_json.total_pages);
      setCurrentPage(pinned_products_json.current_page);
    } else {
      setHasMore(false);
    }
  };

  //use useEffect to get pinned products
  //set result dependent variables
  useEffect(() => {
    const getProducts = async () => {
      const pinned_products_res = await fetch(
        `${BASE_API_URL}/api/store/user_pinned_products/?page_num=1`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.user_id,
          }),
        }
      );
      const pinned_products_json = await pinned_products_res.json();
      setProducts(pinned_products_json.result);
      setTotalPages(pinned_products_json.total_pages);
      setCurrentPage(pinned_products_json.current_page);

      setContainerHeight(window.innerHeight * 0.5 * 0.75);

      //set hasMore
      if (
        pinned_products_json.current_page < pinned_products_json.total_pages
      ) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }

      if (pinned_products_json.result.length == 0) {
        setIsEmpty(true);
      }
    };
    if (user) {
      getProducts();
    }
  }, [user]);

  //return code block
  return (
    //main container
    <div
      className={
        isdarkMode
          ? styles.main_pinned_container_dm
          : styles.main_pinned_container
      }
    >
      {/* title container */}
      <div className={styles.pinned_title_container}>
        <h1>Pinned Products</h1>
      </div>

      {/* infinite scroll component container */}
      <div>
        {/* infinite scroll component */}
        <InfiniteScroll
          dataLength={products ? products.length : 0}
          height={containerHeight}
          next={getMoreProducts}
          hasMore={hasMore}
          loader={products && <DotLoader />}
          className={
            isdarkMode ? styles.infinite_scroll_dm : styles.infinite_scroll
          }
        >
          {/* empty pinned articles banner container */}
          {isEmpty && (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "30px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <i style={{ fontSize: "80px" }} className="fa fa-sad-tear"></i>
                <h1 style={{ fontFamily: "Pacifico", marginTop: "20px" }}>
                  Nothing Pinned
                </h1>
              </div>
            </div>
          )}

          {/* loop through products */}
          {products ? (
            products.map((product) => (
              <Product product={product} key={product.pk} unPin={unPin} />
            ))
          ) : (
            //loader container
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
              {/* loading container */}
              <BlockLoader />
            </div>
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

//desktop dashboard parent component
const DesktopDashboardContainer = () => {
  //get variable
  const { user, isAccountKillDay, isactiveStore } = useSelector(
    (state) => state.Navbar
  );

  const [is_verified, setIsVerified] = useState(false);

  useEffect(() => {
    setIsVerified(user ? user.is_verified : false);
  }, [user]);

  //return code block
  return (
    //main container
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-around",
      }}
    >
      {/* user profile/delet account component container */}
      <div>
        <UserProfile />
        {isAccountKillDay && <DeleteAccount />}
      </div>
      {/* pinned articles/pinned products component container */}
      <div
        style={
          is_verified
            ? { width: "45%", marginLeft: "-20px" }
            : {
                width: "45%",
                marginLeft: "-20px",
                opacity: "0.7",
                select: "none",
                pointerEvents: "none",
              }
        }
      >
        <PinnedArticlesContainer />
        {isactiveStore && <PinnedProductsContainer />}
      </div>

      {/* settings component */}
      <Settings />
    </div>
  );
};

export default DesktopDashboardContainer;
