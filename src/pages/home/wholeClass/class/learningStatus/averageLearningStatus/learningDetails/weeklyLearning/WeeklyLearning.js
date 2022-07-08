import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { attendanceWeek, lastWeekAndThisWeekLearningData, learningData, levelAndChapterData, levelData } from "../../../../../../../../api/axios";
import ScrollToTopButton from "../../../../../../../../components/ScrollToTopButton";
import Learning from "../../../../../../../../assets/images/learning.png";
import Accuracy from "../../../../../../../../assets/images/accuracy.png";
import Time from "../../../../../../../../assets/images/time.png";
import { ResponsiveBar } from '@nivo/bar'; // nivo bar chart api
import { ResponsivePie } from '@nivo/pie'; // nivo pie chart api
import ClassicSpinnerLoader from "../../../../../../../../components/ClassicSpinnerLoader";
import ScrollToTop from '../../../../../../../../components/ScrollToTop';

const WeeklyLearning = () => {
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [attendanceWeekData, setAttendanceWeekData] = useState([]);
    const [totalLearningCount, setTotalLearningCount] = useState(0.0);
    const [accuracy, setAccuracy] = useState(0.0);
    const [totalLearningTimeSeconds, setTotalLearningTimeSeconds] = useState(0);
    const [levelData2, setLevelData2] = useState([]);
    const [maxLevel, setMaxLevel] = useState(0);
    const [levelAndChapterData2, setLevelAndChapterData2] = useState([]);
    const [levelAndChapterMaxLevel, setLevelAndChapterMaxLevel] = useState(0);
    const [levelAndChapterMaxChapter, setLevelAndChapterMaxChapter] = useState(0);
    const [levelAndChapterMaxChapterName, setLevelAndChapterMaxChapterName] = useState("");
    const [lastWeekAndThisWeekLearningData2, setLastWeekAndThisWeekLearningData2] = useState([]);
    const [maxLearningCount, setMaxLearningCount] = useState(3);
    const [maxAccuracy, setMaxAccuracy] = useState(1);
    const [maxLearningTimeMinutes, setMaxLearningTimeMinutes] = useState(5);
    const [lastWeekMaxLearningCount, setLastWeekMaxLearningCount] = useState(0);
    const [lastWeekMaxAccuracy, setLastWeekMaxAccuracy] = useState(0.0);
    const [lastWeekMaxLearningTimeMinutes, setLastWeekMaxLearningTimeMinutes] = useState(0);
    const [thisWeekMaxLearningCount, setThisWeekMaxLearningCount] = useState(0);
    const [thisWeekMaxAccuracy, setThisWeekMaxAccuracy] = useState(0.0);
    const [thisWeekMaxLearningTimeMinutes, setThisWeekMaxLearningTimeMinutes] = useState(0);
    const [learningCountKeys, setLearningCountKeys] = useState([]);
    const [learningCountColors, setLearningCountColors] = useState([]);
    const [learningCountPadding, setLearningCountPadding] = useState(0.0);
    const [learningCountCompare, setLearningCountCompare] = useState(false);
    const [accuracyKeys, setAccuracyKeys] = useState([]);
    const [accuracyColors, setAccuracyColors] = useState([]);
    const [accuracyPadding, setAccuracyPadding] = useState(0.0);
    const [accuracyCompare, setAccuracyCompare] = useState(false);
    const [learningTimeMinutesKeys, setLearningTimeMinutesKeys] = useState([]);
    const [learningTimeMinutesColors, setLearningTimeMinutesColors] = useState([]);
    const [learningTimeMinutesPadding, setLearningTimeMinutesPadding] = useState(0.0);
    const [learningTimeMinutesCompare, setLearningTimeMinutesCompare] = useState(false);
    const [learningData2, setLearningData2] = useState([]);

    const getWeekData = async () => {
        if (params.startdate) { // params.startdate가 있을 때
            let nowDate = new Date(params.startdate);
            let days = nowDate.getDay() === 0 ? 6 : nowDate.getDay() - 1;
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

            let tmp2StartDate = new Date(startDate2);
            let tmp2StartDate2 = tmp2StartDate.setDate(tmp2StartDate.getDate() - 7);
            let tmp2StartDate3 = new Date(tmp2StartDate2);
            let startDateYear2 = tmp2StartDate3.getFullYear();
            let startDateMonth2 = (tmp2StartDate3.getMonth() + 1) < 10 ? "0" + (tmp2StartDate3.getMonth() + 1) : (tmp2StartDate3.getMonth() + 1);
            let startDateDay2 = tmp2StartDate3.getDate() < 10 ? "0" + tmp2StartDate3.getDate() : tmp2StartDate3.getDate();
            let startDate3 = startDateYear2 + "-" + startDateMonth2 + "-" + startDateDay2;

            let tmp2EndDate = new Date(startDate2);
            let tmp2EndDate2 = tmp2EndDate.setDate(tmp2EndDate.getDate() + 7);
            let tmp2EndDate3 = new Date(tmp2EndDate2);
            let endDateYear2 = tmp2EndDate3.getFullYear();
            let endDateMonth2 = (tmp2EndDate3.getMonth() + 1) < 10 ? "0" + (tmp2EndDate3.getMonth() + 1) : (tmp2EndDate3.getMonth() + 1);
            let endDateDay2 = tmp2EndDate3.getDate() < 10 ? "0" + tmp2EndDate3.getDate() : tmp2EndDate3.getDate();
            let endDate3 = endDateYear2 + "-" + endDateMonth2 + "-" + endDateDay2;

            await getAttendanceWeek(params.studentno, startDate2);
            await getLevelData(params.studentno, startDate2, endDate3);
            await getLevelAndChapterData(params.studentno, startDate2, endDate3);
            await getLastWeekAndThisWeekLearningData(params.studentno, startDate3);
            await getLearningData(params.studentno, startDate2, endDate3);
        } else {
            let nowDate = new Date();
            let days = nowDate.getDay() === 0 ? 6 : nowDate.getDay() - 1;
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

            let tmp2StartDate = new Date(startDate2);
            let tmp2StartDate2 = tmp2StartDate.setDate(tmp2StartDate.getDate() - 7);
            let tmp2StartDate3 = new Date(tmp2StartDate2);
            let startDateYear2 = tmp2StartDate3.getFullYear();
            let startDateMonth2 = (tmp2StartDate3.getMonth() + 1) < 10 ? "0" + (tmp2StartDate3.getMonth() + 1) : (tmp2StartDate3.getMonth() + 1);
            let startDateDay2 = tmp2StartDate3.getDate() < 10 ? "0" + tmp2StartDate3.getDate() : tmp2StartDate3.getDate();
            let startDate3 = startDateYear2 + "-" + startDateMonth2 + "-" + startDateDay2;

            let tmp2EndDate = new Date(startDate2);
            let tmp2EndDate2 = tmp2EndDate.setDate(tmp2EndDate.getDate() + 7);
            let tmp2EndDate3 = new Date(tmp2EndDate2);
            let endDateYear2 = tmp2EndDate3.getFullYear();
            let endDateMonth2 = (tmp2EndDate3.getMonth() + 1) < 10 ? "0" + (tmp2EndDate3.getMonth() + 1) : (tmp2EndDate3.getMonth() + 1);
            let endDateDay2 = tmp2EndDate3.getDate() < 10 ? "0" + tmp2EndDate3.getDate() : tmp2EndDate3.getDate();
            let endDate3 = endDateYear2 + "-" + endDateMonth2 + "-" + endDateDay2;

            await getAttendanceWeek(params.studentno, startDate2);
            await getLevelData(params.studentno, startDate2, endDate3);
            await getLevelAndChapterData(params.studentno, startDate2, endDate3);
            await getLastWeekAndThisWeekLearningData(params.studentno, startDate3);
            await getLearningData(params.studentno, startDate2, endDate3);
        }
    }

    const onChangeDate = (number) => {
        if (params.startdate) { // params.startdate가 있을 때
            let nowDate = new Date(params.startdate);
            let thisDate = new Date(nowDate.setDate(nowDate.getDate() + number));

            let tmpStartDateYear = thisDate.getFullYear();
            let tmpStartDateMonth = (thisDate.getMonth() + 1) < 10 ? "0" + (thisDate.getMonth() + 1) : (thisDate.getMonth() + 1);
            let tmpStartDateDay = thisDate.getDate() < 10 ? "0" + thisDate.getDate() : thisDate.getDate();
            let startDate2 = tmpStartDateYear + "-" + tmpStartDateMonth + "-" + tmpStartDateDay;

            navigate(`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/averagelearningstatus/learningdetails/${params.studentno}/${params.studentname}/2/${startDate2}`);
        } else {
            let nowDate = new Date(startDate);
            let thisDate = new Date(nowDate.setDate(nowDate.getDate() + number));

            let tmpStartDateYear = thisDate.getFullYear();
            let tmpStartDateMonth = (thisDate.getMonth() + 1) < 10 ? "0" + (thisDate.getMonth() + 1) : (thisDate.getMonth() + 1);
            let tmpStartDateDay = thisDate.getDate() < 10 ? "0" + thisDate.getDate() : thisDate.getDate();
            let startDate2 = tmpStartDateYear + "-" + tmpStartDateMonth + "-" + tmpStartDateDay;

            navigate(`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/averagelearningstatus/learningdetails/${params.studentno}/${params.studentname}/2/${startDate2}`);
        }
    }

    const getAttendanceWeek = async (studentNo, startDate) => { // 주간 (출석, 학습 데이터)
        await attendanceWeek(studentNo, startDate)
            .then((res) => {
                setAttendanceWeekData(res.data);

                let learningCount = 0;
                let totalCount = 0;
                let rightCount = 0;
                let learningTimeSeconds = 0;

                for (let i = 0; i < res.data.length; i++) {
                    learningCount += res.data[i].learningCount;
                    totalCount += res.data[i].totalCount;
                    rightCount += res.data[i].rightCount;
                    learningTimeSeconds += res.data[i].learningTimeSeconds;
                }

                setTotalLearningCount(learningCount);
                setAccuracy(rightCount !== 0 ? Math.ceil((rightCount / totalCount * 100) * 10) / 10 : 0);
                setTotalLearningTimeSeconds(learningTimeSeconds);
            })
    }

    const getLevelData = async (studentNo, startDate, endDate) => { // 레벨 데이터
        await levelData(studentNo, startDate, endDate)
            .then((res) => {
                setLevelData2(res.data);

                // 학습을 가장 많이 한 레벨 구하기.
                let maxLevel = 0;
                let maxLevelValue = 0;
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].value > maxLevelValue) {
                        maxLevelValue = res.data[i].value;
                        maxLevel = res.data[i].id;
                    }
                }

                setMaxLevel(maxLevel);
            })
            .catch((error) => console.error(error))
    }

    const getLevelAndChapterData = async (studentNo, startDate, endDate) => { // 레벨과 챕터 데이터
        await levelAndChapterData(studentNo, startDate, endDate)
            .then((res) => {
                setLevelAndChapterData2(res.data);

                // 학습을 가장 많이 한 레벨 구하기.
                let maxLevel = 0;
                let maxChapter = 0;
                let maxChapterName = "";
                let maxValue = 0;

                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].value > maxValue) {
                        maxValue = res.data[i].value;
                        maxLevel = res.data[i].level;
                        maxChapter = res.data[i].chapter;
                        maxChapterName = res.data[i].chapterName;
                    }
                }

                setLevelAndChapterMaxLevel(maxLevel);
                setLevelAndChapterMaxChapter(maxChapter);
                setLevelAndChapterMaxChapterName(maxChapterName);
            })
            .catch((error) => console.error(error))
    }

    const getLastWeekAndThisWeekLearningData = async (studentNo, startDate) => { // 지난주와 이번 주의 학습 데이터
        await lastWeekAndThisWeekLearningData(studentNo, startDate)
            .then((res) => {
                setLastWeekAndThisWeekLearningData2(res.data);

                // 최고 학습량
                let lastWeekMaxLearningCount = 0; // 지난주
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].lastWeekLearningCount > lastWeekMaxLearningCount) {
                        lastWeekMaxLearningCount = res.data[i].lastWeekLearningCount;
                    }
                }

                setLastWeekMaxLearningCount(lastWeekMaxLearningCount);

                let thisWeekMaxLearningCount = 0; // 이번 주
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].thisWeekLearningCount > thisWeekMaxLearningCount) {
                        thisWeekMaxLearningCount = res.data[i].thisWeekLearningCount;
                    }
                }

                setThisWeekMaxLearningCount(thisWeekMaxLearningCount);

                setMaxLearningCount(thisWeekMaxLearningCount > 3 ? thisWeekMaxLearningCount : 3);
                setLearningCountKeys(["thisWeekLearningCount"]);
                setLearningCountColors(["#ff9090"]);
                setLearningCountPadding(0.7);
                setLearningCountCompare(false);

                // 최고 정확도
                let lastWeekMaxAccuracy = 0; // 지난주
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].lastWeekAccuracy > lastWeekMaxAccuracy) {
                        lastWeekMaxAccuracy = res.data[i].lastWeekAccuracy;
                    }
                }

                setLastWeekMaxAccuracy(lastWeekMaxAccuracy);

                let thisWeekMaxAccuracy = 0; // 이번 주
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].thisWeekAccuracy > thisWeekMaxAccuracy) {
                        thisWeekMaxAccuracy = res.data[i].thisWeekAccuracy;
                    }
                }

                setThisWeekMaxAccuracy(thisWeekMaxAccuracy);

                setMaxAccuracy(thisWeekMaxAccuracy > 1 ? thisWeekMaxAccuracy : 1);
                setAccuracyKeys(["thisWeekAccuracy"]);
                setAccuracyColors(["#ffa367"]);
                setAccuracyPadding(0.7);
                setAccuracyCompare(false);

                // 최고 학습시간 (분)
                let lastWeekMaxLearningTimeMinutes = 0; // 지난주
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].lastWeekLearningTimeMinutes > lastWeekMaxLearningTimeMinutes) {
                        lastWeekMaxLearningTimeMinutes = res.data[i].lastWeekLearningTimeMinutes;
                    }
                }

                setLastWeekMaxLearningTimeMinutes(lastWeekMaxLearningTimeMinutes);

                let thisWeekMaxLearningTimeMinutes = 0; // 이번 주
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].thisWeekLearningTimeMinutes > thisWeekMaxLearningTimeMinutes) {
                        thisWeekMaxLearningTimeMinutes = res.data[i].thisWeekLearningTimeMinutes;
                    }
                }

                setThisWeekMaxLearningTimeMinutes(thisWeekMaxLearningTimeMinutes);
                
                setMaxLearningTimeMinutes(thisWeekMaxLearningTimeMinutes > 5 ? thisWeekMaxLearningTimeMinutes : 5);
                setLearningTimeMinutesKeys(["thisWeekLearningTimeMinutes"]);
                setLearningTimeMinutesColors(["#ffd159"]);
                setLearningTimeMinutesPadding(0.7);
                setLearningTimeMinutesCompare(false);
            })
    }

    const compareData = (number) => { // 데이터 비교
        if (number === 1) { // 학습량 비교
            let compare = false;
            compare = !learningCountCompare;

            if (compare) {
                setLearningCountKeys(["lastWeekLearningCount", "thisWeekLearningCount"]);
                setLearningCountColors(["#cacdd2", "#ff9090"]);
                setLearningCountPadding(0.5);
                if(lastWeekMaxLearningCount > 3 || thisWeekMaxLearningCount > 3) {
                    setMaxLearningCount(lastWeekMaxLearningCount > thisWeekMaxLearningCount ? lastWeekMaxLearningCount : thisWeekMaxLearningCount);
                }
            } else {
                setLearningCountKeys(["thisWeekLearningCount"]);
                setLearningCountColors(["#ff9090"]);
                setLearningCountPadding(0.7);
                if(lastWeekMaxLearningCount > 3 || thisWeekMaxLearningCount > 3) {
                    setMaxLearningCount(thisWeekMaxLearningCount > 3 ? thisWeekMaxLearningCount : 3);
                }                
            }

            setLearningCountCompare(compare);
        } else if (number === 2) { // 정확도 비교
            let compare = false;
            compare = !accuracyCompare;

            if (compare) {
                setAccuracyKeys(["lastWeekAccuracy", "thisWeekAccuracy"]);
                setAccuracyColors(["#cacdd2", "#ffa367"]);
                setAccuracyPadding(0.5);
                if(lastWeekMaxAccuracy > 1 || thisWeekMaxAccuracy > 1) {
                    setMaxAccuracy(lastWeekMaxAccuracy > thisWeekMaxAccuracy ? lastWeekMaxAccuracy : thisWeekMaxAccuracy);
                }                
            } else {
                setAccuracyKeys(["thisWeekAccuracy"]);
                setAccuracyColors(["#ffa367"]);
                setAccuracyPadding(0.7);
                if(lastWeekMaxAccuracy > 1 || thisWeekMaxAccuracy > 1) {
                    setMaxAccuracy(thisWeekMaxAccuracy > 1 ? thisWeekMaxAccuracy : 1);
                }
            }

            setAccuracyCompare(compare);
        } else if (number === 3) { // 학습시간 비교
            let compare = false;
            compare = !learningTimeMinutesCompare;

            if (compare) {
                setLearningTimeMinutesKeys(["lastWeekLearningTimeMinutes", "thisWeekLearningTimeMinutes"]);
                setLearningTimeMinutesColors(["#cacdd2", "#ffd159"]);
                setLearningTimeMinutesPadding(0.5);
                if(lastWeekMaxLearningTimeMinutes > 4 || thisWeekMaxLearningTimeMinutes > 4) {
                    setMaxLearningTimeMinutes(lastWeekMaxLearningTimeMinutes > thisWeekMaxLearningTimeMinutes ? lastWeekMaxLearningTimeMinutes : thisWeekMaxLearningTimeMinutes);
                }
            } else {
                setLearningTimeMinutesKeys(["thisWeekLearningTimeMinutes"]);
                setLearningTimeMinutesColors(["#ffd159"]);
                setLearningTimeMinutesPadding(0.7);
                if(lastWeekMaxLearningTimeMinutes > 4 || thisWeekMaxLearningTimeMinutes > 4) {
                    setMaxLearningTimeMinutes(thisWeekMaxLearningTimeMinutes > 4 ? thisWeekMaxLearningTimeMinutes : 5);
                }
            }

            setLearningTimeMinutesCompare(compare);
        }
    }

    const getLearningData = async (studentNo, startDate, endDate) => { // 학습 데이터
        await learningData(studentNo, startDate, endDate)
            .then((res) => {
                setLearningData2(res.data);
            })
    }

    const mm = (seconds) => {
        let min = parseInt(seconds / 60);
        let value = min;

        return value;
    }

    const ss = (seconds) => {
        let second = parseInt(seconds % 60);
        let value = second;

        return value;
    }

    const mm2 = (seconds) => {
        let min = parseInt(seconds / 60);
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

    useEffect(async() => {
        setIsLoading(true);
        await getWeekData();
        setIsLoading(false);
    }, [location])

    return (
        <div>
            {
                isLoading ? (
                    <ClassicSpinnerLoader size={80} />
                ) : (null)
            }
            <ScrollToTopButton />
            <ScrollToTop />
            <div className="flex justify-between items-center mt-[40px]">
                <div className="w-[200px]">
                    <div className="text-[24px] font-bold">
                        출석 현황
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="w-[32px] h-[32px] bg-[#e4e7e9] rounded-lg flex justify-center items-center cursor-pointer" onClick={() => onChangeDate(-7)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>

                    <div className="w-[280px] px-[20px] font-bold text-[#464c52] select-none text-center text-[18px]">{startDate} ~ {endDate}</div>

                    <div className="w-[32px] h-[32px] bg-[#e4e7e9] rounded-lg flex justify-center items-center cursor-pointer" onClick={() => onChangeDate(7)} >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className="w-[200px]"></div>
            </div>

            <div className="mt-[20px] w-full h-[200px] bg-[#ffffff] rounded-2xl shadow-md">
                <div className="h-full flex justify-center">
                    <div className="h-full flex justify-between items-center w-[800px]">
                        {
                            attendanceWeekData && attendanceWeekData.map((value, index) => (
                                <div key={index}>
                                    <div className="flex justify-center text-[20px]">
                                        {value.dayOfWeek}
                                    </div>
                                    <div className={value.attendanceStatus ? "w-[100px] h-[100px] border-[2px] mt-[10px] rounded-xl p-[10px] relative border-[#0063ff] bg-[#f7f8f9]" : "w-[100px] h-[100px] border-[2px] mt-[10px] rounded-xl p-[10px] relative"}>
                                        <div className="flex justify-between">
                                            <div className="text-[#72787f]">
                                                {value.day}일
                                            </div>
                                            <div>
                                                {
                                                    value.attendanceStatus ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0063ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    ) : (null)
                                                }
                                            </div>
                                        </div>
                                        <div className="absolute bottom-[10px] right-[10px]">
                                            <div className={value.learningCount > 0 ? "flex justify-end text-[#0063ff] text-[22px]" : "flex justify-end text-[#b6b9bc] text-[22px]"}>
                                                {
                                                    value.attendanceStatus ? (
                                                        <Fragment>
                                                            {value.learningCount}개
                                                        </Fragment>
                                                    ) : (null)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            <div className="mt-[50px] text-[24px] font-bold">
                총 학습 현황
            </div>

            <div className="flex justify-between mt-[20px]">
                <div className="w-[330px] h-[200px] bg-[#ffffff] rounded-2xl shadow-md flex justify-center items-center">
                    <div className="flex">
                        <div className="w-[155px] flex justify-end pr-[20px]">
                            <img src={Learning} alt={"learning"} />
                        </div>
                        <div className="w-[175px] flex items-center justify-start pl-[20px]">
                            <div>
                                <div className="text-[20px]">
                                    학습량
                                </div>
                                <div className="mt-[6px]">
                                    <span className="text-[32px] text-[#0063ff]">{totalLearningCount}</span>
                                    <span className="text-[24px] text-[#0063ff] ml-[4px]">개</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-[330px] h-[200px] bg-[#ffffff] rounded-2xl shadow-md flex justify-center items-center">
                    <div className="flex">
                        <div className="w-[155px] flex justify-end pr-[20px]">
                            <img src={Accuracy} alt={"accuracy"} />
                        </div>
                        <div className="w-[175px] flex items-center justify-start pl-[20px]">
                            <div>
                                <div className="text-[20px]">
                                    정확도
                                </div>
                                <div className="mt-[6px]">
                                    <span className="text-[32px] text-[#0063ff]">{accuracy}</span>
                                    <span className="text-[24px] text-[#0063ff] ml-[4px]">%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-[330px] h-[200px] bg-[#ffffff] rounded-2xl shadow-md flex justify-center items-center">
                    <div className="flex">
                        <div className="w-[155px] flex justify-end pr-[20px]">
                            <img src={Time} alt={"time"} />
                        </div>
                        <div className="w-[175px] flex items-center justify-start pl-[20px]">
                            <div>
                                <div className="text-[20px]">
                                    학습시간
                                </div>
                                <div className="mt-[6px]">
                                    <span className="text-[32px] text-[#0063ff]">{mm(totalLearningTimeSeconds)}</span>
                                    <span className="text-[24px] text-[#0063ff] ml-[4px]">분</span>
                                    {
                                        ss(totalLearningTimeSeconds) > 0 ? (
                                            <Fragment>
                                                <span className="text-[32px] text-[#0063ff] ml-[6px]">{ss(totalLearningTimeSeconds)}</span>
                                                <span className="text-[24px] text-[#0063ff] ml-[4px]">초</span>
                                            </Fragment>
                                        ) : (null)
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-[50px] text-[24px] font-bold">
                학습 레벨/단원 분석
            </div>

            <div className="mt-[20px] w-full h-[400px] bg-[#ffffff] rounded-2xl shadow-md">
                <div className="h-full flex justify-center items-center">
                    <div className="w-[400px] h-full flex justify-center items-center">
                        <div className="w-[320px] h-[320px]">
                            <ResponsivePie
                                data={levelData2}
                                margin={{ top: 20, right: 0, bottom: 20, left: 0 }}
                                innerRadius={0.4}
                                activeOuterRadiusOffset={8}
                                borderWidth={0}
                                borderColor={{ from: 'color', modifiers: [['darker', 0]] }}
                                arcLinkLabelsSkipAngle={10}
                                arcLinkLabelsTextColor="#333333"
                                arcLinkLabelsThickness={2}
                                arcLinkLabelsColor={{ from: 'color' }}
                                arcLabelsSkipAngle={10}
                                arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                                enableArcLinkLabels={false}
                                enableArcLabels={false}
                                padAngle={1}
                                cornerRadius={4}
                                colors={e => e.data.color}
                                tooltip={(e) => {
                                    return (
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "4px 6px", fontSize: "16px", borderRadius: "8px", background: "#fafafa", boxShadow: "4px 4px 4px 1px rgba(192, 192, 192, 0.8)" }}>
                                            {e.datum.data.level}레벨: {e.datum.data.percent}%
                                        </div>
                                    )
                                }}
                            />
                        </div>
                    </div>

                    <div className="w-[720px] h-[400px]">
                        <div className="mt-[50px] text-[18px] text-[#464c52] font-bold">
                            {
                                maxLevel > 0 ? (
                                    <Fragment>
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                            <div className="ml-[8px]">
                                                주간 가장 많이 학습한 레벨은 [{maxLevel}레벨]입니다.
                                            </div>
                                        </div>
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                            <div className="ml-[8px]">
                                                해당 주는 학습하지 않았어요.
                                            </div>
                                        </div>
                                    </Fragment>
                                )
                            }
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "column", height: "240px", marginTop: "20px" }}>
                            {
                                maxLevel > 0 ? (
                                    levelData2 && levelData2.map((value, index) => (
                                        <div key={index} style={{ display: "flex", alignItems: "center", color: value.id === maxLevel ? "#0063ff" : "#464c52", width: "290px", height: "40px" }}>
                                            <div className="w-[10px] flex justify-center items-center">
                                                <div style={{ width: "10px", height: "10px", borderRadius: "25px", background: value.color }}></div>
                                            </div>
                                            <div style={{ width: "120px", paddingLeft: "10px" }}>{value.id}레벨</div>
                                            <div style={{ width: "90px" }}>{value.percent}%</div>
                                            <div style={{ width: "70px" }}>{value.value}개</div>
                                        </div>
                                    ))
                                ) : (null)
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-[20px] w-full h-[400px] bg-[#ffffff] rounded-2xl shadow-md">
                <div className="h-full flex justify-center items-center">
                    <div className="w-[400px] h-full flex justify-center items-center">
                        <div className="w-[320px] h-[320px]">
                            <ResponsivePie
                                data={levelAndChapterData2}
                                margin={{ top: 20, right: 0, bottom: 20, left: 0 }}
                                innerRadius={0.4}
                                activeOuterRadiusOffset={8}
                                borderWidth={0}
                                borderColor={{ from: 'color', modifiers: [['darker', 0]] }}
                                arcLinkLabelsSkipAngle={10}
                                arcLinkLabelsTextColor="#333333"
                                arcLinkLabelsThickness={2}
                                arcLinkLabelsColor={{ from: 'color' }}
                                arcLabelsSkipAngle={10}
                                arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                                enableArcLinkLabels={false}
                                enableArcLabels={false}
                                padAngle={1}
                                cornerRadius={4}
                                colors={e => e.data.color}
                                tooltip={(e) => {
                                    return (
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "4px 6px", fontSize: "16px", borderRadius: "8px", background: "#fafafa", boxShadow: "4px 4px 4px 1px rgba(192, 192, 192, 0.8)" }}>
                                            {e.datum.data.level}레벨 {e.datum.data.chapter}단원: {e.datum.data.percent}%
                                        </div>
                                    )
                                }}
                            />
                        </div>
                    </div>

                    <div className="w-[720px] h-[400px]">
                        <div className="mt-[50px] text-[18px] text-[#464c52] font-bold">
                            {
                                levelAndChapterMaxLevel > 0 ? (
                                    <Fragment>
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                            <div className="ml-[8px]">
                                                주간 가장 많이 학습한 단원은 {levelAndChapterMaxLevel}레벨 [{levelAndChapterMaxChapterName}]입니다.
                                            </div>
                                        </div>
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                            <div className="ml-[8px]">
                                                해당 주는 학습하지 않았어요.
                                            </div>
                                        </div>
                                    </Fragment>
                                )
                            }
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "column", height: "240px", marginTop: "20px" }}>
                            {
                                levelAndChapterMaxLevel > 0 ? (
                                    <div>
                                        <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "column" }}>
                                            {
                                                levelAndChapterData2 && levelAndChapterData2.length > 6 ? (
                                                    <Fragment>
                                                        {
                                                            levelAndChapterData2 && levelAndChapterData2.slice(0, 6).map((value, index) => (
                                                                <div key={index} style={{ height: "40px", display: "flex", alignItems: "center", color: value.level === levelAndChapterMaxLevel && value.chapter === levelAndChapterMaxChapter ? "#0063ff" : "#464c52" }}>
                                                                    <div className="w-[10px] flex justify-center items-center">
                                                                        <div style={{ width: "10px", height: "10px", borderRadius: "25px", background: value.color }}></div>
                                                                    </div>
                                                                    <div className="w-[500px] pl-[10px] relative">
                                                                        <div>{value.level}레벨 {value.chapter}단원 [{value.chapterName && value.chapterName.length > 30 ? value.chapterName.substr(0, 30) + ".." : value.chapterName}]</div>
                                                                        <div className="absolute top-0 left-[10px] w-[500px] h-[28px] opacity-0 hover:opacity-100">
                                                                            <div className="absolute -top-1 -left-1 bg-[#54595e] text-[#ffffff] whitespace-nowrap inline-block p-[4px] rounded-lg">
                                                                                {value.level}레벨 {value.chapter}단원 [{value.chapterName}]
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div style={{ width: "70px" }}>{value.percent}%</div>
                                                                    <div style={{ width: "70px" }}>{value.value}개</div>
                                                                </div>
                                                            ))
                                                        }
                                                        <div className="flex justify-center items-center h-[40px]">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                            </svg>
                                                        </div>
                                                    </Fragment>
                                                ) : (
                                                    levelAndChapterData2 && levelAndChapterData2.map((value, index) => (
                                                        <div key={index} style={{ height: "40px", display: "flex", alignItems: "center", color: value.level === levelAndChapterMaxLevel && value.chapter === levelAndChapterMaxChapter ? "#0063ff" : "#464c52" }}>
                                                            <div className="w-[10px] flex justify-center items-center">
                                                                <div style={{ width: "10px", height: "10px", borderRadius: "25px", background: value.color }}></div>
                                                            </div>
                                                            <div className="w-[500px] pl-[10px] relative">
                                                                <div>{value.level}레벨 {value.chapter}단원 [{value.chapterName && value.chapterName.length > 30 ? value.chapterName.substr(0, 30) + ".." : value.chapterName}]</div>
                                                                <div className="absolute top-0 left-[10px] w-[500px] h-[28px] opacity-0 hover:opacity-100">
                                                                    <div className="absolute -top-1 -left-1 bg-[#54595e] text-[#ffffff] whitespace-nowrap inline-block p-[4px] rounded-lg">
                                                                        {value.level}레벨 {value.chapter}단원 [{value.chapterName}]
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div style={{ width: "70px" }}>{value.percent}%</div>
                                                            <div style={{ width: "70px" }}>{value.value}개</div>
                                                        </div>
                                                    ))
                                                )
                                            }
                                        </div>
                                    </div>
                                ) : (null)
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-[50px] text-[24px] font-bold">
                학습량 (스테이지 개수)
            </div>

            <div className="mt-[20px] w-full h-[400px] bg-[#ffffff] rounded-2xl shadow-md">
                <div className="h-[60px] flex justify-end items-center">
                    <div className="text-[#b6b9bc]">지난주와 비교한 학습량를 보여줍니다.</div>
                    <div className="ml-[20px] mr-[30px]">
                        <div className="font-bold underline underline-offset-4 cursor-pointer select-none" onClick={() => compareData(1)}>
                            비교하기
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center h-[340px]">
                    <div className="w-[900px] h-[280px]">
                        <ResponsiveBar
                            data={lastWeekAndThisWeekLearningData2}
                            keys={learningCountKeys}
                            indexBy="thisWeekLearningDate"
                            margin={{ top: 30, right: 30, bottom: 40, left: 50 }}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                tickSize: 0,
                                tickPadding: 10,
                                tickRotation: 0,
                                format: (e) => {
                                    let thisDate = new Date(e);
                                    return (
                                        <tspan style={{ fontSize: "16px", fill: "#1b1d1f" }}>{thisDate.getDate()}일</tspan>
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
                                fontSize: "16px",
                                textColor: "#999c9f"
                            }}
                            borderRadius={3}
                            padding={learningCountPadding}
                            innerPadding={10}
                            colors={learningCountColors}
                            colorBy="id"
                            label={(e) => {
                                return (
                                    <tspan y="-14" fontSize="16px" fontWeight="700" fill={e.value === maxLearningCount ? "#0063ff" : "#72787f"}>{e.value}</tspan>
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
                                                {
                                                    e.id === 'thisWeekLearningCount' ? (
                                                        <span>{e.data.thisWeekDailyLearningCount ? e.data.thisWeekDailyLearningCount : 0}개</span>
                                                    ) : (
                                                        <span>{e.data.lastWeekDailyLearningCount ? e.data.lastWeekDailyLearningCount : 0}개</span>
                                                    )
                                                }
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
                                                {
                                                    e.id === 'thisWeekLearningCount' ? (
                                                        <span>{e.data.thisWeekFreeLearningCount ? e.data.thisWeekFreeLearningCount : 0}개</span>
                                                    ) : (
                                                        <span>{e.data.lastWeekFreeLearningCount ? e.data.lastWeekFreeLearningCount : 0}개</span>
                                                    )
                                                }
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
                                                {
                                                    e.id === 'thisWeekLearningCount' ? (
                                                        <span>{e.data.thisWeekOneproLearningCount ? e.data.thisWeekOneproLearningCount : 0}개</span>
                                                    ) : (
                                                        <span>{e.data.lastWeekOneproLearningCount ? e.data.lastWeekOneproLearningCount : 0}개</span>
                                                    )
                                                }
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
                                                {
                                                    e.id === 'thisWeekLearningCount' ? (
                                                        <span>{e.data.thisWeekWorldLearningCount ? e.data.thisWeekWorldLearningCount : 0}개</span>
                                                    ) : (
                                                        <span>{e.data.lastWeekWorldLearningCount ? e.data.lastWeekWorldLearningCount : 0}개</span>
                                                    )
                                                }
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
            </div>

            <div className="mt-[50px] text-[24px] font-bold">
                정확도
            </div>

            <div className="mt-[20px] w-full h-[400px] bg-[#ffffff] rounded-2xl shadow-md">
                <div className="h-[60px] flex justify-end items-center">
                    <div className="text-[#b6b9bc]">지난주와 비교한 정확도를 보여줍니다.</div>
                    <div className="ml-[20px] mr-[30px]">
                        <div className="font-bold underline underline-offset-4 cursor-pointer select-none" onClick={() => compareData(2)}>
                            비교하기
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center h-[340px]">
                    <div className="w-[900px] h-[280px]">
                        <ResponsiveBar
                            data={lastWeekAndThisWeekLearningData2}
                            keys={accuracyKeys}
                            indexBy="thisWeekLearningDate"
                            margin={{ top: 30, right: 30, bottom: 40, left: 50 }}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                tickSize: 0,
                                tickPadding: 10,
                                tickRotation: 0,
                                format: (e) => {
                                    let thisDate = new Date(e);
                                    return (
                                        <tspan style={{ fontSize: "16px", fill: "#1b1d1f" }}>{thisDate.getDate()}일</tspan>
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
                                fontSize: "16px",
                                textColor: "#999c9f"
                            }}
                            borderRadius={3}
                            padding={accuracyPadding}
                            innerPadding={10}
                            colors={accuracyColors}
                            colorBy="id"
                            label={(e) => {
                                return (
                                    <tspan y="-14" fontSize="16px" fontWeight="700" fill={e.value === maxAccuracy ? "#0063ff" : "#72787f"}>{e.value}</tspan>
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
                                                {
                                                    e.id === 'thisWeekAccuracy' ? (
                                                        <span>{e.data.thisWeekDailyAccuracy ? e.data.thisWeekDailyAccuracy : 0}%</span>
                                                    ) : (
                                                        <span>{e.data.lastWeekDailyAccuracy ? e.data.lastWeekDailyAccuracy : 0}%</span>
                                                    )
                                                }
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
                                                {
                                                    e.id === 'thisWeekAccuracy' ? (
                                                        <span>{e.data.thisWeekFreeAccuracy ? e.data.thisWeekFreeAccuracy : 0}%</span>
                                                    ) : (
                                                        <span>{e.data.lastWeekFreeAccuracy ? e.data.lastWeekFreeAccuracy : 0}%</span>
                                                    )
                                                }
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
                                                {
                                                    e.id === 'thisWeekAccuracy' ? (
                                                        <span>{e.data.thisWeekOneproAccuracy ? e.data.thisWeekOneproAccuracy : 0}%</span>
                                                    ) : (
                                                        <span>{e.data.lastWeekOneproAccuracy ? e.data.lastWeekOneproAccuracy : 0}%</span>
                                                    )
                                                }
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
                                                {
                                                    e.id === 'thisWeekAccuracy' ? (
                                                        <span>{e.data.thisWeekWorldAccuracy ? e.data.thisWeekWorldAccuracy : 0}%</span>
                                                    ) : (
                                                        <span>{e.data.lastWeekWorldAccuracy ? e.data.lastWeekWorldAccuracy : 0}%</span>
                                                    )
                                                }
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
            </div>

            <div className="mt-[50px] text-[24px] font-bold">
                학습시간 (분)
            </div>

            <div className="mt-[20px] w-full h-[400px] bg-[#ffffff] rounded-2xl shadow-md">
                <div className="h-[60px] flex justify-end items-center">
                    <div className="text-[#b6b9bc]">지난주와 비교한 학습시간를 보여줍니다.</div>
                    <div className="ml-[20px] mr-[30px]">
                        <div className="font-bold underline underline-offset-4 cursor-pointer select-none" onClick={() => compareData(3)}>
                            비교하기
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center h-[340px]">
                    <div className="w-[900px] h-[280px]">
                        <ResponsiveBar
                            data={lastWeekAndThisWeekLearningData2}
                            keys={learningTimeMinutesKeys}
                            indexBy="thisWeekLearningDate"
                            margin={{ top: 30, right: 30, bottom: 40, left: 50 }}
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                tickSize: 0,
                                tickPadding: 10,
                                tickRotation: 0,
                                format: (e) => {
                                    let thisDate = new Date(e);
                                    return (
                                        <tspan style={{ fontSize: "16px", fill: "#1b1d1f" }}>{thisDate.getDate()}일</tspan>
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
                                fontSize: "16px",
                                textColor: "#999c9f"
                            }}
                            borderRadius={3}
                            padding={learningTimeMinutesPadding}
                            innerPadding={10}
                            colors={learningTimeMinutesColors}
                            colorBy="id"
                            label={(e) => {
                                return (
                                    <tspan y="-14" fontSize="16px" fontWeight="700" fill={e.value === maxLearningTimeMinutes ? "#0063ff" : "#72787f"}>{e.value}</tspan>
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
                                                {
                                                    e.id === 'thisWeekLearningTimeMinutes' ? (
                                                        <span>{e.data.thisWeekDailyLearningTimeMinutes ? e.data.thisWeekDailyLearningTimeMinutes : 0}분</span>
                                                    ) : (
                                                        <span>{e.data.lastWeekDailyLearningTimeMinutes ? e.data.lastWeekDailyLearningTimeMinutes : 0}분</span>
                                                    )
                                                }
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
                                                {
                                                    e.id === 'thisWeekLearningTimeMinutes' ? (
                                                        <span>{e.data.thisWeekFreeLearningTimeMinutes ? e.data.thisWeekFreeLearningTimeMinutes : 0}분</span>
                                                    ) : (
                                                        <span>{e.data.lastWeekFreeLearningTimeMinutes ? e.data.lastWeekFreeLearningTimeMinutes : 0}분</span>
                                                    )
                                                }
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
                                                {
                                                    e.id === 'thisWeekLearningTimeMinutes' ? (
                                                        <span>{e.data.thisWeekOneproLearningTimeMinutes ? e.data.thisWeekOneproLearningTimeMinutes : 0}분</span>
                                                    ) : (
                                                        <span>{e.data.lastWeekOneproLearningTimeMinutes ? e.data.lastWeekOneproLearningTimeMinutes : 0}분</span>
                                                    )
                                                }
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
                                                {
                                                    e.id === 'thisWeekLearningTimeMinutes' ? (
                                                        <span>{e.data.thisWeekWorldLearningTimeMinutes ? e.data.thisWeekWorldLearningTimeMinutes : 0}분</span>
                                                    ) : (
                                                        <span>{e.data.lastWeekWorldLearningTimeMinutes ? e.data.lastWeekWorldLearningTimeMinutes : 0}분</span>
                                                    )
                                                }
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
            </div>

            <div className="mt-[50px] text-[24px] font-bold">
                학습 결과 상세
            </div>
            <div className="mt-[20px] w-full bg-[#ffffff] rounded-2xl shadow-md">
                <div className="flex justify-end items-center h-[60px] pr-[30px]">
                    <div className="flex items-center">
                        <div>
                            <div className="w-[10px] h-[10px] rounded-full bg-[#0063ff]"></div>
                        </div>
                        <div className="flex ml-[8px]">
                            <span className="text-[#1b1d1f]">정확도</span>
                            <span className="text-[#0063ff]">&nbsp;90% 이상은 파란색</span>
                            <span className="text-[#1b1d1f]">입니다.</span>
                        </div>
                    </div>

                    <div className="flex items-center ml-[30px]">
                        <div>
                            <div className="w-[10px] h-[10px] rounded-full bg-[#d61313]"></div>
                        </div>
                        <div className="flex ml-[8px]">
                            <span className="text-[#1b1d1f]">정확도</span>
                            <span className="text-[#d61313]">&nbsp;50% 이하는 빨간색</span>
                            <span className="text-[#1b1d1f]">입니다.</span>
                        </div>
                    </div>
                </div>

                <div className="px-[30px] pb-[10px]">
                    <div className="flex items-center text-[#464c52] font-semibold mt-[20px] h-[50px] border-b">
                        <div className="w-[80px] pl-[10px]">번호</div>
                        <div className="w-[80px]">날짜</div>
                        <div className="w-[100px]">시작시간</div>
                        <div className="w-[100px]">학습 모드</div>
                        <div className="w-[100px]">레벨/단원</div>
                        <div className="w-[340px]">스테이지명</div>
                        <div className="w-[100px]">학습시간</div>
                        <div className="w-[80px]">등급</div>
                        <div className="w-[80px]">정확도</div>
                    </div>
                    {
                        learningData2 && Array.isArray(learningData2) && learningData2.length === 0 ? (
                            <div className="flex items-center text-[#1b1d1f] h-[50px] pl-[10px]">
                                해당 주는 학습하지 않았어요.
                            </div>
                        ) : (
                            <Fragment>
                                {
                                    learningData2 && learningData2.map((value, index) => (
                                        <div key={index}>
                                            <div className="flex items-center text-[#1b1d1f] h-[50px]">
                                                <div className="w-[80px] pl-[10px]">{index + 1}</div>
                                                <div className="w-[80px]">{value.month}.{value.day}</div>
                                                <div className="w-[100px]">{value.startLearningTime}</div>
                                                <div className="w-[100px]">{value.learningMode}</div>
                                                <div className="w-[100px]">{value.level}레벨/{value.chapter}단원</div>
                                                <div className="w-[340px] relative">
                                                    <div>{value.unitName && value.unitName.length > 26 ? value.unitName.substr(0, 26) + ".." : value.unitName}</div>
                                                    <div className="absolute top-0 left-0 w-[360px] h-[50px] opacity-0 hover:opacity-100">
                                                        <div className="absolute -top-1 -left-1 bg-[#54595e] text-[#ffffff] whitespace-nowrap inline-block p-[4px] rounded-lg">
                                                            {value.unitName}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="w-[100px]">
                                                    {mm2(value.learningTimeSeconds)} {ss2(value.learningTimeSeconds)}
                                                </div>
                                                <div className="w-[80px]">
                                                    {
                                                        value.learningMode === "일프로 도전" ? (
                                                            <Fragment>
                                                                {
                                                                    value.grade === 1 ? (
                                                                        <span>성공</span>
                                                                    ) : (
                                                                        <span>실패</span>
                                                                    )
                                                                }
                                                            </Fragment>


                                                        ) : (
                                                            <span>
                                                                {value.grade}%
                                                            </span>
                                                        )
                                                    }
                                                </div>
                                                <div className="w-[80px]">
                                                    {
                                                        value.accuracy >= 90 ? (
                                                            <span className="text-[#0063ff]">{value.accuracy}%</span>
                                                        ) : (
                                                            value.accuracy <= 50 ? (
                                                                <span className="text-[#d61313]">{value.accuracy}%</span>
                                                            ) : (
                                                                <span>{value.accuracy}%</span>
                                                            )
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </Fragment>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default WeeklyLearning;