import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import BaseLayout from "./BaseLayout";

function MyApp({ Component, pageProps, router }) {
	return (
		<BaseLayout>
			<Component {...pageProps} key={router.pathname} />
		</BaseLayout>
	);
}

export default MyApp;
