import { Fragment, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { calendar, learningData, levelAndChapterData, levelData, monthlyLearningData, students, weeklyLearningData } from "../../../../../../../../api/axios";
import { useReactToPrint } from 'react-to-print'; // 프린트 api
import Learning from "../../../../../../../../assets/images/learning.png";
import Accuracy from "../../../../../../../../assets/images/accuracy.png";
import Time from "../../../../../../../../assets/images/time.png";
import { ResponsiveBar } from '@nivo/bar'; // nivo bar chart api
import { ResponsivePie } from '@nivo/pie'; // nivo pie chart api
import ScrollToTopButton from "../../../../../../../../components/ScrollToTopButton";
import OnePercentTrophy from "../../../../../../../../assets/images/onePercentTrophy.png";
import TenPercentTrophy from "../../../../../../../../assets/images/tenPercentTrophy.png";
import ThirtyPercentTrophy from "../../../../../../../../assets/images/thirtyPercentTrophy.png";
import FiftyPercentTrophy from "../../../../../../../../assets/images/fiftyPercentTrophy.png";
import GoodTrophy from "../../../../../../../../assets/images/goodTrophy.png";
import GoodBadge from "../../../../../../../../assets/images/goodBadge.png";
import BadBadge from "../../../../../../../../assets/images/badBadge.png";
import ClassicSpinnerLoader from "../../../../../../../../components/ClassicSpinnerLoader";
import { encode } from "../../../../../../../../components/Crypto";
import ScrollToTop from '../../../../../../../../components/ScrollToTop';

const MonthlyLearning = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);
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
    const [monthlyLearningData2, setMonthlyLearningData2] = useState([]); // 월별 학습 데이터
    const [maxLearningCount, setMaxLearningCount] = useState(3);
    const [maxAccuracy, setMaxAccuracy] = useState(1);
    const [maxLearningTimeMinutes, setMaxLearningTimeMinutes] = useState(5);
    const [preMonthComparisonLearningCount, setPreMonthComparisonLearningCount] = useState(0);
    const [preMonthComparisonAccuracy, setPreMonthComparisonAccuracy] = useState(0.0);
    const [preMonthComparisonLearningTimeSeconds, setPreMonthComparisonLearningTimeSeconds] = useState(0);
    const [preMonthComparisonProblemCount, setPreMonthComparisonProblemCount] = useState(0);
    const [weeklyLearningData2, setWeeklyLearningData2] = useState([]); // 주별 학습 데이터
    const [weeklyMaxLearningCount, setWeeklyMaxLearningCount] = useState(3);
    const [weeklyMaxAccuracy, setWeeklyMaxAccuracy] = useState(1);
    const [weeklyMaxLearningTimeMinutes, setWeeklyMaxLearningTimeMinutes] = useState(5);
    const [weekStartDate, setWeekStartDate] = useState("");
    const [weekEndDate, setWeekEndDate] = useState("");
    const [levelData2, setLevelData2] = useState([]);
    const [maxLevel, setMaxLevel] = useState(0);
    const [levelAndChapterData2, setLevelAndChapterData2] = useState([]);
    const [levelAndChapterMaxLevel, setLevelAndChapterMaxLevel] = useState(0);
    const [levelAndChapterMaxChapter, setLevelAndChapterMaxChapter] = useState(0);
    const [levelAndChapterMaxChapterName, setLevelAndChapterMaxChapterName] = useState("");
    const [learningData2, setLearningData2] = useState([]);
    const [learningData3, setLearningData3] = useState([]);
    const [onePercentTrophy, setOnePercentTrophy] = useState(0);
    const [tenPercentTrophy, setTenPercentTrophy] = useState(0);
    const [thirtyPercentTrophy, setThirtyPercentTrophy] = useState(0);
    const [fiftyPercentTrophy, setFiftyPercentTrophy] = useState(0);
    const [goodTrophy, setGoodTrophy] = useState(0);
    const [excellentLearningData, setExcellentLearningData] = useState([]);
    const [weekLearningData, setWeekLearningData] = useState([]);
    const [numberOfLearningData, setNmberOfLearningData] = useState(0);
    const monthlyReportContent = useRef();
    const linkAddressInput = useRef(); // 링크 주소 값
    const linkAddressCopyCheck = useRef(); // 복사 확인 아이콘
    const linkAddressBox = useRef(); // 링크 주소 박스
    const [linkAddressBoxShow, setLinkAddressBoxShow] = useState(false); // 링크 주소 박스 출력
    const [students2, setStudents2] = useState([]); // 모든 학생
    const [encryptProfileNo, setEncryptProfileNo] = useState(""); // 유저넘버 암호화

    const getMonthData = async () => {
        if (params.startdate) { // params.startdate가 있을 때
            let nowDate = new Date(params.startdate);
            let getFullYear = nowDate.getFullYear();
            let getMonth = nowDate.getMonth();
            let tmpStartDate = new Date(getFullYear, getMonth, 1);
            let tmpEndDate = new Date(getFullYear, getMonth + 1, 1);

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
            setEncryptProfileNo(encodeURIComponent(encode(params.studentno))); // Encrypt, encodeURIComponent

            await getCalendar(params.studentno, startDate2);
            await getMonthlyLearningData(params.studentno, startDate2, 4);
            await getWeeklyLearningData(params.studentno, startDate2);
            await getLevelData(params.studentno, startDate2, endDate2);
            await getLevelAndChapterData(params.studentno, startDate2, endDate2);
            await getLearningData(params.studentno, startDate2, endDate2);
            await getStudents(window.sessionStorage.getItem("schoolinfono"), params.classno);
        } else {
            let nowDate = new Date();
            let getFullYear = nowDate.getFullYear();
            let getMonth = nowDate.getMonth();
            let tmpStartDate = new Date(getFullYear, getMonth, 1);
            let tmpEndDate = new Date(getFullYear, getMonth + 1, 1);

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
            setEncryptProfileNo(encodeURIComponent(encode(params.studentno))); // Encrypt, encodeURIComponent

            await getCalendar(params.studentno, startDate2);
            await getMonthlyLearningData(params.studentno, startDate2, 4);
            await getWeeklyLearningData(params.studentno, startDate2);
            await getLevelData(params.studentno, startDate2, endDate2);
            await getLevelAndChapterData(params.studentno, startDate2, endDate2);
            await getLearningData(params.studentno, startDate2, endDate2);
            await getStudents(window.sessionStorage.getItem("schoolinfono"), params.classno);
        }
    }

    // 달력 (출석, 학습 데이터)
    const getCalendar = async (studentNo, startDate) => {
        await calendar(studentNo, startDate)
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

                setAverageLearningCount(learningCount !== 0 ? Math.ceil((learningCount / attendanceCount) * 10) / 10 : 0);
                setAverageAccuracy(rightCount !== 0 ? Math.ceil((rightCount / totalCount * 100) * 10) / 10 : 0);
                setAverageLearningTimeSeconds(learningTimeSeconds !== 0 ? Math.round(learningTimeSeconds / attendanceCount) : 0);
                setDailyModePercent(dailyModeCount !== 0 ? Math.round(dailyModeCount / learningCount * 100) : 0);
                setFreeModePercent(freeModeCount !== 0 ? Math.round(freeModeCount / learningCount * 100) : 0);
                setOneproModePercent(oneproModeCount !== 0 ? Math.round(oneproModeCount / learningCount * 100) : 0);
                setWorldModePercent(worldModeCount !== 0 ? Math.round(worldModeCount / learningCount * 100) : 0);

                let topLearningMode = 0;
                let topLearningModeValue = 0;
                for (let i = 0; i < learningModeEn.length; i++) {
                    if (eval(`${learningModeEn[i]}ModeCount`) > topLearningModeValue) {
                        topLearningModeValue = eval(`${learningModeEn[i]}ModeCount`);
                        topLearningMode = i + 1;
                    }
                }

                setTopLearningMode(topLearningMode);

            })
            .catch((error) => console.error(error))
    }

    const getMonthlyLearningData = async (studentNo, startDate, count) => { // 월별 학습 데이터
        await monthlyLearningData(studentNo, startDate, count)
            .then((res) => {
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
                setPreMonthComparisonAccuracy(Math.ceil((res.data[count - 1].accuracy - res.data[count - 2].accuracy) * 10) / 10);
                setPreMonthComparisonLearningTimeSeconds(res.data[count - 1].learningTimeSeconds - res.data[count - 2].learningTimeSeconds);
                setPreMonthComparisonProblemCount(res.data[count - 1].problemCount - res.data[count - 2].problemCount);
            })
            .catch((error) => console.error(error))
    }

    const getWeeklyLearningData = async (studentNo, startDate) => { // 주별 학습 데이터
        await weeklyLearningData(studentNo, startDate)
            .then((res) => {
                setWeeklyLearningData2(res.data);
                setWeekStartDate(res.data[0].date);
                let endDate = new Date(res.data[res.data.length - 1].date);
                endDate.setDate(endDate.getDate() + 6);
                let endDateYear = endDate.getFullYear();
                let endDateMonth = (endDate.getMonth() + 1) < 10 ? "0" + (endDate.getMonth() + 1) : (endDate.getMonth() + 1);
                let endDateDay = endDate.getDate() < 10 ? "0" + endDate.getDate() : endDate.getDate();
                let endDate2 = endDateYear + "-" + endDateMonth + "-" + endDateDay;
                setWeekEndDate(endDate2);

                // 최고 학습량
                let maxLearningCount = 0;
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].learningCount > maxLearningCount) {
                        maxLearningCount = res.data[i].learningCount;
                    }
                }
                if (maxLearningCount > 3) {
                    setWeeklyMaxLearningCount(maxLearningCount);
                } else {
                    setWeeklyMaxLearningCount(3);
                }

                // 최고 정확도
                let maxAccuracy = 0;
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].accuracy > maxAccuracy) {
                        maxAccuracy = res.data[i].accuracy;
                    }
                }

                if (maxAccuracy > 1) {
                    setWeeklyMaxAccuracy(maxAccuracy);
                } else {
                    setWeeklyMaxAccuracy(1);
                }

                // 최고 학습시간 (분)
                let maxLearningTimeMinutes = 0;
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].learningTimeMinutes > maxLearningTimeMinutes) {
                        maxLearningTimeMinutes = res.data[i].learningTimeMinutes;
                    }
                }

                if (maxLearningTimeMinutes > 5) {
                    setWeeklyMaxLearningTimeMinutes(maxLearningTimeMinutes);
                } else {
                    setWeeklyMaxLearningTimeMinutes(5);
                }
            })
            .catch((error) => console.error(error))
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

    const getLearningData = async (studentNo, startDate, endDate) => { // 학습 데이터
        await learningData(studentNo, startDate, endDate)
            .then((res) => {
                setLearningData2(res.data);

                // 추가 상세 학습 결과 데이터
                let count = Math.ceil(((res.data.length) - 16) / 23); // 상세 학습 결과 첫 페이지의 개수만큼 빼고 나머지를 한 페이지에 들어갈 개수만큼 나눔.
                setNmberOfLearningData(count);
                let tmpData = res.data.slice(16); // 추가 상세 학습 결과
                setLearningData3(tmpData);

                // 트로피별 개수 구하기.
                let onePercentTrophy = 0;
                let tenPercentTrophy = 0;
                let thirtyPercentTrophy = 0;
                let fiftyPercentTrophy = 0;
                let goodTrophy = 0;

                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].grade === 1) { // 1퍼센트
                        onePercentTrophy++;
                    } else if (res.data[i].grade === 10) { // 10퍼센트
                        tenPercentTrophy++;
                    } else if (res.data[i].grade === 30) { // 30퍼센트
                        thirtyPercentTrophy++;
                    } else if (res.data[i].grade === 50) { // 50퍼센트
                        fiftyPercentTrophy++;
                    } else if (res.data[i].grade === 100) { // 100퍼센트
                        goodTrophy++;
                    } else {
                        goodTrophy++;
                    }
                }

                setOnePercentTrophy(onePercentTrophy);
                setTenPercentTrophy(tenPercentTrophy);
                setThirtyPercentTrophy(thirtyPercentTrophy);
                setFiftyPercentTrophy(fiftyPercentTrophy);
                setGoodTrophy(goodTrophy);

                let learningData3 = res.data;

                // 등급순으로 재정렬
                let learningData4 = [...learningData3].sort((a, b) => a.grade - b.grade);

                // 우수 스테이지 배열 만들기.
                let excellentLearningData = [];
                let insertFlag = true;
                for (let i = 0; i < learningData4.length; i++) {
                    insertFlag = true;
                    for (let ii = 0; ii < excellentLearningData.length; ii++) {
                        // 레벨, 챕터, 유닛이 같다면
                        if (excellentLearningData[ii].level === learningData4[i].level && excellentLearningData[ii].chapter === learningData4[i].chapter && excellentLearningData[ii].unit === learningData4[i].unit) {
                            if (excellentLearningData[ii].grade > learningData4[i].grade) { // 기존 등급보다 낮다면
                                excellentLearningData[ii] = learningData4[i];
                            } else if (excellentLearningData[ii].grade === learningData4[i].grade) { // 기존 등급과 같다면
                                if (excellentLearningData[ii].accuracy < learningData4[i].accuracy) { // 기존 정확도보다 높다면
                                    excellentLearningData[ii] = learningData4[i];
                                }
                            }

                            insertFlag = false;
                            break;
                        } else {
                            insertFlag = true;
                        }
                    }
                    if (insertFlag) {
                        if (learningData4[i].accuracy >= 90) { // 정확도가 90퍼센트 이상만 우수 스테이지 추가
                            excellentLearningData.push(learningData4[i]);
                        }
                    }
                }

                // 등급순으로 재정렬
                let excellentLearningData2 = [...excellentLearningData].sort((a, b) => a.grade - b.grade || b.accuracy - a.accuracy);

                setExcellentLearningData(excellentLearningData2);

                // 등급 역순으로 재정렬
                let learningData5 = [...learningData4].sort((a, b) => b.grade - a.grade);

                // 취약 스테이지 배열 만들기.
                let weekLearningData = [];
                insertFlag = true;
                for (let i = 0; i < learningData5.length; i++) {
                    insertFlag = true;
                    for (let ii = 0; ii < weekLearningData.length; ii++) {
                        // 레벨, 챕터, 유닛이 같다면
                        if (weekLearningData[ii].level === learningData5[i].level && weekLearningData[ii].chapter === learningData5[i].chapter && weekLearningData[ii].unit === learningData5[i].unit) {
                            if (weekLearningData[ii].grade < learningData5[i].grade) { // 기존 등급보다 높다면
                                weekLearningData[ii] = learningData5[i];
                            } else if (weekLearningData[ii].grade === learningData5[i].grade) { // 기존 등급과 같다면
                                if (weekLearningData[ii].accuracy > learningData5[i].accuracy) { // 기존 정확도보다 낮다면
                                    weekLearningData[ii] = learningData5[i];
                                }
                            }

                            insertFlag = false;
                            break;
                        } else {
                            insertFlag = true;
                        }
                    }
                    if (insertFlag) {
                        if (learningData5[i].accuracy <= 50) { // 정확도가 50퍼센트 이하만 취약 스테이지 추가
                            weekLearningData.push(learningData5[i]);
                        }
                    }
                }

                // 등급순으로 재정렬
                let weekLearningData2 = [...weekLearningData].sort((a, b) => b.grade - a.grade || a.accuracy - b.accuracy);

                setWeekLearningData(weekLearningData2);
            })
            .catch((error) => console.error(error))
    }

    // 학생 목록
    const getStudents = async (schoolNo, classNo) => {
        await students(schoolNo, classNo)
            .then((res) => {
                setStudents2(res.data);
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

            navigate(`/home/whole-class/${params.class}/${params.classno}/${params.classname}/learning-status/average-learning-status/learning-details/${params.studentno}/${params.studentname}/1/${startDate2}`);
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

            navigate(`/home/whole-class/${params.class}/${params.classno}/${params.classname}/learning-status/average-learning-status/learning-details/${params.studentno}/${params.studentname}/1/${startDate2}`);
        }
    }

    const mm = (seconds) => {
        let min = parseInt(seconds / 60);
        let value = min;

        return value;
    }

    const ss = (seconds) => {
        let second = parseInt(seconds % 60);
        let value = "";

        if (second > 0) {
            value = second;
        } else {
            value = "";
        }

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

    const handlePrint = useReactToPrint({ // 프린트 출력
        onBeforeGetContent: () => monthlyReportContent.current.classList.remove("opacity-0", "h-0", "overflow-hidden"),
        content: () => monthlyReportContent.current,
        onAfterPrint: () => monthlyReportContent.current.classList.add("opacity-0", "h-0", "overflow-hidden"),
    });

    const linkAddressCopy = () => { // 링크 주소 복사
        // Browser compatibility 알림
        if (!document.queryCommandSupported("copy")) {
            alert("복사 기능을 지원하지 않는 브라우저에요.");
            return;
        }

        // 선택 후 복사
        linkAddressInput.current.focus();
        linkAddressInput.current.select();
        document.execCommand('copy');

        // 복사 완료 시
        linkAddressCopyCheck.current.classList.remove("hidden");
        const hidden = setTimeout(() => linkAddressCopyCheck.current.classList.add("hidden"), 3000);
        return () => clearTimeout(hidden);
    }

    const onCLicklinkAddressBox = () => { // 링크 박스 활성화 버튼
        setLinkAddressBoxShow(!linkAddressBoxShow);
    }

    const onChangeProfileNumber = (event) => { // Select box on Change
        const student = students2.find(student => Number(student.studentNo) === Number(event.target.value));
        let studentName = student.studentName.length > 8 ? student.studentName.substring(0, 8) + "..." : student.studentName;

        navigate(`/home/whole-class/${params.class}/${params.classno}/${params.classname}/learning-status/average-learning-status/learning-details/${student.studentNo}/${studentName}/1/${params.startdate ? params.startdate : startDate}`);
    }

    const onChangeProfileNumber2 = (chevron) => { // 방향 클릭 시 studentNo 변경
        const student = students2.find(student => Number(student.studentNo) === Number(params.studentno));
        const index = students2.indexOf(student);

        if (chevron === "left") {
            if (index > 0) {
                let student2 = students2[index - 1];
                let studentName = student2.studentName.length > 8 ? student2.studentName.substring(0, 8) + "..." : student2.studentName;

                navigate(`/home/whole-class/${params.class}/${params.classno}/${params.classname}/learning-status/average-learning-status/learning-details/${student2.studentNo}/${studentName}/1/${params.startdate ? params.startdate : startDate}`);
            }
        } else if (chevron === "right") {
            const lastIndex = students2.length - 1;

            if (lastIndex > index) {
                let student2 = students2[index + 1];
                let studentName = student2.studentName.length > 8 ? student2.studentName.substring(0, 8) + "..." : student2.studentName;

                navigate(`/home/whole-class/${params.class}/${params.classno}/${params.classname}/learning-status/average-learning-status/learning-details/${student2.studentNo}/${studentName}/1/${params.startdate ? params.startdate : startDate}`);
            }
        }
    }

    useEffect(async () => {
        setIsLoading(true);
        await getMonthData();
        setIsLoading(false);
    }, [location])

    return (
        <div className="text-[18px]">
            {
                isLoading ? (
                    <ClassicSpinnerLoader size={80} />
                ) : (null)
            }
            <ScrollToTopButton />
            <ScrollToTop />
            <div className="flex justify-between mt-[40px]">
                <div className="w-[400px] flex justify-start pl-[40px]">
                    <div className="flex justify-evenly items-center w-[9rem] h-[2.75rem] bg-[#b6b9bc] rounded-md cursor-pointer" onClick={onCLicklinkAddressBox}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#f7f8f9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </div>
                        <div className={"text-[#f7f8f9] text-[18px] select-none"}>
                            카카오톡 링크
                        </div>
                    </div>

                    <div ref={linkAddressBox} className={linkAddressBoxShow ? ("absolute") : ("hidden")}>
                        <div className="absolute top-[20px]">
                            <div className="absolute right-[-64px] top-[24px] z-10">
                                <div className="absolute w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[10px] border-b-[#d0d7de]"></div>
                                <div className="absolute w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-[#ffffff] left-[2px] top-[2px]"></div>
                            </div>
                            <div className="absolute top-[33px] right-[-444px] bg-[#ffffff] border-[1px] border-[#d0d7de] rounded p-2 shadow-sm">
                                <div className="flex items-center border-[1px] border-[#d0d7de] rounded-md px-2 bg-[#f6f8fa]">
                                    <input type="text" className="w-[20.875rem] h-6 bg-[#f6f8fa]" ref={linkAddressInput} value={`http://localhost:3000/monthly-report/25/0/${encryptProfileNo}/${params.startdate ? params.startdate : startDate}`} readOnly />
                                    <div className="bg-[#cccccc] w-[0.063rem] h-[2.125rem] ml-2"></div>
                                    <div className="relative w-[3.125rem] ml-2">
                                        <div>
                                            <div className="flex justify-center">
                                                <svg onClick={linkAddressCopy} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer text-[#cccccc] hover:text-[#000000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            </div>

                                            <div className="text-[14px]">
                                                복사하기
                                            </div>
                                        </div>

                                        <div ref={linkAddressCopyCheck} className="bg-[#f6f8fa] absolute top-0 left-0 w-[3.125rem] h-[2.813rem] hidden">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute h-6 w-6 top-0 left-3 text-[#1a7f37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <div className="absolute left-[5px] top-[23px] whitespace-nowrap inline-block text-[14px]">
                                                복사됨!
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2 text-[16px]">
                                    위 링크를 복사해서 카카오톡이나 메시지로 보내보세요!
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-evenly items-center w-[96px] h-[44px] bg-[#b6b9bc] rounded-md ml-2 cursor-pointer" onClick={handlePrint}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#f7f8f9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                        </div>
                        <div className={"text-[#f7f8f9] text-[18px] select-none"}>
                            프린트
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="w-[32px] h-[32px] bg-[#e4e7e9] rounded-lg flex justify-center items-center cursor-pointer" onClick={() => onChangeDate(-1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>

                    <div className="w-[120px] px-[20px] font-bold text-[#464c52] select-none text-center">{year}-{month}</div>

                    <div className="w-[32px] h-[32px] bg-[#e4e7e9] rounded-lg flex justify-center items-center cursor-pointer" onClick={() => onChangeDate(1)} >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className="w-[400px] pr-[40px]">
                    <div className="flex justify-end items-center">
                        <div className="flex justify-center items-center bg-[#e2e3e5] h-[34px] px-[3px] rounded-md cursor-pointer" onClick={() => onChangeProfileNumber2("left")}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#474d53" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </div>
                        <select value={params.studentno} onChange={onChangeProfileNumber} className="text-[14pt] h-[34px] px-[8px] bg-[#f0f1f3] rounded-md ml-[8px] border border-[#e2e3e5] cursor-pointer">
                            {
                                students2 && students2.map((value, index) => (
                                    <option key={index} value={value.studentNo}>{value.studentName.length > 8 ? value.studentName.substring(0, 8) + "..." : value.studentName}</option>
                                ))
                            }
                        </select>
                        <div className="flex justify-center items-center bg-[#e2e3e5] h-[34px] px-[3px] rounded-md ml-[8px] cursor-pointer" onClick={() => onChangeProfileNumber2("right")}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#474d53" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-[40px]">
                <div className="flex justify-center">
                    <div className="bg-[#ffffff] w-[1040px] h-[1400px] shadow-md rounded">
                        <div className="px-[40px] pt-[50px] h-[100px]">
                            <div className="text-[24px] text-[#72787f]">상위 1%가 선택한 연산앱 '일프로연산'</div>
                            <hr className="border-2 mt-[20px]" />
                        </div>
                        <div className="flex justify-center items-center h-[1100px]">
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
                                <div className="text-[30px] text-[#464c52] mt-[110px]">
                                    {year}.{month}
                                </div>
                            </div>
                        </div>

                        <div className="h-[200px] flex justify-center items-center text-[220px] font-black text-[#edf4ff]">
                            1%MATH
                        </div>
                    </div>
                </div>

                <div className="mt-[60px] flex justify-center">
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
                                                            <div className={value2.learningDate >= startDate && value2.learningDate < endDate ? "text-[#000000]" : "text-[#adb0b2]"}>
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

                        <div className="px-[60px] mt-[50px] text-[20px] text-[#464c52] font-bold">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                                <div className="ml-[8px]">
                                    {parseInt(month)}월 총 출석 일수는 {attendanceCount}일입니다.
                                </div>
                            </div>
                            <div className="flex items-center mt-[20px]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                                <div className="ml-[8px]">
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

                <div className="mt-[60px] flex justify-center">
                    <div className="relative bg-[#ffffff] w-[1040px] h-[1400px] shadow-md rounded">
                        <div className="text-[32px] font-bold text-[#061b3b] text-center mt-[50px]">
                            평균 학습 현황
                        </div>
                        <div className="mt-[50px]">
                            <div className="px-[60px]">
                                <div className="text-right text-[#adb0b2] text-[16px]">
                                    * 출석한 날 기준 평균
                                </div>
                            </div>

                            <div className="mt-[20px]">
                                <div className="flex justify-center">
                                    <div className="flex w-[306px] justify-center">
                                        <div className="w-[100px] flex justify-center items-center">
                                            <img src={Learning} alt={"learning"} />
                                        </div>
                                        <div className="w-[146px] pl-[20px]">
                                            <div className="text-[#464c52] mt-[6px]">
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

                                    <div className="flex w-[306px] justify-center">
                                        <div className="w-[100px] flex justify-center items-center">
                                            <img src={Accuracy} alt={"accuracy"} />
                                        </div>
                                        <div className="w-[146px] pl-[20px]">
                                            <div className="text-[#464c52] mt-[6px]">
                                                정확도
                                            </div>
                                            <div className="mt-[10px]">
                                                <span className="text-[28px] font-semibold text-[#0063ff]">{averageAccuracy}</span>
                                                <span className="text-[20px] font-semibold text-[#0063ff] ml-[2px]">%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex w-[306px] justify-center">
                                        <div className="w-[100px] flex justify-center items-center">
                                            <img src={Time} alt={"time"} />
                                        </div>
                                        <div className="w-[146px] pl-[20px]">
                                            <div className="text-[#464c52] mt-[6px]">
                                                학습시간
                                            </div>
                                            <div className="mt-[10px]">
                                                <span className="text-[28px] font-semibold text-[#0063ff]">{mm(averageLearningTimeSeconds)}</span>
                                                {
                                                    mm(averageLearningTimeSeconds) !== "" ? (
                                                        <span className="text-[20px] font-semibold text-[#0063ff] ml-[2px]">분</span>
                                                    ) : (null)
                                                }
                                                <span className="text-[28px] font-semibold text-[#0063ff] ml-[4px]">{ss(averageLearningTimeSeconds)}</span>
                                                {
                                                    ss(averageLearningTimeSeconds) !== "" ? (
                                                        <span className="text-[20px] font-semibold text-[#0063ff] ml-[2px]">초</span>
                                                    ) : (null)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-[32px] font-bold text-[#061b3b] text-center mt-[50px]">
                            총 학습 현황
                        </div>
                        <div className="px-[60px] mt-[50px]">
                            <div className="flex border-t">
                                <div className="flex items-center w-[290px] h-[100px] text-[20px] text-[#464c52] font-bold pl-[40px]">학습량 (스테이지 개수)</div>
                                <div className="flex justify-end items-center w-[260px] h-[100px]">
                                    <div>
                                        <span className="text-[#0063ff] text-[42px]">{learningCount}</span>
                                        <span className="text-[#0063ff] text-[26px] ml-[6px]">개</span>
                                    </div>
                                </div>
                                <div className="flex justify-end items-center w-[370px] h-[100px] pr-[40px]">
                                    {
                                        preMonthComparisonLearningCount === 0 ? (
                                            <Fragment>
                                                <div className="text-[20px] text-[#5c5e60]">저번 달과 동일</div>
                                                <div className="ml-[14px]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#7e7e7e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </Fragment>
                                        ) : (
                                            preMonthComparisonLearningCount > 0 ? (
                                                <Fragment>
                                                    <div className="text-[20px] text-[#5c5e60]">+ 저번 달보다 {preMonthComparisonLearningCount}개 증가</div>
                                                    <div className="ml-[14px]">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#17b20e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                        </svg>
                                                    </div>
                                                </Fragment>
                                            ) : (
                                                <Fragment>
                                                    <div className="text-[20px] text-[#5c5e60]">- 저번 달보다 {Math.abs(preMonthComparisonLearningCount)}개 감소</div>
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

                            <div className="flex border-t">
                                <div className="flex items-center w-[290px] h-[100px] text-[20px] text-[#464c52] font-bold pl-[40px]">정확도</div>
                                <div className="flex justify-end items-center w-[260px] h-[100px]">
                                    <div>
                                        <span className="text-[#0063ff] text-[42px]">{averageAccuracy}</span>
                                        <span className="text-[#0063ff] text-[26px] ml-[6px]">%</span>
                                    </div>
                                </div>
                                <div className="flex justify-end items-center w-[370px] h-[100px] pr-[40px]">
                                    {
                                        preMonthComparisonAccuracy === 0 ? (
                                            <Fragment>
                                                <div className="text-[20px] text-[#5c5e60]">저번 달과 동일</div>
                                                <div className="ml-[14px]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#7e7e7e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </Fragment>
                                        ) : (
                                            preMonthComparisonAccuracy > 0 ? (
                                                <Fragment>
                                                    <div className="text-[20px] text-[#5c5e60]">+ 저번 달보다 {preMonthComparisonAccuracy}% 증가</div>
                                                    <div className="ml-[14px]">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#17b20e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                        </svg>
                                                    </div>
                                                </Fragment>
                                            ) : (
                                                <Fragment>
                                                    <div className="text-[20px] text-[#5c5e60]">- 저번 달보다 {Math.abs(preMonthComparisonAccuracy)}% 감소</div>
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

                            <div className="flex border-t">
                                <div className="flex items-center w-[290px] h-[100px] text-[20px] text-[#464c52] font-bold pl-[40px]">학습시간</div>
                                <div className="flex justify-end items-center w-[260px] h-[100px]">
                                    <div>
                                        <span className="text-[#0063ff] text-[42px]">{mm(learningTimeSeconds)}</span>
                                        <span className="text-[#0063ff] text-[26px] ml-[6px]">분</span>
                                        {
                                            ss(learningTimeSeconds) !== "" ? (
                                                <Fragment>

                                                    <span className="text-[#0063ff] text-[42px] ml-[8px]">{ss(learningTimeSeconds)}</span>
                                                    <span className="text-[#0063ff] text-[26px] ml-[6px]">초</span>
                                                </Fragment>
                                            ) : (null)
                                        }
                                    </div>
                                </div>
                                <div className="flex justify-end items-center w-[370px] h-[100px] pr-[40px]">
                                    {
                                        preMonthComparisonLearningTimeSeconds === 0 ? (
                                            <Fragment>
                                                <div className="text-[20px] text-[#5c5e60]">저번 달과 동일</div>
                                                <div className="ml-[14px]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#7e7e7e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </Fragment>
                                        ) : (
                                            preMonthComparisonLearningTimeSeconds > 0 ? (
                                                <Fragment>
                                                    <div className="text-[20px] text-[#5c5e60]">+ 저번 달보다 {mm2(Math.abs(preMonthComparisonLearningTimeSeconds))} {ss2(Math.abs(preMonthComparisonLearningTimeSeconds))} 증가</div>
                                                    <div className="ml-[14px]">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#17b20e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                        </svg>
                                                    </div>
                                                </Fragment>
                                            ) : (
                                                <Fragment>
                                                    <div className="text-[20px] text-[#5c5e60]">- 저번 달보다 {mm2(Math.abs(preMonthComparisonLearningTimeSeconds))} {ss2(Math.abs(preMonthComparisonLearningTimeSeconds))} 감소</div>
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

                            <div className="flex border-t border-b">
                                <div className="flex items-center w-[290px] h-[100px] text-[20px] text-[#464c52] font-bold pl-[40px]">문제 개수</div>
                                <div className="flex justify-end items-center w-[260px] h-[100px]">
                                    <div>
                                        <span className="text-[#0063ff] text-[42px]">{problemCount}</span>
                                        <span className="text-[#0063ff] text-[26px] ml-[6px]">개</span>
                                    </div>
                                </div>
                                <div className="flex justify-end items-center w-[370px] h-[100px] pr-[40px]">
                                    {
                                        preMonthComparisonProblemCount === 0 ? (
                                            <Fragment>
                                                <div className="text-[20px] text-[#5c5e60]">저번 달과 동일</div>
                                                <div className="ml-[14px]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#7e7e7e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </Fragment>
                                        ) : (
                                            preMonthComparisonProblemCount > 0 ? (
                                                <Fragment>
                                                    <div className="text-[20px] text-[#5c5e60]">+ 저번 달보다 {preMonthComparisonProblemCount}개 증가</div>
                                                    <div className="ml-[14px]">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#17b20e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                        </svg>
                                                    </div>
                                                </Fragment>
                                            ) : (
                                                <Fragment>
                                                    <div className="text-[20px] text-[#5c5e60]">- 저번 달보다 {Math.abs(preMonthComparisonProblemCount)}개 감소</div>
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

                        <div className="mt-[50px] flex justify-center">
                            <div>
                                <div className="flex items-center">
                                    <div className="flex items-center w-[200px] pl-[10px]">
                                        <div className="w-[0.625rem] h-[0.625rem] bg-[#558fe8] rounded-full"></div>
                                        <div className={topLearningMode === 1 ? "text-[#d61313] ml-[8px]" : "ml-[8px]"}>
                                            <span>오늘의 학습</span>
                                        </div>
                                    </div>
                                    <div className={topLearningMode === 1 ? "text-[#d61313] w-[100px]" : "w-[100px]"}>
                                        <span>
                                            {dailyModePercent}%
                                        </span>
                                    </div>
                                    <div className="w-[620px] pr-[10px]">
                                        <div className="overflow-hidden">
                                            <div className="relative w-full bg-[#e8e9ea] rounded-full h-[30px]">
                                                <div className="absolute w-full h-[30px] rounded-full shadow-[0_0_0_30px_#ffffff]"></div>
                                                <div className={"bg-[#558fe8] h-[30px]"} style={{ width: dailyModePercent + "%" }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center mt-[30px]">
                                    <div className="flex items-center w-[200px] pl-[10px]">
                                        <div className="w-[0.625rem] h-[0.625rem] bg-[#fac232] rounded-full"></div>
                                        <div className={topLearningMode === 2 ? "text-[#d61313] ml-[8px]" : "ml-[8px]"}>
                                            <span>자유 학습</span>
                                        </div>
                                    </div>
                                    <div className={topLearningMode === 2 ? "text-[#d61313] w-[100px]" : "w-[100px]"}>
                                        <span>
                                            {freeModePercent}%
                                        </span>
                                    </div>
                                    <div className="w-[620px] pr-[10px]">
                                        <div className="overflow-hidden">
                                            <div className="relative w-full bg-[#e8e9ea] rounded-full h-[30px]">
                                                <div className="absolute w-full h-[30px] rounded-full shadow-[0_0_0_30px_#ffffff]"></div>
                                                <div className={"bg-[#fac232] h-[30px]"} style={{ width: freeModePercent + "%" }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center mt-[30px]">
                                    <div className="flex items-center w-[200px] pl-[10px]">
                                        <div className="w-[0.625rem] h-[0.625rem] bg-[#f67b70] rounded-full"></div>
                                        <div className={topLearningMode === 3 ? "text-[#d61313] ml-[8px]" : "ml-[8px]"}>
                                            <span>일프로 도전</span>
                                        </div>
                                    </div>
                                    <div className={topLearningMode === 3 ? "text-[#d61313] w-[100px]" : "w-[100px]"}>
                                        <span>
                                            {oneproModePercent}%
                                        </span>
                                    </div>
                                    <div className="w-[620px] pr-[10px]">
                                        <div className="overflow-hidden">
                                            <div className="relative w-full bg-[#e8e9ea] rounded-full h-[30px]">
                                                <div className="absolute w-full h-[30px] rounded-full shadow-[0_0_0_30px_#ffffff]"></div>
                                                <div className={"bg-[#f67b70] h-[30px]"} style={{ width: oneproModePercent + "%" }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center mt-[30px]">
                                    <div className="flex items-center w-[200px] pl-[10px]">
                                        <div className="w-[0.625rem] h-[0.625rem] bg-[#3bc7b9] rounded-full"></div>
                                        <div className={topLearningMode === 4 ? "text-[#d61313] ml-[8px]" : "ml-[8px]"}>
                                            <span>연산 월드</span>
                                        </div>
                                    </div>
                                    <div className={topLearningMode === 4 ? "text-[#d61313] w-[100px]" : "w-[100px]"}>
                                        <span>
                                            {worldModePercent}%
                                        </span>
                                    </div>
                                    <div className="w-[620px] pr-[10px]">
                                        <div className="overflow-hidden">
                                            <div className="relative w-full bg-[#e8e9ea] rounded-full h-[30px]">
                                                <div className="absolute w-full h-[30px] rounded-full shadow-[0_0_0_30px_#ffffff]"></div>
                                                <div className={"bg-[#3bc7b9] h-[30px]"} style={{ width: worldModePercent + "%" }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-[60px] mt-[50px] text-[20px] text-[#464c52] font-bold">
                            {
                                topLearningMode !== 0 ? (
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                        <div className="ml-[8px]">
                                            {parseInt(month)}월에 가장 많이 한 학습 모드는 [{learningModeKo[topLearningMode - 1]}]입니다.
                                        </div>
                                    </div>
                                ) : (null)
                            }
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

                <div className="mt-[60px] flex justify-center">
                    <div className="relative bg-[#ffffff] w-[1040px] h-[1400px] shadow-md rounded">
                        <div className="text-[32px] font-bold text-[#061b3b] text-center mt-[50px]">
                            월별 학습 결과 비교
                        </div>
                        <div className="text-[#464c52] text-center mt-[20px]">
                            4개월 평균 학습 결과를 비교한 그래프입니다.
                        </div>

                        <div className="text-[20px] font-bold text-[#061b3b] mt-[50px] px-[60px]">
                            학습량 (스테이지 개수)
                        </div>

                        <div className="flex justify-center items-center mt-[20px]">
                            <div style={{ width: "900px", height: "280px" }}>
                                <ResponsiveBar
                                    data={monthlyLearningData2}
                                    keys={['learningCount']}
                                    indexBy="date"
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
                                                <tspan fontSize="18px" fill="#1b1d1f">{thisDate.getMonth() + 1}월</tspan>
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
                                    padding={0.8}
                                    colors={['#6e72f7']}
                                    colorBy="id"
                                    label={(e) => {
                                        return (
                                            <tspan y="-14" fontSize="16px" fill={e.value === maxLearningCount ? "#0063ff" : "#72787f"} fontWeight="700">{e.value}</tspan>
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

                        <div className="text-[20px] font-bold text-[#061b3b] mt-[50px] px-[60px]">
                            정확도
                        </div>

                        <div className="flex justify-center items-center mt-[20px]">
                            <div style={{ width: "900px", height: "280px" }}>
                                <ResponsiveBar
                                    data={monthlyLearningData2}
                                    keys={['accuracy']}
                                    indexBy="date"
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
                                                <tspan fontSize="18px" fill="#1b1d1f">{thisDate.getMonth() + 1}월</tspan>
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
                                    padding={0.8}
                                    colors={['#33cee6']}
                                    colorBy="id"
                                    label={(e) => {
                                        return (
                                            <tspan y="-14" fontSize="16px" fill={e.value === maxAccuracy ? "#0063ff" : "#72787f"} fontWeight="700">{e.value}</tspan>
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

                        <div className="text-[20px] font-bold text-[#061b3b] mt-[50px] px-[60px]">
                            학습시간
                        </div>

                        <div className="flex justify-center items-center mt-[20px]">
                            <div style={{ width: "900px", height: "280px" }}>
                                <ResponsiveBar
                                    data={monthlyLearningData2}
                                    keys={['learningTimeMinutes']}
                                    indexBy="date"
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
                                                <tspan fontSize="18px" fill="#1b1d1f">{thisDate.getMonth() + 1}월</tspan>
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
                                    padding={0.8}
                                    colors={['#b468ff']}
                                    colorBy="id"
                                    label={(e) => {
                                        return (
                                            <tspan y="-14" fontSize="16px" fill={e.value === maxLearningTimeMinutes ? "#0063ff" : "#72787f"} fontWeight="700">{e.value}</tspan>
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

                <div className="mt-[60px] flex justify-center">
                    <div className="relative bg-[#ffffff] w-[1040px] h-[1400px] shadow-md rounded">
                        <div className="text-[32px] font-bold text-[#061b3b] text-center mt-[50px]">
                            주별 학습 결과 그래프
                        </div>
                        <div className="text-[18px] text-[#464c52] text-center mt-[20px]">
                            {weekStartDate} ~ {weekEndDate}
                        </div>

                        <div className="text-[20px] font-bold text-[#061b3b] mt-[50px] px-[60px]">
                            학습량 (스테이지 개수)
                        </div>

                        <div className="flex justify-center items-center mt-[20px]">
                            <div style={{ width: "900px", height: "280px" }}>
                                <ResponsiveBar
                                    data={weeklyLearningData2}
                                    keys={['learningCount']}
                                    indexBy="date"
                                    margin={{ top: 30, right: 30, bottom: 40, left: 50 }}
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={{
                                        tickSize: 0,
                                        tickPadding: 10,
                                        tickRotation: 0,
                                        format: (e) => {
                                            let startDate = new Date(e);
                                            let endDate = new Date(startDate);
                                            endDate.setDate(endDate.getDate() + 6);
                                            return (
                                                <tspan fontSize="18px" fill="#1b1d1f">{startDate.getDate()}일-{endDate.getDate()}일</tspan>
                                            )
                                        }
                                    }}
                                    axisLeft={{
                                        tickSize: 0,
                                        tickPadding: 10,
                                        tickRotation: 0,
                                        tickValues: (weeklyMaxLearningCount <= 6 ? weeklyMaxLearningCount : 6),
                                        format: e => Math.floor(e) === e && `${e}개`
                                    }}
                                    groupMode={"grouped"}
                                    theme={{
                                        fontSize: "16px",
                                        textColor: "#999c9f"
                                    }}
                                    borderRadius={3}
                                    padding={0.8}
                                    colors={['#ff7d7d']}
                                    colorBy="id"
                                    label={(e) => {
                                        return (
                                            <tspan y="-14" fontSize="16px" fill={e.value === weeklyMaxLearningCount ? "#0063ff" : "#72787f"} fontWeight="700">{e.value}</tspan>
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
                                    maxValue={weeklyMaxLearningCount <= 6 ? weeklyMaxLearningCount : "auto"}
                                    gridYValues={weeklyMaxLearningCount <= 6 ? weeklyMaxLearningCount : 6}
                                />
                            </div>
                        </div>

                        <div className="text-[20px] font-bold text-[#061b3b] mt-[50px] px-[60px]">
                            정확도
                        </div>

                        <div className="flex justify-center items-center mt-[20px]">
                            <div style={{ width: "900px", height: "280px" }}>
                                <ResponsiveBar
                                    data={weeklyLearningData2}
                                    keys={['accuracy']}
                                    indexBy="date"
                                    margin={{ top: 30, right: 30, bottom: 40, left: 50 }}
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={{
                                        tickSize: 0,
                                        tickPadding: 10,
                                        tickRotation: 0,
                                        format: (e) => {
                                            let startDate = new Date(e);
                                            let endDate = new Date(startDate);
                                            endDate.setDate(endDate.getDate() + 6);
                                            return (
                                                <tspan fontSize="18px" fill="#1b1d1f">{startDate.getDate()}일-{endDate.getDate()}일</tspan>
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
                                    padding={0.8}
                                    colors={['#ff9957']}
                                    colorBy="id"
                                    label={(e) => {
                                        return (
                                            <tspan y="-14" fontSize="16px" fill={e.value === weeklyMaxAccuracy ? "#0063ff" : "#72787f"} fontWeight="700">{e.value}</tspan>
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

                        <div className="text-[20px] font-bold text-[#061b3b] mt-[50px] px-[60px]">
                            학습시간
                        </div>

                        <div className="flex justify-center items-center mt-[20px]">
                            <div style={{ width: "900px", height: "280px" }}>
                                <ResponsiveBar
                                    data={weeklyLearningData2}
                                    keys={['learningTimeMinutes']}
                                    indexBy="date"
                                    margin={{ top: 30, right: 30, bottom: 40, left: 50 }}
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={{
                                        tickSize: 0,
                                        tickPadding: 10,
                                        tickRotation: 0,
                                        format: (e) => {
                                            let startDate = new Date(e);
                                            let endDate = new Date(startDate);
                                            endDate.setDate(endDate.getDate() + 6);
                                            return (
                                                <tspan fontSize="18px" fill="#1b1d1f">{startDate.getDate()}일-{endDate.getDate()}일</tspan>
                                            )
                                        }
                                    }}
                                    axisLeft={{
                                        tickSize: 0,
                                        tickPadding: 10,
                                        tickRotation: 0,
                                        tickValues: (weeklyMaxLearningTimeMinutes <= 6 ? weeklyMaxLearningTimeMinutes : 6),
                                        format: e => Math.floor(e) === e && `${e}분`
                                    }}
                                    groupMode={"grouped"}
                                    theme={{
                                        fontSize: "16px",
                                        textColor: "#999c9f"
                                    }}
                                    borderRadius={3}
                                    padding={0.8}
                                    colors={['#ffcd4e']}
                                    colorBy="id"
                                    label={(e) => {
                                        return (
                                            <tspan y="-14" fontSize="16px" fill={e.value === weeklyMaxLearningTimeMinutes ? "#0063ff" : "#72787f"} fontWeight="700">{e.value}</tspan>
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
                                    maxValue={weeklyMaxLearningTimeMinutes <= 6 ? weeklyMaxLearningTimeMinutes : "auto"}
                                    gridYValues={weeklyMaxLearningTimeMinutes <= 6 ? weeklyMaxLearningTimeMinutes : 6}
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
                                4
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-[60px] flex justify-center">
                    <div className="relative bg-[#ffffff] w-[1040px] h-[1400px] shadow-md rounded">
                        <div className="text-[32px] font-bold text-[#061b3b] text-center mt-[50px]">
                            학습 레벨/단원 분석
                        </div>

                        <div className="px-[60px] mt-[50px] text-[20px] text-[#464c52] font-bold">
                            {
                                maxLevel > 0 ? (
                                    <Fragment>
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                            <div className="ml-[8px]">
                                                {month}월에 가장 많이 학습한 레벨은 [{maxLevel}레벨]입니다.
                                            </div>
                                        </div>
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                            <div className="ml-[8px]">
                                                {month}월에는 학습하지 않았어요.
                                            </div>
                                        </div>
                                    </Fragment>
                                )
                            }
                        </div>

                        <div className="mt-[20px]">
                            <div className="flex justify-center items-center">
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
                                <div className="w-[600px] h-[320px] pl-[20px]">
                                    {
                                        maxLevel > 0 ? (
                                            <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "column", height: "320px" }}>
                                                {
                                                    levelData2 && levelData2.map((value, index) => (
                                                        <div key={index} style={{ display: "flex", alignItems: "center", fontSize: "18px", color: value.id === maxLevel ? "#0063ff" : "#464c52", width: "290px", height: "53px" }}>
                                                            <div className="w-[10px] flex justify-center items-center">
                                                                <div style={{ width: "10px", height: "10px", borderRadius: "25px", background: value.color }}></div>
                                                            </div>
                                                            <div style={{ width: "120px", paddingLeft: "10px" }}>{value.id}레벨</div>
                                                            <div style={{ width: "90px" }}>{value.percent}%</div>
                                                            <div style={{ width: "70px" }}>{value.value}개</div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        ) : (
                                            <div style={{ fontSize: "20px" }}>
                                                해당 월은 학습하지 않았어요.
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>


                        <div className="px-[60px] mt-[50px] text-[20px] text-[#464c52] font-bold">
                            {
                                levelAndChapterMaxLevel > 0 ? (
                                    <Fragment>
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                            <div className="ml-[8px]">
                                                {month}월에 가장 많이 학습한 단원은 {levelAndChapterMaxLevel}레벨 [{levelAndChapterMaxChapterName}]입니다.
                                            </div>
                                        </div>
                                    </Fragment>
                                ) : (
                                    <Fragment>

                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                            <div className="ml-[8px]">
                                                {month}월에는 학습하지 않았어요.
                                            </div>
                                        </div>

                                    </Fragment>
                                )
                            }
                        </div>

                        <div className="mt-[20px]">
                            <div className="flex justify-center">
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
                                <div className="w-[600px] h-[700px] pl-[20px]">
                                    {
                                        levelAndChapterMaxLevel > 0 ? (
                                            <div>
                                                <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "column" }}>
                                                    {
                                                        levelAndChapterData2 && levelAndChapterData2.length > 12 ? (
                                                            <Fragment>
                                                                {
                                                                    levelAndChapterData2 && levelAndChapterData2.slice(0, 12).map((value, index) => (
                                                                        <div key={index} style={{ height: "50px", display: "flex", alignItems: "center", color: value.level === levelAndChapterMaxLevel && value.chapter === levelAndChapterMaxChapter ? "#0063ff" : "#464c52" }}>
                                                                            <div className="w-[10px] flex justify-center items-center">
                                                                                <div style={{ width: "10px", height: "10px", borderRadius: "25px", background: value.color }}></div>
                                                                            </div>
                                                                            <div className="w-[430px] pl-[10px] relative">
                                                                                <div>{value.level}레벨 {value.chapter}단원 [{value.chapterName && value.chapterName.length > 21 ? value.chapterName.substr(0, 21) + ".." : value.chapterName}]</div>
                                                                                <div className="absolute top-0 left-[10px] w-[430px] h-[28px] opacity-0 hover:opacity-100">
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
                                                                <div className="flex justify-center items-center h-[50px]">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                                    </svg>
                                                                </div>
                                                            </Fragment>
                                                        ) : (
                                                            levelAndChapterData2 && levelAndChapterData2.map((value, index) => (
                                                                <div key={index} style={{ height: "50px", display: "flex", alignItems: "center", color: value.level === levelAndChapterMaxLevel && value.chapter === levelAndChapterMaxChapter ? "#0063ff" : "#464c52" }}>
                                                                    <div className="w-[10px] flex justify-center items-center">
                                                                        <div style={{ width: "10px", height: "10px", borderRadius: "25px", background: value.color }}></div>
                                                                    </div>
                                                                    <div className="w-[430px] pl-[10px] relative">
                                                                        <div>{value.level}레벨 {value.chapter}단원 [{value.chapterName && value.chapterName.length > 21 ? value.chapterName.substr(0, 21) + ".." : value.chapterName}]</div>
                                                                        <div className="absolute top-0 left-[10px] w-[430px] h-[28px] opacity-0 hover:opacity-100">
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
                                        ) : (
                                            <div style={{ fontSize: "20px" }}>
                                                해당 월은 학습하지 않았어요.
                                            </div>
                                        )
                                    }
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
                                5
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-[60px] flex justify-center">
                    <div className="relative bg-[#ffffff] w-[1040px] h-[1400px] shadow-md rounded">
                        <div className="text-[32px] font-bold text-[#061b3b] text-center mt-[50px]">
                            우수/취약 스테이지
                        </div>

                        <div className="mt-[50px] h-[400px] px-[60px]">
                            <div className="text-[24px] text-[#061b3b] font-bold">
                                우수 스테이지
                            </div>
                            <div className="flex mt-[20px] items-center">
                                <div>
                                    <img src={GoodBadge} alt={"goodBadge"} />
                                </div>
                                <div className="text-[#616161] font-bold ml-[10px]">칭찬해 주세요!</div>
                            </div>

                            <div className="flex justify-center items-center border-t border-b h-[50px] mt-[20px] text-[#464c52] font-semibold">
                                <div className="w-[90px] pl-[10px]">번호</div>
                                <div className="w-[100px]">날짜</div>
                                <div className="w-[120px]">레벨/단원</div>
                                <div className="w-[430px]">스테이지</div>
                                <div className="w-[80px]">등급</div>
                                <div className="w-[100px]">정확도</div>
                            </div>
                            {
                                excellentLearningData && Array.isArray(excellentLearningData) && excellentLearningData.length === 0 ? (
                                    <div className="flex items-center h-[50px] text-[#1b1d1f] pl-[10px]">
                                        우수 스테이지가 없어요.
                                    </div>
                                ) : (
                                    excellentLearningData && excellentLearningData.slice(0, 5).map((value, index) => (
                                        <div key={index}>
                                            <div className="flex justify-center items-center h-[50px] text-[#1b1d1f]">
                                                <div className="w-[90px] pl-[10px]">{index + 1}</div>
                                                <div className="w-[100px]">{parseInt(value.month)}월 {parseInt(value.day)}일</div>
                                                <div className="w-[120px]">{value.level}레벨/{value.chapter}단원</div>
                                                <div className="w-[430px]">{value.unitName}</div>
                                                <div className="w-[80px]">
                                                    {
                                                        value.grade === 1 ? (
                                                            <span className="text-[#0063ff]">{value.grade}%</span>
                                                        ) : (
                                                            <span>{value.grade}%</span>
                                                        )
                                                    }
                                                </div>
                                                <div className="w-[100px]">{value.accuracy}%</div>
                                            </div>
                                        </div>
                                    ))
                                )
                            }
                        </div>

                        <div className="mt-[50px] h-[400px] px-[60px]">
                            <div className="text-[24px] text-[#061b3b] font-bold">
                                취약 스테이지
                            </div>

                            <div className="flex mt-[20px] items-center">
                                <div>
                                    <img src={BadBadge} alt={"badBadge"} />
                                </div>
                                <div className="text-[#616161] font-bold ml-[10px]">어려워 하고 있어요!</div>
                            </div>

                            <div className="flex justify-center items-center border-t border-b h-[50px] mt-[20px] text-[#464c52] font-semibold">
                                <div className="w-[100px] pl-[10px]">번호</div>
                                <div className="w-[110px]">날짜</div>
                                <div className="w-[130px]">레벨/단원</div>
                                <div className="w-[490px]">스테이지</div>
                                <div className="w-[110px]">정확도</div>
                            </div>
                            {
                                weekLearningData && Array.isArray(weekLearningData) && weekLearningData.length === 0 ? (
                                    <div className="flex items-center h-[50px] text-[#1b1d1f] pl-[10px]">
                                        취약 스테이지가 없어요.
                                    </div>
                                ) : (
                                    weekLearningData && weekLearningData.slice(0, 5).map((value, index) => (
                                        <div key={index}>
                                            <div className="flex justify-center items-center h-[50px] text-[#1b1d1f]">
                                                <div className="w-[100px] pl-[10px]">{index + 1}</div>
                                                <div className="w-[110px]">{parseInt(value.month)}월 {parseInt(value.day)}일</div>
                                                <div className="w-[130px]">{value.level}레벨/{value.chapter}단원</div>
                                                <div className="w-[490px]">{value.unitName}</div>
                                                <div className="w-[110px]">{value.accuracy}%</div>
                                            </div>
                                        </div>
                                    ))
                                )
                            }
                        </div>

                        <div className="absolute bottom-[40px] left-0 w-full flex justify-between text-[16px] font-semibold text-[#464c52]">
                            <div className="w-[80px]">
                            </div>
                            <div>
                                {year}.{month}
                            </div>
                            <div className="w-[80px] text-right pr-[40px]">
                                6
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-[60px] flex justify-center">
                    <div className="relative bg-[#ffffff] w-[1040px] h-[1400px] shadow-md rounded">
                        <div className="text-[32px] font-bold text-[#061b3b] text-center mt-[50px]">
                            상세 학습 결과
                        </div>

                        <div className="mt-[50px] px-[60px]">
                            <div className="text-[24px] text-[#061b3b] font-bold">
                                {month}월 등급 메달
                            </div>
                        </div>

                        <div className="flex justify-between mt-[20px] text-[20px] text-[#464c52] font-semibold px-[60px]">
                            <div>
                                <div className="h-[100px] flex items-center">
                                    <img src={OnePercentTrophy} alt={"onePercentTrophy"} />
                                </div>
                                <div className="text-center mt-[20px]">{onePercentTrophy}개</div>
                            </div>
                            <div>
                                <div className="h-[100px] flex items-center">
                                    <img src={TenPercentTrophy} alt={"tenPercentTrophy"} />
                                </div>
                                <div className="text-center mt-[20px]">{tenPercentTrophy}개</div>
                            </div>
                            <div>
                                <div className="h-[100px] flex items-center">
                                    <img src={ThirtyPercentTrophy} alt={"thirtyPercentTrophy"} />
                                </div>
                                <div className="text-center mt-[20px]">{thirtyPercentTrophy}개</div>
                            </div>
                            <div>
                                <div className="h-[100px] flex items-center">
                                    <img src={FiftyPercentTrophy} alt={"fiftyPercentTrophy"} />
                                </div>
                                <div className="text-center mt-[20px]">{fiftyPercentTrophy}개</div>
                            </div>
                            <div>
                                <div className="h-[100px] flex items-center">
                                    <img src={GoodTrophy} alt={"goodTrophy"} />
                                </div>
                                <div className="text-center mt-[20px]">{goodTrophy}개</div>
                            </div>
                        </div>

                        <div className="mt-[50px] flex px-[60px]">
                            <div className="flex items-center">
                                <div>
                                    <div className="w-[10px] h-[10px] rounded-full bg-[#0063ff]"></div>
                                </div>
                                <div className="flex text-[16px] font-semibold ml-[8px]">
                                    <span className="text-[#1b1d1f]">정확도</span>
                                    <span className="text-[#0063ff]">&nbsp;90% 이상은 파란색</span>
                                    <span className="text-[#1b1d1f]">입니다.</span>
                                </div>
                            </div>

                            <div className="flex items-center ml-[50px]">
                                <div>
                                    <div className="w-[10px] h-[10px] rounded-full bg-[#d61313]"></div>
                                </div>
                                <div className="flex text-[16px] font-semibold ml-[8px]">
                                    <span className="text-[#1b1d1f]">정확도</span>
                                    <span className="text-[#d61313]">&nbsp;50% 이하는 빨간색</span>
                                    <span className="text-[#1b1d1f]">입니다.</span>
                                </div>
                            </div>
                        </div>

                        <div className="px-[60px]">
                            <div className="flex items-center text-[#464c52] font-semibold mt-[20px] h-[50px] border-b">
                                <div className="w-[80px] pl-[10px]">날짜</div>
                                <div className="w-[100px]">학습 모드</div>
                                <div className="w-[120px]">레벨/단원</div>
                                <div className="w-[360px]">스테이지명</div>
                                <div className="w-[100px]">학습시간</div>
                                <div className="w-[80px]">등급</div>
                                <div className="w-[80px]">정확도</div>
                            </div>

                            {
                                learningData2 && Array.isArray(learningData2) && learningData2.length === 0 ? (
                                    <div className="flex items-center text-[#1b1d1f] h-[50px] pl-[10px]">
                                        해당 월은 학습하지 않았어요.
                                    </div>
                                ) : (
                                    <Fragment>
                                        {
                                            learningData2 && learningData2.slice(0, 16).map((value, index) => (
                                                <div key={index}>
                                                    <div className="flex items-center text-[#1b1d1f] h-[50px]">
                                                        <div className="w-[80px] pl-[10px]">{value.month}.{value.day}</div>
                                                        <div className="w-[100px]">{value.learningMode}</div>
                                                        <div className="w-[120px]">{value.level}레벨/{value.chapter}단원</div>
                                                        <div className="w-[360px] relative">
                                                            <div>{value.unitName && value.unitName.length > 22 ? value.unitName.substr(0, 22) + ".." : value.unitName}</div>
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

                        <div className="absolute bottom-[40px] left-0 w-full flex justify-between text-[16px] font-semibold text-[#464c52]">
                            <div className="w-[80px]">
                            </div>
                            <div>
                                {year}.{month}
                            </div>
                            <div className="w-[80px] text-right pr-[40px]">
                                7
                            </div>
                        </div>
                    </div>
                </div>

                {[...Array(numberOfLearningData)].map((num, index) => {
                    return (
                        <div key={index} className="mt-[60px] flex justify-center">
                            <div className="relative bg-[#ffffff] w-[1040px] h-[1400px] shadow-md rounded">
                                <div className="mt-[50px] flex px-[60px]">
                                    <div className="flex items-center">
                                        <div>
                                            <div className="w-[10px] h-[10px] rounded-full bg-[#0063ff]"></div>
                                        </div>
                                        <div className="flex text-[16px] font-semibold ml-[8px]">
                                            <span className="text-[#1b1d1f]">정확도</span>
                                            <span className="text-[#0063ff]">&nbsp;90% 이상은 파란색</span>
                                            <span className="text-[#1b1d1f]">입니다.</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center ml-[50px]">
                                        <div>
                                            <div className="w-[10px] h-[10px] rounded-full bg-[#d61313]"></div>
                                        </div>
                                        <div className="flex text-[16px] font-semibold ml-[8px]">
                                            <span className="text-[#1b1d1f]">정확도</span>
                                            <span className="text-[#d61313]">&nbsp;50% 이하는 빨간색</span>
                                            <span className="text-[#1b1d1f]">입니다.</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-[60px]">
                                    <div className="flex items-center text-[#464c52] font-semibold mt-[20px] h-[50px] border-b">
                                        <div className="w-[80px] pl-[10px]">날짜</div>
                                        <div className="w-[100px]">학습 모드</div>
                                        <div className="w-[120px]">레벨/단원</div>
                                        <div className="w-[360px]">스테이지명</div>
                                        <div className="w-[100px]">학습시간</div>
                                        <div className="w-[80px]">등급</div>
                                        <div className="w-[80px]">정확도</div>
                                    </div>
                                    <Fragment>
                                        {
                                            learningData3 && learningData3.slice(0 + (23 * index), 23 + (23 * index)).map((value, index) => (
                                                <div key={index}>
                                                    <div className="flex items-center text-[#1b1d1f] h-[50px]">
                                                        <div className="w-[80px] pl-[10px]">{value.month}.{value.day}</div>
                                                        <div className="w-[100px]">{value.learningMode}</div>
                                                        <div className="w-[120px]">{value.level}레벨/{value.chapter}단원</div>
                                                        <div className="w-[360px] relative">
                                                            <div>{value.unitName && value.unitName.length > 22 ? value.unitName.substr(0, 22) + ".." : value.unitName}</div>
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
                                </div>

                                <div className="absolute bottom-[40px] left-0 w-full flex justify-between text-[16px] font-semibold text-[#464c52]">
                                    <div className="w-[80px]">
                                    </div>
                                    <div>
                                        {year}.{month}
                                    </div>
                                    <div className="w-[80px] text-right pr-[40px]">
                                        {8 + index}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* 프린트 컨텐츠 시작 */}
            <div className={"opacity-0 h-0 overflow-hidden"} ref={monthlyReportContent}>
                <div className="flex justify-center">
                    <div className="bg-[#ffffff] w-[920px] h-[1300px]">
                        <div className="px-[40px] pt-[50px] h-[100px]">
                            <div className="text-[24px] text-[#72787f]">상위 1%가 선택한 연산앱 '일프로연산'</div>
                            <hr className="border-2 mt-[20px]" />
                        </div>
                        <div className="flex justify-center items-center h-[940px]">
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
                                <div className="text-[30px] text-[#464c52] mt-[110px]">
                                    {year}.{month}
                                </div>
                            </div>
                        </div>

                        <div className="h-[200px] flex justify-center items-center text-[220px] font-black text-[#edf4ff]">
                            1%MATH
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="relative bg-[#ffffff] w-[920px] h-[1300px]">
                        <div className="h-[20px]"></div>
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
                                                            <div className={value2.learningDate >= startDate && value2.learningDate < endDate ? "text-[#000000]" : "text-[#adb0b2]"}>
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

                        <div className="px-[60px] mt-[50px] text-[20px] text-[#464c52] font-bold">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                                <div className="ml-[8px]">
                                    {parseInt(month)}월 총 출석 일수는 {attendanceCount}일입니다.
                                </div>
                            </div>
                            <div className="flex items-center mt-[20px]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                                <div className="ml-[8px]">
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

                <div className="flex justify-center">
                    <div className="relative bg-[#ffffff] w-[920px] h-[1300px]">
                        <div className="h-[20px]"></div>
                        <div className="text-[32px] font-bold text-[#061b3b] text-center mt-[50px]">
                            평균 학습 현황
                        </div>
                        <div className="mt-[50px]">
                            <div className="px-[60px]">
                                <div className="text-right text-[#adb0b2] text-[16px]">
                                    * 출석한 날 기준 평균
                                </div>
                            </div>

                            <div className="mt-[20px]">
                                <div className="flex justify-center">
                                    <div className="flex w-[306px] justify-center">
                                        <div className="w-[100px] flex justify-center items-center">
                                            <img src={Learning} alt={"learning"} />
                                        </div>
                                        <div className="w-[146px] pl-[20px]">
                                            <div className="text-[#464c52] mt-[6px]">
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

                                    <div className="flex w-[306px] justify-center">
                                        <div className="w-[100px] flex justify-center items-center">
                                            <img src={Accuracy} alt={"accuracy"} />
                                        </div>
                                        <div className="w-[146px] pl-[20px]">
                                            <div className="text-[#464c52] mt-[6px]">
                                                정확도
                                            </div>
                                            <div className="mt-[10px]">
                                                <span className="text-[28px] font-semibold text-[#0063ff]">{averageAccuracy}</span>
                                                <span className="text-[20px] font-semibold text-[#0063ff] ml-[2px]">%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex w-[306px] justify-center">
                                        <div className="w-[100px] flex justify-center items-center">
                                            <img src={Time} alt={"time"} />
                                        </div>
                                        <div className="w-[146px] pl-[20px]">
                                            <div className="text-[#464c52] mt-[6px]">
                                                학습시간
                                            </div>
                                            <div className="mt-[10px]">
                                                <span className="text-[28px] font-semibold text-[#0063ff]">{mm(averageLearningTimeSeconds)}</span>
                                                {
                                                    mm(averageLearningTimeSeconds) !== "" ? (
                                                        <span className="text-[20px] font-semibold text-[#0063ff] ml-[2px]">분</span>
                                                    ) : (null)
                                                }
                                                <span className="text-[28px] font-semibold text-[#0063ff] ml-[4px]">{ss(averageLearningTimeSeconds)}</span>
                                                {
                                                    ss(averageLearningTimeSeconds) !== "" ? (
                                                        <span className="text-[20px] font-semibold text-[#0063ff] ml-[2px]">초</span>
                                                    ) : (null)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-[32px] font-bold text-[#061b3b] text-center mt-[50px]">
                            총 학습 현황
                        </div>
                        <div className="px-[60px] mt-[50px]">
                            <div className="flex border-t">
                                <div className="flex items-center w-[290px] h-[80px] text-[20px] text-[#464c52] font-bold pl-[40px]">학습량 (스테이지 개수)</div>
                                <div className="flex justify-end items-center w-[220px] h-[80px]">
                                    <div>
                                        <span className="text-[#0063ff] text-[42px]">{learningCount}</span>
                                        <span className="text-[#0063ff] text-[26px] ml-[6px]">개</span>
                                    </div>
                                </div>
                                <div className="flex justify-end items-center w-[410px] h-[80px] pr-[40px]">
                                    {
                                        preMonthComparisonLearningCount === 0 ? (
                                            <Fragment>
                                                <div className="text-[20px] text-[#5c5e60]">저번 달과 동일</div>
                                                <div className="ml-[14px]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#7e7e7e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </Fragment>
                                        ) : (
                                            preMonthComparisonLearningCount > 0 ? (
                                                <Fragment>
                                                    <div className="text-[20px] text-[#5c5e60]">+ 저번 달보다 {preMonthComparisonLearningCount}개 증가</div>
                                                    <div className="ml-[14px]">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#17b20e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                        </svg>
                                                    </div>
                                                </Fragment>
                                            ) : (
                                                <Fragment>
                                                    <div className="text-[20px] text-[#5c5e60]">- 저번 달보다 {Math.abs(preMonthComparisonLearningCount)}개 감소</div>
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

                            <div className="flex border-t">
                                <div className="flex items-center w-[290px] h-[80px] text-[20px] text-[#464c52] font-bold pl-[40px]">정확도</div>
                                <div className="flex justify-end items-center w-[220px] h-[80px]">
                                    <div>
                                        <span className="text-[#0063ff] text-[42px]">{averageAccuracy}</span>
                                        <span className="text-[#0063ff] text-[26px] ml-[6px]">%</span>
                                    </div>
                                </div>
                                <div className="flex justify-end items-center w-[410px] h-[80px] pr-[40px]">
                                    {
                                        preMonthComparisonAccuracy === 0 ? (
                                            <Fragment>
                                                <div className="text-[20px] text-[#5c5e60]">저번 달과 동일</div>
                                                <div className="ml-[14px]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#7e7e7e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </Fragment>
                                        ) : (
                                            preMonthComparisonAccuracy > 0 ? (
                                                <Fragment>
                                                    <div className="text-[20px] text-[#5c5e60]">+ 저번 달보다 {preMonthComparisonAccuracy}% 증가</div>
                                                    <div className="ml-[14px]">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#17b20e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                        </svg>
                                                    </div>
                                                </Fragment>
                                            ) : (
                                                <Fragment>
                                                    <div className="text-[20px] text-[#5c5e60]">- 저번 달보다 {Math.abs(preMonthComparisonAccuracy)}% 감소</div>
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

                            <div className="flex border-t">
                                <div className="flex items-center w-[290px] h-[80px] text-[20px] text-[#464c52] font-bold pl-[40px]">학습시간</div>
                                <div className="flex justify-end items-center w-[220px] h-[80px]">
                                    <div>

                                        <span className="text-[#0063ff] text-[42px]">{mm(learningTimeSeconds)}</span>
                                        <span className="text-[#0063ff] text-[26px] ml-[6px]">분</span>


                                        {
                                            ss(learningTimeSeconds) !== "" ? (
                                                <Fragment>

                                                    <span className="text-[#0063ff] text-[42px] ml-[8px]">{ss(learningTimeSeconds)}</span>
                                                    <span className="text-[#0063ff] text-[26px] ml-[6px]">초</span>
                                                </Fragment>
                                            ) : (null)
                                        }

                                    </div>
                                </div>
                                <div className="flex justify-end items-center w-[410px] h-[80px] pr-[40px]">
                                    {
                                        preMonthComparisonLearningTimeSeconds === 0 ? (
                                            <Fragment>
                                                <div className="text-[20px] text-[#5c5e60]">저번 달과 동일</div>
                                                <div className="ml-[14px]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#7e7e7e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </Fragment>
                                        ) : (
                                            preMonthComparisonLearningTimeSeconds > 0 ? (
                                                <Fragment>
                                                    <div className="text-[20px] text-[#5c5e60]">+ 저번 달보다 {mm2(Math.abs(preMonthComparisonLearningTimeSeconds))} {ss2(Math.abs(preMonthComparisonLearningTimeSeconds))} 증가</div>
                                                    <div className="ml-[14px]">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#17b20e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                        </svg>
                                                    </div>
                                                </Fragment>
                                            ) : (
                                                <Fragment>
                                                    <div className="text-[20px] text-[#5c5e60]">- 저번 달보다 {mm2(Math.abs(preMonthComparisonLearningTimeSeconds))} {ss2(Math.abs(preMonthComparisonLearningTimeSeconds))} 감소</div>
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

                            <div className="flex border-t border-b">
                                <div className="flex items-center w-[290px] h-[80px] text-[20px] text-[#464c52] font-bold pl-[40px]">문제 개수</div>
                                <div className="flex justify-end items-center w-[220px] h-[80px]">
                                    <div>

                                        <span className="text-[#0063ff] text-[42px]">{problemCount}</span>
                                        <span className="text-[#0063ff] text-[26px] ml-[6px]">개</span>

                                    </div>
                                </div>
                                <div className="flex justify-end items-center w-[410px] h-[80px] pr-[40px]">
                                    {
                                        preMonthComparisonProblemCount === 0 ? (
                                            <Fragment>
                                                <div className="text-[20px] text-[#5c5e60]">저번 달과 동일</div>
                                                <div className="ml-[14px]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#7e7e7e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </Fragment>
                                        ) : (
                                            preMonthComparisonProblemCount > 0 ? (
                                                <Fragment>
                                                    <div className="text-[20px] text-[#5c5e60]">+ 저번 달보다 {preMonthComparisonProblemCount}개 증가</div>
                                                    <div className="ml-[14px]">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#17b20e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                        </svg>
                                                    </div>
                                                </Fragment>
                                            ) : (
                                                <Fragment>
                                                    <div className="text-[20px] text-[#5c5e60]">- 저번 달보다 {Math.abs(preMonthComparisonProblemCount)}개 감소</div>
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

                        <div className="mt-[50px] flex justify-center">
                            <div>
                                <div className="flex justify-center items-center">
                                    <div className="flex items-center w-[200px] pl-[10px]">
                                        <div className="w-[0.625rem] h-[0.625rem] bg-[#558fe8] rounded-full"></div>
                                        <div className={topLearningMode === 1 ? "text-[#d61313] ml-[8px]" : "ml-[8px]"}>
                                            <span>오늘의 학습</span>
                                        </div>
                                    </div>
                                    <div className={topLearningMode === 1 ? "text-[#d61313] w-[100px]" : "w-[100px]"}>
                                        <span>
                                            {dailyModePercent}%
                                        </span>
                                    </div>
                                    <div className="w-[500px] pr-[10px]">
                                        <div className="overflow-hidden">
                                            <div className="relative w-full bg-[#e8e9ea] rounded-full h-[30px]">
                                                <div className="absolute w-full h-[30px] rounded-full shadow-[0_0_0_30px_#ffffff]"></div>
                                                <div className={"bg-[#558fe8] h-[30px]"} style={{ width: dailyModePercent + "%" }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center items-center mt-[30px]">
                                    <div className="flex items-center w-[200px] pl-[10px]">
                                        <div className="w-[0.625rem] h-[0.625rem] bg-[#fac232] rounded-full"></div>
                                        <div className={topLearningMode === 2 ? "text-[#d61313] ml-[8px]" : "ml-[8px]"}>
                                            <span>자유 학습</span>
                                        </div>
                                    </div>
                                    <div className={topLearningMode === 2 ? "text-[#d61313] w-[100px]" : "w-[100px]"}>
                                        <span>
                                            {freeModePercent}%
                                        </span>
                                    </div>
                                    <div className="w-[500px] pr-[10px]">
                                        <div className="overflow-hidden">
                                            <div className="relative w-full bg-[#e8e9ea] rounded-full h-[30px]">
                                                <div className="absolute w-full h-[30px] rounded-full shadow-[0_0_0_30px_#ffffff]"></div>
                                                <div className={"bg-[#fac232] h-[30px]"} style={{ width: freeModePercent + "%" }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center items-center mt-[30px]">
                                    <div className="flex items-center w-[200px] pl-[10px]">
                                        <div className="w-[0.625rem] h-[0.625rem] bg-[#f67b70] rounded-full"></div>
                                        <div className={topLearningMode === 3 ? "text-[#d61313] ml-[8px]" : "ml-[8px]"}>
                                            <span>일프로 도전</span>
                                        </div>
                                    </div>
                                    <div className={topLearningMode === 3 ? "text-[#d61313] w-[100px]" : "w-[100px]"}>
                                        <span>
                                            {oneproModePercent}%
                                        </span>
                                    </div>
                                    <div className="w-[500px] pr-[10px]">
                                        <div className="overflow-hidden">
                                            <div className="relative w-full bg-[#e8e9ea] rounded-full h-[30px]">
                                                <div className="absolute w-full h-[30px] rounded-full shadow-[0_0_0_30px_#ffffff]"></div>
                                                <div className={"bg-[#f67b70] h-[30px]"} style={{ width: oneproModePercent + "%" }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center items-center mt-[30px]">
                                    <div className="flex items-center w-[200px] pl-[10px]">
                                        <div className="w-[0.625rem] h-[0.625rem] bg-[#3bc7b9] rounded-full"></div>
                                        <div className={topLearningMode === 4 ? "text-[#d61313] ml-[8px]" : "ml-[8px]"}>
                                            <span>연산 월드</span>
                                        </div>
                                    </div>
                                    <div className={topLearningMode === 4 ? "text-[#d61313] w-[100px]" : "w-[100px]"}>
                                        <span>
                                            {worldModePercent}%
                                        </span>
                                    </div>
                                    <div className="w-[500px] pr-[10px]">
                                        <div className="overflow-hidden">
                                            <div className="relative w-full bg-[#e8e9ea] rounded-full h-[30px]">
                                                <div className="absolute w-full h-[30px] rounded-full shadow-[0_0_0_30px_#ffffff]"></div>
                                                <div className={"bg-[#3bc7b9] h-[30px]"} style={{ width: worldModePercent + "%" }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-[60px] mt-[50px] text-[20px] text-[#464c52] font-bold">
                            {
                                topLearningMode !== 0 ? (
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                        <div className="ml-[8px]">
                                            {parseInt(month)}월에 가장 많이 한 학습 모드는 [{learningModeKo[topLearningMode - 1]}]입니다.
                                        </div>
                                    </div>
                                ) : (null)
                            }
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

                <div className="flex justify-center">
                    <div className="relative bg-[#ffffff] w-[920px] h-[1300px]">
                        <div className="h-[20px]"></div>
                        <div className="text-[32px] font-bold text-[#061b3b] text-center mt-[50px]">
                            월별 학습 결과 비교
                        </div>
                        <div className="text-[#464c52] text-center mt-[20px]">
                            4개월 평균 학습 결과를 비교한 그래프입니다.
                        </div>

                        <div className="text-[20px] font-bold text-[#061b3b] mt-[50px] px-[60px]">
                            학습량 (스테이지 개수)
                        </div>

                        <div className="flex justify-center items-center mt-[20px]">
                            <div style={{ width: "900px", height: "260px" }}>
                                <ResponsiveBar
                                    data={monthlyLearningData2}
                                    keys={['learningCount']}
                                    indexBy="date"
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
                                                <tspan fontSize="18px" fill="#1b1d1f">{thisDate.getMonth() + 1}월</tspan>
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
                                    padding={0.8}
                                    colors={['#6e72f7']}
                                    colorBy="id"
                                    label={(e) => {
                                        return (
                                            <tspan y="-14" fontSize="16px" fill={e.value === maxLearningCount ? "#0063ff" : "#72787f"} fontWeight="700">{e.value}</tspan>
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

                        <div className="text-[20px] font-bold text-[#061b3b] mt-[50px] px-[60px]">
                            정확도
                        </div>

                        <div className="flex justify-center items-center mt-[20px]">
                            <div style={{ width: "900px", height: "260px" }}>
                                <ResponsiveBar
                                    data={monthlyLearningData2}
                                    keys={['accuracy']}
                                    indexBy="date"
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
                                                <tspan fontSize="18px" fill="#1b1d1f">{thisDate.getMonth() + 1}월</tspan>
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
                                    padding={0.8}
                                    colors={['#33cee6']}
                                    colorBy="id"
                                    label={(e) => {
                                        return (
                                            <tspan y="-14" fontSize="16px" fill={e.value === maxAccuracy ? "#0063ff" : "#72787f"} fontWeight="700">{e.value}</tspan>
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

                        <div className="text-[20px] font-bold text-[#061b3b] mt-[50px] px-[60px]">
                            학습시간
                        </div>

                        <div className="flex justify-center items-center mt-[20px]">
                            <div style={{ width: "900px", height: "260px" }}>
                                <ResponsiveBar
                                    data={monthlyLearningData2}
                                    keys={['learningTimeMinutes']}
                                    indexBy="date"
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
                                                <tspan fontSize="18px" fill="#1b1d1f">{thisDate.getMonth() + 1}월</tspan>
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
                                    padding={0.8}
                                    colors={['#b468ff']}
                                    colorBy="id"
                                    label={(e) => {
                                        return (
                                            <tspan y="-14" fontSize="16px" fill={e.value === maxLearningTimeMinutes ? "#0063ff" : "#72787f"} fontWeight="700">{e.value}</tspan>
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

                <div className="flex justify-center">
                    <div className="relative bg-[#ffffff] w-[920px] h-[1300px]">
                        <div className="h-[20px]"></div>
                        <div className="text-[32px] font-bold text-[#061b3b] text-center mt-[50px]">
                            주별 학습 결과 그래프
                        </div>
                        <div className="text-[18px] text-[#464c52] text-center mt-[20px]">
                            {weekStartDate} ~ {weekEndDate}
                        </div>

                        <div className="text-[20px] font-bold text-[#061b3b] mt-[50px] px-[60px]">
                            학습량 (스테이지 개수)
                        </div>

                        <div className="flex justify-center items-center mt-[20px]">
                            <div style={{ width: "900px", height: "260px" }}>
                                <ResponsiveBar
                                    data={weeklyLearningData2}
                                    keys={['learningCount']}
                                    indexBy="date"
                                    margin={{ top: 30, right: 30, bottom: 40, left: 50 }}
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={{
                                        tickSize: 0,
                                        tickPadding: 10,
                                        tickRotation: 0,
                                        format: (e) => {
                                            let startDate = new Date(e);
                                            let endDate = new Date(startDate);
                                            endDate.setDate(endDate.getDate() + 6);
                                            return (
                                                <tspan fontSize="18px" fill="#1b1d1f">{startDate.getDate()}일-{endDate.getDate()}일</tspan>
                                            )
                                        }
                                    }}
                                    axisLeft={{
                                        tickSize: 0,
                                        tickPadding: 10,
                                        tickRotation: 0,
                                        tickValues: (weeklyMaxLearningCount <= 6 ? weeklyMaxLearningCount : 6),
                                        format: e => Math.floor(e) === e && `${e}개`
                                    }}
                                    groupMode={"grouped"}
                                    theme={{
                                        fontSize: "16px",
                                        textColor: "#999c9f"
                                    }}
                                    borderRadius={3}
                                    padding={0.8}
                                    colors={['#ff7d7d']}
                                    colorBy="id"
                                    label={(e) => {
                                        return (
                                            <tspan y="-14" fontSize="16px" fill={e.value === weeklyMaxLearningCount ? "#0063ff" : "#72787f"} fontWeight="700">{e.value}</tspan>
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
                                    maxValue={weeklyMaxLearningCount <= 6 ? weeklyMaxLearningCount : "auto"}
                                    gridYValues={weeklyMaxLearningCount <= 6 ? weeklyMaxLearningCount : 6}
                                />
                            </div>
                        </div>

                        <div className="text-[20px] font-bold text-[#061b3b] mt-[50px] px-[60px]">
                            정확도
                        </div>

                        <div className="flex justify-center items-center mt-[20px]">
                            <div style={{ width: "900px", height: "260px" }}>
                                <ResponsiveBar
                                    data={weeklyLearningData2}
                                    keys={['accuracy']}
                                    indexBy="date"
                                    margin={{ top: 30, right: 30, bottom: 40, left: 50 }}
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={{
                                        tickSize: 0,
                                        tickPadding: 10,
                                        tickRotation: 0,
                                        format: (e) => {
                                            let startDate = new Date(e);
                                            let endDate = new Date(startDate);
                                            endDate.setDate(endDate.getDate() + 6);
                                            return (
                                                <tspan fontSize="18px" fill="#1b1d1f">{startDate.getDate()}일-{endDate.getDate()}일</tspan>
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
                                    padding={0.8}
                                    colors={['#ff9957']}
                                    colorBy="id"
                                    label={(e) => {
                                        return (
                                            <tspan y="-14" fontSize="16px" fill={e.value === weeklyMaxAccuracy ? "#0063ff" : "#72787f"} fontWeight="700">{e.value}</tspan>
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

                        <div className="text-[20px] font-bold text-[#061b3b] mt-[50px] px-[60px]">
                            학습시간
                        </div>

                        <div className="flex justify-center items-center mt-[20px]">
                            <div style={{ width: "900px", height: "260px" }}>
                                <ResponsiveBar
                                    data={weeklyLearningData2}
                                    keys={['learningTimeMinutes']}
                                    indexBy="date"
                                    margin={{ top: 30, right: 30, bottom: 40, left: 50 }}
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={{
                                        tickSize: 0,
                                        tickPadding: 10,
                                        tickRotation: 0,
                                        format: (e) => {
                                            let startDate = new Date(e);
                                            let endDate = new Date(startDate);
                                            endDate.setDate(endDate.getDate() + 6);
                                            return (
                                                <tspan fontSize="18px" fill="#1b1d1f">{startDate.getDate()}일-{endDate.getDate()}일</tspan>
                                            )
                                        }
                                    }}
                                    axisLeft={{
                                        tickSize: 0,
                                        tickPadding: 10,
                                        tickRotation: 0,
                                        tickValues: (weeklyMaxLearningTimeMinutes <= 6 ? weeklyMaxLearningTimeMinutes : 6),
                                        format: e => Math.floor(e) === e && `${e}분`
                                    }}
                                    groupMode={"grouped"}
                                    theme={{
                                        fontSize: "16px",
                                        textColor: "#999c9f"
                                    }}
                                    borderRadius={3}
                                    padding={0.8}
                                    colors={['#ffcd4e']}
                                    colorBy="id"
                                    label={(e) => {
                                        return (
                                            <tspan y="-14" fontSize="16px" fill={e.value === weeklyMaxLearningTimeMinutes ? "#0063ff" : "#72787f"} fontWeight="700">{e.value}</tspan>
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
                                    maxValue={weeklyMaxLearningTimeMinutes <= 6 ? weeklyMaxLearningTimeMinutes : "auto"}
                                    gridYValues={weeklyMaxLearningTimeMinutes <= 6 ? weeklyMaxLearningTimeMinutes : 6}
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
                                4
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="relative bg-[#ffffff] w-[920px] h-[1300px]">
                        <div className="h-[20px]"></div>
                        <div className="text-[32px] font-bold text-[#061b3b] text-center mt-[50px]">
                            학습 레벨/단원 분석
                        </div>

                        <div className="px-[60px] mt-[50px] text-[20px] text-[#464c52] font-bold">
                            {
                                maxLevel > 0 ? (
                                    <Fragment>
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                            <div className="ml-[8px]">
                                                {month}월에 가장 많이 학습한 레벨은 [{maxLevel}레벨]입니다.
                                            </div>
                                        </div>
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                            <div className="ml-[8px]">
                                                {month}월에는 학습하지 않았어요.
                                            </div>
                                        </div>
                                    </Fragment>
                                )
                            }
                        </div>

                        <div className="mt-[20px]">
                            <div className="flex justify-center items-center">
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
                                <div className="w-[600px] h-[320px] pl-[20px]">
                                    {
                                        maxLevel > 0 ? (
                                            <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "column", height: "320px" }}>
                                                {
                                                    levelData2 && levelData2.map((value, index) => (
                                                        <div key={index} style={{ display: "flex", alignItems: "center", fontSize: "18px", color: value.id === maxLevel ? "#0063ff" : "#464c52", width: "290px", height: "53px" }}>
                                                            <div className="w-[10px] flex justify-center items-center">
                                                                <div style={{ width: "10px", height: "10px", borderRadius: "25px", background: value.color }}></div>
                                                            </div>
                                                            <div style={{ width: "120px", paddingLeft: "10px" }}>{value.id}레벨</div>
                                                            <div style={{ width: "90px" }}>{value.percent}%</div>
                                                            <div style={{ width: "70px" }}>{value.value}개</div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        ) : (
                                            <div style={{ fontSize: "20px" }}>
                                                해당 월은 학습하지 않았어요.
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="px-[60px] mt-[50px] text-[20px] text-[#464c52] font-bold">
                            {
                                levelAndChapterMaxLevel > 0 ? (
                                    <Fragment>
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                            <div className="ml-[8px]">
                                                {month}월에 가장 많이 학습한 단원은 {levelAndChapterMaxLevel}레벨 [{levelAndChapterMaxChapterName}]입니다.
                                            </div>
                                        </div>
                                    </Fragment>
                                ) : (
                                    <Fragment>

                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                            <div className="ml-[8px]">
                                                {month}월에는 학습하지 않았어요.
                                            </div>
                                        </div>

                                    </Fragment>
                                )
                            }
                        </div>

                        <div className="mt-[20px]">
                            <div className="flex justify-center">
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
                                <div className="w-[600px] h-[700px] pl-[20px]">
                                    {
                                        levelAndChapterMaxLevel > 0 ? (
                                            <div>
                                                <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "column" }}>
                                                    {
                                                        levelAndChapterData2 && levelAndChapterData2.length > 12 ? (
                                                            <Fragment>
                                                                {
                                                                    levelAndChapterData2 && levelAndChapterData2.slice(0, 12).map((value, index) => (
                                                                        <div key={index} style={{ height: "44px", display: "flex", alignItems: "center", color: value.level === levelAndChapterMaxLevel && value.chapter === levelAndChapterMaxChapter ? "#0063ff" : "#464c52" }}>
                                                                            <div className="w-[10px] flex justify-center items-center">
                                                                                <div style={{ width: "10px", height: "10px", borderRadius: "25px", background: value.color }}></div>
                                                                            </div>
                                                                            <div className="w-[430px] pl-[10px] relative">
                                                                                <div>{value.level}레벨 {value.chapter}단원 [{value.chapterName && value.chapterName.length > 21 ? value.chapterName.substr(0, 21) + ".." : value.chapterName}]</div>
                                                                                <div className="absolute top-0 left-[10px] w-[430px] h-[28px] opacity-0 hover:opacity-100">
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
                                                                <div className="flex justify-center items-center h-[44px]">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                                    </svg>
                                                                </div>
                                                            </Fragment>
                                                        ) : (
                                                            levelAndChapterData2 && levelAndChapterData2.map((value, index) => (
                                                                <div key={index} style={{ height: "44px", display: "flex", alignItems: "center", color: value.level === levelAndChapterMaxLevel && value.chapter === levelAndChapterMaxChapter ? "#0063ff" : "#464c52" }}>
                                                                    <div className="w-[10px] flex justify-center items-center">
                                                                        <div style={{ width: "10px", height: "10px", borderRadius: "25px", background: value.color }}></div>
                                                                    </div>
                                                                    <div className="w-[430px] pl-[10px] relative">
                                                                        <div>{value.level}레벨 {value.chapter}단원 [{value.chapterName && value.chapterName.length > 21 ? value.chapterName.substr(0, 21) + ".." : value.chapterName}]</div>
                                                                        <div className="absolute top-0 left-[10px] w-[430px] h-[28px] opacity-0 hover:opacity-100">
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
                                        ) : (
                                            <div style={{ fontSize: "20px" }}>
                                                해당 월은 학습하지 않았어요.
                                            </div>
                                        )
                                    }
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
                                5
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="relative bg-[#ffffff] w-[920px] h-[1300px]">
                        <div className="h-[20px]"></div>
                        <div className="text-[32px] font-bold text-[#061b3b] text-center mt-[50px]">
                            우수/취약 스테이지
                        </div>

                        <div className="mt-[50px] h-[400px] px-[60px]">
                            <div className="text-[24px] text-[#061b3b] font-bold">
                                우수 스테이지
                            </div>
                            <div className="flex mt-[20px] items-center">
                                <div>
                                    <img src={GoodBadge} alt={"goodBadge"} />
                                </div>
                                <div className="text-[#616161] font-bold ml-[10px]">칭찬해 주세요!</div>
                            </div>

                            <div className="flex justify-center items-center border-t border-b h-[50px] mt-[20px] text-[#464c52] font-semibold">
                                <div className="w-[90px] pl-[10px]">번호</div>
                                <div className="w-[100px]">날짜</div>
                                <div className="w-[120px]">레벨/단원</div>
                                <div className="w-[430px]">스테이지</div>
                                <div className="w-[80px]">등급</div>
                                <div className="w-[100px]">정확도</div>
                            </div>
                            {
                                excellentLearningData && Array.isArray(excellentLearningData) && excellentLearningData.length === 0 ? (
                                    <div className="flex items-center h-[50px] text-[#1b1d1f] pl-[10px]">
                                        우수 스테이지가 없어요.
                                    </div>
                                ) : (
                                    excellentLearningData && excellentLearningData.slice(0, 5).map((value, index) => (
                                        <div key={index}>
                                            <div className="flex justify-center items-center h-[50px] text-[#1b1d1f]">
                                                <div className="w-[90px] pl-[10px]">{index + 1}</div>
                                                <div className="w-[100px]">{parseInt(value.month)}월 {parseInt(value.day)}일</div>
                                                <div className="w-[120px]">{value.level}레벨/{value.chapter}단원</div>
                                                <div className="w-[430px]">{value.unitName}</div>
                                                <div className="w-[80px]">
                                                    {
                                                        value.grade === 1 ? (
                                                            <span className="text-[#0063ff]">{value.grade}%</span>
                                                        ) : (
                                                            <span>{value.grade}%</span>
                                                        )
                                                    }
                                                </div>
                                                <div className="w-[100px]">{value.accuracy}%</div>
                                            </div>
                                        </div>
                                    ))
                                )
                            }
                        </div>

                        <div className="mt-[50px] h-[400px] px-[60px]">
                            <div className="text-[24px] text-[#061b3b] font-bold">
                                취약 스테이지
                            </div>

                            <div className="flex mt-[20px] items-center">
                                <div>
                                    <img src={BadBadge} alt={"badBadge"} />
                                </div>
                                <div className="text-[#616161] font-bold ml-[10px]">어려워 하고 있어요!</div>
                            </div>

                            <div className="flex justify-center items-center border-t border-b h-[50px] mt-[20px] text-[#464c52] font-semibold">
                                <div className="w-[100px] pl-[10px]">번호</div>
                                <div className="w-[110px]">날짜</div>
                                <div className="w-[130px]">레벨/단원</div>
                                <div className="w-[490px]">스테이지</div>
                                <div className="w-[110px]">정확도</div>
                            </div>
                            {
                                weekLearningData && Array.isArray(weekLearningData) && weekLearningData.length === 0 ? (
                                    <div className="flex items-center h-[50px] text-[#1b1d1f] pl-[10px]">
                                        취약 스테이지가 없어요.
                                    </div>
                                ) : (
                                    weekLearningData && weekLearningData.slice(0, 5).map((value, index) => (
                                        <div key={index}>
                                            <div className="flex justify-center items-center h-[50px] text-[#1b1d1f]">
                                                <div className="w-[100px] pl-[10px]">{index + 1}</div>
                                                <div className="w-[110px]">{parseInt(value.month)}월 {parseInt(value.day)}일</div>
                                                <div className="w-[130px]">{value.level}레벨/{value.chapter}단원</div>
                                                <div className="w-[490px]">{value.unitName}</div>
                                                <div className="w-[110px]">{value.accuracy}%</div>
                                            </div>
                                        </div>
                                    ))
                                )
                            }
                        </div>

                        <div className="absolute bottom-[40px] left-0 w-full flex justify-between text-[16px] font-semibold text-[#464c52]">
                            <div className="w-[80px]">
                            </div>
                            <div>
                                {year}.{month}
                            </div>
                            <div className="w-[80px] text-right pr-[40px]">
                                6
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="relative bg-[#ffffff] w-[920px] h-[1300px]">
                        <div className="h-[20px]"></div>
                        <div className="text-[32px] font-bold text-[#061b3b] text-center mt-[50px]">
                            상세 학습 결과
                        </div>

                        <div className="mt-[50px] px-[60px]">
                            <div className="text-[24px] text-[#061b3b] font-bold">
                                {month}월 등급 메달
                            </div>
                        </div>


                        <div className="flex justify-between mt-[20px] text-[20px] text-[#464c52] font-semibold px-[60px]">
                            <div>
                                <div className="h-[100px] flex items-center">
                                    <img src={OnePercentTrophy} alt={"onePercentTrophy"} />
                                </div>
                                <div className="text-center mt-[20px]">{onePercentTrophy}개</div>
                            </div>
                            <div>
                                <div className="h-[100px] flex items-center">
                                    <img src={TenPercentTrophy} alt={"tenPercentTrophy"} />
                                </div>
                                <div className="text-center mt-[20px]">{tenPercentTrophy}개</div>
                            </div>
                            <div>
                                <div className="h-[100px] flex items-center">
                                    <img src={ThirtyPercentTrophy} alt={"thirtyPercentTrophy"} />
                                </div>
                                <div className="text-center mt-[20px]">{thirtyPercentTrophy}개</div>
                            </div>
                            <div>
                                <div className="h-[100px] flex items-center">
                                    <img src={FiftyPercentTrophy} alt={"fiftyPercentTrophy"} />
                                </div>
                                <div className="text-center mt-[20px]">{fiftyPercentTrophy}개</div>
                            </div>
                            <div>
                                <div className="h-[100px] flex items-center">
                                    <img src={GoodTrophy} alt={"goodTrophy"} />
                                </div>
                                <div className="text-center mt-[20px]">{goodTrophy}개</div>
                            </div>
                        </div>


                        <div className="mt-[50px] flex px-[60px]">
                            <div className="flex items-center">
                                <div>
                                    <div className="w-[10px] h-[10px] rounded-full bg-[#0063ff]"></div>
                                </div>
                                <div className="flex text-[16px] font-semibold ml-[8px]">
                                    <span className="text-[#1b1d1f]">정확도</span>
                                    <span className="text-[#0063ff]">&nbsp;90% 이상은 파란색</span>
                                    <span className="text-[#1b1d1f]">입니다.</span>
                                </div>
                            </div>

                            <div className="flex items-center ml-[50px]">
                                <div>
                                    <div className="w-[10px] h-[10px] rounded-full bg-[#d61313]"></div>
                                </div>
                                <div className="flex text-[16px] font-semibold ml-[8px]">
                                    <span className="text-[#1b1d1f]">정확도</span>
                                    <span className="text-[#d61313]">&nbsp;50% 이하는 빨간색</span>
                                    <span className="text-[#1b1d1f]">입니다.</span>
                                </div>
                            </div>
                        </div>

                        <div className="px-[60px]">
                            <div className="flex items-center text-[#464c52] font-semibold mt-[20px] h-[50px] border-b">
                                <div className="w-[80px] pl-[10px]">날짜</div>
                                <div className="w-[100px]">학습 모드</div>
                                <div className="w-[120px]">레벨/단원</div>
                                <div className="w-[360px]">스테이지명</div>
                                <div className="w-[100px]">학습시간</div>
                                <div className="w-[80px]">등급</div>
                                <div className="w-[80px]">정확도</div>
                            </div>

                            {
                                learningData2 && Array.isArray(learningData2) && learningData2.length === 0 ? (
                                    <div className="flex items-center text-[#1b1d1f] h-[40px] pl-[10px]">
                                        해당 월은 학습하지 않았어요.
                                    </div>
                                ) : (
                                    <Fragment>
                                        {
                                            learningData2 && learningData2.slice(0, 16).map((value, index) => (
                                                <div key={index}>
                                                    <div className="flex items-center text-[#1b1d1f] h-[44px]">
                                                        <div className="w-[80px] pl-[10px]">{value.month}.{value.day}</div>
                                                        <div className="w-[100px]">{value.learningMode}</div>
                                                        <div className="w-[120px]">{value.level}레벨/{value.chapter}단원</div>
                                                        <div className="w-[360px] relative">
                                                            <div>{value.unitName && value.unitName.length > 22 ? value.unitName.substr(0, 22) + ".." : value.unitName}</div>
                                                            <div className="absolute top-0 left-0 w-[360px] h-[44px] opacity-0 hover:opacity-100">
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

                        <div className="absolute bottom-[40px] left-0 w-full flex justify-between text-[16px] font-semibold text-[#464c52]">
                            <div className="w-[80px]">
                            </div>
                            <div>
                                {year}.{month}
                            </div>
                            <div className="w-[80px] text-right pr-[40px]">
                                7
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative w-[920px] h-[1300px]">
                    {[...Array(numberOfLearningData)].map((num, index) => {
                        return (
                            <div key={index} className="flex justify-center">
                                <div className="relative bg-[#ffffff] w-[920px] h-[1300px]">
                                    <div className="h-[20px]"></div>
                                    <div className="mt-[50px] flex px-[60px]">
                                        <div className="flex items-center">
                                            <div>
                                                <div className="w-[10px] h-[10px] rounded-full bg-[#0063ff]"></div>
                                            </div>
                                            <div className="flex text-[16px] font-semibold ml-[8px]">
                                                <span className="text-[#1b1d1f]">정확도</span>
                                                <span className="text-[#0063ff]">&nbsp;90% 이상은 파란색</span>
                                                <span className="text-[#1b1d1f]">입니다.</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center ml-[50px]">
                                            <div>
                                                <div className="w-[10px] h-[10px] rounded-full bg-[#d61313]"></div>
                                            </div>
                                            <div className="flex text-[16px] font-semibold ml-[8px]">
                                                <span className="text-[#1b1d1f]">정확도</span>
                                                <span className="text-[#d61313]">&nbsp;50% 이하는 빨간색</span>
                                                <span className="text-[#1b1d1f]">입니다.</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-[60px]">
                                        <div className="flex items-center text-[#464c52] font-semibold mt-[20px] h-[50px] border-b">
                                            <div className="w-[80px] pl-[10px]">날짜</div>
                                            <div className="w-[100px]">학습 모드</div>
                                            <div className="w-[120px]">레벨/단원</div>
                                            <div className="w-[360px]">스테이지명</div>
                                            <div className="w-[100px]">학습시간</div>
                                            <div className="w-[80px]">등급</div>
                                            <div className="w-[80px]">정확도</div>
                                        </div>
                                        <Fragment>
                                            {
                                                learningData3 && learningData3.slice(0 + (23 * index), 23 + (23 * index)).map((value, index) => (
                                                    <div key={index}>
                                                        <div className="flex items-center text-[#1b1d1f] h-[44px]">
                                                            <div className="w-[80px] pl-[10px]">{value.month}.{value.day}</div>
                                                            <div className="w-[100px]">{value.learningMode}</div>
                                                            <div className="w-[120px]">{value.level}레벨/{value.chapter}단원</div>
                                                            <div className="w-[360px] relative">
                                                                <div>{value.unitName && value.unitName.length > 22 ? value.unitName.substr(0, 22) + ".." : value.unitName}</div>
                                                                <div className="absolute top-0 left-0 w-[360px] h-[44px] opacity-0 hover:opacity-100">
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
                                    </div>

                                    <div className="absolute bottom-[40px] left-0 w-full flex justify-between text-[16px] font-semibold text-[#464c52]">
                                        <div className="w-[80px]">
                                        </div>
                                        <div>
                                            {year}.{month}
                                        </div>
                                        <div className="w-[80px] text-right pr-[40px]">
                                            {8 + index}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            {/* 프린트 컨텐츠 종료 */}
        </div>
    )
}

export default MonthlyLearning;