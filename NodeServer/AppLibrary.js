const crypto = require("crypto");
var mysql = require("mysql");

var dbConnection = {
  host: "localhost",
  user: "frqwriter",
  password: "2qP49HM9#@Jn",
  database: "frq",
};

var con = mysql.createConnection(dbConnection);

class AppLibrary {
  async login(email, password) {
    const student = await this.getStudent(email, password);

    if (student.length == 0) return "";

    var accessToken = this.createAccessToken();
    var now = Date.now();
    now = new Date(now);
    var tomorrow = Date.now();
    tomorrow = new Date(tomorrow);
    tomorrow.setDate(tomorrow.getDate() + 5);

    await this.addAccessToken(
      accessToken,
      student[0].id,
      null,
      this.formatDate(now),
      this.formatDate(tomorrow)
    );

    var loginResponse = {
      firstName: student[0].firstName,
      lastName: student[0].lastName,
      studentId: student[0].studentId,
      email: student[0].email,
      userToken: accessToken,
      tokenExpiration: this.formatDate(tomorrow),
    };

    return loginResponse;
  }
  async teacherLogin(email, password) {
    const teacher = await this.getTeacher(email, password);

    if (teacher.length == 0) return "";

    var accessToken = this.createAccessToken();
    var now = Date.now();
    now = new Date(now);
    var tomorrow = Date.now();
    tomorrow = new Date(tomorrow);
    tomorrow.setDate(tomorrow.getDate() + 5);

    await this.addAccessToken(
      accessToken,
      null,
      teacher[0].id,
      this.formatDate(now),
      this.formatDate(tomorrow)
    );

    var loginResponse = {
      firstName: teacher[0].firstName,
      lastName: teacher[0].lastName,
      teacherId: teacher[0].id,
      email: teacher[0].email,
      userToken: accessToken,
      tokenExpiration: this.formatDate(tomorrow),
    };

    return loginResponse;
  }

  async postReview(
    userToken,
    subjectId,
    isCustomQuestion,
    isAutoReview,
    urgency,
    selectedQuestion,
    selectedYear,
    customQuestionText,
    userAnswer
  ) {
    var serverGeneratedReviewId = crypto.randomUUID();

    var today = Date.now();
    today = new Date(today);
    var todayDate = this.formatDate(today);

    var student = await this.getStudentFromToken(userToken);

    await this.addFRQ(
      subjectId,
      student[0].studentId,
      isAutoReview,
      isCustomQuestion,
      urgency,
      selectedYear,
      selectedQuestion,
      customQuestionText,
      userAnswer,
      todayDate,
      serverGeneratedReviewId
    );

    var data = { serverGeneratedReviewId: serverGeneratedReviewId };
    return data;
  }

  createHash(str) {
    const hash = crypto.createHash("sha256").update(str).digest("hex");
    return hash;
  }

  createAccessToken() {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    var str = today.toISOString();

    return this.createHash(str);
  }

