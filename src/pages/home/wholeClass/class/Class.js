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
                console.log(res.data);
                setClassList(res.data);
            })
            .catch((error) => { console.error(error) })

    }

    useEffect(() => {
        console.log("Class.js");
        getClass();
    }, [location])

    return (
        <div>
            [Class]
            {
                classList && classList.map((value, index) => (
                    <Link key={index} to={`/home/wholeclass/${params.class}/${value.schoolClassNo}/learningstatus`} className="block">
                        {value.className}
                    </Link>
                ))
            }
        </div>
    )
}

export default Class;