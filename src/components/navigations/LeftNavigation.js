import { useState } from "react";
import { Link } from "react-router-dom";

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
        <div>
            [LeftNavigation]
            {classMenu && classMenu.map((value, index) => (
                <Link key={index} to={`/home/wholeclass/${value.id}`} className="block">{value.name}</Link>
            ))}
        </div>
    )
}

export default LeftNavigation;