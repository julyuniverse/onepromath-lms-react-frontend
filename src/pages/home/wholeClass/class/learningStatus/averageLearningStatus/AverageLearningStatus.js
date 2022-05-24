import { Link, Route, Routes } from "react-router-dom";
import MonthlyClassAverage from "./monthlyClassAverage/MonthlyClassAverage";
import WeeklyClassAverage from "./weeklyClassAverage/WeeklyClassAverage";
import DailyClassAverage from "./dailyClassAverage/DailyClassAverage";

const AverageLearningStatus = () => {
    return (
        <div>
            [AverageLearningStatus]
            <div>
                <Link to={`monthlyclassaverage`} className="block">
                    월별 학습 평균
                </Link>
                <Link to={`weeklyclassaverage`} className="block">
                    주별 학습 평균
                </Link>
                <Link to={`dailyclassaverage`} className="block">
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