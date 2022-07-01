import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { weeklyStudents } from "../../../../../../api/axios";

const WeeklyLearningStatus = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [weeklyStudentList, setWeeklyStudentList] = useState("");
    const [sort, setSort] = useState(1); // 학생 목록 정렬 기준
    const [order, setOrder] = useState(true); // 학생 목록 순 방향
    const [helpHover, setHelpHover] = useState(false); // 헬프
    const [hover, setHover] = useState(""); // 레벨, 챕터, 학습량
    const schoolYearColor = [
        {
            "schoolYear": 1,
            "color": "#ffea00"
        },
        {
            "schoolYear": 2,
            "color": "#ffa500"
        },
        {
            "schoolYear": 3,
            "color": "#ff0000"
        },
        {
            "schoolYear": 4,
            "color": "#ee82ee"
        },
        {
            "schoolYear": 5,
            "color": "#0000ff"
        },
        {
            "schoolYear": 6,
            "color": "#00ff00"
        }
    ]

    const weeklyLearningData = () => { // 주간 모든 학생
        if (params.startdate) { // params.startdate가 존재한다면
            let tmpEndDate = new Date(params.startdate);
            let tmpEndDate2 = tmpEndDate.setDate(tmpEndDate.getDate() + 6);
            let tmpEndDate3 = new Date(tmpEndDate2);
            let endDate2 = tmpEndDate3.toISOString().substring(0, 10);
            setStartDate(params.startdate);
            setEndDate(endDate2);
            setSort(Number(params.sort)); // int 값을 url 파라미터로 사용 시 다시 받을 때 int 타입으로 변경해야 한다.

            if (params.order === "true") { // boolean 값을 url 파라미터로 사용 시 다시 받을 때 boolean 타입으로 변경해야 한다.
                setOrder(true);
            } else {
                setOrder(false);
            }

            getWeeklyStudents(window.sessionStorage.getItem("schoolinfono"), params.classno, params.startdate, endDate2, params.sort, params.order);
        } else {
            setSort(1);
            setOrder(true);
            let nowDate = new Date();
            let days = nowDate.getDay() === 0 ? 6 : nowDate.getDay() - 1
            let tmpStartDate = new Date(nowDate.setDate(nowDate.getDate() - days));
            let startDateYear = tmpStartDate.getFullYear();
            let startDateMonth = (tmpStartDate.getMonth() + 1) < 10 ? "0" + (tmpStartDate.getMonth() + 1) : (tmpStartDate.getMonth() + 1);
            let startDateDay = tmpStartDate.getDate() < 10 ? "0" + tmpStartDate.getDate() : tmpStartDate.getDate();
            let startDate2 = startDateYear + "-" + startDateMonth + "-" + startDateDay;
            setStartDate(startDate2);

            let tmpEndDate = new Date(startDate2);
            let tmpEndDate2 = tmpEndDate.setDate(tmpEndDate.getDate() + 6);
            let tmpEndDate3 = new Date(tmpEndDate2);
            let endDateYear = tmpEndDate3.getFullYear();
            let endDateMonth = (tmpEndDate3.getMonth() + 1) < 10 ? "0" + (tmpEndDate3.getMonth() + 1) : (tmpEndDate3.getMonth() + 1);
            let endDateDay = tmpEndDate3.getDate() < 10 ? "0" + tmpEndDate3.getDate() : tmpEndDate3.getDate();
            let endDate2 = endDateYear + "-" + endDateMonth + "-" + endDateDay;
            setEndDate(endDate2);

            getWeeklyStudents(window.sessionStorage.getItem("schoolinfono"), params.classno, startDate2, endDate2, 1, true);
        }
    }

    const getWeeklyStudents = (schoolNo, classNo, startDate, endDate, sort, order) => {
        weeklyStudents(schoolNo, classNo, startDate, endDate, sort, order)
                .then((res) => {
                    console.log(res.data);
                    setWeeklyStudentList(res.data);
                })
                .catch((error) => console.error(error))
    }

    const onChangeDate = (number) => { // 날짜 변경
        if (params.startdate) { // params.startdate가 존재한다면
            let newDate = new Date(params.startdate);
            let tmpDate = newDate.setDate(newDate.getDate() + number);
            let tmpDate2 = new Date(tmpDate);
            let tmpYear = tmpDate2.getFullYear();
            let tmpMonth = (tmpDate2.getMonth() + 1) < 10 ? "0" + (tmpDate2.getMonth() + 1) : (tmpDate2.getMonth() + 1);
            let tmpDay = tmpDate2.getDate() < 10 ? "0" + tmpDate2.getDate() : tmpDate2.getDate();
            let startDate2 = tmpYear + "-" + tmpMonth + "-" + tmpDay;

            navigate(`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/weeklylearningstatus/${startDate2}/${params.sort}/${params.order}`);
        } else {
            let newDate = new Date(startDate);
            let tmpDate = newDate.setDate(newDate.getDate() + number);
            let tmpDate2 = new Date(tmpDate);
            let tmpYear = tmpDate2.getFullYear();
            let tmpMonth = (tmpDate2.getMonth() + 1) < 10 ? "0" + (tmpDate2.getMonth() + 1) : (tmpDate2.getMonth() + 1);
            let tmpDay = tmpDate2.getDate() < 10 ? "0" + tmpDate2.getDate() : tmpDate2.getDate();
            let startDate2 = tmpYear + "-" + tmpMonth + "-" + tmpDay;

            navigate(`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/weeklylearningstatus/${startDate2}/${sort}/${order}`);
        }
    }

    const sortStudents = (thisSort, thisOrder) => { // 학생 목록 정렬, 순 설정
        let thisSort2 = thisSort;
        let thisOrder2 = thisOrder;

        if (sort !== thisSort) {
            thisOrder2 = true;
        }

        navigate(`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/weeklylearningstatus/${params.startdate ? params.startdate : startDate}/${thisSort2}/${thisOrder2}`);
    }

    const hh = (seconds) => {
        let value = "";
        let hour = parseInt(seconds / 3600);
        if (hour > 0) {
            value = hour + "시간";
        } else {
            value = "";
        }
        return value;
    }

    const mm = (seconds) => {
        let min = parseInt((seconds % 3600) / 60);
        let value = min + "분";

        return value;
    }

    useEffect(() => {
        weeklyLearningData();
    }, [location])

    return (
        <div className="min-h-screen bg-[#ffffff] p-[40px] rounded-tr-3xl rounded-br-3xl rounded-bl-3xl shadow-md">
            <div>
                <div className="flex items-center justify-end text-[14px]">
                    <div className="w-[10px] h-[10px] bg-[#ffea00] rounded-full"></div>&nbsp;1학년&nbsp;
                    <div className="w-[10px] h-[10px] bg-[#ffa500] rounded-full"></div>&nbsp;2학년&nbsp;
                    <div className="w-[10px] h-[10px] bg-[#ff0000] rounded-full"></div>&nbsp;3학년&nbsp;
                    <div className="w-[10px] h-[10px] bg-[#ee82ee] rounded-full"></div>&nbsp;4학년&nbsp;
                    <div className="w-[10px] h-[10px] bg-[#0000ff] rounded-full"></div>&nbsp;5학년&nbsp;
                    <div className="w-[10px] h-[10px] bg-[#00ff00] rounded-full"></div>&nbsp;6학년
                </div>
                <div className="flex items-center justify-end text-[14px] text-[#464c52] mt-[10px]">
                    ※ 하늘색 칸은 학습을 하지 않은 날을 나타냅니다.
                </div>
            </div>
            <div className="flex justify-between mt-[40px]">
                <div className="flex bg-[#f3f7ff] rounded-lg shadow">
                    <div className="flex justify-center items-center cursor-pointer w-[80px] h-[40px]" onClick={() => { sortStudents(1, !order); }}>
                        <div className="relative w-6 h-4">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                className={sort === 1 && order ? "h-4 w-4 absolute top-0 left-0 text-[#0063ff] select-none" : "h-4 w-4 absolute top-0 left-0 text-[#999c9f] select-none"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                className={sort === 1 && !order ? "h-4 w-4 absolute top-0 right-0 text-[#0063ff] select-none" : "h-4 w-4 absolute top-0 right-0 text-[#999c9f] select-none"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17l-4 4m0 0l-4-4m4 4V3" />
                            </svg>
                        </div>
                        <div className={sort === 1 ? "text-[#0063ff] select-none" : "text-[#999c9f] select-none"}>이름</div>
                    </div>

                    <div className="flex justify-center items-center cursor-pointer w-[90px] h-[40px]" onClick={() => { sortStudents(2, !order); }}>
                        <div className="relative w-6 h-4">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                className={sort === 2 && order ? "h-4 w-4 absolute top-0 left-0 text-[#0063ff] select-none" : "h-4 w-4 absolute top-0 left-0 text-[#999c9f] select-none"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                className={sort === 2 && !order ? "h-4 w-4 absolute top-0 right-0 text-[#0063ff] select-none" : "h-4 w-4 absolute top-0 right-0 text-[#999c9f] select-none"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17l-4 4m0 0l-4-4m4 4V3" />
                            </svg>
                        </div>
                        <div className={sort === 2 ? "text-[#0063ff] select-none" : "text-[#999c9f] select-none"}>학습량</div>
                    </div>
                </div>

                <div className="flex items-center">
                    <div className="w-[32px] h-[32px] bg-[#e4e7e9] rounded-lg flex justify-center items-center cursor-pointer" onClick={() => { onChangeDate(-7) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>

                    <div className="text-[18px] px-[20px] font-bold text-[#464c52] select-none">{startDate} ~ {endDate}</div>

                    <div className="w-[32px] h-[32px] bg-[#e4e7e9] rounded-lg flex justify-center items-center cursor-pointer" onClick={() => { onChangeDate(7) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className="w-[200px]">

                </div>
            </div>
            <div className="mt-[40px]">
                <div className="flex h-[60px]">
                    <div className="w-[80px]"></div>
                    <div className="w-[120px] flex items-center">이름</div>
                    <div className="w-[120px] flex items-center">학습시간</div>
                    <div className="w-[80px] flex items-center">정확도</div>
                    <div className="w-[120px] flex items-center">
                        총 학습량&nbsp;
                        <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" onMouseOver={() => setHelpHover(true)} onMouseOut={() => setHelpHover(false)}>
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                            <div className={helpHover ? ("relative transition") : ("relative transition opacity-0")}>
                                <div className="absolute top-[-34px] left-[2px] z-10">
                                    <div className="absolute w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-[#525d67]"></div>
                                </div>
                                <div className="absolute top-[-124px] left-[-70px] flex bg-[#525d67] rounded-md shadow-sm p-[14px] whitespace-nowrap text-[14px] text-[#f7f8f9]">
                                    <div className="pt-[6px] pr-[6px]">
                                        <div className="w-[8px] h-[8px] bg-[#f7f8f9] rounded-xl"></div>
                                    </div>
                                    <div>
                                        학습한 스테이지에<br />
                                        해당하는 학년을<br />
                                        의미합니다.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-[60px] flex justify-center items-center">월</div>
                    <div className="w-[60px] flex justify-center items-center">화</div>
                    <div className="w-[60px] flex justify-center items-center">수</div>
                    <div className="w-[60px] flex justify-center items-center">목</div>
                    <div className="w-[60px] flex justify-center items-center">금</div>
                    <div className="w-[60px] flex justify-center items-center">토</div>
                    <div className="w-[60px] flex justify-center items-center">일</div>
                    <div className="w-[100px]"></div>
                </div>
                {
                    weeklyStudentList && weeklyStudentList.length > 0 ? (
                        weeklyStudentList && weeklyStudentList.map((value, index) => (
                            <div key={index} className={index === 0 ? "flex border-[2px] border-[#f3f7ff] h-[60px] rounded-md transition duration-150 hover:scale-[1.02] hover:shadow-lg" : "flex border-t-[0px] border-x-[2px] border-b-[2px] border-[#f3f7ff] h-[60px] rounded-md transition duration-150 hover:border-t-[2px] hover:scale-[1.02] hover:shadow-lg"}>
                                <div className="w-[80px] flex justify-center items-center">
                                    <div className={value.sequence % 2 === 1 ? "w-[34px] h-[34px] bg-[#fff9eb] rounded-lg flex justify-center items-center" : "w-[34px] h-[34px] bg-[#eef4fb] rounded-lg flex justify-center items-center"}>
                                        <div className={value.sequence % 2 === 1 ? "text-[#fac232] text-[18px] font-bold" : "text-[#3667bf] text-[18px] font-bold"}>
                                            {value.sequence}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[120px] flex items-center">{value.studentName}</div>
                                <div className="w-[120px] flex items-center">
                                    {hh(value.learningTimeSeconds)}&nbsp;{mm(value.learningTimeSeconds)}
                                </div>
                                <div className="w-[80px] flex items-center">{value.accuracy}%</div>
                                <div className="w-[120px] flex items-center" onMouseOver={() => setHover(index)} onMouseOut={() => setHover("")}>
                                    <div className="relative">
                                        <div className="flex items-center">
                                            <div className="w-[20px]">
                                                {
                                                    value.level.slice(0, 1).map((value2, index2) => (
                                                        <div key={index2} className="relative">
                                                            <div className={`w-[10px] h-[10px] rounded-full bg-[${schoolYearColor[schoolYearColor.findIndex(v => v.schoolYear === value2.schoolYear)].color}]`}>
                                                            </div>
                                                            {
                                                                hover === index ? (
                                                                    <div className="relative">
                                                                        <div className="absolute top-[-14px] left-[-20px] z-10">
                                                                            <div className="absolute w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[10px] border-[#525d67]"></div>
                                                                        </div>
                                                                        <div className="absolute w-[160px] h-[160px] flex items-center top-[-84px] left-[-178px]">
                                                                            <div className="flex justify-center w-[160px] bg-[#525d67] rounded-md shadow-sm p-[14px] whitespace-nowrap text-[14px] text-[#f7f8f9]">
                                                                                <div>
                                                                                    {
                                                                                        value.level.slice(0, 3).map((value3, index3) => (
                                                                                            <div key={index3} className={index3 !== 0 ? "flex mt-[2px]" : "flex"}>
                                                                                                <div className="pt-[6px] pr-[6px]">
                                                                                                    <div className={`w-[8px] h-[8px] bg-[${schoolYearColor[schoolYearColor.findIndex(v => v.schoolYear === value3.schoolYear)].color}] rounded-xl`}></div>
                                                                                                </div>
                                                                                                <div>
                                                                                                    {value3.level}Lv-{value3.chapter}Ch: {value3.learningCount}개
                                                                                                </div>
                                                                                            </div>
                                                                                        ))
                                                                                    }
                                                                                    <div className="flex justify-center">
                                                                                        {
                                                                                            value.level.length > 3 ?
                                                                                                (<div className="mt-[2px]">
                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                                                                    </svg>
                                                                                                </div>) : (null)
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : (null)
                                                            }
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <div>{value.learningCount}개</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[60px] flex justify-center items-center border-l-2 border-[#f3f7ff]">
                                    <div className={value.mondayLearningCount > 0 ? "flex justify-center items-center w-full h-full" : "flex justify-center items-center w-full h-full bg-[#e1efff]"}>
                                        {value.mondayLearningCount > 0 ? value.mondayLearningCount : ""}
                                    </div>
                                </div>
                                <div className="w-[60px] flex justify-center items-center border-l-2 border-[#f3f7ff]">
                                    <div className={value.tuesdayLearningCount > 0 ? "flex justify-center items-center w-full h-full" : "flex justify-center items-center w-full h-full bg-[#e1efff]"}>
                                        {value.tuesdayLearningCount > 0 ? value.tuesdayLearningCount : ""}
                                    </div>
                                </div>
                                <div className="w-[60px] flex justify-center items-center border-l-2 border-[#f3f7ff]">
                                    <div className={value.wednesdayLearningCount > 0 ? "flex justify-center items-center w-full h-full" : "flex justify-center items-center w-full h-full bg-[#e1efff]"}>
                                        {value.wednesdayLearningCount > 0 ? value.wednesdayLearningCount : ""}
                                    </div>
                                </div>
                                <div className="w-[60px] flex justify-center items-center border-l-2 border-[#f3f7ff]">
                                    <div className={value.thursdayLearningCount > 0 ? "flex justify-center items-center w-full h-full" : "flex justify-center items-center w-full h-full bg-[#e1efff]"}>
                                        {value.thursdayLearningCount > 0 ? value.thursdayLearningCount : ""}
                                    </div>
                                </div>
                                <div className="w-[60px] flex justify-center items-center border-l-2 border-[#f3f7ff]">
                                    <div className={value.fridayLearningCount > 0 ? "flex justify-center items-center w-full h-full" : "flex justify-center items-center w-full h-full bg-[#e1efff]"}>
                                        {value.fridayLearningCount > 0 ? value.fridayLearningCount : ""}
                                    </div>
                                </div>
                                <div className="w-[60px] flex justify-center items-center border-l-2 border-[#f3f7ff]">
                                    <div className={value.saturdayLearningCount > 0 ? "flex justify-center items-center w-full h-full" : "flex justify-center items-center w-full h-full bg-[#e1efff]"}>
                                        {value.saturdayLearningCount > 0 ? value.saturdayLearningCount : ""}
                                    </div>
                                </div>
                                <div className="w-[60px] flex justify-center items-center border-l-2 border-[#f3f7ff]">
                                    <div className={value.sundayLearningCount > 0 ? "flex justify-center items-center w-full h-full" : "flex justify-center items-center w-full h-full bg-[#e1efff]"}>
                                        {value.sundayLearningCount > 0 ? value.sundayLearningCount : ""}
                                    </div>
                                </div>
                                <div className="w-[100px] flex justify-center items-center border-l-2 border-[#f3f7ff]">
                                    <Link to={`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/averagelearningstatus/learningdetails/${value.studentNo}/${value.studentName}/2/${startDate}`} className="block w-[74px] h-[28px] bg-[#eef4fb] rounded-md">
                                        <div className="h-full flex justify-center items-center text-[#3f8ce8]">
                                            상세보기
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (<div className="flex justify-center">
                        학생이 없어요.
                    </div>)
                }
            </div>
        </div>
    )
}

export default WeeklyLearningStatus;