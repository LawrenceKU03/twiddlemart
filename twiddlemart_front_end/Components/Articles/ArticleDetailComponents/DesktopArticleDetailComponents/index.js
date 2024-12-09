//import framework and third-party packages
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import parser from "html-react-parser";
import { toast } from "react-toastify";

//import custom variables,styles and function
import styles from "./styles/index.module.css";
import op_styles from "./styles/opinion.module.css";
import vm_styles from "./styles/view_more.module.css";
import product_styles from "./styles/product.module.css";

import { addToUserActivity, BASE_API_URL, copyText } from "../../../utils.js";

//product component
const DesktopProductContainer = ({ product, prodIndex }) => {
  //declare/get variables
  const [isShared, setShared] = useState(false);
  const [isHearted, setHearted] = useState(false);
  const [isPinned, setPinned] = useState(false);
  const [heartVal, setHeartVal] = useState(product.hearts);
  const [pinVal, setPinVal] = useState(product.pins);

  const { user, isdarkMode } = useSelector((state) => state.Navbar);
  const router = useRouter();

  //heart function to talk with the backend
  const _heartProduct = async () => {
    //check if user is logged in to send heart request
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

  //main heart function to talk with frontend/backend
  const heartProduct = () => {
    _heartProduct();
    setHearted(!isHearted);

    //if is hearted reduce by -1 and terminate else continue +1
    if (isHearted) {
      setHeartVal(heartVal - 1);
      return;
    }
    setHeartVal(heartVal + 1);
  };

  //pin function to talk with backend
  const _pinProduct = async () => {
    //check if user is logged in to send pin request
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

  //main pin function to talk with frontend/backend
  const pinProduct = () => {
    _pinProduct();
    setPinned(!isPinned);

    //if is pinned reduce by -1 else continue +1
    if (isPinned) {
      setPinVal(pinVal - 1);
      return;
    }
    setPinVal(pinVal + 1);
  };

  //share function to talk with backend
  const _shareProduct = async () => {
    //if not shared send share+ request to backend
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
      //if shared send share- request to the backend
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

  //use useEffect to check if user hearted/pinned product and also set product stats
  useEffect(() => {
    //function to check if user hearted/pinned product and set product stats
    const checkHeartPin_GetStats = async () => {
      //check if user is logged in to check if hearted/pinned product
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
    checkHeartPin_GetStats();
  }, []);

  //return render code block
  return (
    //main product container
    <div
      className={
        isdarkMode
          ? product_styles.main_container_dm
          : product_styles.main_container
      }
    >
      {/* product container */}
      <div className={product_styles.mcontainer_1}>
        {/* product image container */}
        <div className={product_styles.image_container}>
          <Image
            src={product.image}
            alt={product.title}
            layout="fill"
            objectFit="center"
            objectPosition="center"
          />
          <span
            style={{
              color: `${product.is_white_date_color ? "#fff" : "#000"}`,
            }}
          >
            #{prodIndex}
          </span>
        </div>

        {/* product info container */}
        <div className={product_styles.info_container}>
          <h1>{product.title}</h1>
          {/* product ratings/utils container */}
          <div className={product_styles.ratings_container}>
            {/* product heart util */}
            <motion.div
              whileTap={{ scale: 1.5 }}
              onClick={() => heartProduct()}
              style={{ display: "flex", cursor: "pointer" }}
            >
              <p>
                {heartVal > 999 ? `${(heartVal / 1000).toFixed(1)}k` : heartVal}
              </p>
              <i
                style={{ opacity: isHearted ? "1" : "0.5" }}
                className="fa fa-heart text-red-600"
              ></i>
            </motion.div>

            {/*  product pin container */}
            <motion.div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "10px",
                cursor: "pointer",
              }}
              onClick={() => pinProduct()}
              whileTap={{ scale: 1.5 }}
            >
              <p>{pinVal > 999 ? `${(pinVal / 1000).toFixed(1)}k` : pinVal}</p>
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
            <b>Price</b>: ${product.price}
          </p>
          <p>
            <b>Published</b>: {product.created} - {product.vendor}
          </p>
        </div>
      </div>

      <div style={{ padding: "20px 5px", maxWidth: "600px" }}>
        <p>{parser(product.desc)}</p>
      </div>

      {/* product button container */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
          }}
        >
          <motion.div whileTap={{ scale: 2 }} style={{ width: "100%" }}>
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
                  ? product_styles.share_container_dm
                  : product_styles.share_container
              }
            >
              <i className="fa fa-share"></i>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

//related articles component
const More = ({ related_articles }) => {
  //declare/get variablez
  const { isdarkMode } = useSelector((state) => state.Navbar);
  const router = useRouter();

  //return render code block
  return (
    //main container
    <div
      className={
        isdarkMode ? vm_styles.main_container_dm : vm_styles.main_container
      }
    >
      <div className={vm_styles.sign_tab}>
        <h1>View more</h1>
      </div>
      {/* related articles container */}
      <div className={vm_styles.related_container}>
        {/* forloop through articles */}
        {related_articles[0] ? (
          related_articles.map((article) => (
            <motion.div
              style={{
                background: `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.6)),url(${article.image_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className={vm_styles.others_container}
              whileTap={{ scale: 1.2 }}
              onClick={() => {
                addToUserActivity(category);
                router.push(`${BASE_API_URL}/articles/${article.slug}/detail`);
              }}
            >
              <h1>
                <a href={`${BASE_API_URL}/articles/${article.slug}/detail`}>
                  {article.title}
                </a>
              </h1>
            </motion.div>
          ))
        ) : (
          //blank display banner
          <div className={vm_styles.none_container}>
            <h1>Quite a unique article,huh!</h1>
          </div>
        )}
      </div>
    </div>
  );
};

//main utils component
const Opinion = ({ article }) => {
  //declare/get variables
  const router = useRouter();
  const { slug } = router.query;
  const dispatch = useDispatch();
  const { user, isdarkMode } = useSelector((state) => state.Navbar);

  //heart function to talk with backend
  const _heartArticle = async () => {
    //if user logged in send heart request
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

    //if hearted reduce by -1 and terminate else continue +1
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
    //if user logged in send pin request
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

  //main pin function to talk with frontend/backend
  const pinArticle = () => {
    _pinArticle();

    //if pinned reduce by -1 and terminate else continue +1
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
    //if user is logged in send share request
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

    //toggle share
    setShared(!isShared);
  };

  //declare variables
  const [isHearted, setHearted] = useState(false);
  const [isPinned, setPinned] = useState(false);
  const [isShared, setShared] = useState(false);

  const [pins, setPins] = useState(article.pins);
  const [hearts, setHearts] = useState(article.hearts);

  //use useEffect to check if hearted/pinned article and get article stats
  useEffect(() => {
    //function to check if user hearted/pinned article and get article stats
    const checkisHeartedPinned_GetStats = async () => {
      //check if user is logged in to check if user hearted/pinned article
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
        console.log(["hearted", hearted_json.ishearted]);
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

    checkisHeartedPinned_GetStats();
  }, []);

  return (
    //main utils container
    <div
      className={
        isdarkMode ? op_styles.main_container_dm : op_styles.main_container
      }
    >
      <div className={op_styles.sign_tab}>
        <h1>Opinion</h1>
      </div>
      {/* utils container */}
      <div>
        {/* heart util container */}
        <motion.div
          style={{ opacity: isHearted ? "1" : "0.5" }}
          className={
            isdarkMode
              ? op_styles.utils_container_dm
              : op_styles.utils_container
          }
          whileTap={{ scale: 2 }}
          onClick={() => heartArticle()}
        >
          <h1>{hearts > 999 ? `${(hearts / 1000).toFixed(1)}k` : hearts}</h1>
          <i className="fa fa-heart"></i>
        </motion.div>

        {/* pin utils container */}
        <motion.div
          style={{ opacity: isPinned ? "1" : "0.5" }}
          className={
            isdarkMode
              ? op_styles.utils_container_dm
              : op_styles.utils_container
          }
          whileTap={{ scale: 2 }}
          onClick={() => pinArticle()}
        >
          <h1>{pins > 999 ? `${(pins / 1000).toFixed(1)}k` : pins}</h1>
          <i className="fa fa-thumb-tack"></i>
        </motion.div>

        {/* share util container */}
        <motion.div
          style={{ opacity: isShared ? "1" : "0.5" }}
          className={
            isdarkMode
              ? op_styles.utils_container_dm
              : op_styles.utils_container
          }
          whileTap={{ scale: 2 }}
          onClick={() => shareArticle()}
        >
          <i className="fa fa-share"></i>
        </motion.div>
      </div>
    </div>
  );
};

//article detail component
const ArticleDetailDesktopContainer = ({ article }) => {
  //get variables
  const { isdarkMode } = useSelector((state) => state.Navbar);

  return (
    //main article container
    <div
      className={isdarkMode ? styles.main_container_dm : styles.main_container}
    >
      {/* opinion component */}
      <Opinion article={article} />

      {/* main article info body container */}
      <div
        className={
          isdarkMode
            ? styles.main_info_container_dm
            : styles.main_info_container
        }
      >
        {/* main article image container */}
        <div className={styles.head_container}>
          <div className={styles.image_container}>
            <Image
              src={article.cover_photo_url}
              style={{ objectFit: "cover" }}
              alt={article.title}
              layout="fill"
            />
          </div>
        </div>

        {/* main article body container */}
        <div className={styles.info_container}>
          <h1>{article.title}</h1>
          <p>{parser(article.desc)}</p>
        </div>

        {/* main article products forloop */}
        {article.products.map((product, index) => (
          <DesktopProductContainer product={product} prodIndex={index + 1} />
        ))}

        {/* main article  parts forloop */}
        {article.parts.map((part) => (
          <div key={part.pk}>
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
      </div>

      {/* article more/related articles component */}
      <More related_articles={article.related_articles} />
    </div>
  );
};

//export default component
export default ArticleDetailDesktopContainer;
