import axios from "../utils/axios";

export const login = (id, pw) => { // 로그인
    return axios.post("/api/user/login", { id: id, pw: pw });
}

export const classes = (schoolInfoNo, schoolYear) => { // 반 목록
    return axios.post("/api/class", {schoolInfoNo: schoolInfoNo, schoolYear: schoolYear });
}

export const weeklyStudents = (startDate, endDate, schoolInfoNo, schoolClassNo) => { // 모든 학생
    return axios.post("/api/student/weeklystudents", {startDate: startDate, endDate: endDate, schoolInfoNo: schoolInfoNo, schoolClassNo: schoolClassNo});
}