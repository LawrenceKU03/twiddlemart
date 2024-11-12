//import third-party and framework fucntions
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { toast } from "react-toastify";
import parser from "html-react-parser";
import { useRouter } from "next/router";

//import custom variables,styles
import product_styles from "./index.module.css";
import { BASE_API_URL, copyText, addToUserActivity } from "../../../utils.js";

//product detail component
const MobileProductContainer = ({ product }) => {
  //declare/get variables
  const [isShared, setShared] = useState(false);
  const [isHearted, setHearted] = useState(false);
  const [isPinned, setPinned] = useState(false);
  const [heartVal, setHeartVal] = useState(product.hearts);
  const [pinVal, setPinVal] = useState(product.pins);

  const { user, isdarkMode } = useSelector((state) => state.Navbar);
  const router = useRouter();

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

  //heart function to talk wuth backend
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

  //use useEffect hook to load products stats
  useEffect(() => {
    //function to load stats
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

  //return code block
  return (
    //main product container
    <div
      className={
        isdarkMode
          ? product_styles.main_container_dm
          : product_styles.main_container
      }
    >
      {/* product image containee */}
      <div className={product_styles.image_container}>
        <Image
          src={product.image}
          layout="fill"
          objectFit="center"
          objectPosition="center"
        />
      </div>
      {/* date/vendor container */}
      <div className={product_styles.date_container}>
        <p
          style={{
            color: `${product.is_white_date_color ? "#fff" : "#000"}`,
          }}
        >
          {product.created} - {product.vendor}
        </p>
      </div>

      {/* utils container */}
      <div className={product_styles.main_utils_container}>
        {/* heart util container */}
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
            <p>{heartVal > 999 ? `${(heartVal / 1000).toFixed(1)}k` : heartVal}</p>
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
        <p>
          <b>Price</b>: ${product.price}
        </p>

        <p
          className={product_styles.info_container_p}
          style={{
            background: `${isdarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)"
              }`,
          }}
        >
          {parser(product.desc)}
        </p>
        {/* buttons container */}
        <div
          style={{
            display: "flex",
            position: "relative",
            top: "4px",
          }}
        >
          {/* buy button util container */}
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

          {/* share button util container */}
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

//export component
export default MobileProductContainer;
