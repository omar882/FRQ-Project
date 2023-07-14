const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const AppLibrary = require("./AppLibrary");
const AutoReview = require("./AutoReview");

const app = express();

const appLibrary = new AppLibrary();
const autoReview = new AutoReview();
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

const DIR = "./public/";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});

const upload = multer({ dest: "uploads/" });

app.post("/upload_files", upload.array("files"), uploadFiles);

setInterval(() => {
  callFindReviews();
}, 10000);

function callFindReviews() {
  autoReview.findReviews();
}

function uploadFiles(req, res) {
  const body = req.body;
  console.log(body);
  console.log("trying to upload files");
  res.json({ message: "Successfully uploaded files" });
}

app.post("/upload", upload.array("files", 6), (req, res, next) => {
  console.log("in ---------------------------------");
  console.log(req.headers);

  console.log(req.headers.qid);
  const reqFiles = [];
  const url = req.protocol + "://" + req.get("host");
  let answerFileList = "";
  for (var i = 0; i < req.files.length; i++) {
    reqFiles.push(url + "/public/" + req.files[i].filename);
    //console.log(url + "/public/" + req.files[i].filename);
    answerFileList += url + "/public/" + req.files[i].filename;
    if (i != req.files.length - 1) {
      answerFileList += ",";
    }
  }
  appLibrary.addAnswerFileList(answerFileList, req.headers.qid);
});

app.get("/", (req, res) => {
  res.send(ads);
});

app.post("/subjects", (req, res) => {
  const body = req.body;
  appLibrary.getAllSubjects().then((result) => {
    res.send(result);
  });
});

app.post("/getStudentExpirationtime", (req, res) => {
  const body = req.body;

  appLibrary
    .getStudentExpirationFromToken(req.body.userToken)
    .then((result) => {
      res.send(result);
    });
});
app.post("/getTeacherExpirationtime", (req, res) => {
  const body = req.body;

  appLibrary
    .getTeacherExpirationFromToken(req.body.userToken)
    .then((result) => {
      res.send(result);
    });
});
app.post("/removeFRQ", (req, res) => {
  const body = req.body;

  appLibrary.deleteFRQ(body.id).then((result) => {
    res.send(result);
  });
});
app.post("/addteachersubject", async (req, res) => {
  const body = req.body;
  let teacherId;
  appLibrary.getTeacher(body.email, body.password).then((result) => {
    teacherId = result[0].id;
    appLibrary.addTeacherSubject(teacherId, body.subjectId).then((result) => {
      res.send(result);
    });
  });
});
app.post("/login", async (req, res) => {
  const userCredential = req.body;
  appLibrary
    .login(userCredential.userName, userCredential.password)
    .then((result) => {
      res.send(result);
    });
});
app.post("/teacherlogin", async (req, res) => {
  const userCredential = req.body;
  appLibrary
    .teacherLogin(userCredential.userName, userCredential.password)
    .then((result) => {
      res.send(result);
    });
});

app.post("/signup", async (req, res) => {
  const userCredential = req.body;
  appLibrary
    .addStudent(
      userCredential.userName,
      userCredential.lastname,
      userCredential.dateofbirth,
      1,
      userCredential.grade,
      userCredential.email,
      userCredential.password
    )
    .then((result) => {
      res.send(result);
    });
});

app.post("/teachersignup", async (req, res) => {
  const userCredential = req.body;
  appLibrary
    .addTeacher(
      userCredential.userName,
      userCredential.lastname,
      userCredential.dateofbirth,
      1,
      userCredential.yearsOfExperience,
      userCredential.email,
      userCredential.password,
      userCredential.linkedIn,
      userCredential.onlineResume
    )
    .then((result) => {
      res.send(result);
    });
});

