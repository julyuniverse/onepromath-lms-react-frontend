import { Link, Route, Routes } from "react-router-dom";
import MonthlyClassAverage from "./monthlyClassAverage/MonthlyClassAverage";
import WeeklyClassAverage from "./weeklyClassAverage/WeeklyClassAverage";
import DailyClassAverage from "./dailyClassAverage/DailyClassAverage";

const AverageLearningStatus = () => {
    return (
        <div>
            <div className="flex">
                <Link to={`monthlyclassaverage`} className="block bg-[#ffffff]">
                    월별 학습 평균
                </Link>
                <Link to={`weeklyclassaverage`} className="block bg-[#ffffff]">
                    주별 학습 평균
                </Link>
                <Link to={`dailyclassaverage`} className="block bg-[#ffffff]">
                    일별 학습 평균
                </Link>
            </div>
            <Routes>
                <Route path="monthlyclassaverage" element={<MonthlyClassAverage />}></Route>
                <Route path="weeklyclassaverage" element={<WeeklyClassAverage />}></Route>
                <Route path="dailyclassaverage" element={<DailyClassAverage />}></Route>
                <Route path="*" element={<MonthlyClassAverage />}></Route>
            </Routes>
        </div>
    )
}

export default AverageLearningStatus;