import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import LeftNavigation from "../../components/navigations/LeftNavigation";
import TopNavigation from "../../components/navigations/TopNavigation";
import WholeClass from "./wholeClass/WholeClass";
import Help from "./help/Help";

const Home = () => {
    const [menu, setMenu] = useState(1);
    const [subMenu, setSubMenu] = useState(0);
    const [classMenu] = useState([
        { id: 0, name: '전체보기' },
        { id: 1, name: '1학년' },
        { id: 2, name: '2학년' },
        { id: 3, name: '3학년' },
        { id: 4, name: '4학년' },
        { id: 5, name: '5학년' },
        { id: 6, name: '6학년' },
        { id: 7, name: '미설정' },
    ])

    return (
        <div className="flex">
            <LeftNavigation menu={menu} setMenu={setMenu} subMenu={subMenu} setSubMenu={setSubMenu} classMenu={classMenu} />
            <div className="w-[1200px]">
                <TopNavigation menu={menu} setMenu={setMenu} subMenu={subMenu} setSubMenu={setSubMenu} />
                <div className="p-[40px]">
                    <Routes>
                        {/* 상위 경로 후행에 "*"가 없는 상태에서 더 깊이 탐색하면 상위 경로가 더 이상 일치하지 않으므로 하위 경로가 렌더링 되지 않음. */}
                        <Route path="wholeclass/*" element={<WholeClass />}></Route>
                        <Route path="help" element={<Help />}></Route>
                        <Route path="*" element={<WholeClass />}></Route>
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default Home;