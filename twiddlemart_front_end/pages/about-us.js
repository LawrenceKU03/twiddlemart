import styles from "../styles/Pages/AboutUsPage/AboutUsPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import SEOHeader from "./SeoHeader";
import { useEffect, useState } from "react";
import parser from "html-react-parser";
import Image from "next/image";
import {
  setActivePage,
  setIsLoading,
  setTempCurrentPage,
} from "../Components/Navbar/Navbar.slice";
import { BASE_API_URL } from "../Components/utils.js";

const AffliatePartner = ({ partner, isLogoLeft }) => {
  if (isLogoLeft) {
    return (
      <div className={styles.affliate_partner}>
        <div>
          <div className={styles.affliate_partner_logo}>
            <Image layout="fill" src={partner.logo_url} alt={partner.title} />
          </div>
        </div>
        <div>
          <h1>{partner.title}</h1>
          <p>{parser(partner.desc)}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.affliate_partner}>
        <div>
          <h1>{partner.title}</h1>
          <p>{parser(partner.desc)}</p>
        </div>
        <div>
          <div className={styles.affliate_partner_logo}>
            <Image layout="fill" src={partner.logo_url} alt={partner.title} />
          </div>
        </div>
      </div>
    );
  }
};

const PartnersContainer = () => {
  const [partners, setPartners] = useState([]);
  const [ismobile, setIsMobile] = useState(false);

  useEffect(() => {
    const getPartners = async () => {
      const partners_res = await fetch(
        `${BASE_API_URL}/api/home/affliate_partners/`
      );
      const partners_json = await partners_res.json();
      setPartners(partners_json.partners);

      if (window.innerWidth <= 720) {
        setIsMobile(true);
      }
    };

    getPartners();
  }, []);
  return (
    <div className={styles.affliate_partners_main_container}>
      <div>
        <h1>Affliate Partners</h1>
      </div>
      {partners.map((partner, index) =>
        ismobile ? (
          <div className={styles.affliate_partner}>
            <div className={styles.affliate_partner_logo}>
              <Image layout="fill" src={partner.logo_url} />
            </div>
            <div>
              <h1>{partner.title}</h1>
              <p>{parser(partner.desc)}</p>
            </div>
          </div>
        ) : (
          <AffliatePartner
            partner={partner}
            isLogoLeft={index % 2 == 0 ? true : false}
          />
        )
      )}
    </div>
  );
};

const AboutUs = () => {
  //declare variables
  const { isdarkMode } = useSelector((state) => state.Navbar);
  const dispatch = useDispatch();

  //use useEffect to set active page to about-us
  useEffect(() => {
    dispatch(setActivePage({ page_name: "about-us" }));
    dispatch(setIsLoading({ isloading: false }));
    dispatch(setTempCurrentPage({ page_name: "about-us" }));
  }, []);

  return (
    <div className={styles.main_container}>
      <SEOHeader
        page_title={"About Us"}
        meta_desc={
          "an affliate website designed to recommend the best articles and products to give you the best satisfactory service through our algorithm which helps us in recommending products and articles to you now you get a chance have a say in picking the coolest stuff, making our service t..."
        }
        canonical_url={`${BASE_API_URL}/about-us`}
      />

      <div style={{ zIndex: "1" }}>
        <div className={styles.wave1}>
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className={
                isdarkMode ? styles.wave1_shapefill_dm : styles.wave1_shapefill
              }
            ></path>
          </svg>
        </div>
        <div className={styles.wave2}>
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
              className={styles.wave2_shapefill}
            ></path>
          </svg>
        </div>
        <div
          className={styles.wave3}
          style={{ position: "relative", zIndex: "-1" }}
        >
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className={styles.wave3_shapefill}
            ></path>
          </svg>
        </div>
      </div>
      <div className={styles.info_container}>
        <div
          className={
            isdarkMode
              ? styles.main_about_us_container_dm
              : styles.main_about_us_container
          }
        >
          <h1>About Us</h1>
          <div
            style={{
              width: "100%",
              textAlign: "left",
              padding: "15px 10px",
            }}
          >
            <p>
              Welcome! to
              <b
                style={{
                  fontFamily: "Pacifico",
                  color: "#0ea5e9",
                  fontWeight: "600",
                }}
              >
                Twiddle
                <span
                  style={{
                    color: isdarkMode ? "#fff" : "#000",
                  }}
                >
                  mart
                </span>
              </b>
              ,
              <br />
              <br />
              <div
                className={
                  isdarkMode
                    ? styles.main_info_container_dm
                    : styles.main_info_container
                }
              >
                An affliate blog website designed to recommend the best articles
                and products to give you the best satisfactory user experience
                through our recommendation system which helps us in recommending
                products and articles aimed at giving the best content to
                you,now you get a chance have a say in picking the coolest stuff
                you want, making our service to you better also helping other
                user like you find awesome stuff.
                <br />
                <br /> Also we may get a commission on product bought through
                our affliate link,nonetheless we do not recommend products
                solely for profit more for giving you what we see as the best
                interesting to you.
                <PartnersContainer />
              </div>
            </p>
          </div>
          <div
            style={{
              width: "100%",
              padding: "15px 10px",
              textAlign: "right",
              position: "relative",
            }}
          >
            <b>
              --by{" "}
              <span style={{ fontFamily: "Pacifico" }}>Twiddlemart Team</span>
            </b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
