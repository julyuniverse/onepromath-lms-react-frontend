import { Fragment, useEffect, useState, forwardRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { attendanceWeek, dailyLearningData, learningData } from "../../../../../../../../api/axios";
import ScrollToTopButton from "../../../../../../../../components/ScrollToTopButton";
import Learning from "../../../../../../../../assets/images/learning.png";
import Accuracy from "../../../../../../../../assets/images/accuracy.png";
import Time from "../../../../../../../../assets/images/time.png";
import { ResponsiveBar } from '@nivo/bar' // nivo chart api
import ClassicSpinnerLoader from "../../../../../../../../components/ClassicSpinnerLoader";
import DatePicker from "react-datepicker"; // react date picker API
import { ko } from "date-fns/esm/locale"; // react date picker 한국어 설정에 필요한 API
import "react-datepicker/dist/react-datepicker.css"; // react date picker css import

const DailyLearning = () => {
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [attendanceWeekData, setAttendanceWeekData] = useState([]);
    const [totalLearningCount, setTotalLearningCount] = useState(0.0);
    const [accuracy, setAccuracy] = useState(0.0);
    const [totalLearningTimeSeconds, setTotalLearningTimeSeconds] = useState(0);
    const learningModeEn = ["daily", "free", "onepro", "world"];
    const [dailyLearningData2, setDailyLearningData2] = useState([]);
    const [maxLearningCount, setMaxLearningCount] = useState(0);
    const [maxAccuracy, setMaxAccuracy] = useState(0.0);
    const [maxLearningTimeMinutes, setMaxLearningTimeMinutes] = useState(0);
    const [learningData2, setLearningData2] = useState([]);
    const [datePickerStartDate, setDatePickerStartDate] = useState("");

    const getDayData = async () => {
        if (params.startdate) { // params.startdate가 있을 때
            let nowDate = new Date(params.startdate);
            let startDateYear = nowDate.getFullYear();
            let startDateMonth = (nowDate.getMonth() + 1) < 10 ? "0" + (nowDate.getMonth() + 1) : (nowDate.getMonth() + 1);
            let startDateDay = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
            let startDate2 = startDateYear + "-" + startDateMonth + "-" + startDateDay;
            setStartDate(startDate2);
            setDatePickerStartDate(nowDate);

            let tmpWeekStartDate = new Date(startDate2);
            let days = tmpWeekStartDate.getDay() === 0 ? 6 : tmpWeekStartDate.getDay() - 1;
            let tmpWeekStartDate2 = new Date(tmpWeekStartDate.setDate(tmpWeekStartDate.getDate() - days));
            let weekStartDateYear = tmpWeekStartDate2.getFullYear();
            let weekStartDateMonth = (tmpWeekStartDate2.getMonth() + 1) < 10 ? "0" + (tmpWeekStartDate2.getMonth() + 1) : (tmpWeekStartDate2.getMonth() + 1);
            let weekStartDateDay = tmpWeekStartDate2.getDate() < 10 ? "0" + tmpWeekStartDate2.getDate() : tmpWeekStartDate2.getDate();
            let startDate3 = weekStartDateYear + "-" + weekStartDateMonth + "-" + weekStartDateDay;

            let endDate = new Date(startDate2);
            let endDate2 = new Date(endDate.setDate(endDate.getDate() + 1));
            let endDateYear = endDate2.getFullYear();
            let endDateMonth = (endDate2.getMonth() + 1) < 10 ? "0" + (endDate2.getMonth() + 1) : (endDate2.getMonth() + 1);
            let endDateDay = endDate2.getDate() < 10 ? "0" + endDate2.getDate() : endDate2.getDate();
            let endDate3 = endDateYear + "-" + endDateMonth + "-" + endDateDay;

            await getAttendanceWeek(params.studentno, startDate3, startDate2);
            await getDailyLearningData(params.studentno, startDate2, endDate3);
            await getLearningData(params.studentno, startDate2, endDate3);
        } else {
            let nowDate = new Date();
            let startDateYear = nowDate.getFullYear();
            let startDateMonth = (nowDate.getMonth() + 1) < 10 ? "0" + (nowDate.getMonth() + 1) : (nowDate.getMonth() + 1);
            let startDateDay = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
            let startDate2 = startDateYear + "-" + startDateMonth + "-" + startDateDay;
            setStartDate(startDate2);
            setDatePickerStartDate(nowDate);

            let tmpWeekStartDate = new Date(startDate2);
            let days = tmpWeekStartDate.getDay() === 0 ? 6 : tmpWeekStartDate.getDay() - 1;
            let tmpWeekStartDate2 = new Date(tmpWeekStartDate.setDate(tmpWeekStartDate.getDate() - days));
            let weekStartDateYear = tmpWeekStartDate2.getFullYear();
            let weekStartDateMonth = (tmpWeekStartDate2.getMonth() + 1) < 10 ? "0" + (tmpWeekStartDate2.getMonth() + 1) : (tmpWeekStartDate2.getMonth() + 1);
            let weekStartDateDay = tmpWeekStartDate2.getDate() < 10 ? "0" + tmpWeekStartDate2.getDate() : tmpWeekStartDate2.getDate();
            let startDate3 = weekStartDateYear + "-" + weekStartDateMonth + "-" + weekStartDateDay;

            let endDate = new Date(startDate2);
            let endDate2 = new Date(endDate.setDate(endDate.getDate() + 1));
            let endDateYear = endDate2.getFullYear();
            let endDateMonth = (endDate2.getMonth() + 1) < 10 ? "0" + (endDate2.getMonth() + 1) : (endDate2.getMonth() + 1);
            let endDateDay = endDate2.getDate() < 10 ? "0" + endDate2.getDate() : endDate2.getDate();
            let endDate3 = endDateYear + "-" + endDateMonth + "-" + endDateDay;

            await getAttendanceWeek(params.studentno, startDate3, startDate2);
            await getDailyLearningData(params.studentno, startDate2, endDate3);
            await getLearningData(params.studentno, startDate2, endDate3);
        }
    }

    const getAttendanceWeek = async (studentNo, startDate, startDate2) => { // 주간 (출석, 학습 데이터)
        await attendanceWeek(studentNo, startDate)
            .then((res) => {
                setAttendanceWeekData(res.data);

                let learningCount = 0;
                let totalCount = 0;
                let rightCount = 0;
                let learningTimeSeconds = 0;

                for (let i = 0; i < res.data.length; i++) {
                    if (startDate2 === res.data[i].learningDate) {
                        learningCount += res.data[i].learningCount;
                        totalCount += res.data[i].totalCount;
                        rightCount += res.data[i].rightCount;
                        learningTimeSeconds += res.data[i].learningTimeSeconds;
                    }
                }

                setTotalLearningCount(learningCount);
                setAccuracy(rightCount !== 0 ? Math.ceil((rightCount / totalCount * 100) * 10) / 10 : 0);
                setTotalLearningTimeSeconds(learningTimeSeconds);
            })
    }

    const getDailyLearningData = async (studentNo, startDate, endDate) => { // 일별 학습 데이터
        await dailyLearningData(studentNo, startDate, endDate)
            .then((res) => {
                setDailyLearningData2(res.data);
                // 최고 학습량
                let maxLearningCount = 0;
                for (let i = 0; i < res.data.length; i++) {
                    for (let j = 0; j < learningModeEn.length; j++) {
                        if (eval(`res.data[${i}].${learningModeEn[j]}LearningCount`) > maxLearningCount) {
                            maxLearningCount = eval(`res.data[${i}].${learningModeEn[j]}LearningCount`);
                        }
                    }

                }
                if (maxLearningCount > 3) {
                    setMaxLearningCount(maxLearningCount);
                } else {
                    setMaxLearningCount(3);
                }

                // 최고 정확도
                let maxAccuracy = 0;
                for (let i = 0; i < res.data.length; i++) {
                    for (let j = 0; j < learningModeEn.length; j++) {
                        if (eval(`res.data[${i}].${learningModeEn[j]}Accuracy`) > maxAccuracy) {
                            maxAccuracy = eval(`res.data[${i}].${learningModeEn[j]}Accuracy`);
                        }
                    }
                }

                if (maxAccuracy > 1) {
                    setMaxAccuracy(maxAccuracy);
                } else {
                    setMaxAccuracy(1);
                }

                // 최고 학습시간 (분)
                let maxLearningTimeMinutes = 0;
                for (let i = 0; i < res.data.length; i++) {
                    for (let j = 0; j < learningModeEn.length; j++) {
                        if (eval(`res.data[${i}].${learningModeEn[j]}LearningTimeMinutes`) > maxLearningTimeMinutes) {
                            maxLearningTimeMinutes = eval(`res.data[${i}].${learningModeEn[j]}LearningTimeMinutes`);
                        }
                    }
                }

                if (maxLearningTimeMinutes > 5) {
                    setMaxLearningTimeMinutes(maxLearningTimeMinutes);
                } else {
                    setMaxLearningTimeMinutes(5);
                }
            })
    }

    const getLearningData = async (studentNo, startDate, endDate) => { // 학습 데이터
        await learningData(studentNo, startDate, endDate)
            .then((res) => {
                setLearningData2(res.data);
            })
    }

    const onChangeDate = (number) => {
        if (params.startdate) { // params.startdate가 있을 때
            let nowDate = new Date(params.startdate);
            let thisDate = new Date(nowDate.setDate(nowDate.getDate() + number));

            let tmpStartDateYear = thisDate.getFullYear();
            let tmpStartDateMonth = (thisDate.getMonth() + 1) < 10 ? "0" + (thisDate.getMonth() + 1) : (thisDate.getMonth() + 1);
            let tmpStartDateDay = thisDate.getDate() < 10 ? "0" + thisDate.getDate() : thisDate.getDate();
            let startDate2 = tmpStartDateYear + "-" + tmpStartDateMonth + "-" + tmpStartDateDay;

            navigate(`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/averagelearningstatus/learningdetails/${params.studentno}/${params.studentname}/3/${startDate2}`);
        } else {
            let nowDate = new Date(startDate);
            let thisDate = new Date(nowDate.setDate(nowDate.getDate() + number));

            let tmpStartDateYear = thisDate.getFullYear();
            let tmpStartDateMonth = (thisDate.getMonth() + 1) < 10 ? "0" + (thisDate.getMonth() + 1) : (thisDate.getMonth() + 1);
            let tmpStartDateDay = thisDate.getDate() < 10 ? "0" + thisDate.getDate() : thisDate.getDate();
            let startDate2 = tmpStartDateYear + "-" + tmpStartDateMonth + "-" + tmpStartDateDay;

            navigate(`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/averagelearningstatus/learningdetails/${params.studentno}/${params.studentname}/3/${startDate2}`);
        }
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

    const ReactDatePickerCustomInput = forwardRef(({ value, onClick }, ref) => ( // react date picker custom input
        <button onClick={onClick} ref={ref} style={{ fontSize: "18px", color: "#464c52", fontWeight: "700" }}>
            {value}
        </button>
    ));

    const ReactDatePickerOnChange = (e) => { // react date picker custom onchange
        setDatePickerStartDate(e);
        let nowDate = new Date(e);
        let startDateYear = nowDate.getFullYear();
        let startDateMonth = (nowDate.getMonth() + 1) < 10 ? "0" + (nowDate.getMonth() + 1) : (nowDate.getMonth() + 1);
        let startDateDay = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
        let startDate2 = startDateYear + "-" + startDateMonth + "-" + startDateDay;
        setStartDate(startDate2);

        navigate(`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/averagelearningstatus/learningdetails/${params.studentno}/${params.studentname}/3/${startDate2}`);
    }

    useEffect(async () => {
        setIsLoading(true);
        await getDayData();
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
            <div className="flex justify-between items-center mt-[40px]">
                <div className="w-[200px]">
                    <div className="text-[24px] font-bold">
                        출석 현황
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="w-[32px] h-[32px] bg-[#e4e7e9] rounded-lg flex justify-center items-center cursor-pointer" onClick={() => onChangeDate(-1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>

                    <div className="w-[150px] px-[20px] font-bold text-[#464c52] select-none text-center">
                        <DatePicker
                            calendarClassName="rasta-stripes"
                            locale={ko}
                            dateFormat="yyyy-MM-dd"
                            selected={datePickerStartDate}
                            onChange={ReactDatePickerOnChange}
                            customInput={<ReactDatePickerCustomInput />}
                        />
                    </div>

                    <div className="w-[32px] h-[32px] bg-[#e4e7e9] rounded-lg flex justify-center items-center cursor-pointer" onClick={() => onChangeDate(1)} >
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
                                        <div>
                                            <div className="flex justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className={value.learningDate === startDate ? "h-6 w-6 text-[#0063ff]" : "h-6 w-6 text-[#ffffff]"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                                                </svg>
                                            </div>
                                            <div className="flex justify-center">
                                                {value.dayOfWeek}
                                            </div>
                                        </div>
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

            <div className="mt-[20px] w-full h-[400px] bg-[#ffffff] rounded-2xl shadow-md">
                <div className="flex items-center h-[60px] pl-[30px]">
                    <div className="flex items-center">
                        <div className="bg-[#558fe8] w-[10px] h-[10px] rounded-full"></div>
                        <div className="pl-[8px] pr-[24px]">오늘의 학습</div>
                    </div>
                    <div className="flex items-center">
                        <div className="bg-[#fac232] w-[10px] h-[10px] rounded-full"></div>
                        <div className="pl-[8px] pr-[24px]">자유 학습</div>
                    </div>
                    <div className="flex items-center">
                        <div className="bg-[#f67b70] w-[10px] h-[10px] rounded-full"></div>
                        <div className="pl-[8px] pr-[24px]">일프로 도전</div>
                    </div>
                    <div className="flex items-center">
                        <div className="bg-[#3bc7b9] w-[10px] h-[10px] rounded-full"></div>
                        <div className="pl-[8px] pr-[24px]">연산 월드</div>
                    </div>
                </div>


                <div className="flex justify-center">
                    <div className="w-[350px]">
                        <div className="flex justify-center items-center h-[280px]">
                            <div style={{ width: "300px", height: "260px" }}>
                                <ResponsiveBar
                                    data={dailyLearningData2}
                                    keys={['dailyLearningCount', 'freeLearningCount', 'oneproLearningCount', 'worldLearningCount']}
                                    indexBy="learningDate"
                                    margin={{ top: 30, right: 20, bottom: 20, left: 50 }}
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={null}
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
                                    borderRadius={"3px"}
                                    padding={0.1}
                                    innerPadding={30}
                                    tooltip={(e) => {
                                        const thisLearningMode = (id) => {
                                            let learningMode = "";
                                            if (id === "dailyLearningCount") {
                                                learningMode = "오늘의 학습";
                                            } else if (id === "freeLearningCount") {
                                                learningMode = "자유 학습";
                                            } else if (id === "oneproLearningCount") {
                                                learningMode = "일프로 도전";
                                            } else if (id === "worldLearningCount") {
                                                learningMode = "연산 월드";
                                            }

                                            return learningMode;
                                        }
                                        return (
                                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "4px 6px", fontSize: "16px", borderRadius: "8px", background: "#fafafa", boxShadow: "4px 4px 4px 1px rgba(192, 192, 192, 0.8)" }}>
                                                {thisLearningMode(e.id)}: {e.value}개
                                            </div>
                                        )
                                    }}
                                    colors={["#558fe8", "#fac232", "#f67b70", "#3bc7b9"]}
                                    label={(e) => {
                                        return (
                                            <tspan y="-14" fontSize="16px" fontWeight="500" fill="#72787f">{e.value}</tspan>
                                        )
                                    }}
                                    maxValue={maxLearningCount <= 6 ? maxLearningCount : "auto"}
                                    gridYValues={maxLearningCount <= 6 ? maxLearningCount : 6}
                                />
                            </div>
                        </div>
                        <div className="h-[60px] flex justify-center text-[18px] text-[#72787f]">
                            학습량
                        </div>
                    </div>

                    <div className="w-[350px]">
                        <div className="flex justify-center items-center h-[280px]">
                            <div style={{ width: "300px", height: "260px" }}>
                                <ResponsiveBar
                                    data={dailyLearningData2}
                                    keys={['dailyAccuracy', 'freeAccuracy', 'oneproAccuracy', 'worldAccuracy']}
                                    indexBy="learningDate"
                                    margin={{ top: 30, right: 20, bottom: 20, left: 50 }}
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={null}
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
                                    borderRadius={"3px"}
                                    padding={0.1}
                                    innerPadding={30}
                                    tooltip={(e) => {
                                        const thisLearningMode = (id) => {
                                            let learningMode = "";
                                            if (id === "dailyAccuracy") {
                                                learningMode = "오늘의 학습";
                                            } else if (id === "freeAccuracy") {
                                                learningMode = "자유 학습";
                                            } else if (id === "oneproAccuracy") {
                                                learningMode = "일프로 도전";
                                            } else if (id === "worldAccuracy") {
                                                learningMode = "연산 월드";
                                            }

                                            return learningMode;
                                        }
                                        return (
                                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "4px 6px", fontSize: "16px", borderRadius: "8px", background: "#fafafa", boxShadow: "4px 4px 4px 1px rgba(192, 192, 192, 0.8)" }}>
                                                {thisLearningMode(e.id)}: {e.value}%
                                            </div>
                                        )
                                    }}
                                    colors={["#558fe8", "#fac232", "#f67b70", "#3bc7b9"]}
                                    label={(e) => {
                                        return (
                                            <tspan y="-14" fontSize="16px" fontWeight="500" fill="#72787f">{e.value}</tspan>
                                        )
                                    }}
                                    maxValue={100}
                                    gridYValues={5}
                                />
                            </div>
                        </div>
                        <div className="h-[60px] flex justify-center text-[18px] text-[#72787f]">
                            정확도
                        </div>
                    </div>

                    <div className="w-[350px]">
                        <div className="flex justify-center items-center h-[280px]">
                            <div style={{ width: "300px", height: "260px" }}>
                                <ResponsiveBar
                                    data={dailyLearningData2}
                                    keys={['dailyLearningTimeMinutes', 'freeLearningTimeMinutes', 'oneproLearningTimeMinutes', 'worldLearningTimeMinutes']}
                                    indexBy="learningDate"
                                    margin={{ top: 30, right: 20, bottom: 20, left: 50 }}
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={null}
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
                                    borderRadius={"3px"}
                                    padding={0.1}
                                    innerPadding={30}
                                    tooltip={(e) => {
                                        const thisLearningMode = (id) => {
                                            let learningMode = "";
                                            if (id === "dailyLearningTimeMinutes") {
                                                learningMode = "오늘의 학습";
                                            } else if (id === "freeLearningTimeMinutes") {
                                                learningMode = "자유 학습";
                                            } else if (id === "oneproLearningTimeMinutes") {
                                                learningMode = "일프로 도전";
                                            } else if (id === "worldLearningTimeMinutes") {
                                                learningMode = "연산 월드";
                                            }

                                            return learningMode;
                                        }
                                        return (
                                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "4px 6px", fontSize: "16px", borderRadius: "8px", background: "#fafafa", boxShadow: "4px 4px 4px 1px rgba(192, 192, 192, 0.8)" }}>
                                                {thisLearningMode(e.id)}: {e.value}분
                                            </div>
                                        )
                                    }}
                                    colors={["#558fe8", "#fac232", "#f67b70", "#3bc7b9"]}
                                    label={(e) => {
                                        return (
                                            <tspan y="-14" fontSize="16px" fontWeight="500" fill="#72787f">{e.value}</tspan>
                                        )
                                    }}
                                    maxValue={maxLearningTimeMinutes <= 6 ? maxLearningTimeMinutes : "auto"}
                                    gridYValues={maxLearningTimeMinutes <= 6 ? maxLearningTimeMinutes : 6}
                                />
                            </div>
                        </div>
                        <div className="h-[60px] flex justify-center text-[18px] text-[#72787f]">
                            학습시간
                        </div>
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

                <div className="px-[30px]">
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
                                해당 일은 학습하지 않았어요.
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

export default DailyLearning;