  formatDate(myDate) {
    return (
      myDate.getFullYear() +
      "-" +
      ("0" + (myDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + myDate.getDate()).slice(-2) +
      " " +
      myDate.getHours() +
      ":" +
      ("0" + myDate.getMinutes()).slice(-2) +
      ":" +
      myDate.getSeconds()
    );
  }
  formateToDateTime(date) {
    return (
      date.toISOString().split("T")[0] + " " + date.toTimeString().split(" ")[0]
    );
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

  async addStudent(
    firstName,
    lastName,
    birthDate,
    schoolId,
    schoolGrade,
    email,
    password
  ) {
    var today = Date.now();
    today = new Date(today);
    var todayDate = this.formatDate(today);
    var passwordHash = this.createHash(password);
    var insertQuery = `INSERT INTO students (firstname, lastName, birthDate, schoolId, registrationDate, schoolGrade, email, passwordHash) VALUES ('${firstName}', '${lastName}', '${birthDate}', ${schoolId}, '${todayDate}', ${schoolGrade}, '${email}', '${passwordHash}')`;

    try {
      const result = await this.mySQLInsert(insertQuery);
      return result;
    } catch (error) {
      console.log(JSON.stringify(error));
      return null;
    }
  }
  async addTeacher(
    firstName,
    lastName,
    birthDate,
    schoolId,
    yearsOfExperience,
    email,
    password,
    linkedIn,
    onlineResume
  ) {
    var today = Date.now();
    today = new Date(today);
    var todayDate = this.formateToDateTime(today);
    var passwordHash = this.createHash(password);
    var insertQuery = `INSERT INTO teachers (firstName, lastName, birthDate, schoolId, yearsOfExperience, registrationDate,email, passwordHash, linkInProfile, onlineResume) VALUES ('${firstName}', '${lastName}', '${birthDate}', ${schoolId}, ${yearsOfExperience}, '${todayDate}', '${email}', '${passwordHash}', '${linkedIn}', '${onlineResume}')`;
    //;

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
      return result;
    } catch (error) {
      console.log(error);
      console.log("Error while getting student");
      return null;
    }
  }
  async getTeacher(email, password) {
    var passwordHash = this.createHash(password);

    var query = `select * from teachers where email = '${email}' and passwordHash = '${passwordHash}'`;
    try {
      const result = await this.mySQLQuery(query);
      console.log(JSON.stringify(result));
      return result;
    } catch (error) {
      console.log("Error while getting teacher");
      return null;
    }
  }
  async addTeacherSubject(teacherId, subjectId) {
    var insertQuery = `INSERT INTO teachersubjects (subjectId, teacherId) VALUES (${subjectId}, ${teacherId})`;
    try {
      const result = await this.mySQLInsert(insertQuery);
      return result;
    } catch (error) {
      console.log("Error while adding subject");
      console.log(error);
      return null;
    }
  }
  async addAccessToken(token, studentId, teacherId, startTime, expirationTime) {
    var insertQuery = `INSERT INTO accesstokens (token, studentId,teacherId, startTime, expirationTime) VALUES ('${token}', ${studentId},${teacherId}, '${startTime}', '${expirationTime}')`;

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

  async addFRQ(
    subjectId,
    studentId,
    isAutoReview,
    isCustomQuestion,
    urgency,
    selectedYear,
    selectedQuestion,
    customQuestionText,
    userAnswer,
    submissionDate,
    serverGeneratedReviewId
  ) {
    var insertQuery = `INSERT INTO frqs (subjectId, studentId, isAutoReview, isCustomQuestion, urgency, selectedYear, selectedQuestion, customQuestionText, submissionDate, serverGeneratedReviewId,userAnswer) VALUES (${subjectId}, ${studentId}, ${isAutoReview}, ${isCustomQuestion}, ${urgency}, ${selectedYear}, ${selectedQuestion}, ${con.escape(
      customQuestionText
    )}, '${submissionDate}', '${serverGeneratedReviewId}', ${con.escape(
      userAnswer
    )})`;

    try {
      const result = await this.mySQLInsert(insertQuery);
      return result;
    } catch (error) {
      console.log(JSON.stringify(error));
      return null;
    }
  }

  async deleteFRQ(id) {
    var insertQuery = `DELETE FROM frq.frqs WHERE (id = ${id})`;
    //DELETE FROM frq.frqs WHERE (id = 45);

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
  async getAllTeacherSubjects(userToken) {
    let teacher = await this.getTeacherFromToken(userToken);

    let teacherId = teacher[0].teacherId;
    var query = `SELECT * from frq.teachersubjects where (teacherId = ${teacherId});`;

    try {
      var result = await this.mySQLQuery(query);
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (error) {
      console.log("error here");
      console.log(error);
      return null;
    }
  }
  async getAllTeacherActiveReviews(teacherId) {
    var query = ` Select frqsList.*, subjects.name as subjectName from frq.subjects inner join 
    (
    SELECT * FROM frq.frqs where (assignedTo = ${teacherId})
    ) as frqsList on frqsList.subjectId = subjects.id
  `;

    try {
      var result = await this.mySQLQuery(query);
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (error) {
      console.log(error);
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
  async getNotCompletedFRQsAutoReview() {
    var query = `Select frqsList.*, subjects.name as subjectName from frq.subjects inner join 
        (
        SELECT * FROM frq.frqs where (isReviewed != true or isReviewed = null) and isAutoReview = 1
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
  async getAllOpenSubjectFRQs(subjectId) {
    var query = `(
      Select frqsList.*, subjects.name as subjectName from frq.subjects inner join 
        (
        SELECT * FROM frq.frqs where (isReviewed = false and isAutoReview=false and subjectId = ${subjectId} and assignedTo is NULL)
        ) as frqsList on frqsList.subjectId = subjects.id
      )`;
    try {
      var result = await this.mySQLQuery(query);
      result = JSON.parse(JSON.stringify(result));

      return result;
    } catch (error) {
      console.log("error maybe here");

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
  async getTeacherFromToken(token) {
    var query = `SELECT teachers.id as teacherId, teachers.firstName, teachers.lastName, teachers.birthDate, teachers.schoolId, teachers.yearsOfExperience, teachers.registrationDate, teachers.email, teachers.linkInProfile,teachers.onlineResume FROM teachers as teachers inner join (select * from accesstokens where token = "${token}" ) as tokens where teachers.id = tokens.teacherId`;

    try {
      const result = await this.mySQLQuery(query);
      return result;
    } catch (error) {
      return null;
    }
  }

  async getStudentExpirationFromToken(token) {
    var query = `SELECT accesstokens.expirationTime FROM accesstokens where token = "${token}"`;

    try {
      const user = await this.getStudentFromToken(token);
      if (user.length < 1) {
        return {
          logIn: false,
        };
      }
      const result = await this.mySQLQuery(query);
      var now = new Date();

      if (result[0].expirationTime > now) {
        var data = {
          logIn: true,
          user: user[0],
          userToken: token,
        };
        return data;
      }
      var data = {
        logIn: false,
      };
      return data;
    } catch (error) {
      var data = {
        logIn: false,
      };
      return data;
    }
  }
  async getTeacherExpirationFromToken(token) {
    var query = `SELECT accesstokens.expirationTime FROM accesstokens where token = "${token}"`;

    try {
      const user = await this.getTeacherFromToken(token);
      if (user.length < 1) {
        return {
          logIn: false,
        };
      }
      const result = await this.mySQLQuery(query);
      var now = new Date();

      if (result[0].expirationTime > now) {
        var data = {
          logIn: true,
          user: user[0],
          userToken: token,
        };
        return data;
      }
      var data = {
        logIn: false,
      };
      return data;
    } catch (error) {
      var data = {
        logIn: false,
      };
      return data;
    }
  }
  async updateReview(reviewId, autoReviewAnswer) {
    var now = Date.now();
    now = new Date(now);
    var query = `UPDATE frq.frqs SET isReviewed = 1, autoReviewAnswer = "${con.escape(
      autoReviewAnswer
    )}",reviewDate = '${this.formatDate(now)}' WHERE (id = ${reviewId})`;

    try {
      var result = await this.mySQLUpdate(query);
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async assignReview(teacherId, questionId) {
    var query = `UPDATE frq.frqs SET assignedTo = ${teacherId} WHERE (id = ${questionId})`;

    try {
      var result = await this.mySQLUpdate(query);
      result = JSON.parse(JSON.stringify(result));
      return result;
    } catch (error) {
      console.log(error);
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

  mySQLUpdate(updateQuery) {
    return new Promise((resolve, reject) => {
      con.query(updateQuery, (error, results) => {
        if (error) {
          return reject(error);
        }

        return resolve(results);
      });
    });
  }
}

module.exports = AppLibrary;
