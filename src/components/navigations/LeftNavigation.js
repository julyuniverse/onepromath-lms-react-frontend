import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const LeftNavigation = () => {
    const location = useLocation();
    const [menu, setMenu] = useState(0);
    const [subMenu, setSubMenu] = useState(0);
    const [classMenu] = useState([
        { id: 999, name: '전체보기' },
        { id: 1, name: '1학년' },
        { id: 2, name: '2학년' },
        { id: 3, name: '3학년' },
        { id: 4, name: '4학년' },
        { id: 5, name: '5학년' },
        { id: 6, name: '6학년' },
        { id: 7, name: '미설정' },
    ])

    const settingMenu = () => {
        let pathname = location.pathname;
        let arr = pathname.split("/");

        arr = arr.filter((el) => {
            return el !== null && el !== undefined && el !== "";
        });

        if (arr[1] === "whole-class") {
            setMenu(1);

            if (arr[2]) {
                setSubMenu(parseInt(arr[2]));
            } else {
                setSubMenu(999);
            }
        } else if (arr[1] === "help") {
            setMenu(2);
        } else {
            setMenu(1);
            setSubMenu(999);
        }
    }

    const logout = () => {
        if (window.confirm("로그아웃하시겠어요?")) {
            window.sessionStorage.removeItem("token");
            window.sessionStorage.removeItem("teachername");
            window.sessionStorage.removeItem("schoolinfono");
            window.sessionStorage.removeItem("schoolname");
            window.location.href = 'http://xn--qj1bp8hv6hwhs4z37u.com/login_v2.php';
        }
    }

    useEffect(() => {
        settingMenu();
    }, [location])

    return (
        <div className="min-h-screen w-[240px] bg-[#ffffff] shadow-[15px_0px_15px_-25px_rgba(0,0,0,0.3)]">
            <div className="h-[120px] flex justify-center items-center">
                <Link to="/" className="block hover:pointer-cursor">
                    <div className="flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-[20px]" viewBox="0 0 20 20">
                            <rect fill="#ffffff" opacity="0" width="20" height="20" />
                            <rect fill="#005add" width="20" height="20" rx="3.13" />
                            <path fill="#ffffff" d="M8.46,2.76H6.53A1,1,0,0,0,5.88,3L3.36,5.12a1,1,0,0,0-.13,1.46l.67.79a1,1,0,0,0,1.45.13l1-.88v9.59a1,1,0,0,0,1,1h1a1,1,0,0,0,1-1V3.79A1,1,0,0,0,8.46,2.76Z" />
                            <path fill="#ffffff" d="M10.61,11.28A1,1,0,1,0,12,10.9,1.05,1.05,0,0,0,10.61,11.28Zm1.17.68a.31.31,0,1,1-.11-.43A.31.31,0,0,1,11.78,12Z" />
                            <path fill="#ffffff" d="M16.62,13.62A1,1,0,1,0,17,15,1.05,1.05,0,0,0,16.62,13.62Zm-.25,1.06a.31.31,0,1,1-.11-.43A.32.32,0,0,1,16.37,14.68Z" />
                            <path fill="#ffffff" d="M12.34,16.19l-.48-.28a.42.42,0,0,1-.14-.58l3-5a.42.42,0,0,1,.57-.17l.48.28a.42.42,0,0,1,.14.58l-3,5A.42.42,0,0,1,12.34,16.19Z" />
                        </svg>
                        <div className="text-[18px] text-[#0063ff] ml-[2px] font-semibold">
                            일프로선생님
                        </div>
                    </div>
                </Link>
            </div>
            <div className="pr-[20px]">
                <div className="relative">
                    {
                        menu === 1 ? (
                            <div className="absolute w-[4px] h-[60px] bg-[#0063ff] left-0 rounded-tr-3xl rounded-br-3xl">

                            </div>
                        ) : (null)
                    }
                    <Link to={`/home/whole-class/999`} className="block">
                        <div className={menu === 1 ? "bg-[#f1f3f7] flex items-center h-[60px] pl-[20px] cursor-pointer" : "flex items-center h-[60px] pl-[20px] cursor-pointer"}>
                            <div>
                                <svg className={menu === 1 ? "w-[28px] h-[28px] stroke-[#3569e7]" : "w-[28px] h-[28px] stroke-[#72787f]"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#000000" strokeWidth="2" fill="none"> <rect width="7" height="7" x="3" y="3" /> <rect width="7" height="7" x="14" y="3" /> <rect width="7" height="7" x="3" y="14" /> <rect width="7" height="7" x="14" y="14" /> </svg>
                            </div>
                            <div className={menu === 1 ? "text-[#3569e7] text-[18px] ml-[14px] select-none" : "text-[#72787f] text-[18px] ml-[14px] select-none"}>전체 학급</div>
                            <div className="ml-[50px]">
                                {
                                    menu === 1 ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 stroke-[#3569e7] text-[#3569e7]" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 stroke-[#72787f] text-[#72787f]" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )
                                }
                            </div>
                        </div>
                    </Link>
                </div>

                {
                    menu === 1 ? (
                        <div>
                            {classMenu && classMenu.map((value, index) => (
                                <Link key={index} to={`/home/whole-class/${value.id}`} className="block">
                                    <div className={subMenu === value.id ? "flex items-center h-[50px] pl-[60px] text-[#72787f] font-semibold" : "flex items-center h-[50px] pl-[60px] text-[#999c9f]"}>
                                        {value.name}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (null)
                }
            </div>
            <div className="px-[20px]">
                <hr />
            </div>

            {/* <div>
                <div className="relative">
                    {
                        menu === 2 ? (
                            <div className="absolute w-[4px] h-[60px] bg-[#0063ff] left-0 rounded-tr-3xl rounded-br-3xl">

                            </div>
                        ) : (null)
                    }
                    <Link to={`/home/help`} className="block">
                        <div className={menu === 2 ? "bg-[#f1f3f7] flex items-center h-[60px] pl-[20px] cursor-pointer" : "flex items-center h-[60px] pl-[20px] cursor-pointer"} >
                            <div className={menu === 2 ? "text-[#3569e7] text-[18px] ml-[14px]" : "text-[#72787f] text-[18px] ml-[14px]"}>고객 센터</div>
                        </div>
                    </Link>
                </div>
            </div> */}

            <div>
                <div className="relative">
                    <div className="flex items-center h-[60px] pl-[20px] cursor-pointer text-[#999c9f] hover:text-[#72787f]" onClick={logout}>                       
                        <div className="flex justify-start items-center">
                            <svg width="28px" height="28px" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
                                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <g className="fill-[#999c9f]" fillRule="nonzero">
                                        <path d="M17.0836,5.43173 C17.3048,4.92564 17.8943,4.69463 18.4004,4.91575 C22.2833,6.61226 25,10.4878 25,15 C25,21.0751 20.0751,26 14,26 C7.92487,26 3,21.0751 3,15 C3,10.4878 5.71673,6.61226 9.59963,4.91575 C10.1057,4.69463 10.6952,4.92564 10.9164,5.43173 C11.1375,5.93782 10.9065,6.52733 10.4004,6.74845 C7.21965,8.13817 5,11.311 5,15 C5,19.9706 9.02944,24 14,24 C18.9706,24 23,19.9706 23,15 C23,11.311 20.7803,8.13817 17.5996,6.74845 C17.0935,6.52733 16.8625,5.93782 17.0836,5.43173 Z M14,2 C14.51285,2 14.9355092,2.38604429 14.9932725,2.88337975 L15,3 L15,12 C15,12.5523 14.5523,13 14,13 C13.48715,13 13.0644908,12.613973 13.0067275,12.1166239 L13,12 L13,3 C13,2.44772 13.4477,2 14,2 Z" id="🎨-Color"></path>
                                    </g>
                                </g>
                            </svg>
                            <div className="pl-[14px] text-[18px]">
                                로그아웃
                            </div>
                        </div>                   
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftNavigation;