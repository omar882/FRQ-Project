const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const AppLibrary = require("./AppLibrary");

const app = express();

const appLibrary = new AppLibrary();

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

function uploadFiles(req, res) {
  //console.log(req.body);
  //console.log(req.files);
  //console.log(req.header("serverGeneratedReviewId"));
  res.json({ message: "Successfully uploaded files" });
}

app.post("/upload", upload.array("files", 6), (req, res, next) => {
  const reqFiles = [];
  const url = req.protocol + "://" + req.get("host");
  //console.log(req.files[0].filename);
  for (var i = 0; i < req.files.length; i++) {
    reqFiles.push(url + "/public/" + req.files[i].filename);
    //console.log(url + "/public/" + req.files[i].filename);
  }
});

app.get("/", (req, res) => {
  res.send(ads);
});

app.post("/subjects", (req, res) => {
  const body = req.body;
  appLibrary.getAllSubjects().then((result) => {
    //console.log(result);
    res.send(result);
  });
});
app.post("/removeFRQ", (req, res) => {
  console.log("deleting");
  const body = req.body;

  appLibrary.deleteFRQ(body.id).then((result) => {
    res.send(result);
    //console.log(result);
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

app.post("/postreview", async (req, res) => {
  //console.log("Post review");
  const reviewData = req.body;

  //console.log(reviewData);
  //console.log(reviewData.selectedSubject.id);
  var studentId = null;
  appLibrary.getStudentFromToken(reviewData.token).then((result) => {
    studentId = result.studentId;
  });
  //console.log(studentId);
  //console.log(reviewData.userAnswer);
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
      //console.log(result);
    });
});

app.post("/completedreviews", async (req, res) => {
  //console.log("completedreviews");
  const reviewData = req.body;

  //console.log(JSON.stringify(reviewData));
  //console.log(reviewData.selectedSubject.id);
  var studentId = null;
  await appLibrary.getStudentFromToken(reviewData.userToken).then((result) => {
    //console.log(result);
    //console.log(JSON.parse(JSON.stringify(result))); //.studentId;
    studentId = JSON.parse(JSON.stringify(result))[0].studentId;
    //console.log(studentId);
    appLibrary.getStudentCompletedFRQs(studentId).then((result) => {
      res.send(result);
    });
  });
});

app.post("/openreviews", async (req, res) => {
  //console.log("openreviews");
  const reviewData = req.body;

  //console.log(JSON.stringify(reviewData));
  //console.log(reviewData.selectedSubject.id);
  var studentId = null;
  await appLibrary.getStudentFromToken(reviewData.userToken).then((result) => {
    //console.log(result);
    //console.log(JSON.parse(JSON.stringify(result))); //.studentId;
    studentId = JSON.parse(JSON.stringify(result))[0].studentId;
    //console.log(studentId);
    appLibrary.getStudentNotCompletedFRQs(studentId).then((result) => {
      res.send(result);
    });
  });
});

app.post("/upload2", (req, res) => {
  //console.log(req);
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
