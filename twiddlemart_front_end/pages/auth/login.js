//franework/third-party packages
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

//custom styles/variables/components/functions
import styles from "../../styles/Pages/Auth/Auth.module.css";
import {
  setActivePage,
  setIsLoading,
  setTempCurrentPage,
} from "../../Components/Navbar/Navbar.slice";
import { setAuthTokens } from "../../Components/Navbar/Navbar.slice";
import SEOHeader from "../SeoHeader";
import { BASE_API_URL } from "../../Components/utils.js";

//page component
const Login = () => {
  //declare/get variables
  const { isdarkMode, authTokens } = useSelector((state) => state.Navbar);
  const [isloading, setLoading] = useState(false);
  const [ismobile, setMobile] = useState(false);
  const [homeData, setHomeData] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setError] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const animInput_1 = useAnimationControls();

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
        theme: `${isdarkMode ? "dark" : "light"}`,
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
    } else {
      if (email == "") {
        animInput_1.start({
          rotate: [-2, 2, -2, 2, -2, 2, -2, 0],
          transition: {
            duration: 0.5,
            type: "spring",
          },
        });
      }
    }
  };

  //use useEffect to get home data to set get picture url
  //also find device rendered/loaded on
  //set activepage/loading to false and tempcurrentpage
  useEffect(() => {
    const getData = async () => {
      const res_home = await fetch(`${BASE_API_URL}/api/home/1/`);
      const json_data_home = await res_home.json();
      setHomeData(json_data_home);
    };
    getData();
    if (window.innerWidth <= 720) {
      setMobile(true);
    } else {
      setMobile(false);
    }

    dispatch(setActivePage({ page_name: "login" }));
    dispatch(setIsLoading({ isloading: false }));
    dispatch(setTempCurrentPage({ page_name: "login" }));
  }, []);

  //function to log user in
  const login = () => {
    //set user data
    const data = {
      username: email,
      password: password,
    };

    //set loading to true
    setLoading(true);

    //check if password/email field is filled
    if (email != "" && password != "") {
      fetch(`${BASE_API_URL}/auth/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          //if detail params exist show error and srt laoding to false
          if (json.detail) {
            setError(true);
            setLoading(false);
          } else {
            //set authTokens to json
            //set activepage to home
            //set error to false
            toast.success("LOGGED IN", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: `${isdarkMode ? "dark" : "light"}`,
            });

            dispatch(setAuthTokens({ authTokens: json }));
            setSuccess(true);
            setError(false);

            router.push("/");
          }
        });
    }
  };

  //render if on mobile device
  if (ismobile) {
    //return render block
    return (
      <div
        className={
          isdarkMode
            ? styles.main_signup_container_dm
            : styles.main_signup_container
        }
      >
        {/* seo component */}
        <SEOHeader
          page_title={"Login"}
          meta_desc={
            "Welcome to TwiddleMart,to start getting some better articles to your vibes just login and enjoy the awesomeness and much mo.."
          }
          canonical_url={`${BASE_API_URL}/login`}
        />
        {/* title */}
        <h1>
          Twiddle<span>mart</span>
        </h1>
        {/*show error message if error true*/}
        {isError && (
          <div className={styles.error_container}>
            <h2>Wrong email or password</h2>
          </div>
        )}

        {/* input main container */}
        <div>
          {/* email input field container */}
          <div>
            <motion.input
              animate={animInput_1}
              className={styles.main_signup_container_input_item}
              type="text"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* password input field container */}
          <div style={{ position: "relative" }}>
            {/* password input field main container */}
            <div>
              {/* password input field */}
              <input
                className={styles.main_signup_container_input_item}
                type={showPassword ? "text " : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* password toggle container */}
              <div className={styles.passwordShowToggleContainer}>
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
            </div>
          </div>
        </div>

        {/* re-purposed signup categories container to house reset password link container/button container */}
        <div className={styles.categories_container}>
          {/* password link container */}
          <div
            onClick={() => resetPassword()}
            className={styles.forgot_password_container}
          >
            <h3>
              Forgot Password?{" "}
              <span
                style={{
                  color: "#0ea5e9",
                }}
              >
                Reset.
              </span>
            </h3>
          </div>

          {/* main button container */}
          <div
            className={
              isSuccess
                ? styles.success_btn_container
                : styles.signup_btn_container
            }
          >
            <hr
              style={{
                width: "60%",
                margin: "0 auto",
                marginBottom: "20px",
              }}
            />
            {/* button container */}
            <motion.div onClick={() => login()} whileTap={{ scale: 1.3 }}>
              {/* if loading show spinner else show log in */}
              {isloading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "50px",
                    height: "60px",
                    position: "relative",
                    top: "-10px",
                    background: "transparent",
                    boxShadow: "none",
                  }}
                >
                  <div className={styles.loading_container}></div>
                </div>
              ) : (
                <h1>Log in</h1>
              )}
            </motion.div>
          </div>
        </div>

        {/* wave contianer */}
        <div>
          {/* wave 1 container */}
          <div className={styles.wave}>
            <svg
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                className={styles.shape_fill}
              ></path>
            </svg>
          </div>
        </div>
      </div>
    );
  } else {
    //render for desktop
    //return code block
    return (
      //main container
      <div
        className={
          isdarkMode
            ? styles.main_signup_container_dm
            : styles.main_signup_container
        }
      >
        {/* seo component */}
        <SEOHeader
          page_title={"Login"}
          meta_desc={
            "Welcome to TwiddleMart,to start getting some better articles to your vibes just login and enjoy the awesomeness and much mo.."
          }
        />

        {/* login main container */}
        <div
          className={
            isdarkMode ? styles.window_container_dm : styles.window_container
          }
        >
          {/* login image container */}
          <section className={styles.image_container_login}>
            <div style={{ position: "relative", left: "-33px" }}>
              <Image
                src={homeData.image_url}
                objectFit="cover"
                objectPosition="center"
                layout="fill"
                alt={"signup_image"}
              />
            </div>
          </section>

          {/* login input/info container */}
          <section style={{ width: "50%" }}>
            {/* title tag */}
            <h1>
              Twiddle<span>mart</span>
            </h1>

            {/* show error if erro is true */}
            {isError && (
              <div className={styles.error_container}>
                <h2>Wrong email or password</h2>
              </div>
            )}

            {/*  input field container */}
            <div>
              {/* email input field container */}
              <div>
                <motion.input
                  animate={animInput_1}
                  className={styles.main_signup_container_input_item}
                  type="text"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* password input field */}
              <div style={{ position: "relative" }}>
                <input
                  className={styles.main_signup_container_input_item}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />

                {/* password toggle visibikity container */}
                <div
                  className={styles.passwordShowToggleContainerLi}
                >
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
              </div>
            </div>

            {/* re-purposed categories container for rest password link container/button container */}
            <div className={styles.categories_container}>
              {/* reset passeord link container */}
              <div
                onClick={() => resetPassword()}
                className={styles.forgot_password_container}
              >
                <h3>
                  Forgot Password?{" "}
                  <span style={{ color: "#0ea5e9" }}>Reset.</span>
                </h3>
              </div>

              {/* button container */}
              <div
                className={
                  isSuccess
                    ? styles.success_btn_container
                    : styles.signup_btn_container
                }
              >
                <hr
                  style={{
                    width: "60%",
                    margin: "0 auto",
                    marginBottom: "20px",
                  }}
                />

                {/* if isloading show spinner else show log in */}
                <motion.div onClick={() => login()} whileTap={{ scale: 1.3 }}>
                  {isloading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "centet",
                        width: "50px",
                        height: "60px",
                      }}
                    >
                      <div className={styles.loading_container}></div>
                    </div>
                  ) : (
                    <h1>Log in</h1>
                  )}
                </motion.div>
              </div>
            </div>
          </section>
        </div>

        {/* wave container */}
        <div>
          {/* wave 1 container */}
          <div className={styles.wave}>
            <svg
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                className={styles.shape_fill}
              ></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }
};

export default Login;
