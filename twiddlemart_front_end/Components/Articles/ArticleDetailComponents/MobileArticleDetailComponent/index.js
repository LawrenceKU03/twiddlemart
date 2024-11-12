//import framework and third-party
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import parser from "html-react-parser";
import { toast } from "react-toastify";

//import custom variables,functions and styles
import styles from "./index.module.css";
import { addToUserActivity, BASE_API_URL, copyText } from "../../../utils.js";

//product component
const Product = ({ product, prodIndex }) => {
  //declare/get variables
  const [isShared, setShared] = useState(false);
  const [isHearted, setHearted] = useState(false);
  const [isPinned, setPinned] = useState(false);
  const [heartVal, setHeartVal] = useState(product.hearts);
  const [pinVal, setPinVal] = useState(product.pins);

  const { user, isdarkMode } = useSelector((state) => state.Navbar);
  const router = useRouter();

  //share function to talk with the backend
  const _shareProduct = async () => {
    //if not shared send share+ request to the backend
    //else send share- request to the backend
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

    //toggle share variable
    setShared(!isShared);
  };

  //heart function to talk with the backend
  const _heartProduct = async () => {
    //if user logged in send heart request
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

  //main heart function to talk with backend/frontend
  const heartProduct = () => {
    _heartProduct();
    setHearted(!isHearted);

    //if hearted reduce by -1 and terminate else increase by +1
    if (isHearted) {
      setHeartVal(heartVal - 1);
      return;
    }

    setHeartVal(heartVal + 1);
  };

  //pin function to talk wit backend
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

  //main pin function to talk with frontend and backend
  const pinProduct = () => {
    _pinProduct();
    setPinned(!isPinned);
    if (isPinned) {
      setPinVal(pinVal - 1);
    } else {
      setPinVal(pinVal + 1);
    }
  };

  //use useEffect to set if user pinned/hwarted products and set product stats after mount/render

  useEffect(() => {
    //function to call check if user hearted/pinned product and set product stats
    const checkisHeartedPinned_GetStats = async () => {
      //check if user logged in to send heart request
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
    checkisHeartedPinned_GetStats();
  }, []);

  //return render code block
  return (
    //main product container
    <div
      className={
        isdarkMode
          ? styles.product_main_container_dm
          : styles.product_main_container
      }
    >
      {/* product image container */}
      <div className={styles.product_image_container}>
        <Image
          src={product.image}
          alt={product.title}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>

      {/* product date and vendor container */}
      <div className={styles.product_date_container}>
        <p
          style={{
            color: `${product.is_white_date_color ? "#fff" : "#000"}`,
          }}
        >
          <span>#{prodIndex}</span> - {product.created} - {product.vendor}
        </p>
      </div>

      {/* product utility container */}
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
      {/* product info container */}
      <div className={styles.product_info_container}>
        <h1>{product.title}</h1>
        <p>{parser(product.desc)}</p>
        <p>
          <b>Price</b>: ${product.price}
        </p>

        {/* product button container */}
        <div style={{ display: "flex" }}>
          {/* buy button container */}
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

//more articles component
const More = ({ related_articles }) => {
  const router = useRouter();

  return (
    //main container
    <div>
      {/*  forloop throught related articles */}
      {related_articles.map((article) => (
        <motion.div
          style={{
            background: `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.6)),url(${article.image_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className={styles.others_container}
          whileTap={{ scale: 1.2 }}
          onClick={() => {
            addToUserActivity(article.category_slug);
            router.push(`${BASE_API_URL}/articles/${article.slug}/detail`);
          }}
        >
          <h1>
            <a href={`${BASE_API_URL}/articles/${article.slug}/detail`}>
              {article.title}
            </a>
          </h1>
        </motion.div>
      ))}
    </div>
  );
};

//article detail component
const ArticleDetailMobileContainer = ({ article }) => {
  //declare/get variables
  const router = useRouter();
  const { slug } = router.query;
  const dispatch = useDispatch();

  const { user, isdarkMode } = useSelector((state) => state.Navbar);

  //heart function to talk with backend
  const _heartArticle = async () => {
    //check if user is logged in to send heart request to backend
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

  //main heart function to talk with backend/frontend
  const heartArticle = () => {
    _heartArticle();
    //if hearted reduce by -1 and terminate else continue
    if (isHearted) {
      setHearts(hearts - 1);
      setHearted(!isHearted);
      return;
    }

    setHearted(!isHearted);
    setHearts(hearts + 1);
  };

  //pin function to talk with backend
  const _pinArticle = async () => {
    //check if user logged in to send pin request
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

  //main pin article to talk with backend/frontend
  const pinArticle = () => {
    _pinArticle();
    //if pinned reduced by -1 and terminate else continue
    if (isPinned) {
      setPins(pins - 1);
      setPinned(!isPinned);
      return;
    }

    setPinned(!isPinned);
    setPins(pins + 1);
  };

  //share function to talk with backend
  const _shareArticle = async () => {
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
  };

  //main share function to talk with backend/frontend
  const shareArticle = () => {
    _shareArticle();
    copyText(`${BASE_API_URL}/articles/${slug}/detail`);

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

  const [pins, setPins] = useState(article.pins);
  const [hearts, setHearts] = useState(article.hearts);

  //use useEffect to set variables,article stats and check if user hearted/pinned article
  useEffect(() => {
    //function to check if user hearted/pinned article and set article stats
    const checkisHeartedPinned_GetStats = async () => {
      //check if user is logged in to check if hearted/pinned
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
              isChecking: true,
            }),
          }
        );
        const hearted_json = await hearted_res.json();
        setHearted(hearted_json.ishearted);

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
    };

    //function call
    checkisHeartedPinned_GetStats();
  }, []);

  return (
    //main article detail container
    <div
      className={isdarkMode ? styles.main_container_dm : styles.main_container}
    >
      {/* article main body container */}
      <div className={styles.head_container}>
        {/* article image container.*/}
        <div className={styles.image_container}>
          <Image
            src={article.cover_photo_url}
            layout="fill"
            alt={article.title}
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* article utils container */}
        <div
          className={
            isdarkMode ? styles.utils_container_dm : styles.utils_container
          }
        >
          {/* article heart util container */}
          <motion.div whileTap={{ scale: 2 }} onClick={() => heartArticle()}>
            <div>
              <p style={{ marginRight: "5px" }}>
                {hearts > 999 ? `${(hearts / 1000).toFixed(1)}k` : hearts}
              </p>
              {isHearted ? (
                <i className="fa fa-heart text-red-600"></i>
              ) : (
                <i className="fa fa-heart text-red-600 opacity-[0.5]"></i>
              )}
            </div>
          </motion.div>

          {/* article  pin util container */}
          <motion.div whileTap={{ scale: 2 }} onClick={() => pinArticle()}>
            <div>
              <p style={{ marginRight: "5px" }}>
                {pins > 999 ? `${(pins / 1000).toFixed(1)}k` : pins}
              </p>
              {isPinned ? (
                <i
                  style={{ color: "#0ea5e9" }}
                  className="fa fa-thumb-tack"
                ></i>
              ) : (
                <i
                  style={{ color: "#0ea5e9" }}
                  className="fa fa-thumb-tack opacity-[0.5]"
                ></i>
              )}
            </div>
          </motion.div>

          {/* article share util container */}
          <motion.div whileTap={{ scale: 2 }} onClick={() => shareArticle()}>
            <div style={{ borderRadius: "50%" }}>
              {isShared ? (
                <i className="fa fa-share"></i>
              ) : (
                <i className="fa fa-share opacity-[0.5]"></i>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* article main body info container */}
      <div className={styles.info_container}>
        <h1>{article.title}</h1>
        <p>{parser(article.desc)}</p>
      </div>

      {/* article products container */}
      <div>
        {article.products.map((product, index) => (
          <Product product={product} prodIndex={index + 1} />
        ))}
      </div>

      {/* article parts container */}
      {article.parts.map((part) => (
        <div>
          <div
            className={
              part.image_dir == 1
                ? styles.image_container
                : styles.image_container_
            }
          >
            <Image
              src={part.cover_photo_url}
              layout="fill"
              alt={article.title}
            />
          </div>

          <div className={styles.info_container}>{parser(part.desc)}</div>
        </div>
      ))}
      {/* more/related article component */}
      <More related_articles={article.related_articles} />
    </div>
  );
};

//export component
export default ArticleDetailMobileContainer;
