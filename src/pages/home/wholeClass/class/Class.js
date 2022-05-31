import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { classes } from "../../../../api/axios";

const Class = () => {
    const location = useLocation();
    const params = useParams();
    const [classList, setClassList] = useState([]);

    const getClass = () => {
        classes(window.sessionStorage.getItem("schoolinfono"), params.class)
            .then((res) => {
                setClassList(res.data);
            })
            .catch((error) => { console.error(error) })
    }

    useEffect(() => {
        getClass();
    }, [location])

    return (
        <div className="flex flex-wrap relative w-[1200px]">
            {
                classList && classList.map((value, index) => (
                    <Link key={index} to={`/home/wholeclass/${params.class}/${value.schoolClassNo}/${value.className}/learningstatus`}
                        className="block relative w-[192px] h-[192px] bg-[#ffffff] mr-[40px] mb-[40px] rounded-[10px] transition duration-300 ease-in-out transform shadow-md hover:shadow-lg hover:-translate-y-1">
                        {value.className}
                    </Link>
                ))
            }
        </div>
    )
}

export default Class;