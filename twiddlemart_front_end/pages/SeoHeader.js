import Head from "next/head";
import { BASE_API_URL } from "../Components/utils.js";

const SEOHeader = ({ page_title, meta_desc, canonical_url }) => {
  return (
    <div>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/static/images/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/static/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/static/images/favicon-16x16.png"
        />
        <link rel="manifest" href="/static/images/site.webmanifest" />
        <link
          rel="canonical"
          href={canonical_url ? canonical_url : `${BASE_API_URL}`}
        />
        <title>
          {`${page_title ? page_title.toLowerCase() : ""} ${
            page_title ? "|" : ""
          } twiddlemart`}
        </title>
        <meta
          name="description"
          content={`${page_title ? page_title.toLowerCase() :""},${meta_desc}`}
        />
      </Head>
    </div>
  );
};

export default SEOHeader;
