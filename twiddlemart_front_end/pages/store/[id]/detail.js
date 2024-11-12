//imoport third-party and framework packages
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

//cudtom styles,functions and variables
import styles from "../../../styles/Pages/StorePage/DetailPage.module.css";
import DesktopProductContainer from "../../../Components/StorePage/DetailComponents/DesktopProductContainer";
import MobileProductContainer from "../../../Components/StorePage/DetailComponents/MobileProductContainer";
import { setActivePage, setIsLoading, setTempCurrentPage } from "../../../Components/Navbar/Navbar.slice";
import SEOHeader from "../../SeoHeader";
import { BASE_API_URL } from "../../../Components/utils.js";

//detail page component
const DetailProduct = ({ data }) => {
	const { isdarkMode } = useSelector(
		(state) => state.Navbar
	);
	const [isMobile, setMobile] = useState(false);
	const router = useRouter();
	const dispatch = useDispatch();

	useEffect(() => {
		//check if mobile or desktop
		if (window.innerWidth <= 720) {
			setMobile(true);
		} else {
			setMobile(false);
		}

		//set variables
		dispatch(setActivePage({ page_name: "store/detail" }));
		dispatch(setIsLoading({ isloading: false }));
		dispatch(setTempCurrentPage({ page_name: "store/detail" }));

	}, []);

	//return render code block
	return (
		//main container
		<div>
			{/* SEO component */}
			<SEOHeader
				page_title={`${data.title} - Store`}
				meta_desc={data.snippet}
				canonical_url={`${BASE_API_URL}/articles`}
			/>

			{/* wave container */}
			<div style={{ height: "100%", position: "relative" }}>
				{/* wave 1 container */}
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

				{/* wave 2 container */}
				<div clasName={styles.wave2}>
					<svg
						data-name="Layer 1"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 1200 120"
						preserveAspectRatio="none"
					>
						<path
							d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
							className={styles.wave2_shapefill}
						></path>
					</svg>
				</div>

				{/* wave 3 container */}
				<div className={styles.wave3}>
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

			{/* components container */}
			<div className={styles.component_container}>
				{/* check if isMobile to show only mobile syore drtail component else show desktop detail store component */}
				{isMobile ? (
					<MobileProductContainer product={data} />
				) : (
					<DesktopProductContainer product={data} />
				)}
			</div>
		</div>
	);
};

//server side render function
export async function getServerSideProps(context) {
	//get id param
	const { id } = context.params;

	//fetch product data
	const product_res = await fetch(`${BASE_API_URL}/api/store/${id}/detail/`);
	const product_data = await product_res.json();

	return {
		props: {
			//props data
			data: product_data,
		},
	};
}

export default DetailProduct;
