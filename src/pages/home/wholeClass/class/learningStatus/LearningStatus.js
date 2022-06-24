import { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import AverageLearningStatus from "./averageLearningStatus/AverageLearningStatus";
import WeeklyLearningStatus from "./weeklyLearningStatus/WeeklyLearningStatus";

const LearningStatus = () => {
    const location = useLocation();
    const [tabMenu, setTabMenu] = useState(0);

    const settingTabMenu = () => {
        let pathname = location.pathname;
        let arr = pathname.split("/");

        arr = arr.filter((el) => {
            return el !== null && el !== undefined && el !== "";
        });

        if (arr[6] === "weeklylearningstatus") {
            setTabMenu(1);
        } else if (arr[6] === "averagelearningstatus") {
            setTabMenu(2);
        } else {
            setTabMenu(1);
        }
    }

    useEffect(() => {
        settingTabMenu();
    }, [location])

    return (
        <div>
            <div className="flex">
                {/* 상위 경로 후행에 "*"를 설정하면 하위 경로에서는 상위 경로는 생략하고 이후 경로부터 설정. */}
                <Link to={`weeklylearningstatus`} className={tabMenu === 1 ? "block w-[192px] h-[70px] bg-[#ffffff] rounded-t-3xl relative" : "block w-[192px] h-[70px] bg-[#dce9ff] rounded-t-3xl relative"} onClick={() => { setTabMenu(1) }}>
                    {
                        tabMenu === 1 ? (
                            <div className="absolute w-[4px] h-[40px] bg-[#0063ff] left-0 top-[15px] rounded-tr-3xl rounded-br-3xl">

                            </div>
                        ) : (null)
                    }
                    <div className="w-full h-full flex justify-center items-center text-[20px]">
                        주간 학습 현황
                    </div>
                </Link>
                <Link to={`averagelearningstatus`} className={tabMenu === 2 ? "block w-[192px] h-[70px] bg-[#ffffff] rounded-t-3xl relative ml-[10px]" : "block w-[192px] h-[70px] bg-[#dce9ff] rounded-t-3xl relative ml-[10px]"} onClick={() => { setTabMenu(2) }}>
                    {
                        tabMenu === 2 ? (
                            <div className="absolute w-[4px] h-[40px] bg-[#0063ff] left-0 top-[15px] rounded-tr-3xl rounded-br-3xl">

                            </div>
                        ) : (null)
                    }
                    <div className="w-full h-full flex justify-center items-center text-[20px]">
                        평균 학습 현황
                    </div>
                </Link>
            </div>
            <Routes>
                {/* 상위 경로 후행에 "*"를 설정하면 하위 경로에서는 상위 경로는 생략하고 이후 경로부터 설정. */}
                <Route path="weeklylearningstatus" element={<WeeklyLearningStatus />}></Route>
                <Route path="weeklylearningstatus/:startdate/:sort/:order" element={<WeeklyLearningStatus />}></Route>
                <Route path="averagelearningstatus" element={<AverageLearningStatus />}></Route>
                <Route path="averagelearningstatus/:subtabmenu" element={<AverageLearningStatus />}></Route>
                <Route path="averagelearningstatus/:subtabmenu/:startdate/:sort/:order" element={<AverageLearningStatus />}></Route>
                <Route path="*" element={<WeeklyLearningStatus />}></Route>
            </Routes>
        </div>
    )
}

export default LearningStatus;