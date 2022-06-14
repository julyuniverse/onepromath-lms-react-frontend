import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo.png";

const LeftNavigation = ({ menu, setMenu, subMenu, setSubMenu, classMenu }) => {
    return (
        <div className="min-h-screen w-[240px] bg-[#ffffff] shadow-[15px_0px_15px_-25px_rgba(0,0,0,0.3)]">
            <div className="h-[120px] flex justify-center items-center">
                <Link to="/" className="block" onClick={() => { setMenu(1); setSubMenu(0); }}>
                    <img src={Logo} alt="logo" />
                </Link>
            </div>
            <div className="pr-[20px]" >
                <div className="relative">
                    {
                        menu === 1 ? (
                            <div className="absolute w-[4px] h-[60px] bg-[#0063ff] left-0 rounded-tr-3xl rounded-br-3xl">

                            </div>
                        ) : (null)
                    }
                    <Link to={`/home/wholeclass/${subMenu}`} className="block" onClick={() => { menu === 1 ? setMenu(0) : setMenu(1) }}>
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
                                <Link key={index} to={`/home/wholeclass/${value.id}`} className="block" onClick={() => setSubMenu(value.id)}>
                                    <div className={subMenu === value.id ? "flex items-center h-[50px] pl-[60px] text-[#72787f]" : "flex items-center h-[50px] pl-[60px] text-[#999c9f]"}>
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

            <div>
                <div className="relative">
                    {
                        menu === 2 ? (
                            <div className="absolute w-[4px] h-[60px] bg-[#0063ff] left-0 rounded-tr-3xl rounded-br-3xl">

                            </div>
                        ) : (null)
                    }
                    <Link to={`/home/help`} className="block" onClick={() => { menu === 2 ? setMenu(0) : setMenu(2) }}>
                        <div className={menu === 2 ? "bg-[#f1f3f7] flex items-center h-[60px] pl-[20px] cursor-pointer" : "flex items-center h-[60px] pl-[20px] cursor-pointer"} >
                            <div className={menu === 2 ? "text-[#3569e7] text-[18px] ml-[14px]" : "text-[#72787f] text-[18px] ml-[14px]"}>고객 센터</div>
                        </div>
                    </Link>
                </div>
            </div>

            <div>
                <div className="relative">
                    {
                        menu === 3 ? (
                            <div className="absolute w-[4px] h-[60px] bg-[#0063ff] left-0 rounded-tr-3xl rounded-br-3xl">

                            </div>
                        ) : (null)
                    }
                    <div className={menu === 3 ? "bg-[#f1f3f7] flex items-center h-[60px] pl-[20px] cursor-pointer" : "flex items-center h-[60px] pl-[20px] cursor-pointer"} onClick={() => { menu === 3 ? setMenu(0) : setMenu(3) }}>
                        <div className={menu === 3 ? "text-[#3569e7] text-[18px] ml-[14px]" : "text-[#72787f] text-[18px] ml-[14px]"}>로그아웃</div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default LeftNavigation;