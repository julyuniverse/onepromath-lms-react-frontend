import axios from "../utils/axios";

export const login = (id, pw) => { // 로그인
    return axios.post("/api/user/login", { id: id, pw: pw });
}

export const classes = (schoolInfoNo, schoolYear) => { // 반 목록
    return axios.post("/api/class/class", {schoolInfoNo: schoolInfoNo, schoolYear: schoolYear });
}

export const weeklyStudents = (schoolInfoNo, schoolClassNo, startDate, endDate, sort, order) => { // 주간 모든 학생
    return axios.post("/api/student/weeklystudents", {schoolInfoNo: schoolInfoNo, schoolClassNo: schoolClassNo, startDate: startDate, endDate: endDate, sort: sort, order: order});
}

export const averageStudents = (schoolInfoNo, schoolClassNo, startDate, endDate, sort, order) => { // 평균 모든 학생
    return axios.post("/api/student/averagestudents", {schoolInfoNo: schoolInfoNo, schoolClassNo: schoolClassNo, startDate: startDate, endDate: endDate, sort: sort, order: order});
}

export const averageClass = (schoolInfoNo, schoolClassNo, startDate, endDate) => { // 평균 반
    return axios.post("/api/class/averageclass", {schoolInfoNo: schoolInfoNo, schoolClassNo: schoolClassNo, startDate: startDate, endDate: endDate});
}