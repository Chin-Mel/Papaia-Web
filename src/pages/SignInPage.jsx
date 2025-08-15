import { useState } from "react";
import Footer from "../components/Footer/FooterMain";
import Header from "../components/Header/HeaderStart";
import { Link } from "react-router-dom";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/src/assets/hero-background.png')`,
          }}
        />

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-20 pb-8">
          <div className="w-full max-w-6xl mx-auto relative">
            <div className="absolute inset-0 bg-white/21 backdrop-blur-[5.4px] rounded-[20px] border border-white/1"></div>

            <div className="relative flex justify-center lg:justify-end items-center min-h-[565px] px-4 sm:px-8 md:px-16 py-8">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.25)] overflow-hidden">
                <div className="h-40 bg-gradient-to-r from-[#2D5016] to-[#4A7C59] relative">
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center">
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 30 31"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M30 2.625C30 9.28125 25.043 14.7832 18.6211 15.6328C18.2051 12.5039 16.8281 9.67969 14.7949 7.4707C17.0391 3.46289 21.3281 0.75 26.25 0.75H28.125C29.1621 0.75 30 1.58789 30 2.625ZM0 6.375C0 5.33789 0.837891 4.5 1.875 4.5H3.75C10.998 4.5 16.875 10.377 16.875 17.625V19.5V28.875C16.875 29.9121 16.0371 30.75 15 30.75C13.9629 30.75 13.125 29.9121 13.125 28.875V19.5C5.87695 19.5 0 13.623 0 6.375Z"
                        fill="#F0820B"
                      />
                    </svg>
                  </div>
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center w-full">
                    <h1 className="text-2xl font-bold text-white font-['Poppins']">
                      Papaya Farm
                    </h1>
                    <p className="text-orange-200 text-sm mt-1">
                      Welcome back to your farm dashboard
                    </p>
                  </div>
                </div>

                <div className="p-8">
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                        <svg
                          width="12"
                          height="14"
                          viewBox="0 0 13 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.125 7.75C7.05326 7.75 7.9435 7.38125 8.59987 6.72487C9.25625 6.0685 9.625 5.17826 9.625 4.25C9.625 3.32174 9.25625 2.4315 8.59987 1.77513C7.9435 1.11875 7.05326 0.75 6.125 0.75C5.19674 0.75 4.3065 1.11875 3.65013 1.77513C2.99375 2.4315 2.625 3.32174 2.625 4.25C2.625 5.17826 2.99375 6.0685 3.65013 6.72487C4.3065 7.38125 5.19674 7.75 6.125 7.75ZM4.87539 9.0625C2.18203 9.0625 0 11.2445 0 13.9379C0 14.3863 0.363672 14.75 0.812109 14.75H11.4379C11.8863 14.75 12.25 14.3863 12.25 13.9379C12.25 11.2445 10.068 9.0625 7.37461 9.0625H4.87539Z"
                            fill="#F39C33"
                          />
                        </svg>
                        Username
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your username"
                        className="w-full h-12 px-4 bg-gray-50 border border-gray-300 rounded-lg text-base placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                        <svg
                          width="12"
                          height="14"
                          viewBox="0 0 13 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.9375 4.6875V6H8.3125V4.6875C8.3125 3.47891 7.33359 2.5 6.125 2.5C4.91641 2.5 3.9375 3.47891 3.9375 4.6875ZM2.1875 6V4.6875C2.1875 2.51367 3.95117 0.75 6.125 0.75C8.29883 0.75 10.0625 2.51367 10.0625 4.6875V6H10.5C11.4652 6 12.25 6.78477 12.25 7.75V13C12.25 13.9652 11.4652 14.75 10.5 14.75H1.75C0.784766 14.75 0 13.9652 0 13V7.75C0 6.78477 0.784766 6 1.75 6H2.1875Z"
                            fill="#F39C33"
                          />
                        </svg>
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="w-full h-12 px-4 pr-12 bg-gray-50 border border-gray-300 rounded-lg text-base placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <svg
                            width="18"
                            height="16"
                            viewBox="0 0 18 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9.00001 1C6.47501 1 4.45314 2.15 2.98126 3.51875C1.51876 4.875 0.540637 6.5 0.0781372 7.61562C-0.0249878 7.8625 -0.0249878 8.1375 0.0781372 8.38437C0.540637 9.5 1.51876 11.125 2.98126 12.4812C4.45314 13.85 6.47501 15 9.00001 15C11.525 15 13.5469 13.85 15.0188 12.4812C16.4813 11.1219 17.4594 9.5 17.925 8.38437C18.0281 8.1375 18.0281 7.8625 17.925 7.61562C17.4594 6.5 16.4813 4.875 15.0188 3.51875C13.5469 2.15 11.525 1 9.00001 1ZM4.50001 8C4.50001 6.80653 4.97412 5.66193 5.81803 4.81802C6.66195 3.97411 7.80654 3.5 9.00001 3.5C10.1935 3.5 11.3381 3.97411 12.182 4.81802C13.0259 5.66193 13.5 6.80653 13.5 8C13.5 9.19347 13.0259 10.3381 12.182 11.182C11.3381 12.0259 10.1935 12.5 9.00001 12.5C7.80654 12.5 6.66195 12.0259 5.81803 11.182C4.97412 10.3381 4.50001 9.19347 4.50001 8ZM9.00001 6C9.00001 7.10313 8.10314 8 7.00001 8C6.77814 8 6.56564 7.9625 6.36564 7.89687C6.19376 7.84062 5.99376 7.94688 6.00001 8.12813C6.00939 8.34375 6.04064 8.55937 6.10001 8.775C6.52814 10.375 8.17501 11.325 9.77501 10.8969C11.375 10.4688 12.325 8.82188 11.8969 7.22188C11.55 5.925 10.4031 5.05312 9.12814 5C8.94689 4.99375 8.84064 5.19062 8.89689 5.36562C8.96251 5.56562 9.00001 5.77812 9.00001 6Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 border border-gray-400 rounded-sm accent-orange-500"
                        />
                        <span className="text-sm text-gray-500">
                          Remember me
                        </span>
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 17 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.79375 3.30938L11.6313 7.14687C11.8563 7.37187 11.9844 7.68125 11.9844 8C11.9844 8.31875 11.8563 8.62812 11.6313 8.85312L7.79375 12.6906C7.59375 12.8906 7.325 13 7.04375 13C6.45937 13 5.98438 12.525 5.98438 11.9406V10H1.98438C1.43125 10 0.984375 9.55313 0.984375 9V7C0.984375 6.44688 1.43125 6 1.98438 6H5.98438V4.05937C5.98438 3.475 6.45937 3 7.04375 3C7.325 3 7.59375 3.1125 7.79375 3.30938ZM11.9844 13H13.9844C14.5375 13 14.9844 12.5531 14.9844 12V4C14.9844 3.44688 14.5375 3 13.9844 3H11.9844C11.4312 3 10.9844 2.55313 10.9844 2C10.9844 1.44687 11.4312 1 11.9844 1H13.9844C15.6406 1 16.9844 2.34375 16.9844 4V12C16.9844 13.6562 15.6406 15 13.9844 15H11.9844C11.4312 15 10.9844 14.5531 10.9844 14C10.9844 13.4469 11.4312 13 11.9844 13Z"
                          fill="white"
                        />
                      </svg>
                      Login to Farm
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <span className="text-gray-500">
                      Don't have an account?{" "}
                    </span>
                    <button className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">
                      Sign up here
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
