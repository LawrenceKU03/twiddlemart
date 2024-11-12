//third-party/framework packages
import { motion, useAnimationControls } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

//custom styles/functions/variables/components
import styles from "./styles/index.module.css";
import { setAccountKillDay, logoutUser } from "../../Navbar/Navbar.slice";
import {
  BASE_API_URL,
  DotLoader,
  BlockLoader,
  copyText,
  addToUserActivity,
} from "../../utils.js";

//userprofile component
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
    //default loading/sending to true
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

    //set stats update interfval
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
      clearInterval(interval);
      clearInterval(stats_update_interval);
    };
  }, [user]);

  //return code block
  return (
    //main component container
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
          {/* user icon container */}
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

        {/* delete account trash can container */}
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
        {/* user eamil container */}
        <div>
          <p
            style={{
              color: "#fff",
              fontFamily: "Pacifico",
              margin: "10px 0",
            }}
          >
            {user ? user.email : "nobody@..."}
            {is_verified ? (
              <i className="fa fa-check-circle text-white ml-[5px]"></i>
            ) : (
              <i className="fa fa-circle-exclamation text-white ml-[5px]"></i>
            )}
          </p>

          {!is_verified && (
            <p>
              {!isloading ? (
                <div style={{ textAlign: "center" }}>
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
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
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
        <div>
          <i className="fa fa-heart"></i>

          <h1>{hearts} Hearts</h1>
        </div>
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
  //delcare/get variables
  const [isClicked, setClicked] = useState(isInterested);
  const { isdarkMode } = useSelector((state) => state.Navbar);

  //click function
  const Clicked = () => {
    setClicked(!isClicked);
    addtoCategoryArray(title);
  };

  //check if space category to return filler category else return category
  return space ? (
    <div style={{ padding: "0 30px" }}></div>
  ) : (
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

//delete account component
const DeleteAccount = () => {
  //declare/get variable<F11>
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
    //check if password is set
    if (password != "") {
      //send account delete request
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

      //if account deleted logout and redirect user
      if (delete_json.account_deleted) {
        dispatch(logoutUser());
        router.push("/");
      } else {
        //shake password field if password is wrong
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
      //shake password field if password is empty
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

  //return code block
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

      {/* delete info container */}
      <div>
        {/* warning container */}
        <div className={styles.delete_info_container}>
          <h2>Also note that this is not reversible,once done.</h2>
        </div>

        {/* input field */}
        <div className={styles.delete_input_container}>
          <textarea
            cols="4"
            rows="3"
            placeholder="Please,write short note before you leave,so we can know why you left."
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div>

        {/* password field */}
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
        {/* if password is correct delete */}
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

        {/*  proessing button */}
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
  const [requestReset, SetRequestReset] = useState(false);
  const [is_verified, setIsVerified] = useState(false);

  const shake = useAnimationControls();

  //reset function
  const resetPassword = async () => {
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

  //check if user is authentucated method
  const AuthUser = async () => {
    //if password is not empty send request
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

      //is Authenticated set state val
      if (isauth_json.Authenticated) {
        setIsAuthenticated(true);
        setCurrentState(2);
      } else {
        //shake password field
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
      //shake password field
      shake.start({
        rotate: [-2, 2, -2, 2, -2, 2, -2, 0],
        transition: {
          duration: 0.5,
          type: "spring",
        },
      });
    }
  };

  //function to check if string exists in array
  const isExists = (title, icategories) => {
    let exists = false;
    for (let indx in icategories) {
      if (icategories[indx] == title) {
        return true;
      }
    }
    return false;
  };

  //function add category to categories array vice versa
  const addtoCategoryArray = (title) => {
    //check if exists to add to catgeory
    if (!isExists(title, interested_categories)) {
      setInterestedCategories([...interested_categories, title]);
    } else {
      //remove if exists
      setInterestedCategories(
        interested_categories.filter((category) => category != title)
      );
    }
  };

  //reset frontend update function
  const reset = () => {
    setIsAuthenticated(false);
    setRequestSent(false);
    setCurrentState(0);
  };

  useEffect(() => {
    setIsVerified(user ? user.is_verified : false);
  }, [user]);

  //use useEffect hook to set email
  //set user interested_categories
  //get full categories list
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

  //function to update settings
  const updateRequest = async () => {
    //set sent request to true
    //send settings update request

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

    //if update request successful reset button/authenticated/state
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

  //return code block
  return (
    //main settings container
    <div
      className={
        isdarkMode ? styles.settings_container_dm : styles.settings_container
      }
      style={!is_verified ? { pointerEvents: "none", opacity: "0.5" } : {}}
    >
      {/* sign tab container */}
      <div className={styles.sign_container}>
        <h1>Settings</h1>
      </div>
      {/* settings utils container */}
      <div>
        {/*  email field container */}
        <div className={styles.email_contiainer}>
          <label>Email:</label>
          <input
            type="email"
            placeholder={`${user ? user.email : "nobody@fakemail.com"}`}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <hr />
        {/* categories container */}
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
        <hr />
        {/* password field container */}
        <div className={styles.password_container}>
          <motion.input
            onChange={(e) => setPassword(e.target.value)}
            type={showPasswod ? "text" : "password"}
            placeholder="Password"
            animate={shake}
          />
          {/* password visibility status */}
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

          {/* if state is 1 show loading spinner */}
          {currentState == 1 && (
            <motion.button
              whileTap={{ scale: 1.8 }}
              className={styles.password_container_blue}
            >
              <div></div>
            </motion.button>
          )}

          {/* if state is 0 show verify button CTA(Call To Action) */}
          {currentState == 0 && (
            <motion.button
              whileTap={{ scale: 1.8 }}
              className={styles.password_container_red}
              onClick={() => AuthUser()}
            >
              verify
            </motion.button>
          )}

          {/* if state is 2 show verified button */}
          {currentState == 2 && (
            <motion.button
              className={styles.password_container_green}
              whileTap={{ scale: 1.8 }}
            >
              verified
            </motion.button>
          )}
        </div>

        {/* send request button container */}
        <div>
          <motion.button
            onClick={() => isAuthenticated && updateRequest()}
            whileTap={{ scale: 1.8 }}
            className={styles.request_container}
            style={{ opacity: isAuthenticated ? "1" : "0.5" }}
          >
            {isRequestSent ? "request sent" : "request update"}
          </motion.button>
        </div>

        {/* user notice p tag */}
        <p style={{ margin: "10px 0px", color: "grey" }}>
          *changes will reflect on your next login.
        </p>
        {/* reset password container */}
        <div className={styles.reset_password}>
          <h1>
            Change Password? ,
            <span>
              <a onClick={() => resetPassword()}>Reset</a>
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

    //if hearted reduce heart by -1 then terminate
    if (isHearted) {
      setHearts(hearts - 1);
      setHearted(!isHearted);
      dispatch(AddORSubUserHearts({ actionCharge: -1 }));
      return;
    }

    //add +1 to heart
    setHearted(!isHearted);
    setHearts(hearts + 1);
    dispatch(AddORSubUserHearts({ actionCharge: 1 }));
  };

  //pin functiom to talk with backend
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

    //if pinned reduce by -1 then terminate
    if (isPinned) {
      unPin(article.pk);
      setPins(pins - 1);
      setPinned(!isPinned);

      return;
    }

    //add +1 to pin
    setPinned(!isPinned);
    setPins(pins + 1);
    dispatch(AddORSubUserPins({ actionCharge: 1 }));
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

  //use useEffect to check if articles is hearted/pinned
  //
  useEffect(() => {
    //function to check if hearted/pinned
    const checkisHeartedPinned = async () => {
      if (user) {
        //fetch article heart stats
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
        //set hearted boolean
        setHearted(hearted_json.ishearted);

        //fetch article pin stats
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

        //set pinned boolean
        setPinned(pinned_json.ispinned);
      }

      //check if stats is not set
      if (!isSet) {
        //fetch stats
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
        //set article stats info
        setHearts(article_info_json.hearts);
        setPins(article_info_json.pins);
        setSet(true);
      }
    };

    //function call
    checkisHeartedPinned();
  }, []);

  return (
    //main article container
    <div className={styles.main_article_container}>
      {/* main body container */}
      <div onClick={() => router.push(`articles/${article.slug}/detail`)}>
        <h1>{article.title}</h1>
        {/* article image container */}
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
        {/* heart article util */}
        <motion.div whileTap={{ scale: 2 }} onClick={() => heartArticle()}>
          <p>{hearts > 999 ? `${(hearts / 1000).toFixed(1)}k` : hearts}</p>
          {isHearted ? (
            <i className="fa fa-heart text-rose-400"></i>
          ) : (
            <i className="fa fa-heart opacity-[0.5] text-rose-400"></i>
          )}
        </motion.div>

        {/* pin article util */}
        <motion.div whileTap={{ scale: 2 }} onClick={() => pinArticle()}>
          <p>{pins > 999 ? `${(pins / 1000).toFixed(1)}k` : pins}</p>
          {isPinned ? (
            <i className="fa fa-thumb-tack"></i>
          ) : (
            <i className="fa fa-thumbtack opacity-[0.5]"></i>
          )}
        </motion.div>

        {/* share article util */}
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

  //share product to talk with backend
  const _shareProduct = async () => {
    //if not shared send share+ request to the backend
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

    //reduce by -1 if hearted
    if (isHearted) {
      setHeartVal(heartVal - 1);
    } else {
      //add +1 to heart
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

    //reduce by -1 if pinned
    if (isPinned) {
      setPinVal(pinVal - 1);
      unPin(product.pk);
    } else {
      //add +1 to pin
      setPinVal(pinVal + 1);
    }
  };

  //use useEffect to check if product hearted/pinned
  //check if product stats is set
  useEffect(() => {
    const checkHeartPin = async () => {
      if (user) {
        //fetch/set heart stats
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

        //fetch/set  pin stats
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
    //main product container
    <div
      className={
        isdarkMode
          ? styles.product_main_container_dm
          : styles.product_main_container
      }
    >
      <div className={styles.product_image_container}>
        <Image
          src={product.image}
          alt={product.title}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <div className={styles.product_date_container}>
        <p
          style={{
            color: `${product.is_white_date_color ? "#fff" : "#000"}`,
          }}
        >
          {product.created}
        </p>
      </div>
      <div className={styles.product_main_utils_container}>
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
      <div className={styles.product_info_container}>
        <h1>{product.title}</h1>
        <p>{product.snippet}</p>
        <p>
          <b>Price</b>: ${product.price}
        </p>
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
          <motion.div style={{ height: "100%" }} whileTap={{ scale: 2 }}>
            <div
              onClick={() => {
                addToUserActivity(product.category);
                router.push(product.vendor_affliate_link);
              }}
              className={
                isdarkMode
                  ? styles.product_share_container_dm
                  : styles.product_share_container
              }
            >
              <h1>
                <i className="fa fa-question-circle"></i>
              </h1>
            </div>
          </motion.div>

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

const PinnedArticlesContainer = () => {
  const { user, isdarkMode } = useSelector((state) => state.Navbar);

  const [articles, setArticles] = useState(null);
  const [total_pages, setTotalPages] = useState(1);
  const [current_page, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [is_verified, setIsVerified] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const dispatch = useDispatch();

  const unPin = (pk) => {
    setArticles(articles.filter((item) => item.pk != pk));
  };

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

  const [containerHeight, setContainerHeight] = useState(300);

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
      setContainerHeight(window.innerHeight * 0.5);

      if (pinned_articles_json.result.length == 0) {
        setIsEmpty(true);
      }

      //check if more result exist
      if (
        pinned_articles_json.current_page < pinned_articles_json.total_pages
      ) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    };
    if (user) {
      getArticles();
    }
  }, [user]);

  useEffect(() => {
    setIsVerified(user ? user.is_verified : false);
  }, [user]);

  return (
    <div
      className={
        isdarkMode
          ? styles.main_pinned_container_dm
          : styles.main_pinned_container
      }
      style={
        !is_verified
          ? { pointerEvents: "none", paddingBottom: "20px", opacity: "0.5" }
          : { paddingBottom: "20px" }
      }
    >
      <div className={styles.pinned_title_container}>
        <h1>Pinned Articles</h1>
      </div>
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
              fontSize: "20px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <i style={{ fontSize: "60px" }} className="fa fa-sad-tear"></i>
              <h1 style={{ fontFamily: "Pacifico", marginTop: "20px" }}>
                Nothing Pinned
              </h1>
            </div>
          </div>
        )}

        {/* loop through articles */}
        {articles ? (
          articles.map((article) => (
            <Article article={article} unPin={unPin} key={article.pk} />
          ))
        ) : (
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
      </InfiniteScroll>
    </div>
  );
};

const PinnedProductsContainer = () => {
  const { user, isdarkMode } = useSelector((state) => state.Navbar);

  const dispatch = useDispatch();
  const unPin = (pk) => {
    setProducts(products.filter((item) => item.pk != pk));
  };

  const [products, setProducts] = useState(null);
  const [total_pages, setTotalPages] = useState(1);
  const [current_page, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [is_verified, setIsVerified] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

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

  useEffect(() => {
    setIsVerified(user ? user.is_verified : false);
  }, [user]);

  const [containerHeight, setContainerHeight] = useState(300);

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
      setContainerHeight(window.innerHeight * 0.5);

      if (pinned_products_json.result.length == 0) {
        setIsEmpty(true);
      }

      //check if more result exist
      if (
        pinned_products_json.current_page < pinned_products_json.total_pages
      ) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    };
    if (user) {
      getProducts();
    }
  }, [user]);

  return (
    <div
      className={
        isdarkMode
          ? styles.main_pinned_container_dm
          : styles.main_pinned_container
      }
      style={
        !is_verified
          ? { pointerEvents: "none", paddingBottom: "20px", opacity: "0.5" }
          : { paddingBottom: "20px" }
      }
    >
      <div className={styles.pinned_title_container}>
        <h1>Pinned Products</h1>
      </div>
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
              fontSize: "20px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <i style={{ fontSize: "60px" }} className="fa fa-sad-tear"></i>
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
          // loading component container
          <div
            style={{
              positiom: "absolute",
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
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
  );
};

const MobileDashboardContainer = () => {
  const { isAccountKillDay, isactiveStore } = useSelector(
    (state) => state.Navbar
  );

  return (
    <div
      style={{
        overflowY: "scroll",
        width: "100%",
        padding: "10px 0px",
        height: "100%",
        paddingLeft: "0px",
        paddingRight: "3px",
        boxShadow: "0 0 3px 4px rgba(0,0,0,0.1)",
        borderRadius: "0 0 8px 8px",
      }}
    >
      <UserProfile />
      {isAccountKillDay && <DeleteAccount />}
      <PinnedArticlesContainer />
      {isactiveStore && <PinnedProductsContainer />}
      <Settings />
    </div>
  );
};

export default MobileDashboardContainer;
