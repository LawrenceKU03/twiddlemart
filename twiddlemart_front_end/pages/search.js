//framework/third-party packages functions
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";

//custom styles/functions/variables
import styles from "../styles/Pages/SearchPage/Search.module.css";
import {
	SearchTermContainer,
	SearchStats,
	SearchResultContainer,
	SearchFilter,
} from "../Components/SearchPage/DesktopSearchComponents";
import {
	SearchInfoFilter,
	SearchMobileResultContainer,
} from "../Components/SearchPage/MobileSearchComponents";
import {
	setActivePage,
	setIsLoading,
	setTempCurrentPage,
} from "../Components/Navbar/Navbar.slice";
import SEOHeader from "./SeoHeader";
import { BASE_API_URL } from "../Components/utils";

//search page
const Search = () => {
	//declare/get variables
	const { isdarkMode } = useSelector((state) => state.Navbar);
	const [isMobile, setMobile] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [data, setData] = useState({
		search_result: [],
		products: [],
		articles: [],
	});
	const [search_query, setSearchQuery] = useState("");
	const dispatch = useDispatch();
	const router = useRouter();
	const { q } = router.query;

	//use useEffect to check device/get data
	useEffect(() => {
		if (window.innerWidth <= 720) {
			setMobile(true);
		} else {
			setMobile(false);
		}
		setLoading(true);
		dispatch(setActivePage({ page_name: "search" }));
		setSearchQuery(q);
		const getSearchQuery = async () => {
			const search_res = await fetch(
				`${BASE_API_URL}/api/home/search/?q=${q}&page_num=1`
			);
			const search_data = await search_res.json();
			setData(search_data);
			setLoading(false);
		};

		getSearchQuery();
	}, [q]);

	//use useEffect to set active page to about-us
	useEffect(() => {
		dispatch(setActivePage({ page_name: "search" }));
		dispatch(setIsLoading({ isloading: false }));
		dispatch(setTempCurrentPage({ page_name: "search" }));
	}, []);

	//return code block
	return (
		<div>
			{/* seo component */}
			<SEOHeader
				page_title={"Search"}
				meta_desc={
					"Search the TwiddleMart for the best of products and articles that meet your needs and also gives you the best of quality service."
				}
				canonical_url={`${BASE_API_URL}/search`}
			/>

			{/* waves container */}
			<div style={{ position: "relative", zIndex: "1" }}>
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
				<div className={styles.wave2}>
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
				<div className={styles.wave3} style={{ zIndex: "-1" }}>
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

			{!isMobile ? (
				//desktop container
				<div
					style={{
						position: "absolute",
						top: "0px",
						height: "90%",
						width: "100%",
						display: "flex",
						justifyContent: "space-evenly",
						alignItems: "start",
						marginTop: "30px",
						zIndex: "3",
					}}
				>
					{/*  search utils components container  */}
					<div style={{ position: "relative", marginTop: "-10px" }}>
						<SearchTermContainer search_term={search_query} />
						<SearchStats
							products_n={data.products}
							articles_n={data.articles}
							pins_n={data.pins}
							hearts_n={data.hearts}
						/>
					</div>

					{/* main search component container */}
					<div
						style={{
							width: "60%",
							height: "70%",
							position: "relative",
							zIndex: "4",
						}}
					>
						<SearchResultContainer
							search_res={data}
							isLoading={isLoading}
							q={q ? q : ""}
						/>
					</div>

					{/* search filter component container */}
					<div style={{ position: "relative", marginTop: "-20px" }}>
						<SearchFilter />
					</div>
				</div>
			) : (
				//mobile container
				<div
					style={{
						position: "absolute",
						top: "0px",
						height: "90%",
						width: "100%",
						zIndex: "3",
					}}
				>
					<SearchInfoFilter
						search_term={search_query}
						products_n={data.products}
						articles_n={data.articles}
					/>
					<SearchMobileResultContainer
						search_res={data}
						isLoading={isLoading}
						q={q ? q : ""}
					/>
				</div>
			)}
		</div>
	);
};

export default Search;
