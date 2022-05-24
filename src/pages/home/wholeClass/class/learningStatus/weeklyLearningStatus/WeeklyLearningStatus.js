import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { students } from "../../../../../../api/axios";

const WeeklyLearningStatus = () => {
    const params = useParams();
    const [studentList, setStudentList] = useState("");

    const getStudents = () => {
        console.log(window.sessionStorage.getItem("schoolinfono"));
        console.log(params.classno);
        students(window.sessionStorage.getItem("schoolinfono"), params.classno)
        .then((res) => {
            setStudentList(res.data);
        })
        .catch((error) => console.error(error))
    }

    useEffect(() => {
        getStudents();
    }, [])

    return (
        <div className="min-h-screen bg-[#ffffff]">
            {
                studentList && studentList.map((value, index) => (
                    <div key={index}>
                        {value.studentName}
                    </div>
                ))
            }
        </div>
    )
}

export default WeeklyLearningStatus;