app.post("/postreview", async (req, res) => {
  const reviewData = req.body;
  var studentId = null;
  appLibrary.getStudentFromToken(reviewData.token).then((result) => {
    studentId = result.studentId;
  });
  //console.log(reviewData);
  appLibrary
    .postReview(
      reviewData.userToken,
      reviewData.selectedSubject.id,
      reviewData.isCustom,
      reviewData.isAutoReview,
      reviewData.urgencySelection.value,
      reviewData.selectedQuestion.value,
      reviewData.selectedSubjectYear.value,
      reviewData.customQuestionText,
      reviewData.userAnswer
    )
    .then((result) => {
      res.send(result);
    });
});

app.post("/completedreviews", async (req, res) => {
  const reviewData = req.body;
  console.log(reviewData);
  var studentId = null;
  await appLibrary.getStudentFromToken(reviewData.userToken).then((result) => {
    console.log(result);
    console.log(JSON.parse(JSON.stringify(result))[0]); //.studentId;
    studentId = JSON.parse(JSON.stringify(result))[0].studentId;
    appLibrary.getStudentCompletedFRQs(studentId).then((result) => {
      res.send(result);
    });
  });
});

app.post("/openreviews", async (req, res) => {
  const reviewData = req.body;

  var studentId = null;
  await appLibrary.getStudentFromToken(reviewData.userToken).then((result) => {
    studentId = JSON.parse(JSON.stringify(result))[0].studentId;
    appLibrary.getStudentNotCompletedFRQs(studentId).then((result) => {
      res.send(result);
    });
  });
});
app.post("/teacheropenreviews", async (req, res) => {
  const body = req.body;

  appLibrary.getAllOpenSubjectFRQs(body.subjectId).then((result) => {
    res.send(result);
  });
});
app.post("/assignreview", async (req, res) => {
  const body = req.body;
  console.log("------- ");
  console.log(body);
  appLibrary.assignReview(body.teacherId, body.questionId).then((result) => {
    res.send(result);
  });
});
app.post("/postteacherreview", async (req, res) => {
  const body = req.body;
  console.log("------- ");
  console.log(body);
  appLibrary
    .postTeacherReview(body.questionId, body.questionAnswer)
    .then((result) => {
      res.send(result);
    });
});

app.post("/teacheractivereviews", async (req, res) => {
  const body = req.body;

  appLibrary.getAllTeacherActiveReviews(body.teacherId).then((result) => {
    res.send(result);
  });
});
app.post("/teachercompletedreviews", async (req, res) => {
  const body = req.body;

  appLibrary.getAllTeacherCompletedReviews(body.teacherId).then((result) => {
    res.send(result);
  });
});

app.post("/teachersubjects", async (req, res) => {
  const body = req.body;

  appLibrary.getAllTeacherSubjects(body.userToken).then((result) => {
    res.send(result);
  });
});

app.post("/upload2", (req, res) => {
  res.send("Submitted");
});

const ads = [{ title: "Hello, world (again)!" }];

// starting the server
app.listen(3001, () => {
  console.log("listening on port 3001");
});

//appLibrary.addSchool("Amador Valley High School", "CA", "1155 Santa Rita Road, Pleasanton, California 94566");
//appLibrary.addStudent("Omar", "AbouTaleb", "2006-08-02", 1, "2023-05-07", 11, c);

function run() {
  //appLibrary.login("omar@gmail.com", "passwords").then((result) => { console.log(result) });
  //appLibrary.getStudentFromToken("f595470517982a0051dcd18a83777053ee1b7ac3fb075d9010ecc7be7be4ae15").then((result) => { console.log(result) });
  //appLibrary.addSubject("AP Math").then((result) => { console.log(result) });
  //appLibrary.addSubject("AP History").then((result) => { console.log(result) });
  //appLibrary.getAllSubjects().then((result) => { console.log(result) });
  //appLibrary.addQuestion("Question 1", 2020, 1, "").then((result) => { console.log(result) });
  //appLibrary.getAllQuestions().then((result) => { console.log(result) });
  //appLibrary.postReview("0489fe5f6e33c8763c35fffdedbd1674f623393b0c939a73413dcd16fe03819f", 1, true, true, 1, -1, -1, "What is the sum of 2+2?");
}

run();
