import { Fragment, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { classes } from "../../../../api/axios";

const Class = () => {
    const location = useLocation();
    const params = useParams();
    const [classList, setClassList] = useState([]);

    const getClass = () => {
        if (params.class) { // params.class 존재한다면
            classes(window.sessionStorage.getItem("schoolinfono"), params.class)
                .then((res) => {
                    setClassList(res.data);
                })
                .catch((error) => { console.error(error) });
        } else {
            classes(window.sessionStorage.getItem("schoolinfono"), 999)
                .then((res) => {
                    setClassList(res.data);
                })
                .catch((error) => { console.error(error) });
        }
    }

    useEffect(() => {
        getClass();
    }, [location])

    return (
        <div>
            <div className="text-[20px]">
                {
                    params.class ? (
                        <Fragment>
                            {
                                {
                                    "999": <Fragment>전체보기</Fragment>,
                                    "1": <Fragment>1학년</Fragment>,
                                    "2": <Fragment>2학년</Fragment>,
                                    "3": <Fragment>3학년</Fragment>,
                                    "4": <Fragment>4학년</Fragment>,
                                    "5": <Fragment>5학년</Fragment>,
                                    "6": <Fragment>6학년</Fragment>,
                                    "7": <Fragment>미설정</Fragment>
                                }[params.class]
                            }
                        </Fragment>
                    ) : (
                        <Fragment>전체보기</Fragment>
                    )
                }
            </div>

            <div className="flex flex-wrap relative w-[1200px] mt-[20px]">
                {
                    classList.length > 0 ?
                        (
                            <Fragment>
                                {
                                    params.class === "7" ? (
                                        classList && classList.map((value, index) => (
                                            <div key={index}
                                                className="block relative w-[192px] h-[192px] bg-[#ffffff] mr-[40px] mb-[40px] rounded-[10px] p-[20px] transition duration-300 ease-in-out transform shadow-md hover:shadow-lg hover:-translate-y-1">
                                                <div className="text-[18px] font-bold">
                                                    {value.className}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        classList && classList.map((value, index) => (
                                            <Link key={index} to={`/home/wholeclass/${(params.class) ? params.class : 999}/${value.schoolClassNo}/${value.className}/learningstatus`}
                                                className="block relative w-[192px] h-[192px] bg-[#ffffff] mr-[40px] mb-[40px] rounded-[10px] p-[20px] transition duration-300 ease-in-out transform shadow-md hover:shadow-lg hover:-translate-y-1">
                                                <div className="text-[18px] font-bold">
                                                    {value.className}
                                                </div>
                                                <div className={"flex mt-[100px]"}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#72787f]" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                    &nbsp;{value.studentCount}명
                                                </div>
                                            </Link>
                                        ))
                                    )
                                }
                            </Fragment>
                        ) : (
                            params.class === "7" ? (
                                <div>
                                    <div className={"relative w-[192px] h-[192px] bg-[#ffffff] mr-[40px] mb-[40px] rounded-[10px] p-[20px] transition duration-300 ease-in-out transform shadow-md hover:shadow-lg hover:-translate-y-1"}>
                                        반이 설정되지 않은 학생은 없어요.
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className={"relative w-[192px] h-[192px] bg-[#ffffff] mr-[40px] mb-[40px] rounded-[10px] p-[20px] transition duration-300 ease-in-out transform shadow-md hover:shadow-lg hover:-translate-y-1"}>
                                        반이 없어요.
                                    </div>
                                </div>
                            )
                        )
                }
            </div>
        </div>
    )
}

export default Class;