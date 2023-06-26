const crypto = require('crypto');
var mysql = require('mysql');

var dbConnection = {
    host: "localhost",
    user: "frqwriter",
    password: "2qP49HM9#@Jn",
    database: "frq"
};

var con = mysql.createConnection(dbConnection);

class AppLibrary {

    async login(email, password) {
        const student = await this.getStudent(email, password);
        console.log(student.length);
        console.log(student);

        if (student.length == 0)
            return "";

        var accessToken = this.createAccessToken();
        var now = Date.now();
        now = new Date(now);
        var tomorrow = Date.now();
        tomorrow = new Date(tomorrow)
        tomorrow.setDate(tomorrow.getDate() + 1);

        await this.addAccessToken(accessToken, student[0].id, this.formatDate(now), this.formatDate(tomorrow));

        var loginResponse = JSON.stringify({
            firstName: student[0].firstName,
            lastName: student[0].lastName,
            email: student[0].email,
            userToken: accessToken,
            tokenExpiration: this.formatDate(tomorrow)
        });

        return loginResponse;
    }

    async postReview(userToken, subjectId, isCustomQuestion, isAutoReview, urgency, selectedQuestion, selectedYear, customQuestionText) {
        var serverGeneratedReviewId = crypto.randomUUID();
        //console.log(userToken, isCustom, isAutoReview, urgencySelection, selectedQuestion, selectedSubjectYear, selectedSubject, customQuestionText);
        //console.log(serverGeneratedReviewId);

        var today = Date.now();
        today = new Date(today)
        var todayDate = this.formatDate(today)

        var student = await this.getStudentFromToken(userToken);
        console.log(subjectId);

        await this.addFRQ(subjectId, student[0].studentId, isAutoReview, isCustomQuestion, urgency, selectedYear, selectedQuestion, customQuestionText, todayDate, serverGeneratedReviewId);

        var data = { serverGeneratedReviewId: serverGeneratedReviewId };
        return data;
    }

    createHash(str) {
        const hash = crypto.createHash('sha256').update(str).digest('hex');
        return hash;
    }

    createAccessToken() {
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);
        var str = today.toISOString();

