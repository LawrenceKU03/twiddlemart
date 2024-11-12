//franework/third-party packages
import { useSelector, useDispatch } from "react-redux";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

//custom styles/functions/components/variables
import styles from "../../styles/Pages/Auth/Auth.module.css";
import {
	setActivePage,
	setAuthTokens,
	setIsLoading,
	setTempCurrentPage,
} from "../../Components/Navbar/Navbar.slice";
import SEOHeader from "../SeoHeader";
import { BASE_API_URL } from "../../Components/utils";

//catgeory component
const Category = ({ title, space, addtoCategoryArray }) => {
	//get/declare functions
	const [isClicked, setClicked] = useState(false);
	const { isdarkMode } = useSelector((state) => state.Navbar);

	//clicked function
	const Clicked = () => {
		setClicked(!isClicked);
		addtoCategoryArray(title);
	};

	//return code block
	//if space=true return filler category else return category
	return space ? (
		<div style={{ padding: "0 30px" }}></div>
	) : (
		<motion.div
			whileTap={{ scale: 1.5 }}
			onClick={() => Clicked()}
			className={
				isClicked
					? styles.mini_category_container_clicked
					: isdarkMode
						? styles.mini_category_container_dm
						: styles.mini_category_container
			}
		>
			<h2>{title}</h2>
		</motion.div>
	);
};

