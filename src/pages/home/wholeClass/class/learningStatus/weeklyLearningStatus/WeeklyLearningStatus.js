import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { weeklyStudents } from "../../../../../../api/axios";

const WeeklyLearningStatus = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [weeklyStudentList, setWeeklyStudentList] = useState("");

    const getWeeklyStudents = () => { // 주간 모든 학생
        if (params.startdate) { // params.startdate가 존재한다면
            let tmpEndDate = new Date(params.startdate);
            let tmpEndDate2 = tmpEndDate.setDate(tmpEndDate.getDate() + 6);
            let tmpEndDate3 = new Date(tmpEndDate2);
            let endDate = tmpEndDate3.toISOString().substring(0, 10);
            setStartDate(params.startdate);
            setEndDate(endDate);

            weeklyStudents(params.startdate, endDate, window.sessionStorage.getItem("schoolinfono"), params.classno)
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

            weeklyStudents(startDate2, endDate, window.sessionStorage.getItem("schoolinfono"), params.classno)
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

    useEffect(() => {
        getWeeklyStudents();
    }, [location])

    return (
        <div className="min-h-screen bg-[#ffffff]">
            <div className="flex h-[60px] items-center justify-end px-[16px]">
                <div className="w-[12px] h-[12px] bg-[#ffea00] rounded-full"></div>&nbsp;1학년&nbsp;
                <div className="w-[12px] h-[12px] bg-[#ffa500] rounded-full"></div>&nbsp;2학년&nbsp;
                <div className="w-[12px] h-[12px] bg-[#ff0000] rounded-full"></div>&nbsp;3학년&nbsp;
                <div className="w-[12px] h-[12px] bg-[#ee82ee] rounded-full"></div>&nbsp;4학년&nbsp;
                <div className="w-[12px] h-[12px] bg-[#0000ff] rounded-full"></div>&nbsp;5학년&nbsp;
                <div className="w-[12px] h-[12px] bg-[#00ff00] rounded-full"></div>&nbsp;6학년
            </div>
            <div>
                <div className="flex">
                    <div onClick={() => { onChangeDate(-7) }}>{'<'}</div>
                    <div>{startDate} ~ {endDate}</div>
                    <div onClick={() => { onChangeDate(7) }}>{'>'}</div>
                </div>
            </div>
            <div className="px-[40px]">
                <div className="flex">
                    <div className="w-[80px]"></div>
                    <div className="w-[80px]">이름</div>
                    <div className="w-[80px]">학습시간</div>
                    <div className="w-[80px]">정확도</div>
                    <div className="w-[80px]">학습량</div>
                    <div className="w-[80px]">월</div>
                    <div className="w-[80px]">화</div>
                    <div className="w-[80px]">수</div>
                    <div className="w-[80px]">목</div>
                    <div className="w-[80px]">금</div>
                    <div className="w-[80px]">토</div>
                    <div className="w-[80px]">일</div>
                    <div className="w-[80px]"></div>
                </div>
                {
                    weeklyStudentList && weeklyStudentList.map((value, index) => (
                        <div key={index} className="flex">
                            <div className="w-[80px]"></div>
                            <div className="w-[80px]">{value.studentName}</div>
                            <div className="w-[80px]">{value.learningTimeSeconds}</div>
                            <div className="w-[80px]">{value.accuracy}</div>
                            <div className="w-[80px]">{value.learningCount}</div>
                            <div className="w-[80px]">{value.mondayLearningCount}</div>
                            <div className="w-[80px]">{value.tuesdayLearningCount}</div>
                            <div className="w-[80px]">{value.wednesdayLearningCount}</div>
                            <div className="w-[80px]">{value.thursdayLearningCount}</div>
                            <div className="w-[80px]">{value.fridayLearningCount}</div>
                            <div className="w-[80px]">{value.saturdayLearningCount}</div>
                            <div className="w-[80px]">{value.sundayLearningCount}</div>
                            <div className="w-[80px]"></div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default WeeklyLearningStatus;