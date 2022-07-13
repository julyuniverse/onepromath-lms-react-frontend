import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const TopNavigation = () => {
    const location = useLocation();
    const [menuName, setMenuName] = useState('전체 학급');
    const [menuPathName, setMenuPathName] = useState("/home/whole-class/999");
    const [subMenuName, setSubMenuName] = useState("");
    const [subMenuPathName, setSubMenuPathName] = useState("");
    const [className, setClassName] = useState("");
    const [classNamePathName, setClassNamePathName] = useState("");
    const [learningStatus, setLearningStatus] = useState("");
    const [learningStatusPathName, setLearningStatusPathName] = useState("");
    const [learningDetails, setLearningDetails] = useState("");
    const [learningDetailsPathName, setLearningDetailsPathName] = useState("");
    const [lastMenu, setLastMenu] = useState(0);
    const [helpHover, setHelpHover] = useState(false); // 헬프

    const linkNav = () => {
        let pathname = location.pathname;
        let arr = pathname.split("/");

        arr = arr.filter((el) => {
            return el !== null && el !== undefined && el !== "";
        });
        
        if (Array.isArray(arr) && arr.length === 0) {
            setSubMenuName("전체보기");
            setSubMenuPathName("/home/whole-class/999");
            setClassName("");
            setLearningStatus("");
            setLearningDetails("");
            setLastMenu(2);
        } else {
            // 메뉴
            if (arr[1] === "whole-class") {
                setMenuName("전체 학급");

                // 서브 메뉴
                if (arr[2] === "999") {
                    setSubMenuName("전체보기");
                    setSubMenuPathName(`/${arr[0]}/${arr[1]}/${arr[2]}`);
                    setLastMenu(2);
                } else if (arr[2] === "1") {
                    setSubMenuName("1학년");
                    setSubMenuPathName(`/${arr[0]}/${arr[1]}/${arr[2]}`);
                    setLastMenu(2);
                } else if (arr[2] === "2") {
                    setSubMenuName("2학년");
                    setSubMenuPathName(`/${arr[0]}/${arr[1]}/${arr[2]}`);
                    setLastMenu(2);
                } else if (arr[2] === "3") {
                    setSubMenuName("3학년");
                    setSubMenuPathName(`/${arr[0]}/${arr[1]}/${arr[2]}`);
                    setLastMenu(2);
                } else if (arr[2] === "4") {
                    setSubMenuName("4학년");
                    setSubMenuPathName(`/${arr[0]}/${arr[1]}/${arr[2]}`);
                    setLastMenu(2);
                } else if (arr[2] === "5") {
                    setSubMenuName("5학년");
                    setSubMenuPathName(`/${arr[0]}/${arr[1]}/${arr[2]}`);
                    setLastMenu(2);
                } else if (arr[2] === "6") {
                    setSubMenuName("6학년");
                    setSubMenuPathName(`/${arr[0]}/${arr[1]}/${arr[2]}`);
                    setLastMenu(2);
                } else if (arr[2] === "7") {
                    setSubMenuName("미설정");
                    setSubMenuPathName(`/${arr[0]}/${arr[1]}/${arr[2]}`);
                    setLastMenu(2);
                } else {
                    setSubMenuName("전체보기");
                    setSubMenuPathName("/home/whole-class/999");
                    setLastMenu(2);
                }

                // 반 이름
                if (arr[4]) {
                    setClassName(arr[4]);
                    setClassNamePathName(`/${arr[0]}/${arr[1]}/${arr[2]}/${arr[3]}/${arr[4]}/learning-status`);
                } else {
                    setClassName("");
                    setClassNamePathName("");
                }

                // 학습 현황
                if (arr[5]) {
                    if (arr[6]) {
                        if (arr[6] === "weekly-learning-status") { // 주간 학습 현황
                            setLearningStatus("주간 학습 현황");
                        } else if (arr[6] === "average-learning-status") { // 평균 학습 현황
                            setLearningStatus("평균 학습 현황");
                        }
                        setLearningStatusPathName(`/${arr[0]}/${arr[1]}/${arr[2]}/${arr[3]}/${arr[4]}/${arr[5]}/${arr[6]}`);
                    } else {
                        setLearningStatus("주간 학습 현황");
                        setLearningStatusPathName(`/${arr[0]}/${arr[1]}/${arr[2]}/${arr[3]}/${arr[4]}/${arr[5]}`);
                    };
                    setLastMenu(4);
                } else {
                    setLearningStatus("");
                    setLearningStatusPathName("");
                }

                // 학습 상세
                if (arr[6]) {
                    if (arr[6] === "average-learning-status") {
                        if (arr[10]) {
                            if (arr[10] === "1") {
                                setLearningDetails("월간 보고서");
                                setLearningDetailsPathName(`/${arr[0]}/${arr[1]}/${arr[2]}/${arr[3]}/${arr[4]}/${arr[5]}/${arr[6]}/${arr[7]}/${arr[8]}/${arr[9]}/${arr[10]}`);
                                setLastMenu(5);
                            } else if (arr[10] === "2") {
                                setLearningDetails("주별 학습 상세");
                                setLearningDetailsPathName(`/${arr[0]}/${arr[1]}/${arr[2]}/${arr[3]}/${arr[4]}/${arr[5]}/${arr[6]}/${arr[7]}/${arr[8]}/${arr[9]}/${arr[10]}`);
                                setLastMenu(5);
                            } else if (arr[10] === "3") {
                                setLearningDetails("일별 학습 상세");
                                setLearningDetailsPathName(`/${arr[0]}/${arr[1]}/${arr[2]}/${arr[3]}/${arr[4]}/${arr[5]}/${arr[6]}/${arr[7]}/${arr[8]}/${arr[9]}/${arr[10]}`);
                                setLastMenu(5);
                            }
                        } else {
                            setLearningDetails("");
                            setLearningDetailsPathName("");
                        }
                    }
                } else {
                    setLearningDetails("");
                    setLearningDetailsPathName("");
                }

            } else if (arr[1] === "help") {
                setMenuName("고객 센터");
                setMenuPathName(`/${arr[0]}/${arr[1]}`);
                setSubMenuName("");
                setSubMenuPathName("");
                setClassName("");
                setLearningStatus("");
                setLearningDetails("");
            }
        }
    }

    useEffect(() => {
        linkNav();
    }, [location])

    return (
        <div className="h-[80px] bg-[#ffffff] flex justify-between items-center pr-[26px] rounded-br-3xl shadow-[0_15px_15px_-25px_rgba(0,0,0,0.3)]">
            <div className="flex text-[20px] font-semibold">
                {
                    menuName !== "" ? (
                        <div>
                            <Link to={menuPathName} className="block">
                                <div className="flex items-center">
                                    <div className="hover:text-[#0063ff]">{menuName}</div>
                                </div>
                            </Link>
                        </div>
                    ) : (null)
                }
                {
                    subMenuName !== "" ? (
                        <div>
                            <Link to={subMenuPathName} className="block">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                    <div className={lastMenu === 2 ? "text-[#3382ff] hover:text-[#0063ff]" : "text-[#000000] hover:text-[#0063ff]"}>{subMenuName}</div>
                                </div>
                            </Link>
                        </div>
                    ) : (null)
                }
                {
                    className !== "" ? (
                        <div>
                            <Link to={classNamePathName} className="block">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                    <div className="hover:text-[#0063ff]">{decodeURIComponent(className)}</div>
                                </div>
                            </Link>
                        </div>
                    ) : (null)
                }
                {
                    learningStatus !== "" ? (
                        <div>
                            <Link to={learningStatusPathName} className="block">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                    <div className={lastMenu === 4 ? "text-[#3382ff] hover:text-[#0063ff]" : "text-[#000000] hover:text-[#0063ff]"}>{learningStatus}</div>
                                </div>
                            </Link>
                        </div>
                    ) : (null)
                }
                {
                    learningDetails !== "" ? (
                        <div>
                            <Link to={learningDetailsPathName} className="block">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                    <div className={lastMenu === 5 ? "text-[#3382ff] hover:text-[#0063ff]" : "text-[#000000] hover:text-[#0063ff]"}>{learningDetails}</div>
                                </div>
                            </Link>
                        </div>
                    ) : (null)
                }
            </div>

            <div>
                <div className="flex items-center">
                    <div className="text-[18px]">
                        안녕하세요, {window.sessionStorage.getItem("schoolname")} <span className="underline decoration-wavy decoration-[#fac232] decoration-[2px] underline-offset-[4px]">{window.sessionStorage.getItem("teachername")}</span> 선생님!
                    </div>

                    <div className={"relative px-1"}>
                        <a href="https://blog.naver.com/PostView.naver?blogId=1promath_office&logNo=222630128097&categoryNo=1&parentCategoryNo=1&from=thumbnailList" target="_blank" onMouseOver={() => setHelpHover(true)} onMouseOut={() => setHelpHover(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={helpHover ? "h-6 w-6 stroke-[#72787f]" : "h-6 w-6 stroke-[#999c9f]"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </a>
                        <div className={helpHover ? ("relative top-[10px] -right-[4px] transition") : ("relative top-[10px] -right-[4px] transition opacity-0")}>
                            <div className="absolute -top-[9px] z-10">
                                <div className="absolute w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[10px] border-b-[#d0d7de]"></div>
                                <div className="absolute w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-[#ffffff] left-[2px] top-[2px]"></div>
                            </div>
                            <div className="absolute right-0 bg-[#ffffff] rounded shadow-sm border-[1px] border-[#d0d7de] p-2 whitespace-nowrap inline-block text-[14px]">일프로선생님 도움말 블로그로 가기</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopNavigation;