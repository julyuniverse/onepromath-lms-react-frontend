/*
* width < 1024px
font-size:
    기본: 12px
    제목: 14px
    부제목: 13px
    헬프: 11px
각 페이지
넓이: auto
높이: 800px
페이지 상단과 제목 간의 공백: 20px
제목과 컨텐츠 간의 공백: 20px
페이지 내의 컨텐츠 간의 공백: 20px
컨텐츠 내의 내용 간의 공백: 20px
*/

import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { accountInfo, accountInfo2, calendar, learningData, levelAndChapterData, levelData, monthlyLearningData, weeklyLearningData } from "../../api/axios";
import Logo from "../../assets/images/logo.png";
import Learning from "../../assets/images/learning.png";
import Accuracy from "../../assets/images/accuracy.png";
import Time from "../../assets/images/time.png";
import { ResponsiveBar } from '@nivo/bar'; // nivo bar chart api
import { ResponsivePie } from '@nivo/pie'; // nivo pie chart api
import ScrollToTopButton from "../../components/ScrollToTopButton";
import OnePercentTrophy from "../../assets/images/onePercentTrophy.png";
import TenPercentTrophy from "../../assets/images/tenPercentTrophy.png";
import ThirtyPercentTrophy from "../../assets/images/thirtyPercentTrophy.png";
import FiftyPercentTrophy from "../../assets/images/fiftyPercentTrophy.png";
import GoodTrophy from "../../assets/images/goodTrophy.png";
import GoodBadge from "../../assets/images/goodBadge.png";
import BadBadge from "../../assets/images/badBadge.png";
import ClassicSpinnerLoader from "../../components/ClassicSpinnerLoader";
import { decode, encode } from "../../components/Crypto";

