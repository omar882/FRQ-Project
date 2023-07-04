const AppLibrary = require("./AppLibrary");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
const appLibrary = new AppLibrary();

/* const chatCompletion = await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  messages: [{ role: "user", content: "Hello world" }],
});
console.log(chatCompletion.data.choices[0].message); */
class AutoReview {
  getPrompt(subjectName, customQuestionText, userAnswer) {
    return (
      "Grade this " +
      subjectName +
      " FRQ based on the college board rubric. " +
      "If the students entered answer or the students entered question aren't related to college board FRQS, please respond with the following text: 'Please provide an appropriate response or an appropriate question.' " +
      " The students entered question is '" +
      customQuestionText +
      "'. The students answer was '" +
      userAnswer +
      "'."
    );
  }
  async reviewFRQ(reviewId, subjectName, customQuestionText, userAnswer) {
    //console.log(this.getPrompt(subjectName, customQuestionText, userAnswer));
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: this.getPrompt(subjectName, customQuestionText, userAnswer),
        },
      ],
    });
    console.log("in");
    appLibrary.updateReview(
      reviewId,
      chatCompletion.data.choices[0].message.content
    );
    return chatCompletion;
  }

  async findReviews() {
    appLibrary.getNotCompletedFRQsAutoReview().then((result) => {
      //console.log(result);
      const answer = [];
      for (var i = 0; i < result.length; i++) {
        console.log("this review:");
        console.log(result[i]);
        this.reviewFRQ(
          result[i].id,
          result[i].subjectName,
          result[i].customQuestionText,
          result[i].userAnswer
        ).then((res) => {});
      }
    });
  }
}
module.exports = AutoReview;
