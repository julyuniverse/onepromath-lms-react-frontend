import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const TopNavigation = () => {
    const location = useLocation();
    const [menu, setMenu] = useState('전체 학급');
    const [menuPathName, setMenuPathName] = useState("/home/wholeclass");
    const [subMenu, setSubMenu] = useState("");
    const [subMenuPathName, setSubMenuPathName] = useState("");
    const [className, setClassName] = useState("");
    const [classNamePathName, setClassNamePathName] = useState("");

    const linkNav = () => {
        let pathname = location.pathname;
        let arr = pathname.split("/");

        arr = arr.filter((el) => {
            return el !== null && el !== undefined && el !== "";
        });

        if (Array.isArray(arr) && arr.length === 0) {
            setSubMenu("전체보기");
            setSubMenuPathName("/home/wholeclass/0");
            setClassName("");
            setClassNamePathName("");
        } else {
            // 메뉴
            if (arr[1] === "wholeclass") {
                setMenu("전체 학급");
                setMenuPathName(`/${arr[0]}/${arr[1]}`);

                // 서브 메뉴
                if (arr[2] === "0") {
                    setSubMenu("전체보기");
                    setSubMenuPathName(`/${arr[0]}/${arr[1]}/${arr[2]}`);
                } else if (arr[2] === "1") {
                    setSubMenu("1학년");
                    setSubMenuPathName(`/${arr[0]}/${arr[1]}/${arr[2]}`);
                } else if (arr[2] === "2") {
                    setSubMenu("2학년");
                    setSubMenuPathName(`/${arr[0]}/${arr[1]}/${arr[2]}`);
                } else if (arr[2] === "3") {
                    setSubMenu("3학년");
                    setSubMenuPathName(`/${arr[0]}/${arr[1]}/${arr[2]}`);
                } else if (arr[2] === "4") {
                    setSubMenu("4학년");
                    setSubMenuPathName(`/${arr[0]}/${arr[1]}/${arr[2]}`);
                } else if (arr[2] === "5") {
                    setSubMenu("5학년");
                    setSubMenuPathName(`/${arr[0]}/${arr[1]}/${arr[2]}`);
                } else if (arr[2] === "6") {
                    setSubMenu("6학년");
                    setSubMenuPathName(`/${arr[0]}/${arr[1]}/${arr[2]}`);
                } else if (arr[2] === "7") {
                    setSubMenu("미설정");
                    setSubMenuPathName(`/${arr[0]}/${arr[1]}/${arr[2]}`);
                } else {
                    setSubMenu("전체보기");
                    setSubMenuPathName("/home/wholeclass/0");
                }

                // 반 이름
                if (arr[4]) {
                    setClassName(arr[4]);
                    setClassNamePathName(`/${arr[0]}/${arr[1]}/${arr[2]}/${arr[3]}/${arr[4]}}`);
                } else {
                    setClassName("");
                    setClassNamePathName("");
                }
            }
        }
    }

    useEffect(() => {
        linkNav();
    }, [location])

    return (
        <div className="h-[80px] bg-[#ffffff] flex items-center rounded-br-3xl">
            <div className="flex">
                {
                    menu !== "" ? (
                        <div>
                            <Link to={menuPathName}>{menu}</Link>
                        </div>
                    ) : (null)
                }
                {
                    subMenu !== "" ? (
                        <div>
                            <Link to={subMenuPathName}>{'>'}{subMenu}</Link>
                        </div>
                    ) : (null)
                }
                {
                    className !== "" ? (
                        <div>
                            <Link to={classNamePathName}>{'>'}{decodeURIComponent(className)}</Link>
                        </div>
                    ) : (null)
                }
            </div>
        </div>
    )
}

export default TopNavigation;