const MonthlyReport = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const [isEmpty, setIsEmpty] = useState(true); // 파라미터가 비어 있는지
    const [isError, setIsError] = useState(true); // 페이지를 열 수 없을 때
    const [errorMessage, setErrorMessage] = useState(""); // 페이지를 열 수 없는 이유의 메시지
    const [profileNo, setProfileNo] = useState(0);
    const [userType, setUserType] = useState(0);
    const [profiles, setProfiles] = useState([]);
    const [profile, setProfile] = useState([]);
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

    const checkUser = async () => {
        let objLength = Object.keys(params).length; // 파라미터 체크

        if (objLength !== 0) {
            setIsEmpty(false);
            let userNo = decode(decodeURIComponent(params.userno));
            let profileNo = decode(decodeURIComponent(params.profileno));

            setProfileNo(profileNo);

            // 유저 타입
            if (params.usertype === "21") { // 유료 계정
                setUserType(21);

                let accountInfo = await getAccountInfo(userNo);

                if (accountInfo.useStatus === 0) { // 사용 가능한 계정이 아니라면
                    setErrorMessage("사용할 수 없는 계정입니다.\n다시 한번 확인해 주세요.");
                } else {
                    if (accountInfo.paidAccountStatus === 0) { // 결제 계정이 아니라면
                        setErrorMessage("아직 결제하지 않은 계정입니다.\n다시 한번 확인해 주세요.");
                    } else {
                        if (accountInfo.paidStatus === 0) { // 결제 상태가 아니라면
                            setErrorMessage("결제가 유효하지 않은 계정입니다.\n다시 한번 확인해 주세요.");
                        } else {
                            if (accountInfo.profiles.length === 0) { // 프로필이 없다면
                                setErrorMessage("생성된 프로필이 없습니다.\n프로필을 생성해 주세요.");
                            } else {
                                setIsError(false);
                                setProfiles(accountInfo.profiles);
                                for (let i = 0; i < accountInfo.profiles.length; i++) {
                                    if (accountInfo.profiles[i].profileNo === Number(profileNo)) {
                                        setProfile(accountInfo.profiles[i]);
                                        break;
                                    }
                                }
                                await getMonthData(profileNo);
                            }
                        }
                    }
                }
            } else if (params.usertype === "25") { // 학교||학원 계정
                setUserType(25);

                let accountInfo = await getAccountInfo2(profileNo);

                if (accountInfo.existenceStatus === 0) { // 계정이 없다면
                    setErrorMessage("등록되어 있지 않은 계정입니다.\n다시 한번 확인해 주세요.");
                } else {
                    if (accountInfo.useStatus === 0) { // 사용 정지된 계정이라면
                        setErrorMessage("사용 정지된 계정입니다. 다시 한번 확인해 주세요.");
                    } else {
                        if (accountInfo.schoolAccountStatus === 0) { // 학교||학원 계정이 아니라면
                            setErrorMessage("학교 또는 학원 계정이 아닙니다.\n다시 한번 확인해 주세요.");
                        } else {
                            setIsError(false);
                            setProfiles(accountInfo.profiles);
                            for (let i = 0; i < accountInfo.profiles.length; i++) {
                                if (accountInfo.profiles[i].profileNo === Number(profileNo)) {
                                    setProfile(accountInfo.profiles[i]);
                                    break;
                                }
                            }
                            await getMonthData(profileNo);
                        }
                    }
                }
            } else if (params.usertype === "32") { // 임시 계정||무료 계정 프로모션 3일차 월간 보고서
                setUserType(32);

                let accountInfo = await getAccountInfo(userNo);

                if (accountInfo.existenceStatus === 0) { // 계정이 없다면
                    setErrorMessage("등록되어 있지 않은 계정입니다.\n다시 한번 확인해 주세요.");
                } else {
                    if (accountInfo.useStatus === 0) { // 사용 정지된 계정이라면
                        setErrorMessage("사용 정지된 계정입니다. 다시 한번 확인해 주세요.");
                    } else {
                        if (accountInfo.paidAccountStatus === 1) { // 유료 계정이라면
                            setErrorMessage("유료 계정입니다.\n매월 1일 오후 12시 월간 보고서를 기다려 주세요.");
                        } else {
                            setIsError(false);
                            setProfiles(accountInfo.profiles);
                            for (let i = 0; i < accountInfo.profiles.length; i++) {
                                if (accountInfo.profiles[i].profileNo === Number(profileNo)) {
                                    setProfile(accountInfo.profiles[i]);
                                    break;
                                }
                            }
                            await getMonthData(profileNo);
                        }
                    }
                }
            }
        }
    }

    const getAccountInfo = async (userNo) => {
        let accountInfo2;

        await accountInfo(userNo)
            .then(async (res) => {
                accountInfo2 = res.data;
            })
            .catch(error => { console.log(error) });

        return accountInfo2;
    }

    const getAccountInfo2 = async (profileNo) => {
        let accountInfo22;

        await accountInfo2(profileNo)
            .then(async (res) => {
                accountInfo22 = res.data;
            })
            .catch(error => { console.log(error) });

        return accountInfo22;
    }

    const getMonthData = async (profileNo) => {
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

            await getCalendar(profileNo, startDate2);
            await getMonthlyLearningData(profileNo, startDate2, 4);
            await getWeeklyLearningData(profileNo, startDate2);
            await getLevelData(profileNo, startDate2, endDate2);
            await getLevelAndChapterData(profileNo, startDate2, endDate2);
            await getLearningData(profileNo, startDate2, endDate2);
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

            await getCalendar(profileNo, startDate2);
            await getMonthlyLearningData(profileNo, startDate2, 4);
            await getWeeklyLearningData(profileNo, startDate2);
            await getLevelData(profileNo, startDate2, endDate2);
            await getLevelAndChapterData(profileNo, startDate2, endDate2);
            await getLearningData(profileNo, startDate2, endDate2);
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

    const onChangeProfile = (profileNo) => { // 프로필 변경
        let encodedProfileNo = encodeURIComponent(encode(profileNo.toString())); // CryptoJS가 숫자 인식 오류 남 -> 문자열로 변경 후 진행

        navigate(`/monthly-report/${params.usertype}/${encodeURIComponent(params.userno)}/${encodedProfileNo}/${params.startdate}`);
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

    const checkLine = text => { // 문자열 줄 넘김
        return (
            <Fragment>
                {text.split("\n").map((txt) => (
                    <Fragment key={txt}>
                        {txt}
                        <br />
                    </Fragment>
                ))}
            </Fragment>
        )
    };

    useEffect(async () => {
        setIsLoading(true);
        await checkUser();
        setIsLoading(false);
    }, [location])

    return (
        <Fragment>
            {
                !isEmpty ? (
                    !isError ? (
                        <div className="text-[12px] pb-[40px] lg:text-[18px]">
                            {
                                isLoading ? (
                                    <ClassicSpinnerLoader size={40} />
                                ) : (null)
                            }
                            <ScrollToTopButton />
                            {/* 유료 계정일 경우 (user_type: 21) */}
                            {
                                userType === 21 ? (
                                    <div className={
                                        "relative w-full px-[4px] my-[20px] flex justify-end" + " " +
                                        "lg:w-[1040px] lg:mx-auto lg:my-[40px] lg:px-[0px]"
                                    }>
                                        {
                                            profiles && profiles.map((value, index) => (
                                                <div key={index} className="w-[19%] pl-[4px] lg:pl-[6px]">
                                                    <div
                                                        className={
                                                            Number(profileNo) === value.profileNo ? (
                                                                "rounded shadow-sm hover:cursor-pointer flex justify-center items-center py-[4px] bg-[#0063ff] text-[#ffffff] w-full lg:text-[20px] lg:py-[10px]"
                                                            ) : (
                                                                "rounded shadow-sm hover:cursor-pointer flex justify-center items-center py-[4px] bg-[#ffffff] text-[#000000] w-full lg:text-[20px] lg:py-[10px]"
                                                            )
                                                        }
                                                        onClick={() => { onChangeProfile(value.profileNo) }}
                                                    >
                                                        {value.profileName && value.profileName.length > 4 ? value.profileName.substr(0, 4) + ".." : value.profileName}
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                ) : (null)
                            }

                            {/* 프로모션 3일 계정일 경우 (user_type: 32) */}
                            {
                                userType === 32 ? (
                                    <div className="flex justify-center text-[14px] p-[4px] lg:p-[0px] lg:mt-[40px] lg:text-[18px]">
                                        <div className="bg-[#ffffff] w-full shadow-md rounded p-[10px] lg:w-[1040px] lg:p-[20px]">
                                            <div><span className="font-black">{profile.profileName}</span>님의 3일 동안 학습한 AI 학습 보고서입니다.</div>
                                            <div>일프로연산 이용권을 구매하실 경우, AI 학습 보고서가 매달 1일 정기적으로 제공됩니다.</div>
                                        </div>
                                    </div>
                                ) : (null)
                            }

                            <div className="mt-[20px] lg:mt-[40px]">
                                <div className="flex justify-center px-[4px] lg:px-[0px]">
                                    <div className="bg-[#ffffff] w-full h-[800px] shadow-md rounded lg:w-[1040px] lg:h-[1400px]">
                                        <div className="px-[40px] pt-[50px] h-[100px]">
                                            <div className="text-[16px] text-[#72787f] lg:text-[24px]">상위 1%가 선택한 연산앱 '일프로연산'</div>
                                            <hr className="border-2 mt-[20px]" />
                                        </div>
                                        <div className="flex justify-center items-center h-[500px] lg:h-[1100px]">
                                            <div className="text-center">
                                                <div className="text-[20px] font-semibold text-[#72787f] mt-[110px]">
                                                    {window.sessionStorage.getItem("schoolname")}
                                                </div>
                                                <div className="text-[20px] font-semibold text-[#72787f] lg:text-[40px]">
                                                    {profile.profileName}
                                                </div>
                                                <div className="text-[40px] font-extrabold text-[#0063ff] lg:text-[80px]">
                                                    학습 보고서
                                                </div>
                                                <div className="text-[18px] text-[#464c52] mt-[110px] lg:text-[30px]">
                                                    {year}.{month}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="h-[200px] flex justify-center items-center text-[80px] font-black text-[#edf4ff] lg:text-[220px]">
                                            1%MATH
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-[10px] flex justify-center px-[4px] lg:px-[0px] lg:mt-[60px]">
                                    <div className="relative bg-[#ffffff] w-full h-[800px] shadow-md rounded lg:w-[1040px] lg:h-[1400px]">
                                        <div className="text-[14px] font-bold text-[#061b3b] text-center mt-[20px] lg:mt-[50px] lg:text-[32px]">
                                            출석 현황
                                        </div>
                                        <div className="flex justify-center">
                                            <div className="flex justify-center w-full px-[10px] text-[13px] font-semibold text-[#464c52] mt-[20px] lg:mt-[50px] lg:text-[20px] lg:px-[0px]">
                                                <div className="pl-[10px] w-[14.2%] h-[30px] lg:pl-[20px] lg:w-[130px] lg:h-[40px]">일</div>
                                                <div className="pl-[10px] w-[14.2%] h-[30px] lg:pl-[20px] lg:w-[130px] lg:h-[40px]">월</div>
                                                <div className="pl-[10px] w-[14.2%] h-[30px] lg:pl-[20px] lg:w-[130px] lg:h-[40px]">화</div>
                                                <div className="pl-[10px] w-[14.2%] h-[30px] lg:pl-[20px] lg:w-[130px] lg:h-[40px]">수</div>
                                                <div className="pl-[10px] w-[14.2%] h-[30px] lg:pl-[20px] lg:w-[130px] lg:h-[40px]">목</div>
                                                <div className="pl-[10px] w-[14.2%] h-[30px] lg:pl-[20px] lg:w-[130px] lg:h-[40px]">금</div>
                                                <div className="pl-[10px] w-[14.2%] h-[30px] lg:pl-[20px] lg:w-[130px] lg:h-[40px]">토</div>
                                            </div>
                                        </div>

                                        <div className="flex justify-center">
                                            <div className="w-full px-[4px] lg:px-[0px] lg:w-[920px]">
                                                {
                                                    calendarData && calendarData.map((value, index) => (
                                                        <div key={index} className="flex justify-center border-t-[1px]">
                                                            {
                                                                calendarData[index] && calendarData[index].map((value2, index2) => (
                                                                    <div key={index2} className={value2.sequence === 1 ? "w-[14.2%] h-[68px] p-[4px] lg:w-[130px] lg:h-[130px] lg:p-[20px]" : "w-[14.2%] h-[68px] p-[4px] border-l-[1px] lg:w-[130px] lg:h-[130px] lg:p-[20px]"}>
                                                                        <div className="flex justify-between items-center">
                                                                            <div className={value2.learningDate >= startDate && value2.learningDate < endDate ? "text-[#000000]" : "text-[#adb0b2]"}>
                                                                                {value2.day}일
                                                                            </div>
                                                                            <div>
                                                                                {
                                                                                    value2.attendanceStatus ? (
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-[14px] w-[14px] text-[#0063ff] lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                        </svg>
                                                                                    ) : (null)
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            {
                                                                                value2.attendanceStatus ? (
                                                                                    <div className={value2.learningCount > 0 ? "mt-[24px] text-right text-[#0063ff] lg:text-[20px] lg:mt-[40px]" : "mt-[24px] text-right text-[#b6b9bc] lg:text-[20px] lg:mt-[40px]"}>
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

                                        <div className="px-[4px] mt-[20px] text-[#464c52] font-bold lg:px-[60px] lg:mt-[50px] lg:text-[20px]">
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-[14px] w-[14px] lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                                <div className="ml-[8px]">
                                                    {parseInt(month)}월 총 출석 일수는 {attendanceCount}일입니다.
                                                </div>
                                            </div>
                                            <div className="flex items-center mt-[20px]">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-[14px] w-[14px] lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                                <div className="ml-[8px]">
                                                    출석한 날에는 평균 {averageLearningCount}개의 스테이지를 학습했습니다.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="absolute bottom-[10px] left-0 w-full flex justify-between font-semibold text-[#464c52] lg:text-[16px] lg:bottom-[40px] ">
                                            <div className="w-[80px]">
                                            </div>
                                            <div>
                                                {year}.{month}
                                            </div>
                                            <div className="w-[80px] text-right pr-[10px] lg:pr-[40px]">
                                                1
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-[10px] flex justify-center px-[4px] lg:px-[0px] lg:mt-[60px]">
                                    <div className="relative bg-[#ffffff] w-full h-[800px] shadow-md rounded lg:w-[1040px] lg:h-[1400px]">
                                        <div className="text-[14px] mt-[20px] font-bold text-[#061b3b] text-center lg:text-[32px] lg:mt-[50px]">
                                            평균 학습 현황
                                        </div>
                                        <div className="mt-[20px] lg:mt-[50px]">
                                            <div className="px-[4px] lg:px-[60px]">
                                                <div className="text-[11px] text-right text-[#adb0b2] lg:text-[16px]">
                                                    * 출석한 날 기준 평균
                                                </div>
                                            </div>

                                            <div className="mt-[20px]">
                                                <div className="flex justify-center">
                                                    <div className="flex justify-center w-[33%] lg:w-[306px]">
                                                        <div className="flex justify-center items-center w-[30%] lg:w-[100px]">
                                                            <img src={Learning} alt={"learning"} className="w-[30px] lg:w-auto" />
                                                        </div>
                                                        <div className="w-[70%] pl-[10px] lg:w-[146px] lg:pl-[20px]">
                                                            <div className="text-[#464c52] mt-[6px]">
                                                                학습량
                                                            </div>
                                                            <div className="mt-[4px] lg:mt-[10px]">
                                                                <span className="text-[12px] font-semibold text-[#0063ff] lg:text-[28px]">
                                                                    {averageLearningCount}
                                                                </span>
                                                                <span className="text-[12px] font-semibold text-[#0063ff] ml-[2px] lg:text-[20px]">개</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-center w-[33%] lg:w-[306px]">
                                                        <div className="flex justify-center items-center w-[30%] lg:w-[100px]">
                                                            <img src={Accuracy} alt={"accuracy"} className="w-[30px] lg:w-auto" />
                                                        </div>
                                                        <div className="w-[70%] pl-[10px] lg:w-[146px] lg:pl-[20px]">
                                                            <div className="text-[#464c52] mt-[6px]">
                                                                정확도
                                                            </div>
                                                            <div className="mt-[4px] lg:mt-[10px]">
                                                                <span className="text-[12px] font-semibold text-[#0063ff] lg:text-[28px]">{averageAccuracy}</span>
                                                                <span className="text-[12px] font-semibold text-[#0063ff] ml-[2px] lg:text-[20px]">%</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-center w-[33%] lg:w-[306px]">
                                                        <div className="flex justify-center items-center w-[30%] lg:w-[100px]">
                                                            <img src={Time} alt={"time"} className="w-[30px] lg:w-auto" />
                                                        </div>
                                                        <div className="w-[70%] pl-[10px] lg:w-[146px] lg:pl-[20px]">
                                                            <div className="text-[#464c52] mt-[6px]">
                                                                학습시간
                                                            </div>
                                                            <div className="mt-[4px] lg:mt-[10px]">
                                                                <span className="text-[12px] font-semibold text-[#0063ff] lg:text-[28px]">{mm(averageLearningTimeSeconds)}</span>
                                                                {
                                                                    mm(averageLearningTimeSeconds) !== "" ? (
                                                                        <span className="text-[12px] font-semibold text-[#0063ff] ml-[2px] lg:text-[20px]">분</span>
                                                                    ) : (null)
                                                                }
                                                                <span className="text-[12px] font-semibold text-[#0063ff] ml-[2px] lg:ml-[4px] lg:text-[28px]">{ss(averageLearningTimeSeconds)}</span>
                                                                {
                                                                    ss(averageLearningTimeSeconds) !== "" ? (
                                                                        <span className="text-[12px] font-semibold text-[#0063ff] ml-[2px] lg:text-[20px]">초</span>
                                                                    ) : (null)
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-[14px] mt-[20px] font-bold text-[#061b3b] text-center lg:mt-[50px] lg:text-[32px]">
                                            총 학습 현황
                                        </div>
                                        <div className="mt-[20px] px-[4px] lg:px-[60px] lg:mt-[50px]">
                                            <div className="flex border-t">
                                                <div className="flex items-center text-[#464c52] font-bold w-[32%] h-[50px] text-[10px] lg:text-[20px] lg:w-[290px] lg:h-[100px] lg:pl-[40px]">학습량 (스테이지 개수)</div>
                                                <div className="flex justify-end items-center w-[20%] h-[50px] lg:w-[260px] lg:h-[100px]">
                                                    <div>
                                                        <span className="text-[#0063ff] text-[10px] lg:text-[42px]">{learningCount}</span>
                                                        <span className="text-[#0063ff] ml-[2px] text-[10px] lg:text-[26px] lg:ml-[6px]">개</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end items-center w-[48%] h-[50px] lg:w-[370px] lg:h-[100px] lg:pr-[40px]">
                                                    {
                                                        preMonthComparisonLearningCount === 0 ? (
                                                            <Fragment>
                                                                <div className="text-[#5c5e60] text-[10px] lg:text-[20px]">저번 달과 동일</div>
                                                                <div className="ml-[4px] lg:ml-[14px]">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="text-[#7e7e7e] w-[14px] h-[14px] lg:h-10 lg:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                </div>
                                                            </Fragment>
                                                        ) : (
                                                            preMonthComparisonLearningCount > 0 ? (
                                                                <Fragment>
                                                                    <div className="text-[#5c5e60] text-[10px] lg:text-[20px]">+ 저번 달보다 {preMonthComparisonLearningCount}개 증가</div>
                                                                    <div className="ml-[4px] lg:ml-[14px]">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="text-[#17b20e] w-[14px] h-[14px] lg:h-10 lg:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                                        </svg>
                                                                    </div>
                                                                </Fragment>
                                                            ) : (
                                                                <Fragment>
                                                                    <div className="text-[#5c5e60] text-[10px] lg:text-[20px]">- 저번 달보다 {Math.abs(preMonthComparisonLearningCount)}개 감소</div>
                                                                    <div className="ml-[4px] lg:ml-[14px]">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="text-[#d61313] w-[14px] h-[14px] lg:h-10 lg:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                                <div className="flex items-center text-[#464c52] font-bold w-[32%] h-[50px] text-[10px] lg:text-[20px] lg:w-[290px] lg:h-[100px] lg:pl-[40px]">정확도</div>
                                                <div className="flex justify-end items-center w-[20%] h-[50px] lg:w-[260px] lg:h-[100px]">
                                                    <div>
                                                        <span className="text-[#0063ff] text-[10px] lg:text-[42px]">{averageAccuracy}</span>
                                                        <span className="text-[#0063ff] ml-[2px] text-[10px] lg:text-[26px] lg:ml-[6px]">%</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end items-center w-[48%] h-[50px] lg:w-[370px] lg:h-[100px] lg:pr-[40px]">
                                                    {
                                                        preMonthComparisonAccuracy === 0 ? (
                                                            <Fragment>
                                                                <div className="text-[#5c5e60] text-[10px] lg:text-[20px]">저번 달과 동일</div>
                                                                <div className="ml-[4px] lg:ml-[14px]">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="text-[#7e7e7e] w-[14px] h-[14px] lg:h-10 lg:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                </div>
                                                            </Fragment>
                                                        ) : (
                                                            preMonthComparisonAccuracy > 0 ? (
                                                                <Fragment>
                                                                    <div className="text-[#5c5e60] text-[10px] lg:text-[20px]">+ 저번 달보다 {preMonthComparisonAccuracy}% 증가</div>
                                                                    <div className="ml-[4px] lg:ml-[14px]">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="text-[#17b20e] w-[14px] h-[14px] lg:h-10 lg:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                                        </svg>
                                                                    </div>
                                                                </Fragment>
                                                            ) : (
                                                                <Fragment>
                                                                    <div className="text-[#5c5e60] text-[10px] lg:text-[20px]">- 저번 달보다 {Math.abs(preMonthComparisonAccuracy)}% 감소</div>
                                                                    <div className="ml-[4px] lg:ml-[14px]">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="text-[#d61313] w-[14px] h-[14px] lg:h-10 lg:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                                <div className="flex items-center text-[#464c52] font-bold w-[32%] h-[50px] text-[10px] lg:text-[20px] lg:w-[290px] lg:h-[100px] lg:pl-[40px]">학습시간</div>
                                                <div className="flex justify-end items-center w-[20%] h-[50px] lg:w-[260px] lg:h-[100px]">
                                                    <div>
                                                        <span className="text-[#0063ff] text-[10px] lg:text-[42px]">{mm(learningTimeSeconds)}</span>
                                                        <span className="text-[#0063ff] ml-[2px] text-[10px] lg:text-[26px] lg:ml-[6px]">분</span>
                                                        {
                                                            ss(learningTimeSeconds) !== "" ? (
                                                                <Fragment>
                                                                    <span className="text-[#0063ff] ml-[2px] text-[10px] lg:text-[42px] lg:ml-[8px]">{ss(learningTimeSeconds)}</span>
                                                                    <span className="text-[#0063ff] ml-[2px] text-[10px] lg:text-[26px] lg:ml-[6px]">초</span>
                                                                </Fragment>
                                                            ) : (null)
                                                        }
                                                    </div>
                                                </div>
                                                <div className="flex justify-end items-center w-[48%] h-[50px] lg:w-[370px] lg:h-[100px] lg:pr-[40px]">
                                                    {
                                                        preMonthComparisonLearningTimeSeconds === 0 ? (
                                                            <Fragment>
                                                                <div className="text-[#5c5e60] text-[10px] lg:text-[20px]">저번 달과 동일</div>
                                                                <div className="ml-[4px] lg:ml-[14px]">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="text-[#7e7e7e] w-[14px] h-[14px] lg:h-10 lg:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                </div>
                                                            </Fragment>
                                                        ) : (
                                                            preMonthComparisonLearningTimeSeconds > 0 ? (
                                                                <Fragment>
                                                                    <div className="text-[#5c5e60] text-[10px] lg:text-[20px]">+ 저번 달보다 {mm2(Math.abs(preMonthComparisonLearningTimeSeconds))} {ss2(Math.abs(preMonthComparisonLearningTimeSeconds))} 증가</div>
                                                                    <div className="ml-[4px] lg:ml-[14px]">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="text-[#17b20e] w-[14px] h-[14px] lg:h-10 lg:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                                        </svg>
                                                                    </div>
                                                                </Fragment>
                                                            ) : (
                                                                <Fragment>
                                                                    <div className="text-[#5c5e60] text-[10px] lg:text-[20px]">- 저번 달보다 {mm2(Math.abs(preMonthComparisonLearningTimeSeconds))} {ss2(Math.abs(preMonthComparisonLearningTimeSeconds))} 감소</div>
                                                                    <div className="ml-[4px] lg:ml-[14px]">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="text-[#d61313] w-[14px] h-[14px] lg:h-10 lg:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                                <div className="flex items-center text-[#464c52] font-bold w-[32%] h-[50px] text-[10px] lg:text-[20px] lg:w-[290px] lg:h-[100px] lg:pl-[40px]">문제 개수</div>
                                                <div className="flex justify-end items-center w-[20%] h-[50px] lg:w-[260px] lg:h-[100px]">
                                                    <div>
                                                        <span className="text-[#0063ff] text-[10px] lg:text-[42px]">{problemCount}</span>
                                                        <span className="text-[#0063ff] ml-[2px] text-[10px] lg:text-[26px] lg:ml-[6px]">개</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end items-center w-[48%] h-[50px] lg:w-[370px] lg:h-[100px] lg:pr-[40px]">
                                                    {
                                                        preMonthComparisonProblemCount === 0 ? (
                                                            <Fragment>
                                                                <div className="text-[#5c5e60] text-[10px] lg:text-[20px]">저번 달과 동일</div>
                                                                <div className="ml-[4px] lg:ml-[14px]">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="text-[#7e7e7e] w-[14px] h-[14px] lg:h-10 lg:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                </div>
                                                            </Fragment>
                                                        ) : (
                                                            preMonthComparisonProblemCount > 0 ? (
                                                                <Fragment>
                                                                    <div className="text-[#5c5e60] text-[10px] lg:text-[20px]">+ 저번 달보다 {preMonthComparisonProblemCount}개 증가</div>
                                                                    <div className="ml-[4px] lg:ml-[14px]">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="text-[#17b20e] w-[14px] h-[14px] lg:h-10 lg:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                                        </svg>
                                                                    </div>
                                                                </Fragment>
                                                            ) : (
                                                                <Fragment>
                                                                    <div className="text-[#5c5e60] text-[10px] lg:text-[20px]">- 저번 달보다 {Math.abs(preMonthComparisonProblemCount)}개 감소</div>
                                                                    <div className="ml-[4px] lg:ml-[14px]">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="text-[#d61313] w-[14px] h-[14px] lg:h-10 lg:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

                                        <div className=" font-bold text-[#061b3b] text-center text-[14px] mt-[20px] lg:text-[32px] lg:mt-[50px]">
                                            학습 모드별 비율
                                        </div>

                                        <div className="mt-[20px] flex justify-center lg:mt-[50px]">
                                            <div className="w-full px-[4px] lg:px-[0px]">
                                                <div className="flex justify-center items-center">
                                                    <div className="flex items-center w-[24%] lg:w-[200px] lg:pl-[10px]">
                                                        <div className="w-[0.625rem] h-[0.625rem] bg-[#558fe8] rounded-full"></div>
                                                        <div className={topLearningMode === 1 ? "text-[#d61313] ml-[8px]" : "ml-[8px]"}>
                                                            <span>오늘의 학습</span>
                                                        </div>
                                                    </div>
                                                    <div className={topLearningMode === 1 ? "text-[#d61313] w-[16%] lg:w-[100px]" : "w-[16%] lg:w-[100px]"}>
                                                        <span>
                                                            {dailyModePercent}%
                                                        </span>
                                                    </div>
                                                    <div className="w-[60%] lg:w-[620px] lg:pr-[10px]">
                                                        <div className="overflow-hidden">
                                                            <div className="relative w-full bg-[#e8e9ea] rounded-full h-[14px] lg:h-[30px]">
                                                                <div className="absolute w-full h-[14px] rounded-full shadow-[0_0_0_30px_#ffffff] lg:h-[30px]"></div>
                                                                <div className={"bg-[#558fe8] h-[14px] lg:h-[30px]"} style={{ width: dailyModePercent + "%" }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-center items-center mt-[20px] lg:mt-[30px]">
                                                    <div className="flex items-center w-[24%] lg:w-[200px] lg:pl-[10px]">
                                                        <div className="w-[0.625rem] h-[0.625rem] bg-[#fac232] rounded-full"></div>
                                                        <div className={topLearningMode === 2 ? "text-[#d61313] ml-[8px]" : "ml-[8px]"}>
                                                            <span>자유 학습</span>
                                                        </div>
                                                    </div>
                                                    <div className={topLearningMode === 2 ? "text-[#d61313] w-[16%] lg:w-[100px]" : "w-[16%] lg:w-[100px]"}>
                                                        <span>
                                                            {freeModePercent}%
                                                        </span>
                                                    </div>
                                                    <div className="w-[60%] lg:w-[620px] lg:pr-[10px]">
                                                        <div className="overflow-hidden">
                                                            <div className="relative w-full bg-[#e8e9ea] rounded-full h-[14px] lg:h-[30px]">
                                                                <div className="absolute w-full h-[14px] rounded-full shadow-[0_0_0_30px_#ffffff] lg:h-[30px]"></div>
                                                                <div className={"bg-[#fac232] h-[14px] lg:h-[30px]"} style={{ width: freeModePercent + "%" }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-center items-center mt-[20px] lg:mt-[30px]">
                                                    <div className="flex items-center w-[24%] lg:w-[200px] lg:pl-[10px]">
                                                        <div className="w-[0.625rem] h-[0.625rem] bg-[#f67b70] rounded-full"></div>
                                                        <div className={topLearningMode === 3 ? "text-[#d61313] ml-[8px]" : "ml-[8px]"}>
                                                            <span>일프로 도전</span>
                                                        </div>
                                                    </div>
                                                    <div className={topLearningMode === 3 ? "text-[#d61313] w-[16%] lg:w-[100px]" : "w-[16%] lg:w-[100px]"}>
                                                        <span>
                                                            {oneproModePercent}%
                                                        </span>
                                                    </div>
                                                    <div className="w-[60%] lg:w-[620px] lg:pr-[10px]">
                                                        <div className="overflow-hidden">
                                                            <div className="relative w-full bg-[#e8e9ea] rounded-full h-[14px] lg:h-[30px]">
                                                                <div className="absolute w-full h-[14px] rounded-full shadow-[0_0_0_30px_#ffffff] lg:h-[30px]"></div>
                                                                <div className={"bg-[#f67b70] h-[14px] lg:h-[30px]"} style={{ width: oneproModePercent + "%" }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-center items-center mt-[20px] lg:mt-[30px]">
                                                    <div className="flex items-center w-[24%] lg:w-[200px] lg:pl-[10px]">
                                                        <div className="w-[0.625rem] h-[0.625rem] bg-[#3bc7b9] rounded-full"></div>
                                                        <div className={topLearningMode === 4 ? "text-[#d61313] ml-[8px]" : "ml-[8px]"}>
                                                            <span>연산 월드</span>
                                                        </div>
                                                    </div>
                                                    <div className={topLearningMode === 4 ? "text-[#d61313] w-[16%] lg:w-[100px]" : "w-[16%] lg:w-[100px]"}>
                                                        <span>
                                                            {worldModePercent}%
                                                        </span>
                                                    </div>
                                                    <div className="w-[60%] lg:w-[620px] lg:pr-[10px]">
                                                        <div className="overflow-hidden">
                                                            <div className="relative w-full bg-[#e8e9ea] rounded-full h-[14px] lg:h-[30px]">
                                                                <div className="absolute w-full h-[14px] rounded-full shadow-[0_0_0_30px_#ffffff] lg:h-[30px]"></div>
                                                                <div className={"bg-[#3bc7b9] h-[14px] lg:h-[30px]"} style={{ width: worldModePercent + "%" }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-[4px] mt-[20px] text-[#464c52] font-bold lg:px-[60px] lg:mt-[50px] lg:text-[20px]">
                                            {
                                                topLearningMode !== 0 ? (
                                                    <div className="flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-[14px] w-[14px] lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                        </svg>
                                                        <div className="ml-[8px]">
                                                            {parseInt(month)}월에 가장 많이 한 학습 모드는 [{learningModeKo[topLearningMode - 1]}]입니다.
                                                        </div>
                                                    </div>
                                                ) : (null)
                                            }
                                        </div>

                                        <div className="absolute bottom-[10px] left-0 w-full flex justify-between font-semibold text-[#464c52] lg:text-[16px] lg:bottom-[40px] ">
                                            <div className="w-[80px]">
                                            </div>
                                            <div>
                                                {year}.{month}
                                            </div>
                                            <div className="w-[80px] text-right pr-[10px] lg:pr-[40px]">
                                                2
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-[10px] flex justify-center px-[4px] lg:px-[0px] lg:mt-[60px]">
                                    <div className="relative bg-[#ffffff] w-full h-[800px] shadow-md rounded lg:w-[1040px] lg:h-[1400px]">
                                        <div className="text-[14px] mt-[20px] font-bold text-[#061b3b] text-center lg:mt-[50px] lg:text-[32px]">
                                            월별 학습 결과 비교
                                        </div>
                                        <div className="text-[#464c52] text-center mt-[10px] lg:mt-[20px]">
                                            4개월 평균 학습 결과를 비교한 그래프입니다.
                                        </div>

                                        <div className="text-[13px] mt-[20px] px-[4px] font-bold text-[#061b3b] lg:mt-[50px] lg:px-[60px] lg:text-[20px]">
                                            학습량 (스테이지 개수)
                                        </div>

                                        <div className="flex justify-center items-center px-[4px] mt-[0px] lg:mt-[20px] lg:px-[0px]">
                                            <div className="w-full h-[200px] lg:w-[900px] lg:h-[280px]">
                                                <ResponsiveBar
                                                    data={monthlyLearningData2}
                                                    keys={['learningCount']}
                                                    indexBy="date"
                                                    margin={{ top: 30, right: 30, bottom: 40, left: 50 }}
                                                    axisTop={null}
                                                    axisRight={null}
                                                    axisBottom={{
                                                        tickSize: 0,
                                                        tickPadding: 20,
                                                        tickRotation: 0,
                                                        format: (e) => {
                                                            let thisDate = new Date(e);
                                                            return (
                                                                <tspan className="text-[14px] lg:text-[18px]" fill="#1b1d1f">{thisDate.getMonth() + 1}월</tspan>
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
                                                        fontSize: "14px",
                                                        textColor: "#999c9f"
                                                    }}
                                                    borderRadius={3}
                                                    padding={0.8}
                                                    colors={['#6e72f7']}
                                                    colorBy="id"
                                                    label={(e) => {
                                                        return (
                                                            <tspan y="-14" className="text-[14px] lg:text-[16px]" fill={e.value === maxLearningCount ? "#0063ff" : "#72787f"} fontWeight="700">{e.value}</tspan>
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

                                        <div className="text-[13px] mt-[0px] px-[4px] font-bold text-[#061b3b] lg:mt-[50px] lg:px-[60px] lg:text-[20px]">
                                            정확도
                                        </div>

                                        <div className="flex justify-center items-center px-[4px] mt-[0px] lg:mt-[20px] lg:px-[0px]">
                                            <div className="w-full h-[200px] lg:w-[900px] lg:h-[280px]">
                                                <ResponsiveBar
                                                    data={monthlyLearningData2}
                                                    keys={['accuracy']}
                                                    indexBy="date"
                                                    margin={{ top: 30, right: 30, bottom: 40, left: 50 }}
                                                    axisTop={null}
                                                    axisRight={null}
                                                    axisBottom={{
                                                        tickSize: 0,
                                                        tickPadding: 20,
                                                        tickRotation: 0,
                                                        format: (e) => {
                                                            let thisDate = new Date(e);
                                                            return (
                                                                <tspan className="text-[14px] lg:text-[18px]" fill="#1b1d1f">{thisDate.getMonth() + 1}월</tspan>
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
                                                        fontSize: "14px",
                                                        textColor: "#999c9f"
                                                    }}
                                                    borderRadius={3}
                                                    padding={0.8}
                                                    colors={['#33cee6']}
                                                    colorBy="id"
                                                    label={(e) => {
                                                        return (
                                                            <tspan y="-14" className="text-[14px] lg:text-[16px]" fill={e.value === maxAccuracy ? "#0063ff" : "#72787f"} fontWeight="700">{e.value}</tspan>
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

                                        <div className="text-[13px] mt-[0px] px-[4px] font-bold text-[#061b3b] lg:mt-[50px] lg:px-[60px] lg:text-[20px]">
                                            학습시간
                                        </div>

                                        <div className="flex justify-center items-center px-[4px] mt-[0px] lg:mt-[20px] lg:px-[0px]">
                                            <div className="w-full h-[200px] lg:w-[900px] lg:h-[280px]">
                                                <ResponsiveBar
                                                    data={monthlyLearningData2}
                                                    keys={['learningTimeMinutes']}
                                                    indexBy="date"
                                                    margin={{ top: 30, right: 30, bottom: 40, left: 50 }}
                                                    axisTop={null}
                                                    axisRight={null}
                                                    axisBottom={{
                                                        tickSize: 0,
                                                        tickPadding: 20,
                                                        tickRotation: 0,
                                                        format: (e) => {
                                                            let thisDate = new Date(e);
                                                            return (
                                                                <tspan className="text-[14px] lg:text-[18px]" fill="#1b1d1f">{thisDate.getMonth() + 1}월</tspan>
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
                                                        fontSize: "14px",
                                                        textColor: "#999c9f"
                                                    }}
                                                    borderRadius={3}
                                                    padding={0.8}
                                                    colors={['#b468ff']}
                                                    colorBy="id"
                                                    label={(e) => {
                                                        return (
                                                            <tspan y="-14" className="text-[14px] lg:text-[16px]" fill={e.value === maxLearningTimeMinutes ? "#0063ff" : "#72787f"} fontWeight="700">{e.value}</tspan>
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

                                        <div className="absolute bottom-[10px] left-0 w-full flex justify-between font-semibold text-[#464c52] lg:text-[16px] lg:bottom-[40px] ">
                                            <div className="w-[80px]">
                                            </div>
                                            <div>
                                                {year}.{month}
                                            </div>
                                            <div className="w-[80px] text-right pr-[10px] lg:pr-[40px]">
                                                3
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-[10px] flex justify-center px-[4px] lg:px-[0px] lg:mt-[60px]">
                                    <div className="relative bg-[#ffffff] w-full h-[800px] shadow-md rounded lg:w-[1040px] lg:h-[1400px]">
                                        <div className="text-[14px] font-bold text-[#061b3b] text-center mt-[20px] lg:mt-[50px] lg:text-[32px]">
                                            주별 학습 결과 그래프
                                        </div>
                                        <div className="mt-[10px] text-[#464c52] text-center lg:mt-[20px] lg:text-[18px]">
                                            {weekStartDate} ~ {weekEndDate}
                                        </div>

                                        <div className="text-[13px] font-bold text-[#061b3b] mt-[20px] px-[4px] lg:mt-[50px] lg:px-[60px] lg:text-[20px]">
                                            학습량 (스테이지 개수)
                                        </div>

                                        <div className="flex justify-center items-center px-[4px] mt-[0px] lg:mt-[20px] lg:px-[0px]">
                                            <div className="w-full h-[200px] lg:w-[900px] lg:h-[280px]">
                                                <ResponsiveBar
                                                    data={weeklyLearningData2}
                                                    keys={['learningCount']}
                                                    indexBy="date"
                                                    margin={{ top: 30, right: 30, bottom: 40, left: 50 }}
                                                    axisTop={null}
                                                    axisRight={null}
                                                    axisBottom={{
                                                        tickSize: 0,
                                                        tickPadding: 20,
                                                        tickRotation: 0,
                                                        format: (e) => {
                                                            let startDate = new Date(e);
                                                            let endDate = new Date(startDate);
                                                            endDate.setDate(endDate.getDate() + 6);
                                                            return (
                                                                <tspan className="text-[9px] lg:text-[16px]" fill="#1b1d1f">{startDate.getDate()}일-{endDate.getDate()}일</tspan>
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
                                                        fontSize: "14px",
                                                        textColor: "#999c9f"
                                                    }}
                                                    borderRadius={3}
                                                    padding={0.8}
                                                    colors={['#ff7d7d']}
                                                    colorBy="id"
                                                    label={(e) => {
                                                        return (
                                                            <tspan y="-14" className="text-[14px] lg:text-[16px]" fill={e.value === weeklyMaxLearningCount ? "#0063ff" : "#72787f"} fontWeight="700">{e.value}</tspan>
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

                                        <div className="text-[13px] font-bold text-[#061b3b] mt-[0px] px-[4px] lg:mt-[50px] lg:px-[60px] lg:text-[20px]">
                                            정확도
                                        </div>

                                        <div className="flex justify-center items-center px-[4px] mt-[0px] lg:mt-[20px] lg:px-[0px]">
                                            <div className="w-full h-[200px] lg:w-[900px] lg:h-[280px]">
                                                <ResponsiveBar
                                                    data={weeklyLearningData2}
                                                    keys={['accuracy']}
                                                    indexBy="date"
                                                    margin={{ top: 30, right: 30, bottom: 40, left: 50 }}
                                                    axisTop={null}
                                                    axisRight={null}
                                                    axisBottom={{
                                                        tickSize: 0,
                                                        tickPadding: 20,
                                                        tickRotation: 0,
                                                        format: (e) => {
                                                            let startDate = new Date(e);
                                                            let endDate = new Date(startDate);
                                                            endDate.setDate(endDate.getDate() + 6);
                                                            return (
                                                                <tspan className="text-[9px] lg:text-[16px]" fill="#1b1d1f">{startDate.getDate()}일-{endDate.getDate()}일</tspan>
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
                                                        fontSize: "14px",
                                                        textColor: "#999c9f"
                                                    }}
                                                    borderRadius={3}
                                                    padding={0.8}
                                                    colors={['#ff9957']}
                                                    colorBy="id"
                                                    label={(e) => {
                                                        return (
                                                            <tspan y="-14" className="text-[14px] lg:text-[16px]" fill={e.value === weeklyMaxAccuracy ? "#0063ff" : "#72787f"} fontWeight="700">{e.value}</tspan>
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

                                        <div className="text-[13px] font-bold text-[#061b3b] mt-[0px] px-[4px] lg:mt-[50px] lg:px-[60px] lg:text-[20px]">
                                            학습시간
                                        </div>

                                        <div className="flex justify-center items-center px-[4px] mt-[0px] lg:mt-[20px] lg:px-[0px]">
                                            <div className="w-full h-[200px] lg:w-[900px] lg:h-[280px]">
                                                <ResponsiveBar
                                                    data={weeklyLearningData2}
                                                    keys={['learningTimeMinutes']}
                                                    indexBy="date"
                                                    margin={{ top: 30, right: 30, bottom: 40, left: 50 }}
                                                    axisTop={null}
                                                    axisRight={null}
                                                    axisBottom={{
                                                        tickSize: 0,
                                                        tickPadding: 20,
                                                        tickRotation: 0,
                                                        format: (e) => {
                                                            let startDate = new Date(e);
                                                            let endDate = new Date(startDate);
                                                            endDate.setDate(endDate.getDate() + 6);
                                                            return (
                                                                <tspan className="text-[9px] lg:text-[16px]" fill="#1b1d1f">{startDate.getDate()}일-{endDate.getDate()}일</tspan>
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
                                                        fontSize: "14px",
                                                        textColor: "#999c9f"
                                                    }}
                                                    borderRadius={3}
                                                    padding={0.8}
                                                    colors={['#ffcd4e']}
                                                    colorBy="id"
                                                    label={(e) => {
                                                        return (
                                                            <tspan y="-14" className="text-[14px] lg:text-[16px]" fill={e.value === weeklyMaxLearningTimeMinutes ? "#0063ff" : "#72787f"} fontWeight="700">{e.value}</tspan>
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

                                        <div className="absolute bottom-[10px] left-0 w-full flex justify-between font-semibold text-[#464c52] lg:text-[16px] lg:bottom-[40px] ">
                                            <div className="w-[80px]">
                                            </div>
                                            <div>
                                                {year}.{month}
                                            </div>
                                            <div className="w-[80px] text-right pr-[10px] lg:pr-[40px]">
                                                4
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-[10px] flex justify-center px-[4px] lg:px-[0px] lg:mt-[60px]">
                                    <div className="relative bg-[#ffffff] w-full h-[800px] shadow-md rounded lg:w-[1040px] lg:h-[1400px]">
                                        <div className="text-[14px] mt-[20px] font-bold text-[#061b3b] text-center lg:mt-[50px] lg:text-[32px]">
                                            학습 레벨/단원 분석
                                        </div>

                                        <div className="px-[4px] mt-[20px] text-[#464c52] font-bold lg:px-[60px] lg:mt-[50px] lg:text-[20px]">
                                            {
                                                maxLevel > 0 ? (
                                                    <Fragment>
                                                        <div className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-[14px] w-[14px] lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-[14px] w-[14px] lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                                                <div className="w-[40%] h-[180px] lg:w-[320px] lg:h-[320px]">
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
                                                                    {e.datum.data.id}레벨: {e.datum.data.percent}%
                                                                </div>
                                                            )
                                                        }}
                                                    />
                                                </div>
                                                <div className="w-[60%] h-[180px] lg:w-[600px] lg:h-[320px] lg:pl-[20px]">
                                                    {
                                                        maxLevel > 0 ? (
                                                            <div className="flex flex-wrap flex-col h-[180px] lg:h-[320px]">
                                                                {
                                                                    levelData2 && levelData2.map((value, index) => (
                                                                        <div key={index} className={value.id === maxLevel ? "flex justify-center items-center text-[#0063ff] w-[50%] h-[30px] lg:text-[18px] lg:w-[290px] lg:h-[53px]" : "flex justify-center items-center text-[#464c52] w-[50%] h-[30px] lg:text-[18px] lg:w-[290px] lg:h-[53px]"}>
                                                                            <div className="w-[10%] flex justify-center items-center lg:w-[10px]">
                                                                                <div style={{ width: "10px", height: "10px", borderRadius: "25px", background: value.color }}></div>
                                                                            </div>
                                                                            <div className="w-[30%] lg:w-[120px] lg:pl-[10px]">{value.id}레벨</div>
                                                                            <div className="w-[30%] lg:w-[90px]">{value.percent}%</div>
                                                                            <div className="w-[30%] lg:w-[70px]">{value.value}개</div>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                        ) : (
                                                            <div className="lg:text-[20px]">
                                                                해당 월은 학습하지 않았어요.
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-[4px] mt-[20px] text-[#464c52] font-bold lg:px-[60px] lg:mt-[50px] lg:text-[20px]">
                                            {
                                                levelAndChapterMaxLevel > 0 ? (
                                                    <Fragment>
                                                        <div className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-[14px] w-[14px] lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-[14px] w-[14px] lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                                                <div className="w-[40%] h-[180px] lg:w-[320px] lg:h-[320px]">
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
                                                <div className="w-[60%] h-[180px] lg:w-[600px] lg:h-[320px] lg:pl-[20px]">
                                                    {
                                                        levelAndChapterMaxLevel > 0 ? (
                                                            <div>
                                                                <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "column" }}>
                                                                    {
                                                                        levelAndChapterData2 && levelAndChapterData2.length > 12 ? (
                                                                            <Fragment>
                                                                                {
                                                                                    levelAndChapterData2 && levelAndChapterData2.slice(0, 12).map((value, index) => (
                                                                                        <div key={index} className={value.level === levelAndChapterMaxLevel && value.chapter === levelAndChapterMaxChapter ? "flex items-center h-[30px] text-[#0063ff] lg:h-[50px]" : "flex items-center h-[30px] text-[#464c52] lg:h-[50px]"}>
                                                                                            <div className="w-[6%] flex justify-center items-center lg:w-[10px]">
                                                                                                <div style={{ width: "10px", height: "10px", borderRadius: "25px", background: value.color }}></div>
                                                                                            </div>
                                                                                            <div className="relative w-[64%] lg:w-[430px] lg:pl-[10px]">
                                                                                                <div className="hidden lg:block">
                                                                                                    <div className="text-[10px] lg:text-[18px]">{value.level}레벨 {value.chapter}단원 [{value.chapterName && value.chapterName.length > 21 ? value.chapterName.substr(0, 21) + ".." : value.chapterName}]</div>
                                                                                                    <div className="absolute top-0 left-[10px] w-[430px] h-[28px] opacity-0 lg:hover:opacity-100">
                                                                                                        <div className="absolute -top-1 -left-1 bg-[#54595e] text-[#ffffff] whitespace-nowrap inline-block p-[4px] rounded-lg">
                                                                                                            {value.level}레벨 {value.chapter}단원 [{value.chapterName}]
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="block pr-[4px] lg:pr-[0px] lg:hidden">
                                                                                                    <div className="text-[10px] lg:text-[18px]">{value.level}레벨 {value.chapter}단원 [{value.chapterName}]</div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="w-[15%] lg:w-[70px]">{value.percent}%</div>
                                                                                            <div className="w-[15%] lg:w-[70px]">{value.value}개</div>
                                                                                        </div>
                                                                                    ))
                                                                                }
                                                                                <div className="flex justify-center items-center h-[30px] lg:h-[50px]">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-[14px] w-[14px] lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                                                    </svg>
                                                                                </div>
                                                                            </Fragment>
                                                                        ) : (
                                                                            levelAndChapterData2 && levelAndChapterData2.map((value, index) => (
                                                                                <div key={index} className={value.level === levelAndChapterMaxLevel && value.chapter === levelAndChapterMaxChapter ? "flex items-center h-[30px] text-[#0063ff] lg:h-[50px]" : "flex items-center h-[30px] text-[#464c52] lg:h-[50px]"}>
                                                                                    <div className="w-[10%] flex justify-center items-center lg:w-[10px]">
                                                                                        <div style={{ width: "10px", height: "10px", borderRadius: "25px", background: value.color }}></div>
                                                                                    </div>
                                                                                    <div className="relative w-[60%] lg:w-[430px] lg:pl-[10px]">
                                                                                        <div className="hidden lg:block">
                                                                                            <div className="text-[10px] lg:text-[18px]">{value.level}레벨 {value.chapter}단원 [{value.chapterName && value.chapterName.length > 21 ? value.chapterName.substr(0, 21) + ".." : value.chapterName}]</div>
                                                                                            <div className="absolute top-0 left-[10px] w-[430px] h-[28px] opacity-0 lg:hover:opacity-100">
                                                                                                <div className="absolute -top-1 -left-1 bg-[#54595e] text-[#ffffff] whitespace-nowrap inline-block p-[4px] rounded-lg">
                                                                                                    {value.level}레벨 {value.chapter}단원 [{value.chapterName}]
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="block pr-[4px] lg:pr-[0px] lg:hidden">
                                                                                            <div className="text-[10px] lg:text-[18px]">{value.level}레벨 {value.chapter}단원 [{value.chapterName}]</div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="w-[15%] lg:w-[70px]">{value.percent}%</div>
                                                                                    <div className="w-[15%] lg:w-[70px]">{value.value}개</div>
                                                                                </div>
                                                                            ))
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="lg:text-[20px]">
                                                                해당 월은 학습하지 않았어요.
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        <div className="absolute bottom-[10px] left-0 w-full flex justify-between font-semibold text-[#464c52] lg:text-[16px] lg:bottom-[40px] ">
                                            <div className="w-[80px]">
                                            </div>
                                            <div>
                                                {year}.{month}
                                            </div>
                                            <div className="w-[80px] text-right pr-[10px] lg:pr-[40px]">
                                                5
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-[10px] flex justify-center px-[4px] lg:px-[0px] lg:mt-[60px]">
                                    <div className="relative bg-[#ffffff] w-full h-[800px] shadow-md rounded lg:w-[1040px] lg:h-[1400px]">
                                        <div className="text-[14px] mt-[20px] font-bold text-[#061b3b] text-center lg:mt-[50px] lg:text-[32px]">
                                            우수/취약 스테이지
                                        </div>

                                        <div className="px-[4px] mt-[20px] h-[300px] lg:mt-[50px] lg:h-[400px] lg:px-[60px]">
                                            <div className="text-[13px] text-[#061b3b] font-bold lg:text-[24px]">
                                                우수 스테이지
                                            </div>
                                            <div className="flex mt-[20px] items-center">
                                                <div>
                                                    <img src={GoodBadge} alt={"goodBadge"} />
                                                </div>
                                                <div className="text-[#616161] font-bold ml-[10px]">칭찬해 주세요!</div>
                                            </div>

                                            <div className="flex justify-center items-center border-t border-b mt-[20px] text-[#464c52] font-semibold h-[30px] text-[10px] lg:h-[50px] lg:text-[18px]">
                                                <div className="w-[8%] lg:w-[90px] lg:pl-[10px]">번호</div>
                                                <div className="w-[15%] lg:w-[100px]">날짜</div>
                                                <div className="w-[20%] lg:w-[120px]">레벨/단원</div>
                                                <div className="w-[37%] lg:w-[430px]">스테이지</div>
                                                <div className="w-[10%] lg:w-[80px]">등급</div>
                                                <div className="w-[10%] lg:w-[100px]">정확도</div>
                                            </div>
                                            {
                                                excellentLearningData && Array.isArray(excellentLearningData) && excellentLearningData.length === 0 ? (
                                                    <div className="flex items-center text-[#1b1d1f] pl-[10px] h-[30px] text-[10px] lg:text-[18px] lg:h-[50px]">
                                                        우수 스테이지가 없어요.
                                                    </div>
                                                ) : (
                                                    excellentLearningData && excellentLearningData.slice(0, 5).map((value, index) => (
                                                        <div key={index}>
                                                            <div className="flex justify-center items-center text-[#1b1d1f] h-[30px] lg:h-[50px] text-[10px] lg:text-[18px]">
                                                                <div className="w-[8%] lg:w-[90px] lg:pl-[10px]">{index + 1}</div>
                                                                <div className="w-[15%] lg:w-[100px]">{parseInt(value.month)}월 {parseInt(value.day)}일</div>
                                                                <div className="w-[20%] lg:w-[120px]">{value.level}레벨/{value.chapter}단원</div>
                                                                <div className="w-[37%] lg:w-[430px] pr-[4px] lg:pr-[0px]">{value.unitName}</div>
                                                                <div className="w-[10%] lg:w-[80px]">
                                                                    {
                                                                        value.grade === 1 ? (
                                                                            <span className="text-[#0063ff]">{value.grade}%</span>
                                                                        ) : (
                                                                            <span>{value.grade}%</span>
                                                                        )
                                                                    }
                                                                </div>
                                                                <div className="w-[10%] lg:w-[100px]">{value.accuracy}%</div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )
                                            }
                                        </div>

                                        <div className="px-[4px] mt-[20px] lg:mt-[50px] lg:h-[400px] lg:px-[60px]">
                                            <div className="text-[13px] text-[#061b3b] font-bold lg:text-[24px]">
                                                취약 스테이지
                                            </div>

                                            <div className="flex mt-[20px] items-center">
                                                <div>
                                                    <img src={BadBadge} alt={"badBadge"} />
                                                </div>
                                                <div className="text-[#616161] font-bold ml-[10px]">어려워 하고 있어요!</div>
                                            </div>

                                            <div className="flex justify-center items-center border-t border-b mt-[20px] text-[#464c52] font-semibold h-[30px] text-[10px] lg:text-[18px] lg:h-[50px]">
                                                <div className="w-[8%] lg:w-[100px] lg:pl-[10px]">번호</div>
                                                <div className="w-[15%] lg:w-[110px]">날짜</div>
                                                <div className="w-[25%] lg:w-[130px]">레벨/단원</div>
                                                <div className="w-[47%] lg:w-[490px]">스테이지</div>
                                                <div className="w-[10%] lg:w-[110px]">정확도</div>
                                            </div>
                                            {
                                                weekLearningData && Array.isArray(weekLearningData) && weekLearningData.length === 0 ? (
                                                    <div className="flex items-center h-[30px] text-[#1b1d1f] pl-[10px] text-[10px] lg:text-[18px] lg:h-[50px]">
                                                        취약 스테이지가 없어요.
                                                    </div>
                                                ) : (
                                                    weekLearningData && weekLearningData.slice(0, 5).map((value, index) => (
                                                        <div key={index}>
                                                            <div className="flex justify-center items-center h-[30px] text-[#1b1d1f]  text-[10px] lg:text-[18px] lg:h-[50px]">
                                                                <div className="w-[8%] lg:w-[100px] lg:pl-[10px]">{index + 1}</div>
                                                                <div className="w-[15%] lg:w-[110px]">{parseInt(value.month)}월 {parseInt(value.day)}일</div>
                                                                <div className="w-[20%] lg:w-[130px]">{value.level}레벨/{value.chapter}단원</div>
                                                                <div className="w-[47%] lg:w-[490px] pr-[4px] lg:pr-[0px]">{value.unitName}</div>
                                                                <div className="w-[10%] lg:w-[110px]">{value.accuracy}%</div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )
                                            }
                                        </div>

                                        <div className="absolute bottom-[10px] left-0 w-full flex justify-between font-semibold text-[#464c52] lg:text-[16px] lg:bottom-[40px] ">
                                            <div className="w-[80px]">
                                            </div>
                                            <div>
                                                {year}.{month}
                                            </div>
                                            <div className="w-[80px] text-right pr-[10px] lg:pr-[40px]">
                                                6
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-[10px] flex justify-center px-[4px] lg:px-[0px] lg:mt-[60px]">
                                    <div className="relative bg-[#ffffff] w-full h-[800px] shadow-md rounded lg:w-[1040px] lg:h-[1400px]">
                                        <div className="text-[14px] mt-[20px] font-bold text-[#061b3b] text-center lg:mt-[50px] lg:text-[32px]">
                                            상세 학습 결과
                                        </div>

                                        <div className="px-[4px] mt-[20px] lg:mt-[50px] lg:px-[60px]">
                                            <div className="text-[13px] text-[#061b3b] font-bold lg:text-[24px]">
                                                {month}월 등급 메달
                                            </div>
                                        </div>

                                        <div className="flex justify-between mt-[20px] text-[#464c52] font-semibold px-[4px] lg:px-[60px] lg:text-[20px]">
                                            <div className="flex justify-center w-[20%] lg:w-auto">
                                                <div>
                                                    <div className="w-[90%] h-[80px] mx-auto flex items-center lg:w-auto lg:h-[100px]">
                                                        <img src={OnePercentTrophy} alt={"onePercentTrophy"} />
                                                    </div>
                                                    <div className="w-[90%] text-center mx-auto mt-[10px] lg:mt-[20px] lg:w-auto">{onePercentTrophy}개</div>
                                                </div>
                                            </div>
                                            <div className="flex justify-center w-[20%] lg:w-auto">
                                                <div>
                                                    <div className="w-[72%] h-[80px] mx-auto flex items-center lg:w-auto lg:h-[100px]">
                                                        <img src={TenPercentTrophy} alt={"tenPercentTrophy"} />
                                                    </div>
                                                    <div className="w-[72%] text-center mx-auto mt-[10px] lg:mt-[20px] lg:w-auto">{tenPercentTrophy}개</div>
                                                </div>
                                            </div>
                                            <div className="flex justify-center w-[20%] lg:w-auto">
                                                <div>
                                                    <div className="w-[68%] h-[80px] mx-auto flex items-center lg:w-auto lg:h-[100px]">
                                                        <img src={ThirtyPercentTrophy} alt={"thirtyPercentTrophy"} />
                                                    </div>
                                                    <div className="w-[68%] text-center mx-auto mt-[10px] lg:mt-[20px] lg:w-auto">{thirtyPercentTrophy}개</div>
                                                </div>
                                            </div>
                                            <div className="flex justify-center w-[20%] lg:w-auto">
                                                <div>
                                                    <div className="w-[64%] h-[80px] mx-auto flex items-center lg:w-auto lg:h-[100px]">
                                                        <img src={FiftyPercentTrophy} alt={"fiftyPercentTrophy"} />
                                                    </div>
                                                    <div className="w-[64%] text-center mx-auto mt-[10px] lg:mt-[20px] lg:w-auto">{fiftyPercentTrophy}개</div>
                                                </div>
                                            </div>
                                            <div className="flex justify-center w-[20%] lg:w-auto">
                                                <div>
                                                    <div className="w-[60%] h-[80px] mx-auto flex items-center lg:w-auto lg:h-[100px]">
                                                        <img src={GoodTrophy} alt={"goodTrophy"} />
                                                    </div>
                                                    <div className="w-[60%] text-center mx-auto mt-[10px] lg:mt-[20px] lg:w-auto">{goodTrophy}개</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-[20px] px-[4px] flex lg:px-[60px] lg:mt-[50px]">
                                            <div className="flex items-center">
                                                <div>
                                                    <div className="w-[10px] h-[10px] rounded-full bg-[#0063ff]"></div>
                                                </div>
                                                <div className="flex font-semibold text-[10px] ml-[8px] lg:text-[16px]">
                                                    <span className="text-[#1b1d1f]">정확도</span>
                                                    <span className="text-[#0063ff]">&nbsp;90% 이상은 파란색</span>
                                                    <span className="text-[#1b1d1f]">입니다.</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center ml-[10px] lg:ml-[50px]">
                                                <div>
                                                    <div className="w-[10px] h-[10px] rounded-full bg-[#d61313]"></div>
                                                </div>
                                                <div className="flex font-semibold text-[10px] ml-[8px] lg:text-[16px]">
                                                    <span className="text-[#1b1d1f]">정확도</span>
                                                    <span className="text-[#d61313]">&nbsp;50% 이하는 빨간색</span>
                                                    <span className="text-[#1b1d1f]">입니다.</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-[4px] lg:px-[60px]">
                                            <div className="flex items-center text-[#464c52] font-semibold mt-[20px] border-b h-[30px] text-[9px] lg:h-[50px] lg:text-[18px]">
                                                <div className="w-[9%] lg:w-[80px] lg:pl-[10px]">날짜</div>
                                                <div className="w-[13%] lg:w-[100px]">학습 모드</div>
                                                <div className="w-[15%] lg:w-[120px]">레벨/단원</div>
                                                <div className="w-[32%] lg:w-[360px]">스테이지명</div>
                                                <div className="w-[13%] lg:w-[100px]">학습시간</div>
                                                <div className="w-[9%] lg:w-[80px]">등급</div>
                                                <div className="w-[9%] lg:w-[80px]">정확도</div>
                                            </div>
                                            {
                                                learningData2 && Array.isArray(learningData2) && learningData2.length === 0 ? (
                                                    <div className="flex items-center text-[#1b1d1f] h-[30px] pl-[10px] text-[9px] lg:h-[50px] lg:text-[18px]">
                                                        해당 월은 학습하지 않았어요.
                                                    </div>
                                                ) : (
                                                    <Fragment>
                                                        {
                                                            learningData2 && learningData2.slice(0, 16).map((value, index) => (
                                                                <div key={index}>
                                                                    <div className="flex items-center text-[#1b1d1f] h-[30px] text-[9px] lg:h-[50px] lg:text-[18px]">
                                                                        <div className="w-[9%] lg:w-[80px] lg:pl-[10px]">{value.month}.{value.day}</div>
                                                                        <div className="w-[13%] lg:w-[100px]">{value.learningMode}</div>
                                                                        <div className="w-[15%] lg:w-[120px]">{value.level}레벨/{value.chapter}단원</div>
                                                                        <div className="w-[32%] lg:w-[360px] relative">
                                                                            <div className="hidden lg:block">
                                                                                <div>{value.unitName && value.unitName.length > 22 ? value.unitName.substr(0, 22) + ".." : value.unitName}</div>
                                                                                <div className="absolute top-0 left-0 w-[360px] h-[50px] opacity-0 hover:opacity-100">
                                                                                    <div className="absolute -top-1 -left-1 bg-[#54595e] text-[#ffffff] whitespace-nowrap inline-block p-[4px] rounded-lg">
                                                                                        {value.unitName}
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            <div className="block lg:hidden">
                                                                                <div className="pr-[4px] lg:pr-[0px]">{value.unitName}</div>
                                                                            </div>                                                                            
                                                                        </div>

                                                                        <div className="w-[13%] lg:w-[100px]">
                                                                            {mm2(value.learningTimeSeconds)} {ss2(value.learningTimeSeconds)}
                                                                        </div>
                                                                        <div className="w-[9%] lg:w-[80px]">
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
                                                                        <div className="w-[9%] lg:w-[80px]">
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

                                        <div className="absolute bottom-[10px] left-0 w-full flex justify-between font-semibold text-[#464c52] lg:text-[16px] lg:bottom-[40px] ">
                                            <div className="w-[80px]">
                                            </div>
                                            <div>
                                                {year}.{month}
                                            </div>
                                            <div className="w-[80px] text-right pr-[10px] lg:pr-[40px]">
                                                7
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {[...Array(numberOfLearningData)].map((num, index) => {
                                    return (
                                        <div key={index} className="mt-[10px] flex justify-center px-[4px] lg:px-[0px] lg:mt-[60px]">
                                            <div className="relative bg-[#ffffff] w-full h-[800px] shadow-md rounded lg:w-[1040px] lg:h-[1400px]">
                                                <div className="mt-[20px] px-[4px] flex lg:px-[60px] lg:mt-[50px]">
                                                    <div className="flex items-center">
                                                        <div>
                                                            <div className="w-[10px] h-[10px] rounded-full bg-[#0063ff]"></div>
                                                        </div>
                                                        <div className="flex font-semibold text-[10px] ml-[8px] lg:text-[16px]">
                                                            <span className="text-[#1b1d1f]">정확도</span>
                                                            <span className="text-[#0063ff]">&nbsp;90% 이상은 파란색</span>
                                                            <span className="text-[#1b1d1f]">입니다.</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center ml-[10px] lg:ml-[50px]">
                                                        <div>
                                                            <div className="w-[10px] h-[10px] rounded-full bg-[#d61313]"></div>
                                                        </div>
                                                        <div className="flex font-semibold text-[10px] ml-[8px] lg:text-[16px]">
                                                            <span className="text-[#1b1d1f]">정확도</span>
                                                            <span className="text-[#d61313]">&nbsp;50% 이하는 빨간색</span>
                                                            <span className="text-[#1b1d1f]">입니다.</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="px-[4px] lg:px-[60px]">
                                                    <div className="flex items-center text-[#464c52] font-semibold mt-[20px] border-b h-[30px] text-[9px] lg:h-[50px] lg:text-[18px]">
                                                    <div className="w-[9%] lg:w-[80px] lg:pl-[10px]">날짜</div>
                                                    <div className="w-[13%] lg:w-[100px]">학습 모드</div>
                                                    <div className="w-[15%] lg:w-[120px]">레벨/단원</div>
                                                    <div className="w-[32%] lg:w-[360px]">스테이지명</div>
                                                    <div className="w-[13%] lg:w-[100px]">학습시간</div>
                                                    <div className="w-[9%] lg:w-[80px]">등급</div>
                                                    <div className="w-[9%] lg:w-[80px]">정확도</div>
                                                </div>
                                                    <Fragment>
                                                        {
                                                            learningData3 && learningData3.slice(0 + (23 * index), 23 + (23 * index)).map((value, index) => (
                                                                <div key={index}>
                                                                    <div className="flex items-center text-[#1b1d1f] h-[30px] text-[9px] lg:h-[50px] lg:text-[18px]">
                                                                        <div className="w-[9%] lg:w-[80px] lg:pl-[10px]">{value.month}.{value.day}</div>
                                                                        <div className="w-[13%] lg:w-[100px]">{value.learningMode}</div>
                                                                        <div className="w-[15%] lg:w-[120px]">{value.level}레벨/{value.chapter}단원</div>
                                                                        <div className="w-[32%] lg:w-[360px] relative">
                                                                            <div className="hidden lg:block">
                                                                                <div>{value.unitName && value.unitName.length > 22 ? value.unitName.substr(0, 22) + ".." : value.unitName}</div>
                                                                                <div className="absolute top-0 left-0 w-[360px] h-[50px] opacity-0 hover:opacity-100">
                                                                                    <div className="absolute -top-1 -left-1 bg-[#54595e] text-[#ffffff] whitespace-nowrap inline-block p-[4px] rounded-lg">
                                                                                        {value.unitName}
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            <div className="block lg:hidden">
                                                                                <div className="pr-[4px] lg:pr-[0px]">{value.unitName}</div>
                                                                            </div>                                                                            
                                                                        </div>

                                                                        <div className="w-[13%] lg:w-[100px]">
                                                                            {mm2(value.learningTimeSeconds)} {ss2(value.learningTimeSeconds)}
                                                                        </div>
                                                                        <div className="w-[9%] lg:w-[80px]">
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
                                                                        <div className="w-[9%] lg:w-[80px]">
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

                                                <div className="absolute bottom-[10px] left-0 w-full flex justify-between font-semibold text-[#464c52] lg:text-[16px] lg:bottom-[40px] ">
                                                    <div className="w-[80px]">
                                                    </div>
                                                    <div>
                                                        {year}.{month}
                                                    </div>
                                                    <div className="w-[80px] text-right pr-[10px] lg:pr-[40px]">
                                                        {8 + index}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="h-screen flex justify-center items-center">
                            <div>
                                <div className="flex justify-center">
                                    <img src={Logo} alt="logo" />
                                </div>
                                <div className="flex justify-center mt-[20px] text-[16px] text-center">
                                    {checkLine(errorMessage)}
                                </div>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="h-screen flex justify-center items-center">
                        <div>
                            <div className="flex justify-center">
                                <img src={Logo} alt="logo" />
                            </div>
                            <div className="flex justify-center mt-[20px] text-[16px]">
                                링크 주소를 다시 한번 확인해 주세요.
                            </div>
                        </div>
                    </div>
                )
            }
        </Fragment>
    )
}

export default MonthlyReport;