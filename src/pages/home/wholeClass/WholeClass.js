import { Route, Routes } from "react-router-dom";
import Class from "./class/Class";
import LearningStatus from "./class/learningStatus/LearningStatus";

const WholeClass = () => {
    return (
        <Routes>   
            <Route path=":class" element={<Class />}></Route>
            {/* 상위 경로 후행에 "*"가 없는 상태에서 더 깊이 탐색하면 상위 경로가 더 이상 일치하지 않으므로 하위 경로가 렌더링 되지 않음. */}
            <Route path=":class/:classno/:classname/learningstatus/*" element={<LearningStatus />}></Route>
            <Route path="*" element={<Class />}></Route>
        </Routes>
    )
}

export default WholeClass;