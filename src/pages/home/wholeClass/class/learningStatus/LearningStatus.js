import { Link, Route, Routes } from "react-router-dom";
import AverageLearningStatus from "./averageLearningStatus/AverageLearningStatus";
import WeeklyLearningStatus from "./weeklyLearningStatus/WeeklyLearningStatus";

const LearningStatus = () => {
    return (
        <div>
            <div className="flex">
                {/* 상위 경로 후행에 "*"를 설정하면 하위 경로에서는 상위 경로는 생략하고 이후 경로부터 설정. */}
                <Link to={`weeklylearningstatus`} className="block w-[192px] h-[80px] bg-[#ffffff]">
                    주간 학습 현황
                </Link>
                <Link to={`averagelearningstatus`} className="block w-[192px] h-[80px] bg-[#ffffff] ml-[10px]">
                    평균 학습 현황
                </Link>
            </div>
            <Routes>
                {/* 상위 경로 후행에 "*"를 설정하면 하위 경로에서는 상위 경로는 생략하고 이후 경로부터 설정. */}
                <Route path="weeklylearningstatus" element={<WeeklyLearningStatus />}></Route>
                <Route path="weeklylearningstatus/:startdate" element={<WeeklyLearningStatus />}></Route>
                <Route path="averagelearningstatus/*" element={<AverageLearningStatus />}></Route>
                <Route path="*" element={<WeeklyLearningStatus />}></Route>
            </Routes>
        </div>
    )
}

export default LearningStatus;