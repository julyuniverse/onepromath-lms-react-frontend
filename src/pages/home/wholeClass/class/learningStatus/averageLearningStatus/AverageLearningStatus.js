import { Fragment, useEffect, useState } from "react";
import { ResponsiveScatterPlot } from '@nivo/scatterplot' // nivo chart api
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { averageStudents, averageClass } from "../../../../../../api/axios";
import StageIcon from "../../../../../../assets/images/icon/stage.png";
import AccuracyIcon from "../../../../../../assets/images/icon/accuracy.png";
import TimeIcon from "../../../../../../assets/images/icon/time.png";

const AverageLearningStatus = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const [subTabMenu, setSubTabMenu] = useState(1);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [averageStudentList, setAverageStudentList] = useState("");
    const [sort, setSort] = useState(1); // 학생 목록 정렬 기준
    const [order, setOrder] = useState(true); // 학생 목록 순 방향
    const [scatterChartData, setScatterChartData] = useState([]);
    const [averageClassData, setAverageClassData] = useState([]);
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");

    const getAverageData = () => { // 평균 데이터
        if (params.subtabmenu) { // params.subtabmenu가 존재한다면
            if (Number(params.subtabmenu) === 1 && (!params.startdate)) { // 월별 학습 평균 (params.startdate가 없을 때)
                setSubTabMenu(1);
                setSort(1);
                setOrder(true);

                let nowDate = new Date();
                let getFullYear = nowDate.getFullYear();
                let getMonth = nowDate.getMonth();
                let tmpStartDate = new Date(getFullYear, getMonth, 1);
                let tmpEndDate = new Date(getFullYear, getMonth + 1, 0);

                let tmpStartDateYear = tmpStartDate.getFullYear();
                setYear(tmpStartDateYear);
                let tmpStartDateMonth = (tmpStartDate.getMonth() + 1) < 10 ? "0" + (tmpStartDate.getMonth() + 1) : (tmpStartDate.getMonth() + 1);
                setMonth(tmpStartDateMonth);
                let tmpStartDateDay = tmpStartDate.getDate() < 10 ? "0" + tmpStartDate.getDate() : tmpStartDate.getDate();
                let startDate2 = tmpStartDateYear + "-" + tmpStartDateMonth + "-" + tmpStartDateDay;
                setStartDate(startDate2);

                let tmpEndDateYear = tmpEndDate.getFullYear();
                let tmpEndDateMonth = (tmpEndDate.getMonth() + 1) < 10 ? "0" + (tmpEndDate.getMonth() + 1) : (tmpEndDate.getMonth() + 1);
                let tmpEndDateDay = tmpEndDate.getDate() < 10 ? "0" + tmpEndDate.getDate() : tmpEndDate.getDate();
                let endDate2 = tmpEndDateYear + "-" + tmpEndDateMonth + "-" + tmpEndDateDay;

                getAverageStudents(window.sessionStorage.getItem("schoolinfono"), params.classno, startDate2, endDate2, 1, true);
                getAverageClass(window.sessionStorage.getItem("schoolinfono"), params.classno, startDate2, endDate2);
            } else if (Number(params.subtabmenu) === 2 && (!params.startdate)) { // 주별 학습 평균 (params.startdate가 없을 때)
                setSubTabMenu(2);
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

                getAverageStudents(window.sessionStorage.getItem("schoolinfono"), params.classno, startDate2, endDate2, 1, true);
                getAverageClass(window.sessionStorage.getItem("schoolinfono"), params.classno, startDate2, endDate2);
            } else if (Number(params.subtabmenu) === 3 && (!params.startdate)) { // 일별 학습 평균 (params.startdate가 없을 때)
                setSubTabMenu(3);
                setSort(1);
                setOrder(true);

                let nowDate = new Date();
                let getFullYear = nowDate.getFullYear();
                let getMonth = (nowDate.getMonth() + 1) < 10 ? "0" + (nowDate.getMonth() + 1) : (nowDate.getMonth() + 1);
                let getDay = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
                let startDate2 = getFullYear + "-" + getMonth + "-" + getDay;
                setStartDate(startDate2);

                getAverageStudents(window.sessionStorage.getItem("schoolinfono"), params.classno, startDate2, startDate2, 1, true);
                getAverageClass(window.sessionStorage.getItem("schoolinfono"), params.classno, startDate2, startDate2);
            } else if (Number(params.subtabmenu) === 1) { // 월별 학습 평균 (params.startdate가 있을 때)
                setSubTabMenu(1);
                setSort(Number(params.sort)); // int 값을 url 파라미터로 사용 시 다시 받을 때 int 타입으로 변경해야 한다.

                if (params.order === "true") { // boolean 값을 url 파라미터로 사용 시 다시 받을 때 boolean 타입으로 변경해야 한다.
                    setOrder(true);
                } else {
                    setOrder(false);
                }

                let nowDate = new Date(params.startdate);
                let getFullYear = nowDate.getFullYear();
                let getMonth = nowDate.getMonth();
                let tmpStartDate = new Date(getFullYear, getMonth, 1);
                let tmpEndDate = new Date(getFullYear, getMonth + 1, 0);

                let tmpStartDateYear = tmpStartDate.getFullYear();
                setYear(tmpStartDateYear);
                let tmpStartDateMonth = (tmpStartDate.getMonth() + 1) < 10 ? "0" + (tmpStartDate.getMonth() + 1) : (tmpStartDate.getMonth() + 1);
                setMonth(tmpStartDateMonth);
                let tmpStartDateDay = tmpStartDate.getDate() < 10 ? "0" + tmpStartDate.getDate() : tmpStartDate.getDate();
                let startDate2 = tmpStartDateYear + "-" + tmpStartDateMonth + "-" + tmpStartDateDay;
                setStartDate(startDate2);

                let tmpEndDateYear = tmpEndDate.getFullYear();
                let tmpEndDateMonth = (tmpEndDate.getMonth() + 1) < 10 ? "0" + (tmpEndDate.getMonth() + 1) : (tmpEndDate.getMonth() + 1);
                let tmpEndDateDay = tmpEndDate.getDate() < 10 ? "0" + tmpEndDate.getDate() : tmpEndDate.getDate();
                let endDate2 = tmpEndDateYear + "-" + tmpEndDateMonth + "-" + tmpEndDateDay;

                getAverageStudents(window.sessionStorage.getItem("schoolinfono"), params.classno, startDate2, endDate2, params.sort, params.order);
                getAverageClass(window.sessionStorage.getItem("schoolinfono"), params.classno, startDate2, endDate2);
            } else if (Number(params.subtabmenu) === 2) { // 주별 학습 평균 (params.startdate가 있을 때)
                setSubTabMenu(2);
                setSort(Number(params.sort)); // int 값을 url 파라미터로 사용 시 다시 받을 때 int 타입으로 변경해야 한다.

                if (params.order === "true") { // boolean 값을 url 파라미터로 사용 시 다시 받을 때 boolean 타입으로 변경해야 한다.
                    setOrder(true);
                } else {
                    setOrder(false);
                }

                let nowDate = new Date(params.startdate);
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

                getAverageStudents(window.sessionStorage.getItem("schoolinfono"), params.classno, startDate2, endDate2, params.sort, params.order);
                getAverageClass(window.sessionStorage.getItem("schoolinfono"), params.classno, startDate2, endDate2);
            } else if (Number(params.subtabmenu) === 3) { // 일별 학습 평균 (params.startdate가 있을 때)
                setSubTabMenu(3);
                setSort(Number(params.sort)); // int 값을 url 파라미터로 사용 시 다시 받을 때 int 타입으로 변경해야 한다.

                if (params.order === "true") { // boolean 값을 url 파라미터로 사용 시 다시 받을 때 boolean 타입으로 변경해야 한다.
                    setOrder(true);
                } else {
                    setOrder(false);
                }

                let nowDate = new Date(params.startdate);
                let getFullYear = nowDate.getFullYear();
                let getMonth = (nowDate.getMonth() + 1) < 10 ? "0" + (nowDate.getMonth() + 1) : (nowDate.getMonth() + 1);
                let getDay = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
                let startDate2 = getFullYear + "-" + getMonth + "-" + getDay;
                setStartDate(startDate2);

                getAverageStudents(window.sessionStorage.getItem("schoolinfono"), params.classno, startDate2, startDate2, params.sort, params.order);
                getAverageClass(window.sessionStorage.getItem("schoolinfono"), params.classno, startDate2, startDate2);
            }
        } else {
            let nowDate = new Date();
            let getFullYear = nowDate.getFullYear();
            let getMonth = nowDate.getMonth();
            let tmpStartDate = new Date(getFullYear, getMonth, 1);
            let tmpEndDate = new Date(getFullYear, getMonth + 1, 0);

            let tmpStartDateYear = tmpStartDate.getFullYear();
            setYear(tmpStartDateYear);
            let tmpStartDateMonth = (tmpStartDate.getMonth() + 1) < 10 ? "0" + (tmpStartDate.getMonth() + 1) : (tmpStartDate.getMonth() + 1);
            setMonth(tmpStartDateMonth);
            let tmpStartDateDay = tmpStartDate.getDate() < 10 ? "0" + tmpStartDate.getDate() : tmpStartDate.getDate();
            let startDate2 = tmpStartDateYear + "-" + tmpStartDateMonth + "-" + tmpStartDateDay;
            setStartDate(startDate2);

            let tmpEndDateYear = tmpEndDate.getFullYear();
            let tmpEndDateMonth = (tmpEndDate.getMonth() + 1) < 10 ? "0" + (tmpEndDate.getMonth() + 1) : (tmpEndDate.getMonth() + 1);
            let tmpEndDateDay = tmpEndDate.getDate() < 10 ? "0" + tmpEndDate.getDate() : tmpEndDate.getDate();
            let endDate2 = tmpEndDateYear + "-" + tmpEndDateMonth + "-" + tmpEndDateDay;

            getAverageStudents(window.sessionStorage.getItem("schoolinfono"), params.classno, startDate2, endDate2, 1, true);
            getAverageClass(window.sessionStorage.getItem("schoolinfono"), params.classno, startDate2, endDate2)
        }
    }

    const getAverageStudents = (schoolNo, classNo, startDate, endDate, sort, order) => { // 평균 모든 학생
        averageStudents(schoolNo, classNo, startDate, endDate, sort, order)
            .then((res) => {
                setAverageStudentList(res.data);

                let tmpScatterChartData = new Array(
                    {
                        "id": "group A",
                        "data": new Array()
                    }
                );

                for (let i = 0; i < res.data.length; i++) {
                    tmpScatterChartData[0].data[i] = {
                        "studentName": res.data[i].studentName,
                        "learningTimeSeconds": res.data[i].learningTimeSeconds,
                        "x": res.data[i].learningCount,
                        "y": res.data[i].accuracy
                    }
                }

                setScatterChartData(tmpScatterChartData);
            })
            .catch((error) => console.error(error))
    }

    const getAverageClass = (schoolNo, classNo, startDate, endDate) => {
        averageClass(schoolNo, classNo, startDate, endDate)
            .then((res) => {
                setAverageClassData(res.data);
            })
            .catch((error) => console.error(error))
    }

    // 월별, 주별, 일별 변경 시
    const settingSubTabeMenu = (subTabMenuValue) => {
        if (subTabMenuValue === 1) {
            navigate(`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/averagelearningstatus/1`);
        } else if (subTabMenuValue === 2) {
            navigate(`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/averagelearningstatus/2`);
        } else if (subTabMenuValue === 3) {
            navigate(`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/averagelearningstatus/3`);
        }
    }

    const onChangeDate = (number) => { // 날짜 변경
        if (params.subtabmenu) {
            if (Number(params.subtabmenu) === 1 && (!params.startdate)) { // 월별 학습 평균 (params.startdate가 없을 때)
                let nowDate = new Date(startDate);
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

                navigate(`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/averagelearningstatus/1/${startDate2}/${sort}/${order}`);
            } else if (Number(params.subtabmenu) === 2 && (!params.startdate)) { // 주별 학습 평균 (params.startdate가 없을 때)
                let nowDate = new Date(startDate);
                let thisDate = new Date(nowDate.setDate(nowDate.getDate() + number));

                let tmpStartDateYear = thisDate.getFullYear();
                let tmpStartDateMonth = (thisDate.getMonth() + 1) < 10 ? "0" + (thisDate.getMonth() + 1) : (thisDate.getMonth() + 1);
                let tmpStartDateDay = thisDate.getDate() < 10 ? "0" + thisDate.getDate() : thisDate.getDate();
                let startDate2 = tmpStartDateYear + "-" + tmpStartDateMonth + "-" + tmpStartDateDay;

                navigate(`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/averagelearningstatus/2/${startDate2}/${sort}/${order}`);
            } else if (Number(params.subtabmenu) === 3 && (!params.startdate)) { // 일별 학습 평균 (params.startdate가 없을 때)
                let nowDate = new Date(startDate);
                let thisDate = new Date(nowDate.setDate(nowDate.getDate() + number));

                let tmpStartDateYear = thisDate.getFullYear();
                let tmpStartDateMonth = (thisDate.getMonth() + 1) < 10 ? "0" + (thisDate.getMonth() + 1) : (thisDate.getMonth() + 1);
                let tmpStartDateDay = thisDate.getDate() < 10 ? "0" + thisDate.getDate() : thisDate.getDate();
                let startDate2 = tmpStartDateYear + "-" + tmpStartDateMonth + "-" + tmpStartDateDay;

                navigate(`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/averagelearningstatus/3/${startDate2}/${sort}/${order}`);
            } else if (Number(params.subtabmenu) === 1) { // 월별 학습 평균 (params.startdate가 있을 때)
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

                navigate(`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/averagelearningstatus/1/${startDate2}/${sort}/${order}`);
            } else if (Number(params.subtabmenu) === 2) { // 주별 학습 평균 (params.startdate가 있을 때)
                let nowDate = new Date(params.startdate);
                let thisDate = new Date(nowDate.setDate(nowDate.getDate() + number));

                let tmpStartDateYear = thisDate.getFullYear();
                let tmpStartDateMonth = (thisDate.getMonth() + 1) < 10 ? "0" + (thisDate.getMonth() + 1) : (thisDate.getMonth() + 1);
                let tmpStartDateDay = thisDate.getDate() < 10 ? "0" + thisDate.getDate() : thisDate.getDate();
                let startDate2 = tmpStartDateYear + "-" + tmpStartDateMonth + "-" + tmpStartDateDay;

                navigate(`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/averagelearningstatus/2/${startDate2}/${sort}/${order}`);
            } else if (Number(params.subtabmenu) === 3) { // 일별 학습 평균 (params.startdate가 있을 때)
                let nowDate = new Date(params.startdate);
                let thisDate = new Date(nowDate.setDate(nowDate.getDate() + number));

                let tmpStartDateYear = thisDate.getFullYear();
                let tmpStartDateMonth = (thisDate.getMonth() + 1) < 10 ? "0" + (thisDate.getMonth() + 1) : (thisDate.getMonth() + 1);
                let tmpStartDateDay = thisDate.getDate() < 10 ? "0" + thisDate.getDate() : thisDate.getDate();
                let startDate2 = tmpStartDateYear + "-" + tmpStartDateMonth + "-" + tmpStartDateDay;

                navigate(`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/averagelearningstatus/3/${startDate2}/${sort}/${order}`);
            }
        } else {
            let nowDate = new Date(startDate);
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

            navigate(`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/averagelearningstatus/1/${startDate2}/${sort}/${order}`);
        }
    }

    const sortStudents = (thisSort, thisOrder) => { // 학생 목록 정렬, 순 설정
        let thisSort2 = thisSort;
        let thisOrder2 = thisOrder;

        if (sort !== thisSort) {
            thisOrder2 = true;
        }

        navigate(`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/averagelearningstatus/${params.subtabmenu ? params.subtabmenu : subTabMenu}/${params.startdate ? params.startdate : startDate}/${thisSort2}/${thisOrder2}`);
    }

    useEffect(() => {
        getAverageData();
    }, [location])

    return (
        <div>
            <div className="bg-[#ffffff] p-[40px] rounded-tr-3xl rounded-br-3xl rounded-bl-3xl shadow-md">
                <div>
                    <div className="flex">
                        <div className={subTabMenu === 1 ? "w-[120px] h-[34px] flex justify-center items-center border-[2px] border-[#3569e7] bg-[#3569e7] rounded-md text-[#ffffff] font-bold cursor-pointer" : "w-[120px] h-[34px] flex justify-center items-center border-[2px] border-[#3569e7] rounded-md font-bold bg-[#ffffff] text-[#3569e7] cursor-pointer"} onClick={() => { settingSubTabeMenu(1) }}>
                            월별 학습 평균
                        </div>
                        <div className={subTabMenu === 2 ? "w-[120px] h-[34px] flex justify-center items-center border-[2px] border-[#3569e7] bg-[#3569e7] rounded-md text-[#ffffff] font-bold cursor-pointer ml-[16px]" : "w-[120px] h-[34px] flex justify-center items-center border-[2px] border-[#3569e7] rounded-md font-bold bg-[#ffffff] text-[#3569e7] cursor-pointer ml-[16px]"} onClick={() => { settingSubTabeMenu(2) }}>
                            주별 학습 평균
                        </div>
                        <div className={subTabMenu === 3 ? "w-[120px] h-[34px] flex justify-center items-center border-[2px] border-[#3569e7] bg-[#3569e7] rounded-md text-[#ffffff] font-bold cursor-pointer ml-[16px]" : "w-[120px] h-[34px] flex justify-center items-center border-[2px] border-[#3569e7] rounded-md font-bold bg-[#ffffff] text-[#3569e7] cursor-pointer ml-[16px]"} onClick={() => { settingSubTabeMenu(3) }}>
                            일별 학습 평균
                        </div>
                    </div>
                </div>
                <div className="mt-[40px] flex justify-center">
                    <div className="flex items-center">
                        <div className="w-[32px] h-[32px] bg-[#e4e7e9] rounded-lg flex justify-center items-center cursor-pointer"
                            onClick={
                                () => {
                                    if (subTabMenu === 1 || subTabMenu === 3) {
                                        onChangeDate(-1);
                                    } else if (subTabMenu === 2) {
                                        onChangeDate(-7);
                                    }
                                }
                            }
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>

                        <div className="text-[18px] px-[20px] font-bold text-[#464c52] select-none">
                            {
                                {
                                    1: <Fragment>
                                        {year}-{month}
                                    </Fragment>,
                                    2: <Fragment>
                                        {startDate} ~ {endDate}
                                    </Fragment>,
                                    3: <Fragment>
                                        {startDate}
                                    </Fragment>
                                }[subTabMenu]

                            }
                        </div>

                        <div className="w-[32px] h-[32px] bg-[#e4e7e9] rounded-lg flex justify-center items-center cursor-pointer"
                            onClick={
                                () => {
                                    if (subTabMenu === 1 || subTabMenu === 3) {
                                        onChangeDate(1);
                                    } else if (subTabMenu === 2) {
                                        onChangeDate(7);
                                    }
                                }
                            }
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <div className="w-[820px]">
                        <div className="text-[18px] text-[#9ea0a2] pt-[26px] pl-[36px]">
                            정확도(%)
                        </div>
                        <div className="flex justify-center items-center">
                            <div className="w-[820px] h-[260px]">
                                <ResponsiveScatterPlot
                                    data={scatterChartData}
                                    margin={{ top: 16, right: 30, bottom: 30, left: 76 }}
                                    xScale={{ type: 'linear', min: 0, max: 'auto' }}
                                    xFormat=">-.2f"
                                    yScale={{ type: 'linear', min: 0, max: '100' }}
                                    yFormat=">-.2f"
                                    blendMode="multiply"
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={{
                                        orient: 'bottom',
                                        tickSize: 0,
                                        tickPadding: 5,
                                        tickRotation: 0,
                                        format: e => Math.floor(e) === e && e
                                    }}
                                    axisLeft={{
                                        orient: 'left',
                                        tickSize: 0,
                                        tickPadding: 10,
                                        tickRotation: 0,
                                        tickValues: [0, 20, 40, 60, 80, 100]
                                    }}
                                    enableGridX={false}
                                    theme={{
                                        fontSize: "20px",
                                        textColor: "#72787f"
                                    }}
                                    colors={"#c5c6c7"}
                                    gridYValues={5}
                                    tooltip={({ node }) => (
                                        <div className="w-[180px] h-[130px] text-[#f7f8f9] bg-[#525d67] rounded pt-[13px] pl-[13px] shadow">
                                            <div className="text-[17px] font-bold">{node.data.studentName}</div>
                                            <div className="flex text-[15px] mt-[12px]">
                                                <div className="w-[50%]">
                                                    <div>학습량</div>
                                                    <div>평균 정확도</div>
                                                    <div>총 학습시간</div>
                                                </div>
                                                <div className="w-[50%]">
                                                    <div>{node.data.x}개</div>
                                                    <div>{node.data.y}%</div>
                                                    <div>{parseInt(node.data.learningTimeSeconds / 60) > 0 ? (parseInt(node.data.learningTimeSeconds / 60) + "분") : (null)} {node.data.learningTimeSeconds % 60}초</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="text-[18px] text-[#9ea0a2] text-right pr-[36px] mt-[12px]">
                            학습량(스테이지 개수)
                        </div>
                    </div>

                    <div className="w-[220px] h-[352px] bg-[#f7f7f8] rounded-xl">
                        <div className="h-[108px] pt-[34px]">
                            <div className="flex items-center pl-[38px]">
                                <div>
                                    <img src={StageIcon} alt="stage_icon" />
                                </div>
                                <div className="flex justify-center text-[17px] text-[#72787f] ml-[10px]">반평균 학습량</div>
                            </div>
                            <div className="pl-[64px]">
                                <span className="text-[28px] text-[#0063ff] font-bold">{averageClassData.learningCount}</span><span className="text-[20px] text-[#0063ff] ml-[5px]">개</span>
                            </div>
                        </div>

                        <div className="h-[108px] pt-[34px]">
                            <div className="flex items-center pl-[38px]">
                                <div>
                                    <img src={AccuracyIcon} alt="accuracy_icon" />
                                </div>
                                <div className="flex justify-center text-[17px] text-[#72787f] ml-[10px]">반평균 정확도</div>
                            </div>
                            <div className="pl-[64px]">
                                <span className="text-[28px] text-[#0063ff] font-bold">{averageClassData.accuracy}</span><span className="text-[20px] text-[#0063ff] ml-[5px]">%</span>
                            </div>
                        </div>

                        <div className="h-[108px] pt-[34px]">
                            <div className="flex items-center pl-[38px]">
                                <div>
                                    <img src={TimeIcon} alt="time_icon" />
                                </div>
                                <div className="flex justify-center text-[17px] text-[#72787f] ml-[10px]">반평균 학습시간</div>
                            </div>

                            <div className="pl-[64px] flex">
                                {
                                    parseInt(averageClassData.learningTimeSeconds / 60) > 0 ? (
                                        <div className="mr-[6px]">
                                            <span className="text-[28px] text-[#0063ff] font-bold">{parseInt(averageClassData.learningTimeSeconds / 60)}</span>
                                            <span className="text-[20px] text-[#0063ff] ml-[5px]">분</span>
                                        </div>
                                    ) : (null)
                                }
                                <div>
                                    <span className="text-[28px] text-[#0063ff] font-bold">{averageClassData.learningTimeSeconds % 60}</span>
                                    <span className="text-[20px] text-[#0063ff] ml-[5px]">초</span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex justify-between mt-[50px]">
                    <div className="text-[24px] font-bold">학생 학습 현황</div>
                    <div className="flex">
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

                        <div className="flex items-center cursor-pointer w-[90px] h-[40px]" onClick={() => { sortStudents(3, !order); }}>
                            <div className="relative w-6 h-4">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    className={sort === 3 && order ? "h-4 w-4 absolute top-0 left-0 text-[#0063ff] select-none" : "h-4 w-4 absolute top-0 left-0 text-[#999c9f] select-none"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    className={sort === 3 && !order ? "h-4 w-4 absolute top-0 right-0 text-[#0063ff] select-none" : "h-4 w-4 absolute top-0 right-0 text-[#999c9f] select-none"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17l-4 4m0 0l-4-4m4 4V3" />
                                </svg>
                            </div>
                            <div className={sort === 3 ? "text-[#0063ff] select-none" : "text-[#999c9f] select-none"}>정확도</div>
                        </div>

                        <div className="flex items-center cursor-pointer w-[90px] h-[40px]" onClick={() => { sortStudents(4, !order); }}>
                            <div className="relative w-6 h-4">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    className={sort === 4 && order ? "h-4 w-4 absolute top-0 left-0 text-[#0063ff] select-none" : "h-4 w-4 absolute top-0 left-0 text-[#999c9f] select-none"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    className={sort === 4 && !order ? "h-4 w-4 absolute top-0 right-0 text-[#0063ff] select-none" : "h-4 w-4 absolute top-0 right-0 text-[#999c9f] select-none"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17l-4 4m0 0l-4-4m4 4V3" />
                                </svg>
                            </div>
                            <div className={sort === 4 ? "text-[#0063ff] select-none" : "text-[#999c9f] select-none"}>학습시간</div>
                        </div>
                    </div>
                </div>

                <div className="mt-[20px]">
                    <div className={"flex flex-wrap relative w-[1160px]"}>
                        {
                            averageStudentList && averageStudentList.length > 0 ? (
                                averageStudentList && averageStudentList.map((value, index) => (
                                    <div key={index}
                                        className={"relative w-[250px] h-[250px] py-[19px] px-[20px] bg-[#ffffff] mr-[40px] mb-[40px] rounded-xl transition duration-300 ease-in-out transform shadow-md hover:shadow-lg hover:-translate-y-1"}>
                                        <div className={"font-bold text-[24px]"}>{value.studentName}</div>
                                        <div className={"mt-2"}>
                                            <table style={{ fontSize: "17px" }} className={"font-medium"}>
                                                <tbody>
                                                    <tr>
                                                        <td style={{ width: "98px", padding: "5px 0" }} className={"text-gray-500"}>학습량</td>
                                                        <td>{value.learningCount}개</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ padding: "5px 0" }} className={"text-gray-500"}>평균 정확도</td>
                                                        <td>{value.accuracy}%</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ padding: "5px 0" }} className={"text-gray-500"}>총 학습시간</td>
                                                        <td>
                                                            {
                                                                parseInt(value.learningTimeSeconds / 60) > 0 ? (
                                                                    parseInt(value.learningTimeSeconds / 60) + "분 "
                                                                ) : (null)
                                                            }
                                                            {value.learningTimeSeconds % 60}초
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <Link
                                            to={`/home/wholeclass/${params.class}/${params.classno}/${params.classname}/learningstatus/averagelearningstatus/learningdetails/${value.studentNo}/${value.studentName}/${subTabMenu}/${startDate}`}
                                            className={"w-[210px] h-[50px] mt-[10px] border-2 border-[#eef4fb] bottom-[16px] flex items-center justify-center rounded shadow-sm bg-[#eef4fb] hover:border-blue-500 hover:shadow"}>
                                            학습 결과 상세
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="w-[1120px] bg-[#ffffff] rounded-xl shadow-md flex items-center p-[20px]">
                                    학생이 없어요.
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AverageLearningStatus;