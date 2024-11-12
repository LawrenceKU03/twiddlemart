//franework/third-party packages
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

//custom styles/functions/components/variables
import styles from "../../../styles/Pages/Auth/Auth.module.css";
import {
	setActivePage,
	setAuthTokens,
	setIsLoading,
	setTempCurrentPage,
} from "../../../Components/Navbar/Navbar.slice";
import SEOHeader from "../../SeoHeader";
import { BASE_API_URL } from "../../../Components/utils";

//reset page
const reset = () => {
	//declare/get password
	const { isdarkMode } = useSelector((state) => state.Navbar);

	const [isloading, setLoading] = useState(false);
	const [ismobile, setMobile] = useState(false);
	const [homeData, setHomeData] = useState({});
	const [isSuccess, setSuccess] = useState(false);
	const [password, setPassword] = useState("");
	const [confirm_password, setConfirmPassword] = useState("");
	const [passwordStrength, setPasswordStrength] = useState(0);

	const router = useRouter();
	const { hash, id } = router.query;
	const dispatch = useDispatch();

	let strongPassword = new RegExp(
		"(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
	);
	let mediumPassword = new RegExp(
		"(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,})"
	);
	let containsUL = new RegExp("(?=.*[a-z])(?=.*[A-Z])");
	let containsSC = new RegExp(
		"(?=.*[0-9])(?=.*[@#$%&*()!:;/?~`|•√Π÷×{}	£¢€°^_=[]™®©¶<>=])"
	);

	const [showErrors, setShowError] = useState(false);
	const [showError2, setShowError2] = useState(false);
	const [showError3, setShowError3] = useState(false);

	const [showPassword, setShowPassword] = useState(false);
	const [showCPassword, setShowCPassword] = useState(false);

	const animInput_1 = useAnimationControls();
	const animInput_2 = useAnimationControls();

	//use useEffect to get HomeData and set device type
	useEffect(() => {
		const getHomeData = async () => {
			const res_home = await fetch(`${BASE_API_URL}/api/home/1/`);
			const json_data_home = await res_home.json();
			setHomeData(json_data_home);
		};

		getHomeData();
		if (window.innerWidth <= 720) {
			setMobile(!ismobile);
		}

		dispatch(setActivePage({ page_name: "reset" }));
		dispatch(setIsLoading({ isloading: false }));
		dispatch(setTempCurrentPage({ page_name: "reset" }));
	}, []);

	//submit form function
	const submitForm = async () => {
		setLoading(true);
		setShowError(false);
		setShowError2(false);
		setShowError3(false);

		//check for first password validation
		//activate shake anination
		if (password == "" || !strongPassword.test(password)) {
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
			//check for second password validation
			//activate shake animation
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
				//if isloading is true
				if (!isloading) {
					const reset_password_res = await fetch(
						`${BASE_API_URL}/api/home/reset_account_password/`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								hash: hash,
								id: id,
								password: password,
							}),
						}
					);

					const reset_password_json = await reset_password_res.json();

					if (!reset_password_json.success) {
						setLoading(false);
						toast.error("EXPIRED/BAD LINK", {
							position: "top-right",
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							theme: "colored",
						});
					} else {
						toast.success("PASSWORD RESET SUCCESS", {
							position: "top-right",
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							theme: "colored",
						});

						dispatch(setActivePage({ page_name: "login" }));
						setSuccess(true);
						router.push("auth/login");
					}
				}
			}
		}
	};

	//check password strength functiom
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

	//render for mobile device
	if (ismobile) {
		return (
			<div
				className={
					isdarkMode
						? styles.main_signup_container_dm
						: styles.main_signup_container
				}
			>
				<SEOHeader
					page_title={"Reset Password"}
					meta_desc={
						"Welcome to TwiddleMart,to start getting some better articles to your vibes just signup for and get your self customized view of our site and enjoy the awesomeness and much mo.."
					}
					canonical_url={`${BASE_API_URL}/${hash}/${id}`}
				/>

				<h1>
					Twiddle<span>mart</span>
				</h1>
				<div>
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
					<div style={{ position: "relative" }}>
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
				<div className={styles.categories_container}>
					<div
						className={
							isSuccess
								? styles.success_btn_container
								: styles.signup_btn_container
						}
					>
						<hr
							style={{
								width: "60%",
								margin: "0 auto",
								marginBottom: "20px",
							}}
						/>
						<motion.div onClick={() => submitForm()} whileTap={{ scale: 1.3 }}>
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
								<h1>Reset</h1>
							)}
						</motion.div>
					</div>
				</div>

				<div>
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
		return (
			<div
				className={
					isdarkMode
						? styles.main_signup_container_dm
						: styles.main_signup_container
				}
			>
				<SEOHeader
					page_title={"Reset Password"}
					meta_desc={
						"Welcome to TwiddleMart,to start getting some better articles to your vibes just signup for and get your self customized view of our site and enjoy the awesomeness and much mo.."
					}
				/>

				<div
					className={
						isdarkMode ? styles.window_container_dm : styles.window_container
					}
				>
					<section style={{ width: "50%", margin: "auto auto" }}>
						<h1>
							Twiddle<span>mart</span>
						</h1>
						<div>
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

							<div
								className={styles.password_container}
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									flexDirection: "column",
									minWidth: "100%",
								}}
							>
								<div style={{ position: "relative" }}>
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
										style={{ marginBottom: "20px", width: "100%" }}
									/>
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
										style={{ width: "100%" }}
									/>
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
						<div className={styles.categories_container}>
							<div
								className={
									isSuccess
										? styles.success_btn_container
										: styles.signup_btn_container
								}
							>
								<hr
									style={{
										width: "60%",
										margin: "0 auto",
										marginBottom: "20px",
									}}
								/>
								<motion.div
									onClick={() => submitForm()}
									whileTap={{ scale: 1.3 }}
								>
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
										<h1>Reset</h1>
									)}
								</motion.div>
							</div>
						</div>
					</section>
					<section className={styles.image_container}>
						<div style={{ position: "relative" }}>
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
				<div>
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
export default reset;
