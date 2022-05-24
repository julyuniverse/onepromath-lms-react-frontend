import { Route, Routes } from "react-router-dom";
import LeftNavigation from "../../components/navigations/LeftNavigation";
import TopNavigation from "../../components/navigations/TopNavigation";
import WholeClass from "./wholeClass/WholeClass";

const Home = () => {
    return (
        <div className="flex">
            <LeftNavigation />
            <div>
                <TopNavigation />
                <Routes>
                    <Route path="/home/wholeclass" element={<WholeClass />}></Route>
                    <Route path="/*" element={<WholeClass />}></Route>
                </Routes>
            </div>
        </div>
    )
}

export default Home;