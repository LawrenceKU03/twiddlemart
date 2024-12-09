import styles from "./utils.module.css";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
export const BASE_API_URL = "http://45.4.172.49:8000/";

export const BlockLoader = () => {
  return (
    <div className={styles.main_block_container}>
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className={styles.block_one}></div>
        <div className={styles.block_two}></div>
        <div className={styles.block_three}></div>
        <div className={styles.block_four}></div>
      </div>
    </div>
  );
};

export const DotLoader = () => {
  const { isdarkMode } = useSelector((state) => state.Navbar);
  return (
    <div className={isdarkMode ? styles.dot_loader_dm : styles.dot_loader}>
      <div className={styles.dot_one}></div>
      <div className={styles.dot_two}></div>
      <div className={styles.dot_three}></div>
    </div>
  );
};

export const LoadingLayout = () => {
  const { isLoading, isdarkMode } = useSelector((state) => state.Navbar);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: "0px",
        zIndex: `${isLoading ? "10" : "-1"}`,
      }}
    >
      {isLoading && (
        <div
          className={
            isdarkMode ? styles.loader_container_dm : styles.loader_container
          }
        >
          <BlockLoader />
        </div>
      )}
    </div>
  );
};

export const addToUserActivity = (tag) => {
  const data = JSON.parse(localStorage.getItem("userActivity")).data;

  if (localStorage.getItem("userActivity") && data.length < 60 && tag) {
    localStorage.setItem(
      "userActivity",
      JSON.stringify({ data: [...data, tag] })
    );
  } else {
    let sliced_data = data.slice(0, 30);
    localStorage.setItem(
      "userActivity",
      JSON.stringify({ data: [...sliced_data, tag] })
    );
  }
};

export const addToUserArticleActivity = (article_name) => {
  if (!localStorage.getItem("userArticleActivity")) {
    localStorage.setItem(
      "userArticleActivity",
      JSON.stringify({ data: [article_name] })
    );
    return;
  }

  const data = JSON.parse(localStorage.getItem("userArticleActivity")).data;

  if (
    localStorage.getItem("userArticleActivity") &&
    data.length < 60 &&
    article_name
  ) {
    localStorage.setItem(
      "userArticleActivity",
      JSON.stringify({ data: [...data, article_name] })
    );
  } else {
    let sliced_data = data.slice(0, 30);
    localStorage.setItem(
      "userArticleActivity",
      JSON.stringify({ data: [...sliced_data, article_name] })
    );
  }
};

export const copyText = (text) => {
  navigator.clipboard.writeText(text);
};
