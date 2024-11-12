//frmaework/third-party packages
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion, useAnimationControls } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import SEOHeader from "../../../SeoHeader.js";

//custom.varuables/styles
import { BASE_API_URL, BlockLoader } from "../../../../Components/utils.js";
import styles from "./index.module.css";
import { logoutUser } from "../../../../Components/Navbar/Navbar.slice.js";

const Verify = () => {
  //declare/get variables
  const router = useRouter();
  const [verifyingText, setVerifyingText] = useState("Verifying");
  const [verificationStatus, setVerificationStatus] = useState(0);
  const [hash, setHash] = useState(null);
  const [id, setId] = useState(null);

  const dispatch = useDispatch();
  const verifyContainerAnimationControl = useAnimationControls();
  const { user, isdarkMode } = useSelector((state) => state.Navbar);

  /* figure out how intervals in reactbwork! */
  useEffect(() => {
    const { hash, id } = router.query;
    setHash(hash);
    setId(id);
    //get user verification status function
    const getVerificationStatus = async () => {
      //talk with backend
      const verification_res = await fetch(
        `${BASE_API_URL}/api/home/verify_user/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hash: hash,
            id: id,
          }),
        }
      );
      const verification_json = await verification_res.json();

      if (verification_json.success) {
        setVerificationStatus(1);
        dispatch(logoutUser());

        router.push("/auth/login");

        verifyContainerAnimationControl.start({
          y: [-8, 8, -6, 6, -4, 4, -2, 2, 1, -1, 0],
          transition: {
            duration: 0.8,
            type: "spring",
            ease: "easeOut",
          },
        });
      } else {
        setVerificationStatus(2);
        verifyContainerAnimationControl.start({
          rotate: [-4, 4, -4, 4, -2, 2, -1, 0],
          transition: {
            duration: 0.8,
            type: "spring",
            ease: "easeOut",
          },
        });
      }
    };

    if (router.isReady) {
      getVerificationStatus();
    }
  }, [router.isReady]);

  //use useEffect hook to animate verifyingText
  useEffect(() => {
    const interval = setInterval(() => {
      setVerifyingText((prevState) => {
        return prevState.length < 12 ? prevState + "." : "Verifying";
      });
    }, 1000);

    //clear interval so interval don't act weird
    return () => {
      clearInterval(interval);
    };
  }, []);

  //return code block
  return (
    //main container
    <div style={{ background: "rgba(0, 0, 0, 0.5)" }}>
      <SEOHeader
        page_title={"Account Verification"}
        meta_desc={
          "Welcome to TwiddleMart,to start getting some better articles to your vibes just signup for and get your self customized view of our site and enjoy the awesomeness and much mo.."
        }
        canonical_url={`${BASE_API_URL}/verify/${hash}/${id}`}
      />

      <div className={styles.main_container}>
        {/* main verify container */}
        <motion.div
          animate={verifyContainerAnimationControl}
          className={
            isdarkMode
              ? styles.main_verify_container_dm
              : styles.main_verify_container
          }
        >
          {/* title container */}
          <div
            className={
              isdarkMode ? styles.title_container_dm : styles.title_container
            }
          >
            <h1>
              Twiddle<span>mart</span>
            </h1>
          </div>

          {/* line */}
          <hr />

          {/* verificatiom status 0 container */}
          {verificationStatus == 0 && (
            <div className={styles.status_container}>
              <div>
                <BlockLoader />
              </div>
              <div>
                <h1>{verifyingText}</h1>
              </div>
            </div>
          )}

          {/* verificatiom status 1 container */}
          {verificationStatus == 1 && (
            <div className={styles.status_container}>
              <div>
                <BlockLoader />
              </div>
              <div>
                <h1>Verified.</h1>
                <p style={{ color: "gray" }}>
                  *{user ? "re-login" : "login"} for status update
                </p>
                <p>redirecting shortly.</p>
              </div>
            </div>
          )}

          {/* verificatiom status 2 container */}
          {verificationStatus == 2 && (
            <div className={styles.status_container}>
              <div>
                <i className="far fa-times-circle"></i>
              </div>
              <div>
                <h1>Verification Failed</h1>
                <p>
                  please login and generate a <br /> new link from the <br />
                  dashboard.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <div>
        <div className={styles.wave}>
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
              className={styles.shape_fill}
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Verify;
