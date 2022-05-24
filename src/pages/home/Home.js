import { Route, Routes } from "react-router-dom";
import LeftNavigation from "../../components/navigations/LeftNavigation";
import TopNavigation from "../../components/navigations/TopNavigation";
import WholeClass from "./wholeClass/WholeClass";

const Home = () => {
    return (
        <div className="flex">
            <LeftNavigation />
            <div className="w-[1200px]">
                <TopNavigation />
                <div className="p-[40px]">
                    <Routes>
                        {/* 상위 경로 후행에 "*"가 없는 상태에서 더 깊이 탐색하면 상위 경로가 더 이상 일치하지 않으므로 하위 경로가 렌더링 되지 않음. */}
                        <Route path="wholeclass/*" element={<WholeClass />}></Route>
                        <Route path="*" element={<WholeClass />}></Route>
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default Home;