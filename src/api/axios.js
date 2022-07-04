import axios from "../utils/axios";

export const login = (id, pw) => { // 로그인
    return axios.post("/api/user/login", { id: id, pw: pw });
}

export const classes = (schoolInfoNo, schoolYear) => { // 반 목록
    return axios.post("/api/class/class", { schoolInfoNo: schoolInfoNo, schoolYear: schoolYear });
}

export const weeklyStudents = (schoolInfoNo, schoolClassNo, startDate, endDate, sort, order) => { // 주간 모든 학생
    return axios.post("/api/student/weekly-students", { schoolInfoNo: schoolInfoNo, schoolClassNo: schoolClassNo, startDate: startDate, endDate: endDate, sort: sort, order: order });
}

export const averageStudents = (schoolInfoNo, schoolClassNo, startDate, endDate, sort, order) => { // 평균 모든 학생
    return axios.post("/api/student/average-students", { schoolInfoNo: schoolInfoNo, schoolClassNo: schoolClassNo, startDate: startDate, endDate: endDate, sort: sort, order: order });
}

export const averageClass = (schoolInfoNo, schoolClassNo, startDate, endDate) => { // 평균 반
    return axios.post("/api/class/average-class", { schoolInfoNo: schoolInfoNo, schoolClassNo: schoolClassNo, startDate: startDate, endDate: endDate });
}

export const calendar = (studentNo, startDate) => { // 달력 (출석, 학습량)
    return axios.post("/api/attendance/calendar", { studentNo: studentNo, startDate: startDate });
}

export const monthlyLearningData = (studentNo, startDate, count) => { // 월별 학습 데이터
    return axios.post("/api/learning/monthly-learning-data", { studentNo: studentNo, startDate: startDate, count: count });
}

export const weeklyLearningData = (studentNo, startDate) => { // 주별 학습 데이터
    return axios.post("/api/learning/weekly-learning-data", { studentNo: studentNo, startDate: startDate });
}

export const levelData = (studentNo, startDate, endDate) => { // 레벨 데이터
    return axios.post("/api/learning/level-data", { studentNo: studentNo, startDate: startDate, endDate: endDate });
}

export const levelAndChapterData = (studentNo, startDate, endDate) => { // 레벨과 챕터 데이터
    return axios.post("/api/learning/level-and-chapter-data", { studentNo: studentNo, startDate: startDate, endDate: endDate });
}

export const learningData = (studentNo, startDate, endDate) => { // 학습 데이터
    return axios.post("/api/learning/learning-data", { studentNo: studentNo, startDate: startDate, endDate: endDate });
}

export const students = (schoolNo, classNo) => { // 모든 학생
    return axios.post("/api/student/students", { schoolNo: schoolNo, classNo: classNo });
}

export const attendanceWeek = (studentNo, startDate) => { // 주간 (출석, 학습 데이터)
    return axios.post("/api/attendance/week", { studentNo: studentNo, startDate: startDate });
}

export const lastWeekAndThisWeekLearningData = (studentNo, startDate) => { // 지난주와 이번 주의 학습 데이터
    return axios.post("/api/learning/last-week-and-this-week-learning-data", { studentNo: studentNo, startDate: startDate });
}

export const dailyLearningData = (studentNo, startDate, endDate) => { // 일별 학습 데이터
    return axios.post("/api/learning/daily-learning-data", { studentNo: studentNo, startDate: startDate, endDate: endDate });
}

export const accountInfo = (userNo) => { // 계정 정보 (userNo 기준)
    return axios.post("/api/account/info", { userNo: userNo });
}

export const accountInfo2 = (profileNo) => { // 계정 정보 (profileNo 기준)
    return axios.post("/api/account/info2", { profileNo: profileNo });
}