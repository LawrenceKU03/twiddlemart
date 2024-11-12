//import framework and third-party packages
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import parser from "html-react-parser";
import { useRouter } from "next/router";

//import custom styles and variables
import styles from "./index.module.css";
import { BASE_API_URL, copyText, addToUserActivity } from "../../../utils.js";

//product detail component
const DesktopProductContainer = ({ product }) => {
  //declare/get variables
  const [isShared, setShared] = useState(false);
  const [isHearted, setHearted] = useState(false);
  const [isPinned, setPinned] = useState(false);
  const [heartVal, setHeartVal] = useState(product.hearts);
  const [pinVal, setPinVal] = useState(product.pins);

  const { user, isdarkMode } = useSelector((state) => state.Navbar);
  const router = useRouter();

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

  //heart function to talk with frontend and backend
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

  //pin function to talk with backend/frontend
  const pinProduct = () => {
    _pinProduct();
    setPinned(!isPinned);
    if (isPinned) {
      setPinVal(pinVal - 1);
    } else {
      setPinVal(pinVal + 1);
    }
  };

  //share function to talk with backend send share+ else send share-
  const _shareProduct = async () => {
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
      position: "top-right",
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

  //use useEffect to check if user hearted/pinned product
  useEffect(() => {
    //function to check if user pinned/hearted product
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

    //function call
    checkHeartPin();
  }, []);

  return (
    //main product container
    <div
      className={isdarkMode ? styles.main_container_dm : styles.main_container}
    >
      {/*  main product container */}
      <div className={styles.mcontainer_1}>
        {/* product image container */}
        <div className={styles.image_container}>
          <Image
            src={product.image}
            layout="fill"
            objectFit="center"
            objectPosition="center"
          />
        </div>

        {/* info container */}
        <div className={styles.info_container}>
          <h1>{product.title}</h1>

          {/* ratings container */}
          <div className={styles.ratings_container}>
            {/* heart rating container */}
            <motion.div
              whileTap={{ scale: 1.3 }}
              onClick={() => heartProduct()}
              style={{ display: "flex", cursor: "pointer" }}
            >
              <p>{heartVal}</p>
              <i
                style={{ opacity: isHearted ? "1" : "0.5" }}
                className="fa fa-heart text-red-600"
              ></i>
            </motion.div>

            {/* pin rating container */}
            <motion.div
              whileTap={{ scale: 1.3 }}
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "10px",
                cursor: "pointer",
              }}
              onClick={() => pinProduct()}
            >
              <p>{pinVal}</p>
              <i
                style={{
                  opacity: isPinned ? "1" : "0.5",
                  color: "#0ea5e9",
                }}
                className="fa fa-thumb-tack"
              ></i>
            </motion.div>
          </div>

          <p style={{ marginBottom: "8px" }}>
            <b>PRICE</b>: ${product.price}
          </p>
          <p>
            <b>PUBLISHED</b>: {product.created}
          </p>
          <br />
          <p>
            <b>VENDOR</b>: {product.vendor}
          </p>
          {/* buttons  container */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                width: "100%",
                display: "flex",
                marginTop: "18px",
                top: "40px",
              }}
            >
              {/* buy button container */}
              <motion.div whileTap={{ scale: 2 }} style={{ width: "100%" }}>
                <div
                  onClick={() => {
                    addToUserActivity(product.category);
                    router.push(product.vendor_affliate_link);
                  }}
                  className={
                    isdarkMode ? styles.btn_container_dm : styles.btn_container
                  }
                >
                  <h2>BUY NOW</h2>
                </div>
              </motion.div>

              {/* share button container */}
              <motion.div
                whileTap={{ scale: 2 }}
                style={{ height: "100%", marginLeft: "10px" }}
              >
                <div
                  style={{ opacity: isShared ? "1" : "0.5" }}
                  onClick={() => _shareProduct()}
                  className={
                    isdarkMode
                      ? styles.share_container_dm
                      : styles.share_container
                  }
                >
                  <i className="fa fa-share"></i>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* product description container */}
      <div
        style={{ padding: "20px 5px", maxWidth: "600px", marginTop: "70px" }}
      >
        <p>{parser(product.desc)}</p>
      </div>
    </div>
  );
};

//export component
export default DesktopProductContainer;
