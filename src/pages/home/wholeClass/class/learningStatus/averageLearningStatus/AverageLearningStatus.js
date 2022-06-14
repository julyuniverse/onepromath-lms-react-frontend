import { useState } from "react";

const AverageLearningStatus = () => {
    const [subTabMenu, setSubTabMenu] = useState(1);

    return (
        <div className="bg-[#ffffff] p-[40px] rounded-tr-3xl rounded-br-3xl rounded-bl-3xl shadow-xl">
            <div>
                <div className="flex">
                    <div className={subTabMenu === 1 ? "w-[120px] h-[34px] flex justify-center items-center border-[2px] border-[#3569e7] rounded-md text-[#3569e7] font-bold cursor-pointer" : "w-[120px] h-[34px] flex justify-center items-center border-[2px] border-[#3569e7] rounded-md font-bold bg-[#3569e7] text-[#ffffff] cursor-pointer"} onClick={() => {setSubTabMenu(1)}}>
                        월별 학습 평균
                    </div>
                    <div className={subTabMenu === 2 ? "w-[120px] h-[34px] flex justify-center items-center border-[2px] border-[#3569e7] rounded-md text-[#3569e7] font-bold ml-[16px] cursor-pointer" : "w-[120px] h-[34px] flex justify-center items-center border-[2px] border-[#3569e7] rounded-md font-bold bg-[#3569e7] text-[#ffffff] ml-[16px] cursor-pointer"} onClick={() => {setSubTabMenu(2)}}>

                        주별 학습 평균
                    </div>
                    <div className={subTabMenu ===  3 ? "w-[120px] h-[34px] flex justify-center items-center border-[2px] border-[#3569e7] rounded-md text-[#3569e7] font-bold ml-[16px] cursor-pointer" : "w-[120px] h-[34px] flex justify-center items-center border-[2px] border-[#3569e7] rounded-md font-bold bg-[#3569e7] text-[#ffffff] ml-[16px] cursor-pointer"} onClick={() => {setSubTabMenu(3)}}>

                        일별 학습 평균
                    </div>
                </div>
            </div>
            <div className="mt-[40px] flex justify-center">
                <div className="flex items-center">
                    <div className="w-[32px] h-[32px] bg-[#e4e7e9] rounded-lg flex justify-center items-center cursor-pointer" >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>

                    <div className="text-[18px] px-[20px] font-bold text-[#464c52] select-none"></div>

                    <div className="w-[32px] h-[32px] bg-[#e4e7e9] rounded-lg flex justify-center items-center cursor-pointer" >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AverageLearningStatus;