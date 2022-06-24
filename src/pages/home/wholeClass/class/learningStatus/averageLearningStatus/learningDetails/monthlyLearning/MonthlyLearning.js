import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { calendar, monthlyLearningData } from "../../../../../../../../api/axios";
import Learning from "../../../../../../../../assets/images/learning.png";
import Accuracy from "../../../../../../../../assets/images/accuracy.png";
import Time from "../../../../../../../../assets/images/time.png";
import { ResponsiveBar } from '@nivo/bar'; // nivo bar chart api
import { ResponsivePie } from '@nivo/pie'; // nivo pie chart api

const MonthlyLearning = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [calendarData, setCalendarData] = useState([]);
    const [attendanceCount, setAttendanceCount] = useState(0);
    const [learningCount, setLearningCount] = useState(0);
    const [averageLearningCount, setAverageLearningCount] = useState(0);
    const [averageLearningTimeSeconds, setAverageLearningTimeSeconds] = useState(0);
    const [averageAccuracy, setAverageAccuracy] = useState(0);
    const [learningTimeSeconds, setLearningTimeSeconds] = useState(0);
    const [problemCount, setProblemCount] = useState(0);
    const [dailyModePercent, setDailyModePercent] = useState(0);
    const [freeModePercent, setFreeModePercent] = useState(0);
    const [oneproModePercent, setOneproModePercent] = useState(0);
    const [worldModePercent, setWorldModePercent] = useState(0);
    const learningModeEn = ["daily", "free", "onepro", "world"];
    const learningModeKo = ["오늘의 학습", "자유 학습", "일프로 도전", "연산 월드"];
    const [topLearningMode, setTopLearningMode] = useState(0);
    const [monthlyLearningData2, setMonthlyLearningData2] = useState([]);
    const [maxLearningCount, setMaxLearningCount] = useState(3);
    const [maxAccuracy, setMaxAccuracy] = useState(1);
    const [maxLearningTimeMinutes, setMaxLearningTimeMinutes] = useState(5);
    const [preMonthComparisonLearningCount, setPreMonthComparisonLearningCount] = useState(0);
    const [preMonthComparisonAccuracy, setPreMonthComparisonAccuracy] = useState(0.0);
    const [preMonthComparisonLearningTimeSeconds, setPreMonthComparisonLearningTimeSeconds] = useState(0);
    const [preMonthComparisonProblemCount, setPreMonthComparisonProblemCount] = useState(0);


    const getMonthData = () => {
        if (params.startdate) { // params.startdate가 있을 때
            let nowDate = new Date(params.startdate);
            let getFullYear = nowDate.getFullYear();
            let getMonth = nowDate.getMonth();
            let tmpStartDate = new Date(getFullYear, getMonth, 1);
            let tmpEndDate = new Date(getFullYear, getMonth + 1, 0);

            let tmpStartDateYear = tmpStartDate.getFullYear();
            let tmpStartDateMonth = (tmpStartDate.getMonth() + 1) < 10 ? "0" + (tmpStartDate.getMonth() + 1) : (tmpStartDate.getMonth() + 1);
            let tmpStartDateDay = tmpStartDate.getDate() < 10 ? "0" + tmpStartDate.getDate() : tmpStartDate.getDate();
            let startDate2 = tmpStartDateYear + "-" + tmpStartDateMonth + "-" + tmpStartDateDay;

            let tmpEndDateYear = tmpEndDate.getFullYear();
            let tmpEndDateMonth = (tmpEndDate.getMonth() + 1) < 10 ? "0" + (tmpEndDate.getMonth() + 1) : (tmpEndDate.getMonth() + 1);
            let tmpEndDateDay = tmpEndDate.getDate() < 10 ? "0" + tmpEndDate.getDate() : tmpEndDate.getDate();
            let endDate2 = tmpEndDateYear + "-" + tmpEndDateMonth + "-" + tmpEndDateDay;

            setStartDate(startDate2);
            setEndDate(endDate2);

            setYear(tmpStartDateYear);
            setMonth(tmpStartDateMonth);

            getCalendar(params.studentno, startDate2);
            getMonthlyLearningData(params.studentno, startDate2, 4);
        } else {
            let nowDate = new Date();
            let getFullYear = nowDate.getFullYear();
            let getMonth = nowDate.getMonth();
            let tmpStartDate = new Date(getFullYear, getMonth, 1);
            let tmpEndDate = new Date(getFullYear, getMonth + 1, 0);

            let tmpStartDateYear = tmpStartDate.getFullYear();
            let tmpStartDateMonth = (tmpStartDate.getMonth() + 1) < 10 ? "0" + (tmpStartDate.getMonth() + 1) : (tmpStartDate.getMonth() + 1);
            let tmpStartDateDay = tmpStartDate.getDate() < 10 ? "0" + tmpStartDate.getDate() : tmpStartDate.getDate();
            let startDate2 = tmpStartDateYear + "-" + tmpStartDateMonth + "-" + tmpStartDateDay;

            let tmpEndDateYear = tmpEndDate.getFullYear();
            let tmpEndDateMonth = (tmpEndDate.getMonth() + 1) < 10 ? "0" + (tmpEndDate.getMonth() + 1) : (tmpEndDate.getMonth() + 1);
            let tmpEndDateDay = tmpEndDate.getDate() < 10 ? "0" + tmpEndDate.getDate() : tmpEndDate.getDate();
            let endDate2 = tmpEndDateYear + "-" + tmpEndDateMonth + "-" + tmpEndDateDay;

            setStartDate(startDate2);
            setEndDate(endDate2);

            setYear(tmpStartDateYear);
            setMonth(tmpStartDateMonth);

            getCalendar(params.studentno, startDate2);
            getMonthlyLearningData(params.studentno, startDate2, 4);
        }
    }

    // 달력 (출석, 학습 데이터)
    const getCalendar = (studentNo, startDate) => {
        calendar(studentNo, startDate)
            .then((res) => {
                setCalendarData(res.data);

                let attendanceCount = 0;
                let learningCount = 0;
                let totalCount = 0;
                let rightCount = 0;
                let learningTimeSeconds = 0;
                let dailyModeCount = 0;
                let freeModeCount = 0;
                let oneproModeCount = 0;
                let worldModeCount = 0;

                for (let i = 0; i < res.data.length; i++) {
                    for (let j = 0; j < res.data[i].length; j++) {
                        if (res.data[i][j].attendanceStatus) {
                            attendanceCount++;
                        }
                        learningCount += res.data[i][j].learningCount;
                        totalCount += res.data[i][j].totalCount;
                        rightCount += res.data[i][j].rightCount;
                        learningTimeSeconds += res.data[i][j].learningTimeSeconds;
                        dailyModeCount += res.data[i][j].dailyModeCount;
                        freeModeCount += res.data[i][j].freeModeCount;
                        oneproModeCount += res.data[i][j].oneproModeCount;
                        worldModeCount += res.data[i][j].worldModeCount;
                    }
                }

                setAttendanceCount(attendanceCount);
                setLearningCount(learningCount);
                setProblemCount(totalCount);
                setLearningTimeSeconds(learningTimeSeconds);

                if (learningCount > 0) {
                    setAverageLearningCount((learningCount / attendanceCount).toFixed(1));
                } else {
                    setAverageLearningCount(0);
                }

                if (rightCount > 0) {
                    setAverageAccuracy((rightCount / totalCount * 100).toFixed(1));
                } else {
                    setAverageAccuracy(0);
                }

                if (learningTimeSeconds > 0) {
                    setAverageLearningTimeSeconds(Math.round(learningTimeSeconds / attendanceCount));
                } else {
                    setAverageLearningTimeSeconds(0);
                }

                if (dailyModeCount > 0) {
                    setDailyModePercent(Math.round(dailyModeCount / learningCount * 100));
                } else {
                    setDailyModePercent(0);
                }

                if (freeModeCount > 0) {
                    setFreeModePercent(Math.round(freeModeCount / learningCount * 100));
                } else {
                    setFreeModePercent(0);
                }

                if (oneproModeCount > 0) {
                    setOneproModePercent(Math.round(oneproModeCount / learningCount * 100));

                } else {
                    setOneproModePercent(0);
                }

                if (worldModeCount > 0) {
                    setWorldModePercent(Math.round(worldModeCount / learningCount * 100));
                } else {
                    setWorldModePercent(0);
                }

                let topLearningMode = 0;
                let topLearningModeValue = 0;
                for (let i = 0; i < learningModeEn.length; i++) {
                    if (eval(`${learningModeEn[i]}ModeCount`) > topLearningModeValue) {
                        topLearningModeValue = eval(`${learningModeEn[i]}ModeCount`);
                        topLearningMode = i;
                    }
                }

                setTopLearningMode(topLearningMode);

            })
            .catch((error) => console.error(error))
    }

    const getMonthlyLearningData = (studentNo, startDate, count) => { // 월별 학습 데이터
        monthlyLearningData(studentNo, startDate, count)
            .then((res) => {
                console.log(res.data);
                setMonthlyLearningData2(res.data);

                // 최고 학습량
                let maxLearningCount = 0;
                for (let i = 0; i < count; i++) {
                    if (res.data[i].learningCount > maxLearningCount) {
                        maxLearningCount = res.data[i].learningCount;
                    }
                }
                if (maxLearningCount > 3) {
                    setMaxLearningCount(maxLearningCount);
                } else {
                    setMaxLearningCount(3);
                }


                // 최고 정확도
                let maxAccuracy = 0;
                for (let i = 0; i < count; i++) {
                    if (res.data[i].accuracy > maxAccuracy) {
                        maxAccuracy = res.data[i].accuracy;
                    }
                }

                if (maxAccuracy > 1) {
                    setMaxAccuracy(maxAccuracy);
                } else {
                    setMaxAccuracy(1);
                }

                // 최고 학습시간 (분)
                let maxLearningTimeMinutes = 0;
                for (let i = 0; i < count; i++) {
                    if (res.data[i].learningTimeMinutes > maxLearningTimeMinutes) {
                        maxLearningTimeMinutes = res.data[i].learningTimeMinutes;
                    }
                }

                if (maxLearningTimeMinutes > 5) {
                    setMaxLearningTimeMinutes(maxLearningTimeMinutes);
                } else {
                    setMaxLearningTimeMinutes(5);
                }


                // 전월 비교 데이터
                setPreMonthComparisonLearningCount(res.data[count - 1].learningCount - res.data[count - 2].learningCount);
                setPreMonthComparisonAccuracy(
                    (res.data[count - 1].accuracy - res.data[count - 2].accuracy) % 10 === 0 ? res.data[count - 1].accuracy - res.data[count - 2].accuracy : (res.data[count - 1].accuracy - res.data[count - 2].accuracy).toFixed(1)
                );
                setPreMonthComparisonLearningTimeSeconds(res.data[count - 1].learningTimeSeconds - res.data[count - 2].learningTimeSeconds);
                setPreMonthComparisonProblemCount(res.data[count - 1].problemCount - res.data[count - 2].problemCount);

                console.log(res.data[count - 2].learningTimeSeconds);
                console.log(res.data[count - 1].learningTimeSeconds);

            })
            .catch((error) => console.error(error))
    }

    const onChangeDate = (number) => {
        if (params.startdate) { // params.startdate가 있을 때
            let nowDate = new Date(params.startdate);
            let getFullYear = nowDate.getFullYear();
            let getMonth = nowDate.getMonth();
            let tmpStartDate = new Date(getFullYear, getMonth, 1);

            let thisDate = new Date(tmpStartDate.setMonth(tmpStartDate.getMonth() + number));

            let nowDate2 = new Date(thisDate);
            let getFullYear2 = nowDate2.getFullYear();
            let getMonth2 = nowDate2.getMonth();
            let tmpStartDate2 = new Date(getFullYear2, getMonth2, 1);

            let tmpStartDateYear = tmpStartDate2.getFullYear();
            let tmpStartDateMonth = (tmpStartDate2.getMonth() + 1) < 10 ? "0" + (tmpStartDate2.getMonth() + 1) : (tmpStartDate2.getMonth() + 1);
            let tmpStartDateDay = tmpStartDate2.getDate() < 10 ? "0" + tmpStartDate2.getDate() : tmpStartDate2.getDate();
            let startDate2 = tmpStartDateYear + "-" + tmpStartDateMonth + "-" + tmpStartDateDay;

            navigate(`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/averagelearningstatus/learningdetails/${params.studentno}/${params.studentname}/1/${startDate2}`);
        } else {
            let nowDate = new Date();
            let getFullYear = nowDate.getFullYear();
            let getMonth = nowDate.getMonth();
            let tmpStartDate = new Date(getFullYear, getMonth, 1);

            let thisDate = new Date(tmpStartDate.setMonth(tmpStartDate.getMonth() + number));

            let nowDate2 = new Date(thisDate);
            let getFullYear2 = nowDate2.getFullYear();
            let getMonth2 = nowDate2.getMonth();
            let tmpStartDate2 = new Date(getFullYear2, getMonth2, 1);

            let tmpStartDateYear = tmpStartDate2.getFullYear();
            let tmpStartDateMonth = (tmpStartDate2.getMonth() + 1) < 10 ? "0" + (tmpStartDate2.getMonth() + 1) : (tmpStartDate2.getMonth() + 1);
            let tmpStartDateDay = tmpStartDate2.getDate() < 10 ? "0" + tmpStartDate2.getDate() : tmpStartDate2.getDate();
            let startDate2 = tmpStartDateYear + "-" + tmpStartDateMonth + "-" + tmpStartDateDay;

            navigate(`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/averagelearningstatus/learningdetails/${params.studentno}/${params.studentname}/1/${startDate2}`);
        }
    }

    const mm = (seconds) => {
        let min = parseInt(seconds / 60);
        let value = min + "분";

        return value;
    }

    const ss = (seconds) => {
        let second = parseInt(seconds % 60);
        let value = "";

        if (second > 0) {
            value = second + "초";
        } else {
            value = "";
        }

        return value;
    }

    const mm2 = (seconds) => {
        console.log("seconds: " + seconds);
        let min = parseInt(seconds / 60);
        console.log(min);
        let value = "";

        if (min > 0) {
            value = min + "분";
        } else {
            value = "";
        }

        return value;
    }

    const ss2 = (seconds) => {
        let second = parseInt(seconds % 60);
        let value = second + "초";

        return value;
    }

    useEffect(() => {
        getMonthData();
    }, [location])

    return (
        <div className="text-[18px]">
            <div className="flex justify-center mt-[40px]">
                <div className="w-[200px]"></div>
                <div className="flex items-center">
                    <div className="w-[32px] h-[32px] bg-[#e4e7e9] rounded-lg flex justify-center items-center cursor-pointer" onClick={() => onChangeDate(-1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>

                    <div className="px-[20px] font-bold text-[#464c52] select-none">{year}-{month}</div>

                    <div className="w-[32px] h-[32px] bg-[#e4e7e9] rounded-lg flex justify-center items-center cursor-pointer" onClick={() => onChangeDate(1)} >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className="w-[200px]"></div>
            </div>

            <div className="mt-[40px] flex justify-center">
                <div className="bg-[#ffffff] w-[1040px] h-[1400px] shadow-md rounded">
                    <div className="px-[40px] pt-[50px] h-[100px]">
                        <div className="text-[24px] text-[#72787f] font-medium">상위 1%가 선택한 연산앱 '일프로연산'</div>
                        <hr className="border-2 mt-[20px]" />
                    </div>
                    <div className="flex justify-center items-center h-[1000px]">
                        <div className="text-center">
                            <div className="text-[30px] font-semibold text-[#72787f] mt-[110px]">
                                {window.sessionStorage.getItem("schoolname")}
                            </div>
                            <div className="text-[40px] font-semibold text-[#72787f]">
                                {params.studentname}
                            </div>
                            <div className="text-[80px] font-extrabold text-[#0063ff]">
                                학습 보고서
                            </div>
                            <div className="text-[30px] font-medium text-[#464c52] mt-[110px]">
                                {year}.{month}
                            </div>
                        </div>
                    </div>

                    <div className="h-[200px] flex justify-center items-center text-[220px] font-black text-[#edf4ff]">
                        1%MATH
                    </div>
                </div>
            </div>

            <div className="mt-[40px] flex justify-center">
                <div className="relative bg-[#ffffff] w-[1040px] h-[1400px] shadow-md rounded">
                    <div className="text-[32px] font-bold text-[#061b3b] text-center mt-[50px]">
                        출석 현황
                    </div>
                    <div className="flex justify-center">
                        <div className="flex text-[20px] font-semibold text-[#464c52] mt-[50px]">
                            <div className="pl-[20px] w-[130px] h-[40px]">일</div>
                            <div className="pl-[20px] w-[130px] h-[40px]">월</div>
                            <div className="pl-[20px] w-[130px] h-[40px]">화</div>
                            <div className="pl-[20px] w-[130px] h-[40px]">수</div>
                            <div className="pl-[20px] w-[130px] h-[40px]">목</div>
                            <div className="pl-[20px] w-[130px] h-[40px]">금</div>
                            <div className="pl-[20px] w-[130px] h-[40px]">토</div>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div>
                            {
                                calendarData && calendarData.map((value, index) => (
                                    <div key={index} className="flex border-t-[1px]">
                                        {
                                            calendarData[index] && calendarData[index].map((value2, index2) => (
                                                <div key={index2} className={value2.sequence === 1 ? "w-[130px] h-[130px] p-[20px]" : "w-[130px] h-[130px] p-[20px] border-l-[1px]"}>
                                                    <div className="flex justify-between items-center">
                                                        <div className={value2.learningDate < startDate || value2.learningDate > endDate ? "text-[#adb0b2]" : "text-[#000000]"}>
                                                            {value2.day}일
                                                        </div>
                                                        <div>
                                                            {
                                                                value2.attendanceStatus ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0063ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                ) : (null)
                                                            }

                                                        </div>
                                                    </div>
                                                    <div>
                                                        {
                                                            value2.attendanceStatus ? (
                                                                <div className={value2.learningCount > 0 ? "mt-[40px] text-[20px] text-right text-[#0063ff]" : "mt-[40px] text-[20px] text-right text-[#b6b9bc]"}>
                                                                    {value2.learningCount}개
                                                                </div>
                                                            ) : (null)
                                                        }
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                ))
                            }
                        </div>

                    </div>

                    <div className="px-[60px] mt-[50px]">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                            <div className="ml-[8px] text-[20px]">
                                {parseInt(month)}월 총 출석 일수는 {attendanceCount}일입니다.
                            </div>
                        </div>
                        <div className="flex items-center mt-[20px]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                            <div className="ml-[8px] text-[20px]">
                                출석한 날에는 평균 {averageLearningCount}개의 스테이지를 학습했습니다.
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-[40px] left-0 w-full flex justify-between text-[16px] font-semibold text-[#464c52]">
                        <div className="w-[80px]">
                        </div>
                        <div>
                            {year}.{month}
                        </div>
                        <div className="w-[80px] text-right pr-[40px]">
                            1
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-[40px] flex justify-center">
                <div className="relative bg-[#ffffff] w-[1040px] h-[1400px] shadow-md rounded">
                    <div className="text-[32px] font-bold text-[#061b3b] text-center mt-[50px]">
                        평균 학습 현황
                    </div>
                    <div>
                        <div>
                            * 출석한 날 기준 평균
                        </div>
                        <div className="flex justify-between mt-[10px]">
                            <div className="flex w-[14.563rem] justify-start">
                                <div className="w-[5.625rem]">
                                    <img src={Learning} alt={"learning"} />
                                </div>
                                <div className="w-[8.938rem] pl-[20px]">
                                    <div className="text-[18px] text-[#464c52] mt-[6px]">
                                        학습량
                                    </div>
                                    <div className="mt-[10px]">
                                        <span className="text-[28px] font-semibold text-[#0063ff]">
                                            {averageLearningCount}
                                        </span>
                                        <span className="text-[20px] font-semibold text-[#0063ff] ml-[2px]">개</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex w-[14.563rem] justify-center">
                                <div className="w-[5.625rem]">
                                    <img src={Accuracy} alt={"accuracy"} />
                                </div>
                                <div className="w-[8.938rem] pl-[20px]">
                                    <div className="text-[18px] text-[#464c52] mt-[6px]">
                                        정확도
                                    </div>
                                    <div className="mt-[10px]">
                                        <span className="text-[28px] font-semibold text-[#0063ff]">{averageAccuracy}</span>
                                        <span className="text-[20px] font-semibold text-[#0063ff] ml-[2px]">%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex w-[14.563rem] justify-end">
                                <div className="w-[5.625rem]">
                                    <img src={Time} alt={"time"} />
                                </div>
                                <div className="w-[8.938rem] pl-[20px]">
                                    <div className="text-[18px] text-[#464c52] mt-[6px]">
                                        학습시간
                                    </div>
                                    <div className="mt-[10px]">
                                        {mm(averageLearningTimeSeconds)}{ss(averageLearningTimeSeconds)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-[32px] font-bold text-[#061b3b] text-center mt-[50px]">
                        총 학습 현황
                    </div>
                    <div>
                        <div className="flex">
                            <div>
                                학습량 (스테이지 개수)

                            </div>
                            <div>
                                {learningCount}개
                            </div>
                            <div className="flex justify-end items-center w-[19.375rem] pr-[35px]">
                                {
                                    preMonthComparisonLearningCount === 0 ? (
                                        <Fragment>
                                            <div className="text-[16px] text-[#5c5e60]">저번 달과 동일</div>
                                            <div className="ml-[14px]">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#7e7e7e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </Fragment>
                                    ) : (
                                        preMonthComparisonLearningCount > 0 ? (
                                            <Fragment>
                                                <div className="text-[16px] text-[#5c5e60]">+ 저번 달보다 {preMonthComparisonLearningCount}개 증가</div>
                                                <div className="ml-[14px]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#17b20e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                    </svg>
                                                </div>
                                            </Fragment>
                                        ) : (
                                            <Fragment>
                                                <div className="text-[16px] text-[#5c5e60]">- 저번 달보다 {preMonthComparisonLearningCount}개 감소</div>
                                                <div className="ml-[14px]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#d61313]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                                    </svg>
                                                </div>
                                            </Fragment>
                                        )
                                    )
                                }
                            </div>
                        </div>
                        <div className="flex">
                            <div>
                                정확도

                            </div>
                            <div>
                                {averageAccuracy}%
                            </div>
                            <div className="flex justify-end items-center w-[19.375rem] pr-[35px]">
                                {
                                    preMonthComparisonAccuracy === 0 ? (
                                        <Fragment>
                                            <div className="text-[16px] text-[#5c5e60]">저번 달과 동일</div>
                                            <div className="ml-[14px]">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#7e7e7e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </Fragment>
                                    ) : (
                                        preMonthComparisonAccuracy > 0 ? (
                                            <Fragment>
                                                <div className="text-[16px] text-[#5c5e60]">+ 저번 달보다 {preMonthComparisonAccuracy}% 증가</div>
                                                <div className="ml-[14px]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#17b20e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                    </svg>
                                                </div>
                                            </Fragment>
                                        ) : (
                                            <Fragment>
                                                <div className="text-[16px] text-[#5c5e60]">- 저번 달보다 {preMonthComparisonAccuracy}% 감소</div>
                                                <div className="ml-[14px]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#d61313]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                                    </svg>
                                                </div>
                                            </Fragment>
                                        )
                                    )
                                }
                            </div>
                        </div>
                        <div className="flex">
                            <div>
                                학습시간

                            </div>
                            <div>
                                {mm(learningTimeSeconds)}{ss(learningTimeSeconds)}
                            </div>
                            <div className="flex justify-end items-center w-[19.375rem] pr-[35px]">
                                {
                                    preMonthComparisonLearningTimeSeconds === 0 ? (
                                        <Fragment>
                                            <div className="text-[16px] text-[#5c5e60]">저번 달과 동일</div>
                                            <div className="ml-[14px]">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#7e7e7e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </Fragment>
                                    ) : (
                                        preMonthComparisonLearningTimeSeconds > 0 ? (
                                            <Fragment>
                                                <div className="text-[16px] text-[#5c5e60]">+ 저번 달보다 {mm2(Math.abs(preMonthComparisonLearningTimeSeconds))}{ss2(Math.abs(preMonthComparisonLearningTimeSeconds))} 증가</div>
                                                <div className="ml-[14px]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#17b20e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                    </svg>
                                                </div>
                                            </Fragment>
                                        ) : (
                                            <Fragment>
                                                <div className="text-[16px] text-[#5c5e60]">- 저번 달보다 {mm2(Math.abs(preMonthComparisonLearningTimeSeconds))}{ss2(Math.abs(preMonthComparisonLearningTimeSeconds))} 감소</div>
                                                <div className="ml-[14px]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#d61313]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                                    </svg>
                                                </div>
                                            </Fragment>
                                        )
                                    )
                                }
                            </div>
                        </div>
                        <div className="flex">
                            <div>
                                문제 개수

                            </div>
                            <div>
                                {problemCount}개
                            </div>
                            <div className="flex justify-end items-center w-[19.375rem] pr-[35px]">
                                {
                                    preMonthComparisonProblemCount === 0 ? (
                                        <Fragment>
                                            <div className="text-[16px] text-[#5c5e60]">저번 달과 동일</div>
                                            <div className="ml-[14px]">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#7e7e7e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </Fragment>
                                    ) : (
                                        preMonthComparisonProblemCount > 0 ? (
                                            <Fragment>
                                                <div className="text-[16px] text-[#5c5e60]">+ 저번 달보다 {preMonthComparisonProblemCount}개 증가</div>
                                                <div className="ml-[14px]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#17b20e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                    </svg>
                                                </div>
                                            </Fragment>
                                        ) : (
                                            <Fragment>
                                                <div className="text-[16px] text-[#5c5e60]">- 저번 달보다 {preMonthComparisonProblemCount}개 감소</div>
                                                <div className="ml-[14px]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#d61313]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                                    </svg>
                                                </div>
                                            </Fragment>
                                        )
                                    )
                                }
                            </div>
                        </div>

                    </div>

                    <div className="text-[32px] font-bold text-[#061b3b] text-center mt-[50px]">
                        학습 모드별 비율
                    </div>

                    <div>
                        <div className="flex items-center mt-[43px]">
                            <div className="flex items-center w-[12.5rem] pl-[10px]">
                                <div className="w-[0.625rem] h-[0.625rem] bg-[#558fe8] rounded-full"></div>
                                <div className={topLearningMode === 0 ? "text-[#d61313] ml-[8px] text-[18px]" : "ml-[8px] text-[18px]"}>
                                    <span>오늘의 학습</span>
                                </div>
                            </div>
                            <div className={topLearningMode === 0 ? "text-[#d61313] text-[18px] w-[6.25rem]" : "text-[18px] w-[6.25rem]"}>
                                <span>
                                    {dailyModePercent}%
                                </span>
                            </div>
                            <div className="w-[25rem] pr-[10px]">
                                <div className="overflow-hidden">
                                    <div className="relative w-full bg-[#e8e9ea] rounded-full h-[1.5rem]">
                                        <div className="absolute w-full h-[1.5rem] rounded-full shadow-[0_0_0_30px_#ffffff]"></div>
                                        <div className={"bg-[#558fe8] h-[1.5rem]"} style={{ width: dailyModePercent + "%" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center mt-[43px]">
                            <div className="flex items-center w-[12.5rem] pl-[10px]">
                                <div className="w-[0.625rem] h-[0.625rem] bg-[#fac232] rounded-full"></div>
                                <div className={topLearningMode === 1 ? "text-[#d61313] ml-[8px] text-[18px]" : "ml-[8px] text-[18px]"}>
                                    <span>자유 학습</span>
                                </div>
                            </div>
                            <div className={topLearningMode === 1 ? "text-[#d61313] text-[18px] w-[6.25rem]" : "text-[18px] w-[6.25rem]"}>
                                <span>
                                    {freeModePercent}%
                                </span>
                            </div>
                            <div className="w-[25rem] pr-[10px]">
                                <div className="overflow-hidden">
                                    <div className="relative w-full bg-[#e8e9ea] rounded-full h-[1.5rem]">
                                        <div className="absolute w-full h-[1.5rem] rounded-full shadow-[0_0_0_30px_#ffffff]"></div>
                                        <div className={"bg-[#fac232] h-[1.5rem]"} style={{ width: freeModePercent + "%" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center mt-[43px]">
                            <div className="flex items-center w-[12.5rem] pl-[10px]">
                                <div className="w-[0.625rem] h-[0.625rem] bg-[#f67b70] rounded-full"></div>
                                <div className={topLearningMode === 2 ? "text-[#d61313] ml-[8px] text-[18px]" : "ml-[8px] text-[18px]"}>
                                    <span>일프로 도전</span>
                                </div>
                            </div>
                            <div className={topLearningMode === 2 ? "text-[#d61313] text-[18px] w-[6.25rem]" : "text-[18px] w-[6.25rem]"}>
                                <span>
                                    {oneproModePercent}%
                                </span>
                            </div>
                            <div className="w-[25rem] pr-[10px]">
                                <div className="overflow-hidden">
                                    <div className="relative w-full bg-[#e8e9ea] rounded-full h-[1.5rem]">
                                        <div className="absolute w-full h-[1.5rem] rounded-full shadow-[0_0_0_30px_#ffffff]"></div>
                                        <div className={"bg-[#f67b70] h-[1.5rem]"} style={{ width: oneproModePercent + "%" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center mt-[43px]">
                            <div className="flex items-center w-[12.5rem] pl-[10px]">
                                <div className="w-[0.625rem] h-[0.625rem] bg-[#3bc7b9] rounded-full"></div>
                                <div className={topLearningMode === 3 ? "text-[#d61313] ml-[8px] text-[18px]" : "ml-[8px] text-[18px]"}>
                                    <span>연산 월드</span>
                                </div>
                            </div>
                            <div className={topLearningMode === 3 ? "text-[#d61313] text-[18px] w-[6.25rem]" : "text-[18px] w-[6.25rem]"}>
                                <span>
                                    {worldModePercent}%
                                </span>
                            </div>
                            <div className="w-[25rem] pr-[10px]">
                                <div className="overflow-hidden">
                                    <div className="relative w-full bg-[#e8e9ea] rounded-full h-[1.5rem]">
                                        <div className="absolute w-full h-[1.5rem] rounded-full shadow-[0_0_0_30px_#ffffff]"></div>
                                        <div className={"bg-[#3bc7b9] h-[1.5rem]"} style={{ width: worldModePercent + "%" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>

                            <div>
                                2월에 가장 많이 한 학습 모드는 [{learningModeKo[topLearningMode]}]입니다.
                            </div>

                        </div>
                    </div>

                    <div className="absolute bottom-[40px] left-0 w-full flex justify-between text-[16px] font-semibold text-[#464c52]">
                        <div className="w-[80px]">
                        </div>
                        <div>
                            {year}.{month}
                        </div>
                        <div className="w-[80px] text-right pr-[40px]">
                            2
                        </div>
                    </div>
                </div>
            </div>


            <div className="mt-[40px] flex justify-center">
                <div className="relative bg-[#ffffff] w-[1040px] h-[1400px] shadow-md rounded">
                    <div className="text-[32px] font-bold text-[#061b3b] text-center mt-[50px]">
                        월별 학습 결과 비교
                    </div>
                    <div className="text-[18px] text-[#464c52] text-center mt-[16px]">
                        4개월 평균 학습 결과를 비교한 그래프입니다.
                    </div>

                    <div className="text-[18px] font-bold text-[#061b3b] mt-[32px]">
                        학습량 (스테이지 개수)
                    </div>

                    <div className="flex justify-center items-center mt-[10px]">
                        <div style={{ width: "700px", height: "260px" }}>
                            <ResponsiveBar
                                data={monthlyLearningData2}
                                keys={['learningCount']}
                                indexBy="date"
                                margin={{ top: 20, right: 0, bottom: 30, left: 70 }}
                                axisTop={null}
                                axisRight={null}
                                axisBottom={{
                                    tickSize: 0,
                                    tickPadding: 10,
                                    tickRotation: 0,
                                    format: (e) => {
                                        let thisDate = new Date(e);
                                        return (
                                            <tspan fontSize="17px" fontWeight="500" fill="#1b1d1f">{thisDate.getMonth() + 1}월</tspan>
                                        )
                                    }
                                }}
                                axisLeft={{
                                    tickSize: 0,
                                    tickPadding: 10,
                                    tickRotation: 0,
                                    tickValues: (maxLearningCount <= 6 ? maxLearningCount : 6),

                                    format: e => Math.floor(e) === e && `${e}개`
                                }}
                                groupMode={"grouped"}
                                theme={{
                                    fontSize: "15px",
                                    textColor: "#999c9f"
                                }}
                                borderRadius={3}
                                padding={0.8}
                                colors={['#6e72f7']}
                                colorBy="id"
                                label={(e) => {
                                    return (
                                        <tspan y="-10" fontSize="14px" fill={e.value === maxLearningCount ? "#0063ff" : "#72787f"} fontWeight="700">{e.value}</tspan>
                                    )
                                }}
                                tooltip={(e) => {
                                    return (
                                        <div style={{ width: "164px", height: "110px", padding: "14px 0 0 14px", fontSize: "14px", color: "#f7f8f9", borderRadius: "8px", background: "#54595e", boxShadow: "3px 3px 7px 1px rgba(192, 192, 192, 0.8)" }}>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", width: "82px" }}>
                                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                        <div style={{ width: "6px", height: "6px", borderRadius: "25px", background: "#558fe8" }}></div>
                                                        <div style={{ marginLeft: "8px" }}>오늘의 학습</div>
                                                    </div>
                                                </div>
                                                <div style={{ width: "38px", textAlign: "right" }}>
                                                    <span>{e.data.dailyModeCount ? e.data.dailyModeCount : 0}개</span>
                                                </div>
                                            </div>

                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", width: "82px" }}>
                                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                        <div style={{ width: "6px", height: "6px", borderRadius: "25px", background: "#fac232" }}></div>
                                                        <div style={{ marginLeft: "8px" }}>자유 학습</div>
                                                    </div>
                                                </div>
                                                <div style={{ width: "38px", textAlign: "right" }}>
                                                    <span>{e.data.freeModeCount ? e.data.freeModeCount : 0}개</span>
                                                </div>
                                            </div>

                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", width: "82px" }}>
                                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                        <div style={{ width: "6px", height: "6px", borderRadius: "25px", background: "#f67b70" }}></div>
                                                        <div style={{ marginLeft: "8px" }}>일프로 도전</div>
                                                    </div>
                                                </div>
                                                <div style={{ width: "38px", textAlign: "right" }}>
                                                    <span>{e.data.oneproModeCount ? e.data.oneproModeCount : 0}개</span>
                                                </div>
                                            </div>

                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", width: "82px" }}>
                                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                        <div style={{ width: "6px", height: "6px", borderRadius: "25px", background: "#3bc7b9" }}></div>
                                                        <div style={{ marginLeft: "8px" }}>연산 월드</div>
                                                    </div>
                                                </div>
                                                <div style={{ width: "38px", textAlign: "right" }}>
                                                    <span>{e.data.worldModeCount ? e.data.worldModeCount : 0}개</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }}
                                maxValue={maxLearningCount <= 6 ? maxLearningCount : "auto"}
                                gridYValues={maxLearningCount <= 6 ? maxLearningCount : 6}
                            />
                        </div>
                    </div>

                    <div className="text-[18px] font-bold text-[#061b3b] mt-[32px]">
                    정확도
                    </div>

                    <div className="flex justify-center items-center mt-[10px]">
                        <div style={{ width: "700px", height: "260px" }}>
                            <ResponsiveBar
                                data={monthlyLearningData2}
                                keys={['accuracy']}
                                indexBy="date"
                                margin={{ top: 20, right: 0, bottom: 30, left: 70 }}
                                axisTop={null}
                                axisRight={null}
                                axisBottom={{
                                    tickSize: 0,
                                    tickPadding: 10,
                                    tickRotation: 0,
                                    format: (e) => {
                                        let thisDate = new Date(e);
                                        return (
                                            <tspan fontSize="17px" fontWeight="500" fill="#1b1d1f">{thisDate.getMonth() + 1}월</tspan>
                                        )
                                    }
                                }}
                                axisLeft={{
                                    tickSize: 0,
                                    tickPadding: 10,
                                    tickRotation: 0,
                                    tickValues: [0, 20, 40, 60, 80, 100],
                                    format: e => Math.floor(e) === e && `${e}%`
                                }}
                                groupMode={"grouped"}
                                theme={{
                                    fontSize: "15px",
                                    textColor: "#999c9f"
                                }}
                                borderRadius={3}
                                padding={0.8}
                                colors={['#33cee6']}
                                colorBy="id"
                                label={(e) => {
                                    return (
                                        <tspan y="-10" fontSize="14px" fill={e.value === maxAccuracy ? "#0063ff" : "#72787f"} fontWeight="700">{e.value}</tspan>
                                    )
                                }}
                                tooltip={(e) => {
                                    return (
                                        <div style={{ width: "164px", height: "110px", padding: "14px 0 0 14px", fontSize: "14px", color: "#f7f8f9", borderRadius: "8px", background: "#54595e", boxShadow: "3px 3px 7px 1px rgba(192, 192, 192, 0.8)" }}>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", width: "82px" }}>
                                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                        <div style={{ width: "6px", height: "6px", borderRadius: "25px", background: "#558fe8" }}></div>
                                                        <div style={{ marginLeft: "8px" }}>오늘의 학습</div>
                                                    </div>
                                                </div>
                                                <div style={{ width: "38px", textAlign: "right" }}>
                                                    <span>{e.data.dailyAccuracy ? e.data.dailyAccuracy : 0}%</span>
                                                </div>
                                            </div>

                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", width: "82px" }}>
                                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                        <div style={{ width: "6px", height: "6px", borderRadius: "25px", background: "#fac232" }}></div>
                                                        <div style={{ marginLeft: "8px" }}>자유 학습</div>
                                                    </div>
                                                </div>
                                                <div style={{ width: "38px", textAlign: "right" }}>
                                                    <span>{e.data.freeAccuracy ? e.data.freeAccuracy : 0}%</span>
                                                </div>
                                            </div>

                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", width: "82px" }}>
                                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                        <div style={{ width: "6px", height: "6px", borderRadius: "25px", background: "#f67b70" }}></div>
                                                        <div style={{ marginLeft: "8px" }}>일프로 도전</div>
                                                    </div>
                                                </div>
                                                <div style={{ width: "38px", textAlign: "right" }}>
                                                    <span>{e.data.oneproAccuracy ? e.data.oneproAccuracy : 0}%</span>
                                                </div>
                                            </div>

                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", width: "82px" }}>
                                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                        <div style={{ width: "6px", height: "6px", borderRadius: "25px", background: "#3bc7b9" }}></div>
                                                        <div style={{ marginLeft: "8px" }}>연산 월드</div>
                                                    </div>
                                                </div>
                                                <div style={{ width: "38px", textAlign: "right" }}>
                                                    <span>{e.data.worldAccuracy ? e.data.worldAccuracy : 0}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }}
                                maxValue={100}
                                gridYValues={5}
                            />
                        </div>
                    </div>

                    <div className="text-[18px] font-bold text-[#061b3b] mt-[40px]">
                        학습시간
                    </div>

                    <div className="flex justify-center items-center mt-[10px]">
                        <div style={{ width: "700px", height: "260px" }}>
                            <ResponsiveBar
                                data={monthlyLearningData2}
                                keys={['learningTimeMinutes']}
                                indexBy="date"
                                margin={{ top: 20, right: 0, bottom: 30, left: 70 }}
                                axisTop={null}
                                axisRight={null}
                                axisBottom={{
                                    tickSize: 0,
                                    tickPadding: 10,
                                    tickRotation: 0,
                                    format: (e) => {
                                        let thisDate = new Date(e);
                                        return (
                                            <tspan fontSize="17px" fontWeight="500" fill="#1b1d1f">{thisDate.getMonth() + 1}월</tspan>
                                        )
                                    }
                                }}
                                axisLeft={{
                                    tickSize: 0,
                                    tickPadding: 10,
                                    tickRotation: 0,
                                    tickValues: (maxLearningTimeMinutes <= 6 ? maxLearningTimeMinutes : 6),
                                    format: e => Math.floor(e) === e && `${e}분`
                                }}
                                groupMode={"grouped"}
                                theme={{
                                    fontSize: "15px",
                                    textColor: "#999c9f"
                                }}
                                borderRadius={3}
                                padding={0.8}
                                colors={['#b468ff']}
                                colorBy="id"
                                label={(e) => {
                                    return (
                                        <tspan y="-10" fontSize="14px" fill={e.value === maxLearningTimeMinutes ? "#0063ff" : "#72787f"} fontWeight="700">{e.value}</tspan>
                                    )
                                }}
                                tooltip={(e) => {
                                    return (
                                        <div style={{ width: "164px", height: "110px", padding: "14px 0 0 14px", fontSize: "14px", color: "#f7f8f9", borderRadius: "8px", background: "#54595e", boxShadow: "3px 3px 7px 1px rgba(192, 192, 192, 0.8)" }}>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", width: "82px" }}>
                                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                        <div style={{ width: "6px", height: "6px", borderRadius: "25px", background: "#558fe8" }}></div>
                                                        <div style={{ marginLeft: "8px" }}>오늘의 학습</div>
                                                    </div>
                                                </div>
                                                <div style={{ width: "38px", textAlign: "right" }}>
                                                    <span>{e.data.dailyLearningTimeMinutes ? e.data.dailyLearningTimeMinutes : 0}분</span>
                                                </div>
                                            </div>

                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", width: "82px" }}>
                                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                        <div style={{ width: "6px", height: "6px", borderRadius: "25px", background: "#fac232" }}></div>
                                                        <div style={{ marginLeft: "8px" }}>자유 학습</div>
                                                    </div>
                                                </div>
                                                <div style={{ width: "38px", textAlign: "right" }}>
                                                    <span>{e.data.freeLearningTimeMinutes ? e.data.freeLearningTimeMinutes : 0}분</span>
                                                </div>
                                            </div>

                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", width: "82px" }}>
                                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                        <div style={{ width: "6px", height: "6px", borderRadius: "25px", background: "#f67b70" }}></div>
                                                        <div style={{ marginLeft: "8px" }}>일프로 도전</div>
                                                    </div>
                                                </div>
                                                <div style={{ width: "38px", textAlign: "right" }}>
                                                    <span>{e.data.oneproLearningTimeMinutes ? e.data.oneproLearningTimeMinutes : 0}분</span>
                                                </div>
                                            </div>

                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", width: "82px" }}>
                                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                        <div style={{ width: "6px", height: "6px", borderRadius: "25px", background: "#3bc7b9" }}></div>
                                                        <div style={{ marginLeft: "8px" }}>연산 월드</div>
                                                    </div>
                                                </div>
                                                <div style={{ width: "38px", textAlign: "right" }}>
                                                    <span>{e.data.worldLearningTimeMinutes ? e.data.worldLearningTimeMinutes : 0}분</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }}
                                maxValue={maxLearningTimeMinutes <= 6 ? maxLearningTimeMinutes : "auto"}
                                gridYValues={maxLearningTimeMinutes <= 6 ? maxLearningTimeMinutes : 6}
                            />
                        </div>
                    </div>


                    <div className="absolute bottom-[40px] left-0 w-full flex justify-between text-[16px] font-semibold text-[#464c52]">
                        <div className="w-[80px]">
                        </div>
                        <div>
                            {year}.{month}
                        </div>
                        <div className="w-[80px] text-right pr-[40px]">
                            3
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-[40px] flex justify-center">
                <div className="relative bg-[#ffffff] w-[1040px] h-[1400px] shadow-md rounded">
                    <div className="text-[32px] font-bold text-[#061b3b] text-center mt-[50px]">
                    주별 학습 결과 그래프
                    </div>
                    <div className="text-[18px] text-[#464c52] text-center mt-[16px]">
                        4개월 평균 학습 결과를 비교한 그래프입니다.
                    </div>

                    <div className="text-[18px] font-bold text-[#061b3b] mt-[32px]">
                        학습량 (스테이지 개수)
                    </div>

                   


                    <div className="absolute bottom-[40px] left-0 w-full flex justify-between text-[16px] font-semibold text-[#464c52]">
                        <div className="w-[80px]">
                        </div>
                        <div>
                            {year}.{month}
                        </div>
                        <div className="w-[80px] text-right pr-[40px]">
                            4
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MonthlyLearning;