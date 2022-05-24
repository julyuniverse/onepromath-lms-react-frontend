import axios from "../utils/axios";

export const login = (id, pw) => { // 로그인
    return axios.post("/api/user/login", { id: id, pw: pw });
}

export const classes = (schoolInfoNo, schoolYear) => { // 반 목록
    return axios.post("/api/class", {schoolInfoNo: schoolInfoNo, schoolYear: schoolYear });
}