//signup page
const signup = () => {
	//get/declare variables
	const { isdarkMode } = useSelector((state) => state.Navbar);
	const [interested_categories, setInterestedCategories] = useState([]);
	const [categories, setCategories] = useState({});

	const [isloading, setLoading] = useState(false);
	const [ismobile, setMobile] = useState(false);
	const [homeData, setHomeData] = useState({});
	const [isSuccess, setSuccess] = useState(false);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirm_password, setConfirmPassword] = useState("");
	const [passwordStrength, setPasswordStrength] = useState(0);

	const router = useRouter();
	const dispatch = useDispatch();

	//regex checker
	let strongPassword = new RegExp(
		"(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
	);
	let mediumPassword = new RegExp(
		"(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,})"
	);
	let containsUL = new RegExp("(?=.*[a-z])(?=.*[A-Z])");
	let containsSC = new RegExp(
		"(?=.*[0-9])(?=.*[@#$%&*-+()!:;/?~`|•√Π÷×{}	£¢€°^_=[]™®©¶<>])"
	);

	const [showErrors, setShowError] = useState(false);
	const [showError2, setShowError2] = useState(false);
	const [showError3, setShowError3] = useState(false);
	const [showBError, setShowBError] = useState(false);

	const [showPassword, setShowPassword] = useState(false);
	const [showCPassword, setShowCPassword] = useState(false);

	const animInput_1 = useAnimationControls();
	const animInput_2 = useAnimationControls();
	const animInput_3 = useAnimationControls();

	//use useEffect hook get categories data / home data
	useEffect(() => {
		const getHomeCategories = async () => {
			//fetch categories data
			const res_cat = await fetch(`${BASE_API_URL}/api/home/categories/`);
			const json_data_cat = await res_cat.json();
			setCategories(json_data_cat);

			//fetch home data
			const res_home = await fetch(`${BASE_API_URL}/api/home/1/`);
			const json_data_home = await res_home.json();
			setCategories(json_data_cat);
			setHomeData(json_data_home);
		};

		getHomeCategories();

		//check if on mobile device
		if (window.innerWidth <= 720) {
			setMobile(!ismobile);
		}

		//set active page/turn off loading/ set temp active page
		dispatch(setActivePage({ page_name: "signup" }));
		dispatch(setIsLoading({ isloading: false }));
		dispatch(setTempCurrentPage({ page_name: "signup" }));
	}, []);

	//util function to check if category exist in.an.array
	const isExists = (title, icategories) => {
		let exists = false;
		for (let indx in icategories) {
			exists = icategories[indx] == title ? true : false;
		}
		return exists;
	};

	//function to add new categeory
	const addtoCategoryArray = (title) => {
		if (!isExists(title, interested_categories)) {
			setInterestedCategories([...interested_categories, title]);
		} else {
			let indx = interested_categories.indexOf(title);
			interested_categories.splice(indx, 1);
		}
	};

	//function to submit signup form
	const submitForm = async () => {
		setLoading(true);
		setShowError(false);
		setShowError2(false);
		setShowError3(false);
		setShowBError(false);

		if (!email != "") {
			setLoading(false);
			setShowError3(true);
			animInput_3.start({
				rotate: [-2, 2, -2, 2, -2, 2, -2, 0],
				transition: {
					duration: 0.5,
					type: "spring",
				},
			});
		} else {
			if (!strongPassword.test(password)) {
				setShowError(true);
				setLoading(false);
				animInput_1.start({
					rotate: [-2, 2, -2, 2, -2, 2, -2, 0],
					transition: {
						duration: 0.5,
						type: "spring",
					},
				});
			} else {
				if (password != confirm_password) {
					setShowError2(true);
					setLoading(false);

					animInput_2.start({
						rotate: [-2, 2, -2, 2, -2, 2, -2, 0],
						transition: {
							duration: 0.5,
							type: "spring",
						},
					});
				} else {
					//if is loading is true
					if (!isloading) {
						const signup_res = await fetch(`${BASE_API_URL}/api/home/signup/`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								email: email,
								password: password,
								categories_of_interest: interested_categories,
							}),
						});
						const signup_data = await signup_res.json();

						//if not success show error message
						//signup success login and redirect to home
						if (!signup_data.success) {
							setLoading(false);
							setShowBError(true);
						} else {
							fetch(`${BASE_API_URL}/auth/token/`, {
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({
									username: email,
									password: password,
								}),
							})
								.then((res) => {
									return res.json();
								})
								.then((json) => {
									if (json.detail) {
										setLoading(false);
									} else {
										dispatch(setAuthTokens({ authTokens: json }));
										dispatch(setActivePage({ page_name: "home" }));
										setSuccess(true);
										router.push("/");
									}
								});
						}
					}
				}
			}
		}
	};

	//function to check password strength
	const checkPassword = (password) => {
		if (strongPassword.test(password)) {
			setPasswordStrength(2);
		} else {
			if (mediumPassword.test(password)) {
				setPasswordStrength(1);
			} else {
				setPasswordStrength(0);
			}
		}
		setPassword(password);
	};

	//check if on mobile device to render for mobile
	if (ismobile) {
		//return block
		return (
			//main container
			<div
				className={
					isdarkMode
						? styles.main_signup_container_dm
						: styles.main_signup_container
				}
			>
				{/* seo component */}
				<SEOHeader
					page_title={"Sign Up"}
					meta_desc={
						"Welcome to TwiddleMart,to start getting some better articles to your vibes just signup for and get your self customized view of our site and enjoy the awesomeness and much mo.."
					}
				/>

				{/* title container */}
				<h1>
					Twiddle<span>mart</span>
				</h1>

				{/* error/input field main container */}
				<div>
					{/* email error container 1 */}
					{showError3 && (
						<div className={styles.validation_container}>
							<p
								style={{
									color: email != "" ? "#52ac39" : "#cf1733",
								}}
							>
								*email field must be field
							</p>
						</div>
					)}

					{/* email error container 2}
					{showBError && (
						<div className={styles.validation_container}>
							<p
								style={{
									color: "#cf1733",
								}}
							>
								*email address already in use
							</p>
						</div>
					)}

					{/* email field */}
					<div>
						<motion.input
							className={
								isdarkMode
									? styles.main_signup_container_input_item_dm
									: styles.main_signup_container_input_item
							}
							type="email"
							placeholder="Email"
							onChange={(e) => setEmail(e.target.value)}
							animate={animInput_3}
						/>
					</div>

					{/*  password  error container 1*/}
					{showErrors && (
						<div className={styles.validation_container}>
							<p
								style={{
									color: password.length >= 8 ? "#52ac39" : "#cf1733",
								}}
							>
								*must contain 8+ characters
							</p>
							<p
								style={{
									color: containsUL.test(password) ? "#52ac39" : "#cf1733",
								}}
							>
								*must contain uppercase and lowecase [A -Z,a-z]
							</p>
							<p
								style={{
									color: containsSC.test(password) ? "#52ac39" : "#cf1733",
								}}
							>
								*must contain numbers and contain special characters @,#,$,% etc
							</p>
						</div>
					)}

					{/* input container */}
					<div style={{ position: "relative" }}>
						{/* password input field */}
						<motion.input
							className={
								isdarkMode
									? passwordStrength == 2
										? styles.main_signup_container_input_item_passwords
										: passwordStrength == 1
											? styles.main_signup_container_input_item_passwordm
											: styles.main_signup_container_input_item_passwordw
									: passwordStrength == 2
										? styles.main_signup_container_input_item_passwords
										: passwordStrength == 1
											? styles.main_signup_container_input_item_passwordm
											: styles.main_signup_container_input_item_passwordw
							}
							type={showPassword ? "text" : "password"}
							placeholder="Password"
							onChange={(e) => checkPassword(e.target.value)}
							animate={animInput_1}
						/>

						{/* password visibilty toggle container */}
						<div className={styles.passwordShowToggleContainersi}>
							{showPassword ? (
								<i
									onClick={() => setShowPassword(!showPassword)}
									className="fa fa-eye"
								></i>
							) : (
								<i
									onClick={() => setShowPassword(!showPassword)}
									className="fa fa-eye-slash"
								></i>
							)}
						</div>
					</div>

					{/* password error container 2 */}
					{showError2 && (
						<div className={styles.validation_container}>
							<p
								style={{
									color: password == confirm_password ? "#52ac39" : "#cf1733",
								}}
							>
								*passwords must be the same
							</p>
						</div>
					)}

					{/* password input field */}
					<div style={{ position: "relative" }}>
						<motion.input
							className={
								isdarkMode
									? styles.main_signup_container_input_item_dm
									: styles.main_signup_container_input_item
							}
							type={showCPassword ? "text" : "password"}
							placeholder="Confirm Password"
							onChange={(e) => setConfirmPassword(e.target.value)}
							animate={animInput_2}
						/>

						{/* password visibility toggle container */}
						<div className={styles.passwordShowToggleContainer}>
							{showCPassword ? (
								<i
									onClick={() => setShowCPassword(!showCPassword)}
									className="fa fa-eye"
								></i>
							) : (
								<i
									onClick={() => setShowCPassword(!showCPassword)}
									className="fa fa-eye-slash"
								></i>
							)}
						</div>
					</div>
				</div>

				{/* main categories container */}
				<div className={styles.categories_container}>
					{/* title container */}
					<div
						className={
							isdarkMode
								? styles.categories_container_container_dm
								: styles.categories_container_container
						}
					>
						<h2>Interest</h2>
						<hr />
					</div>

					{/* categories container */}
					<div className={styles.interest_container}>
						{/* filler category */}
						<Category space={true} />

						{/* loop through categories */}
						{categories[0] &&
							categories.map((category, index) => (
								<Category
									addtoCategoryArray={addtoCategoryArray}
									title={category.title}
									key={index}
								/>
							))}

						{/* filler category */}
						<Category space={true} />
					</div>

					{/* main button container */}
					<div
						className={
							isSuccess
								? styles.success_btn_container
								: styles.signup_btn_container
						}
					>
						{/* line */}
						<hr
							style={{
								width: "60%",
								margin: "0 auto",
								marginBottom: "20px",
							}}
						/>

						{/* button container */}
						<motion.div onClick={() => submitForm()} whileTap={{ scale: 1.3 }}>
							{/* if is loading show spinner else signup text */}
							{isloading ? (
								<div
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "centet",
										width: "50px",
										height: "60px",
									}}
								>
									<div className={styles.loading_container}></div>
								</div>
							) : (
								<h1>Sign up</h1>
							)}
						</motion.div>
					</div>
				</div>

				{/* wave container */}
				<div>
					{/* wave 1 container */}
					<div className={styles.wave}>
						<svg
							data-name="Layer 1"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 1200 120"
							preserveAspectRatio="none"
						>
							<path
								d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
								className={styles.shape_fill}
							></path>
						</svg>
					</div>
				</div>
			</div>
		);
	} else {
		//return for desktop
		return (
			<div
				className={
					isdarkMode
						? styles.main_signup_container_dm
						: styles.main_signup_container
				}
			>
				{/* seo component */}
				<SEOHeader
					page_title={"Sign Up"}
					meta_desc={
						"Welcome to TwiddleMart,to start getting some better articles to your vibes just signup for and get your self customized view of our site and enjoy the awesomeness and much mo.."
					}
					canonical_url={`${BASE_API_URL}/signup`}
				/>

				{/* main signup container */}
				<div
					className={
						isdarkMode ? styles.window_container_dm : styles.window_container
					}
				>
					{/* input container section */}
					<section style={{ width: "50%" }}>
						{/* title */}
						<h1>
							Twiddle<span>mart</span>
						</h1>

						{/* input field/error container */}
						<div>
							<div>
								{/* email error container 1 */}
								{showError3 && (
									<div className={styles.validation_container}>
										<p
											style={{
												color: email != "" ? "#52ac39" : "#cf1733",
											}}
										>
											*email field must be field
										</p>
									</div>
								)}

								{/* email error container 2 */}
								{showBError && (
									<div className={styles.validation_container}>
										<p
											style={{
												color: "#cf1733",
											}}
										>
											*email address already in use
										</p>
									</div>
								)}

								{/* email input container */}
								<div>
									<motion.input
										className={
											isdarkMode
												? styles.main_signup_container_input_item_dm
												: styles.main_signup_container_input_item
										}
										type="email"
										placeholder="Email"
										onChange={(e) => setEmail(e.target.value)}
										animate={animInput_3}
									/>
								</div>
							</div>

							{/* password error container 1 */}
							{showErrors && (
								<div className={styles.validation_container}>
									<p
										style={{
											color: password.length >= 8 ? "#52ac39" : "#cf1733",
										}}
									>
										*must contain 8+ characters
									</p>
									<p
										style={{
											color: containsUL.test(password) ? "#52ac39" : "#cf1733",
										}}
									>
										*must contain uppercase and lowecase [A -Z,a-z]
									</p>
									<p
										style={{
											color: containsSC.test(password) ? "#52ac39" : "#cf1733",
										}}
									>
										*must contain numbers and contain special characters @,#,$,%
										etc
									</p>
								</div>
							)}

							{/* password error contianer 2 */}
							{showError2 && (
								<div className={styles.validation_container}>
									<p
										style={{
											color:
												password == confirm_password ? "#52ac39" : "#cf1733",
										}}
									>
										*passwords must be the same
									</p>
								</div>
							)}

							{/* password container */}
							<div className={styles.password_container}>
								<div style={{ position: "relative" }}>
									{/* password input field 1 */}
									<motion.input
										className={
											isdarkMode
												? passwordStrength == 2
													? styles.main_signup_container_input_item_passwords
													: passwordStrength == 1
														? styles.main_signup_container_input_item_passwordm
														: styles.main_signup_container_input_item_passwordw
												: passwordStrength == 2
													? styles.main_signup_container_input_item_passwords
													: passwordStrength == 1
														? styles.main_signup_container_input_item_passwordm
														: styles.main_signup_container_input_item_passwordw
										}
										type={showPassword ? "text" : "password"}
										placeholder="Password"
										onChange={(e) => checkPassword(e.target.value)}
										animate={animInput_1}
									/>

									{/* password visibility toggle container */}
									<div className={styles.passwordShowToggleContainer}>
										{showPassword ? (
											<i
												onClick={() => setShowPassword(!showPassword)}
												className="fa fa-eye"
											></i>
										) : (
											<i
												onClick={() => setShowPassword(!showPassword)}
												className="fa fa-eye-slash"
											></i>
										)}
									</div>
								</div>

								{/* password input field 2 */}
								<div style={{ position: "relative" }}>
									{/* password inout field */}
									<motion.input
										className={
											isdarkMode
												? styles.main_signup_container_input_item_dm
												: styles.main_signup_container_input_item
										}
										type={showCPassword ? "text" : "password"}
										placeholder="Confirm Password"
										onChange={(e) => setConfirmPassword(e.target.value)}
										animate={animInput_2}
									/>

									{/* password visibility toggle container */}
									<div className={styles.passwordShowToggleContainer}>
										{showCPassword ? (
											<i
												onClick={() => setShowCPassword(!showCPassword)}
												className="fa fa-eye"
											></i>
										) : (
											<i
												onClick={() => setShowCPassword(!showCPassword)}
												className="fa fa-eye-slash"
											></i>
										)}
									</div>
								</div>
							</div>
						</div>

						{/* main categories container */}
						<div className={styles.categories_container}>
							{/* title container */}
							<div
								className={
									isdarkMode
										? styles.categories_container_container_dm
										: styles.categories_container_container
								}
							>
								<h2>Interest</h2>
								<hr />
							</div>

							{/* categories container */}
							<div
								className={
									isdarkMode
										? styles.interest_container_dm
										: styles.interest_container
								}
							>
								{/* filler category */}
								<Category space={true} />

								{/* loop through categories */}
								{categories[0] &&
									categories.map((category, index) => (
										<Category
											addtoCategoryArray={addtoCategoryArray}
											title={category.title}
											key={index}
										/>
									))}

								{/* filler category */}
								<Category space={true} />
							</div>

							{/* main button container */}
							<div
								className={
									isSuccess
										? styles.success_btn_container
										: styles.signup_btn_container
								}
							>
								{/* line */}
								<hr
									style={{
										width: "60%",
										margin: "0 auto",
										marginBottom: "20px",
									}}
								/>

								{/* button container  */}
								<motion.div
									onClick={() => submitForm()}
									whileTap={{ scale: 1.3 }}
								>
									{/* if isloading shoe spinner else show signup text */}
									{isloading ? (
										<div
											style={{
												display: "flex",
												justifyContent: "center",
												alignItems: "centet",
												width: "50px",
												height: "60px",
											}}
										>
											<div className={styles.loading_container}></div>
										</div>
									) : (
										<h1>Sign up</h1>
									)}
								</motion.div>
							</div>
						</div>
					</section>

					{/* image  container section */}
					<section className={styles.image_container}>
						{/* image container */}
						<div style={{ position: "relative" }}>
							{/* image */}
							<Image
								src={homeData.image_url}
								objectFit="cover"
								objectPosition="center"
								layout="fill"
								alt={"signup_image"}
							/>
						</div>
					</section>
				</div>

				{/* wave container */}
				<div>
					{/* wave 1 container */}
					<div className={styles.wave}>
						<svg
							data-name="Layer 1"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 1200 120"
							preserveAspectRatio="none"
						>
							<path
								d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
								className={styles.shape_fill}
							></path>
						</svg>
					</div>
				</div>
			</div>
		);
	}
};

export default signup;
