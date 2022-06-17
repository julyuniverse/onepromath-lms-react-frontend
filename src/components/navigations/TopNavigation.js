import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const TopNavigation = () => {
    const location = useLocation();
    const [menuName, setMenuName] = useState('전체 학급');
    const [menuPathName, setMenuPathName] = useState("/home/wholeclass/999");
    const [subMenuName, setSubMenuName] = useState("");
    const [subMenuPathName, setSubMenuPathName] = useState("");
    const [className, setClassName] = useState("");
    const [classNamePathName, setClassNamePathName] = useState("");
    const [learningStatus, setLearningStatus] = useState("");
    const [learningStatusPathName, setLearningStatusPathName] = useState("");
    const [subLearningStatus, setSubLearningStatus] = useState("");
    const [subLearningStatusPathName, setSubLearningStatusPathName] = useState("");

    const linkNav = () => {
        let pathname = location.pathname;
        let arr = pathname.split("/");

        arr = arr.filter((el) => {
            return el !== null && el !== undefined && el !== "";
        });

        if (Array.isArray(arr) && arr.length === 0) {
            setSubMenuName("전체보기");
            setSubMenuPathName("/home/wholeclass/999");
            setClassName("");
            setClassNamePathName("");
        } else {
            // 메뉴
            if (arr[1] === "wholeclass") {
                setMenuName("전체 학급");

                // 서브 메뉴
                if (arr[2] === "999") {
                    setSubMenuName("전체보기");
                    setSubMenuPathName(`/${arr[0]}/${arr[1]}/${arr[2]}`);
                } else if (arr[2] === "1") {
                    setSubMenuName("1학년");
                    setSubMenuPathName(`/${arr[0]}/${arr[1]}/${arr[2]}`);
                } else if (arr[2] === "2") {
                    setSubMenuName("2학년");
                    setSubMenuPathName(`/${arr[0]}/${arr[1]}/${arr[2]}`);
                } else if (arr[2] === "3") {
                    setSubMenuName("3학년");
                    setSubMenuPathName(`/${arr[0]}/${arr[1]}/${arr[2]}`);
                } else if (arr[2] === "4") {
                    setSubMenuName("4학년");
                    setSubMenuPathName(`/${arr[0]}/${arr[1]}/${arr[2]}`);
                } else if (arr[2] === "5") {
                    setSubMenuName("5학년");
                    setSubMenuPathName(`/${arr[0]}/${arr[1]}/${arr[2]}`);
                } else if (arr[2] === "6") {
                    setSubMenuName("6학년");
                    setSubMenuPathName(`/${arr[0]}/${arr[1]}/${arr[2]}`);
                } else if (arr[2] === "7") {
                    setSubMenuName("미설정");
                    setSubMenuPathName(`/${arr[0]}/${arr[1]}/${arr[2]}`);
                } else {
                    setSubMenuName("전체보기");
                    setSubMenuPathName("/home/wholeclass/999");
                }

                // 반 이름
                if (arr[4]) {
                    setClassName(arr[4]);
                    setClassNamePathName(`/${arr[0]}/${arr[1]}/${arr[2]}/${arr[3]}/${arr[4]}/${arr[5]}`);
                } else {
                    setClassName("");
                    setClassNamePathName("");
                }

                // 학습 현황
                if (arr[5]) {
                    if (arr[6]) {
                        if (arr[6] === "weeklylearningstatus") { // 주간 학습 현황
                            setLearningStatus("주간 학습 현황");
                        } else if (arr[6] === "averagelearningstatus") { // 평균 학습 현황
                            setLearningStatus("평균 학습 현황");
                        }
                        setLearningStatusPathName(`/${arr[0]}/${arr[1]}/${arr[2]}/${arr[3]}/${arr[4]}/${arr[5]}/${arr[6]}`);
                    } else {
                        setLearningStatus("주간 학습 현황");
                        setLearningStatusPathName(`/${arr[0]}/${arr[1]}/${arr[2]}/${arr[3]}/${arr[4]}/${arr[5]}`);
                    };
                } else {
                    setLearningStatus("");
                    setLearningStatusPathName("");
                }

                // 서브 학습 현황
                if (arr[7]) {
                    if (arr[7] === "monthlyclassaverage") {
                        setSubLearningStatus("월별 학습 평균");
                    } else if (arr[7] === "weeklyclassaverage") {
                        setSubLearningStatus("주별 학습 평균");
                    } else if (arr[7] === "dailyclassaverage") {
                        setSubLearningStatus("일별 학습 평균");
                    }
                    setSubLearningStatusPathName(`/${arr[0]}/${arr[1]}/${arr[2]}/${arr[3]}/${arr[4]}/${arr[5]}/${arr[6]}/${arr[7]}`);
                } else {
                    setSubLearningStatus("");
                    setSubLearningStatusPathName("");
                }
            } else if (arr[1] === "help") {
                setMenuName("고객 센터");
                setMenuPathName(`/${arr[0]}/${arr[1]}`);
                setSubMenuName("");
                setSubMenuPathName("");
                setClassName("");
                setClassNamePathName("");
                setLearningStatus("");
                setSubLearningStatusPathName("");
            }
        }
    }

    useEffect(() => {
        linkNav();
    }, [location])

    return (
        <div className="h-[80px] bg-[#ffffff] flex items-center rounded-br-3xl shadow-[0_15px_15px_-25px_rgba(0,0,0,0.3)]">
            <div className="flex text-[20px]">
                {
                    menuName !== "" ? (
                        <div>
                            <Link to={menuPathName} className="block">
                                <div className="flex items-center">
                                    <div className="hover:text-[#0063ff]">{menuName}</div>
                                </div></Link>
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
                                    <div className="hover:text-[#0063ff]">{subMenuName}</div>
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
                                    <div className="hover:text-[#0063ff]">{learningStatus}</div>
                                </div>
                            </Link>
                        </div>
                    ) : (null)
                }
                {
                    subLearningStatus !== "" ? (
                        <div>
                            <Link to={subLearningStatusPathName} className="block">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                    <div className="hover:text-[#0063ff]">{subLearningStatus}</div>
                                </div>
                            </Link>
                        </div>
                    ) : (null)
                }
            </div>
        </div>
    )
}

export default TopNavigation;