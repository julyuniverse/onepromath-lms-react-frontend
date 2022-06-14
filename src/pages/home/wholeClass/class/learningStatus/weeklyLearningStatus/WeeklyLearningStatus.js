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

    const getWeeklyStudents = () => { // 주간 모든 학생
        if (params.startdate) { // params.startdate가 존재한다면
            let tmpEndDate = new Date(params.startdate);
            let tmpEndDate2 = tmpEndDate.setDate(tmpEndDate.getDate() + 6);
            let tmpEndDate3 = new Date(tmpEndDate2);
            let endDate = tmpEndDate3.toISOString().substring(0, 10);
            setStartDate(params.startdate);
            setEndDate(endDate);

            weeklyStudents(params.startdate, endDate, window.sessionStorage.getItem("schoolinfono"), params.classno, sort, order)
                .then((res) => {
                    setWeeklyStudentList(res.data);
                })
                .catch((error) => console.error(error))
        } else {
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
            let endDate = endDateYear + "-" + endDateMonth + "-" + endDateDay;
            setEndDate(endDate);

            weeklyStudents(startDate2, endDate, window.sessionStorage.getItem("schoolinfono"), params.classno, sort, order)
                .then((res) => {
                    setWeeklyStudentList(res.data);
                })
                .catch((error) => console.error(error))
        }
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

            navigate(`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/weeklylearningstatus/${startDate2}`);
        } else {
            let newDate = new Date(startDate);
            let tmpDate = newDate.setDate(newDate.getDate() + number);
            let tmpDate2 = new Date(tmpDate);
            let tmpYear = tmpDate2.getFullYear();
            let tmpMonth = (tmpDate2.getMonth() + 1) < 10 ? "0" + (tmpDate2.getMonth() + 1) : (tmpDate2.getMonth() + 1);
            let tmpDay = tmpDate2.getDate() < 10 ? "0" + tmpDate2.getDate() : tmpDate2.getDate();
            let startDate2 = tmpYear + "-" + tmpMonth + "-" + tmpDay;

            navigate(`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/weeklylearningstatus/${startDate2}`);
        }
    }

    const sortStudents = (thisSort, thisOrder) => { // 학생 목록 정렬, 순 설정
        let thisSort2 = thisSort;
        let thisOrder2 = thisOrder;
        setSort(thisSort);
        if (sort !== thisSort) {
            setOrder(true);
            thisOrder2 = true;
        } else {
            setOrder(thisOrder);
        }

        weeklyStudents(startDate, endDate, window.sessionStorage.getItem("schoolinfono"), params.classno, thisSort2, thisOrder2)
            .then((res) => {
                setWeeklyStudentList(res.data);
            })
            .catch((error) => console.error(error))
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
        getWeeklyStudents();
    }, [location])

    return (
        <div className="min-h-screen bg-[#ffffff] p-[40px] rounded-tr-3xl shadow-xl">
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
                    <div className="flex items-center cursor-pointer w-[80px] h-[40px]" onClick={() => { sortStudents(1, !order); }}>
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

                    <div className="flex items-center cursor-pointer w-[90px] h-[40px]" onClick={() => { sortStudents(2, !order); }}>
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
                    <div className="w-[120px] flex items-center">학습량</div>
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
                    weeklyStudentList && weeklyStudentList.map((value, index) => (
                        <div key={index} className={index === 0 ? "flex border-[2px] border-[#f3f7ff] h-[60px] rounded-md transition duration-150 hover:scale-[1.04] hover:shadow-lg" : "flex border-t-[0px] border-x-[2px] border-b-[2px] border-[#f3f7ff] h-[60px] rounded-md transition duration-150 hover:border-t-[2px] hover:scale-[1.04] hover:shadow-lg"}>
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
                            <div className="w-[120px] flex items-center">{value.learningCount}개</div>
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
                                <Link to="" className="block w-[74px] h-[28px] bg-[#eef4fb] rounded-md">
                                    <div className="h-full flex justify-center items-center text-[#3f8ce8]">
                                        상세보기
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default WeeklyLearningStatus;