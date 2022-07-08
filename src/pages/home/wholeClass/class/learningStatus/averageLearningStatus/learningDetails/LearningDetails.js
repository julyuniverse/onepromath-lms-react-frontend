import { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import DailyLearning from "./dailyLearning/DailyLearning";
import MonthlyLearning from "./monthlyLearning/MonthlyLearning";
import WeeklyLearning from "./weeklyLearning/WeeklyLearning";

const LearningDetails = () => {
    const location = useLocation();
    const params = useParams();
    const [tabMenu, setTabMenu] = useState(0);

    const settingTabMenu = () => {
        let pathname = location.pathname;
        let arr = pathname.split("/");

        arr = arr.filter((el) => {
            return el !== null && el !== undefined && el !== "";
        });

        if (arr[10] === "1") {
            setTabMenu(1);
        } else if (arr[10] === "2") {
            setTabMenu(2);
        } else if (arr[10] === "3") {
            setTabMenu(3);
        }
    }

    useEffect(() => {
        settingTabMenu();
    }, [location])

    return (
        <div>
            <div className="flex justify-between">
                <div className="w-[240px] text-[20px] font-bold">
                    <span className="text-[22px] text-[#3382ff] pr-[2px]">{params.studentname}</span>님의<br />
                    학습 결과 상세
                </div>
                <div className="flex">
                    <Link to={`1`} className="block">
                        <div className={tabMenu === 1 ? "flex justify-center items-center w-[180px] h-[70px] bg-[#3569e7] text-[20px] text-[#ffffff] rounded-xl shadow-md" : "flex justify-center items-center w-[180px] h-[70px] bg-[#ffffff] text-[20px] text-[#3569e7] rounded-xl shadow-md"}>
                            월간 보고서
                        </div>
                    </Link>
                    <Link to={`2`} className="block">
                        <div className={tabMenu === 2 ? "flex justify-center items-center w-[180px] h-[70px] bg-[#3569e7] text-[20px] text-[#ffffff] rounded-xl shadow-md ml-[14px]" : "flex justify-center items-center w-[180px] h-[70px] bg-[#ffffff] text-[20px] text-[#3569e7] rounded-xl shadow-md ml-[14px]"}>
                            주별 학습 상세
                        </div>

                    </Link>
                    <Link to={`3`} className="block">
                        <div className={tabMenu === 3 ? "flex justify-center items-center w-[180px] h-[70px] bg-[#3569e7] text-[20px] text-[#ffffff] rounded-xl shadow-md ml-[14px]" : "flex justify-center items-center w-[180px] h-[70px] bg-[#ffffff] text-[20px] text-[#3569e7] rounded-xl shadow-md ml-[14px]"}>
                            일별 학습 상세
                        </div>
                    </Link>
                </div>
                <div className="w-[240px]"></div>

            </div>

            <hr className="mt-[40px] border-[1px] border-[#d7e1fa]" />


            <Routes>
                <Route path="1" element={<MonthlyLearning />}></Route>
                <Route path="1/:startdate" element={<MonthlyLearning />}></Route>
                <Route path="2" element={<WeeklyLearning />}></Route>
                <Route path="2/:startdate" element={<WeeklyLearning />}></Route>
                <Route path="3" element={<DailyLearning />}></Route>
                <Route path="3/:startdate" element={<DailyLearning />}></Route>
            </Routes>
        </div>
    )
}

export default LearningDetails;