import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo.png";

const LeftNavigation = () => {
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
        <div className="min-h-screen w-[240px] bg-[#ffffff] shadow-[15px_0px_15px_-25px_rgba(0,0,0,0.3)]">
            <div className="h-[120px] flex justify-center items-center">
                <Link to="/" className="block">
                    <img src={Logo} alt="logo" />
                </Link>
            </div>
            <div>
                {classMenu && classMenu.map((value, index) => (
                    <Link key={index} to={`/home/wholeclass/${value.id}`} className="block">{value.name}</Link>
                ))}
            </div>
        </div>
    )
}

export default LeftNavigation;