        return this.createHash(str);
    }

    formatDate(myDate) {
        return myDate.getFullYear() + '-' + ('0' + (myDate.getMonth() + 1)).slice(-2) + '-' + ('0' + myDate.getDate()).slice(-2) + ' ' + myDate.getHours() + ':' + ('0' + (myDate.getMinutes())).slice(-2) + ':' + myDate.getSeconds()
    }

    async addSchool(name, state, address) {
        var insertQuery = `INSERT INTO schools (name, state, address) VALUES ('${name}', '${state}', '${address}')`;
        try {
            const result = await this.mySQLInsert(insertQuery);
            return result;
        } catch (error) {
            console.log(JSON.stringify(error));
            return null;
        }
    }

    async addStudent(firstName, lastName, birthDate, schoolId, registrationDate, schoolGrade, email, password) {
        var passwordHash = this.createHash(password);
        var insertQuery = `INSERT INTO students (firstname, lastName, birthDate, schoolId, registrationDate, schoolGrade, email, passwordHash) VALUES ('${firstName}', '${lastName}', '${birthDate}', ${schoolId}, '${registrationDate}', ${schoolGrade}, '${email}', '${passwordHash}')`;

        try {
            const result = await this.mySQLInsert(insertQuery);
            return result;
        } catch (error) {
            console.log(JSON.stringify(error));
            return null;
        }
    }

    async getStudent(email, password) {
        var passwordHash = this.createHash(password);

        var query = `select * from students where email = '${email}' and passwordHash = '${passwordHash}'`;
        try {
            const result = await this.mySQLQuery(query);
            //console.log(JSON.stringify(result));
            return result;
        } catch (error) {
            console.log("Error while getting student");
            return null;
        }
    }

    async addAccessToken(token, studentId, startTime, expirationTime) {
        var insertQuery = `INSERT INTO accesstokens (token, studentId, startTime, expirationTime) VALUES ('${token}', ${studentId}, '${startTime}', '${expirationTime}')`;

        try {
            const result = await this.mySQLInsert(insertQuery);
            return result;
        } catch (error) {
            console.log(JSON.stringify(error));
            return null;
        }
    }

    async addSubject(name) {
        var insertQuery = `INSERT INTO subjects (name) VALUES ('${name}')`;

        try {
            const result = await this.mySQLInsert(insertQuery);
            return result;
        } catch (error) {
            console.log(JSON.stringify(error));
            return null;
        }
    }

    async addFRQ(subjectId, studentId, isAutoReview, isCustomQuestion, urgency, selectedYear, selectedQuestion, customQuestionText, submissionDate, serverGeneratedReviewId) {
        var insertQuery = `INSERT INTO frqs (subjectId, studentId, isAutoReview, isCustomQuestion, urgency, selectedYear, selectedQuestion, customQuestionText, submissionDate, serverGeneratedReviewId)
                VALUES (${subjectId}, ${studentId}, ${isAutoReview}, ${isCustomQuestion}, ${urgency}, ${selectedYear}, ${selectedQuestion}, '${customQuestionText}', '${submissionDate}', '${serverGeneratedReviewId}')`;

        try {
            const result = await this.mySQLInsert(insertQuery);
            return result;
        } catch (error) {
            console.log(JSON.stringify(error));
            return null;
        }
    }

    async addQuestion(name, year, subjectId, files) {
        var insertQuery = `INSERT INTO questions (name, year, subjectId, files) VALUES ('${name}', '${year}', '${subjectId}', '${files}')`;

        try {
            const result = await this.mySQLInsert(insertQuery);
            return result;
        } catch (error) {
            console.log(JSON.stringify(error));
            return null;
        }
    }

    async getAllSubjects() {
        var query = `SELECT * from subjects;`;

        try {
            var result = await this.mySQLQuery(query);
            result = JSON.parse(JSON.stringify(result));
            return result;
        } catch (error) {
            return null;
        }
    }

    async getStudentNotCompletedFRQs(studentId) {
        var query = `Select frqsList.*, subjects.name as subjectName from frq.subjects inner join 
        (
        SELECT * FROM frq.frqs where (isReviewed != true or isReviewed = null) and studentId = ${studentId}
        ) as frqsList on frqsList.subjectId = subjects.id`;

        try {
            var result = await this.mySQLQuery(query);
            result = JSON.parse(JSON.stringify(result));
            return result;
        } catch (error) {
            return null;
        }
    }

    async getStudentCompletedFRQs(studentId) {
        var query = `Select frqsList.*, subjects.name as subjectName from frq.subjects inner join 
        (
        SELECT * FROM frq.frqs where (isReviewed = true) and studentId = ${studentId}
        ) as frqsList on frqsList.subjectId = subjects.id`;

        try {
            var result = await this.mySQLQuery(query);
            result = JSON.parse(JSON.stringify(result));
            return result;
        } catch (error) {
            return null;
        }
    }

    async getAllQuestions() {
        var query = `SELECT questions.*, subjects.name from subjects inner join questions on questions.subjectId = subjects.id;`;

        try {
            const result = await this.mySQLQuery(query);
            return result;
        } catch (error) {
            return null;
        }
    }

    async getStudentFromToken(token) {
        var query = `SELECT students.id as studentId, students.firstName, students.lastName, students.birthDate, students.schoolId, students.registrationDate, students.schoolGrade, students.email FROM students as students inner join (select * from accesstokens where token = "${token}" ) as tokens where students.id = tokens.studentId`;

        try {
            const result = await this.mySQLQuery(query);
            return result;
        } catch (error) {
            return null;
        }
    }

    mySQLQuery(query) {
        return new Promise((resolve, reject) => {
            con.query(query, (error, results) => {
                if (error) {
                    console.log("---Error " + error);
                    return reject(error);
                }

                return resolve(results);
            });
        });
    }

    mySQLInsert(insertQuery) {
        return new Promise((resolve, reject) => {
            con.query(insertQuery, (error, results) => {
                if (error) {
                    return reject(error);
                }

                return resolve(results);
            });
        });
    }

}

module.exports = AppLibrary
