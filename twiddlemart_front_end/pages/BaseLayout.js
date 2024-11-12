import Head from "next/head";
import { AnimatePresence } from "framer-motion";
import { FootNavbar, MobileNavbar, Navbar } from "../Components/Navbar/";
import { Provider } from "react-redux";
import { store } from "../store";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";

import styles from "./BaseLayout.module.css";
import { LoadingLayout } from "../Components/utils.js";

const BaseLayout = ({ children }) => {
  const [is_mobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (window.innerWidth <= 720) {
      setIsMobile(!is_mobile);
    }
  }, []);

  useEffect(() => {
    const mainComponentBody = document.querySelector("#mainComponentBody");
    mainComponentBody.scrollTo({
      top: 0,
    });
  }, [store.getState("isactivePage")]);

  return (
    <AnimatePresence>
      <Provider store={store}>
        <div className={styles.root_container}>
          <Head>
            <title>Twiddlemart</title>
            <style>
              @import
              url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
              @import
              url('https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap');
              @import
              url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
            </style>
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
              integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
          </Head>
          <Navbar />
          <div id="mainComponentBody" className={styles.main_root_container}>
            {children}
            <FootNavbar />
            <LoadingLayout />
          </div>
          <div className={styles.mobile_nav_container}>
            {is_mobile && <MobileNavbar />}
          </div>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Provider>
    </AnimatePresence>
  );
};

export default BaseLayout;
