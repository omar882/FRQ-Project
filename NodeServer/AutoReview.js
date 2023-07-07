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
  getRubric(subjectName, questionNumber = 2) {
    var ans;
    if (subjectName === "AP Language and Composition") {
      /*
        1 is rhetorical , 2 is argumentation, 3 is synthesis
        */
      if (questionNumber == 1) {
        ans = `Before you start grading, keep in mind the student had a very limited amount of time to complete the essay. Keep the bar much lower and decide whether the essay's score holistically. The total FRQ Is graded out of 6 points. For each category, state how many points the student achieved and how they could achieve more.
The first category is the thesis which is worth (0-1 points).
Give 0 points for any of the following: 
There is no defensible thesis. 
The intended thesis only restates the prompt. 
The intended thesis provides a summary of the issue with no apparent or coherent claim. 
Or, there is a thesis, but it does not respond to the prompt.
Give 1 point for the following: 
Responds to the prompt with a defensible thesis that analyzes the writer's rhetorical choices.
The second category is Evidence AND Commentary which is worth (0-4 points).
Give 0 points for the following: Simply restates thesis (if present), repeats provided information, or offers information irrelevant to the prompt.
Give 1 point for the following: 
EVIDENCE: Provides evidence that is mostly general. 
AND COMMENTARY: Summarizes the evidence but does not explain how the evidence supports the student's argument.
Give 2 points for the following: 
EVIDENCE: Provides some specific relevant evidence. 
AND COMMENTARY: Explains how some of the evidence relates to the student's argument, but no line of reasoning is established, or the line of reasoning is faulty.
Give 3 points for the following: 
EVIDENCE: Provides specific evidence to support all claims in a line of reasoning. 
AND COMMENTARY: Explains how some of the evidence supports a line of reasoning. AND Explains how at least on rhetorical choice in the passage contributes to the writer's argument, purpose, or message.
Give 4 points for the following: 
EVIDENCE: Provides specific evidence to support all claims in a line of reasoning. 
AND COMMENTARY: Consistently explains how the evidence supports a line of reasoning. AND Explains how multiple rhetorical choices in the passage contribute to the writer's argument, purpose, or message.
The third category is Sophistication which is worth (0-1 points)
Give the Sophistication point if the student does any of the following:
1. Explaining the significance or relevance of the writer's rhetorical choices (given the rhetorical situation).
2. Explaining a purpose or function of the passage's complexities or tensions.
3. Employing a style that is consistently vivid and persuasive`;
        return ans;
      } else if (questionNumber == 2) {
        ans = `The total FRQ Is graded out of 6 points. For each category, state how many points the student achieved and how they could achieve more.
The first category is the thesis which is worth (0-1 points).
Give 0 points for any of the following: 
There is no defensible thesis. 
The intended thesis only restates the prompt. 
The intended thesis provides a summary of the issue with no apparent or coherent claim. 
Or, there is a thesis, but it does not respond to the prompt.
Give 1 point for the following: 
Responds to the prompt with a thesis that presents a defensible position
The second category is Evidence AND Commentary which is worth (0-4 points).
Give 0 points for the following: Simply restates thesis (if present), repeats provided information, or offers information irrelevant to the prompt.
Give 1 point for the following: 
EVIDENCE: Provides evidence that is mostly general. 
AND COMMENTARY: Summarizes the evidence but does not explain how the evidence supports the argument.
Give 2 points for the following: 
EVIDENCE: Provides some specific relevant evidence. 
AND COMMENTARY: Explains how some of the evidence relates to the student's argument, but no line of reasoning is established, or the line of reasoning is faulty.
Give 3 points for the following: 
EVIDENCE: Provides specific evidence to support all claims in a line of reasoning. 
AND COMMENTARY: Explains how some of the evidence supports a line of reasoning.
Give 4 points for the following: 
EVIDENCE: Provides specific evidence to support all claims in a line of reasoning. 
AND COMMENTARY: Consistently explains how the evidence supports a line of reasoning. 
The third category is Sophistication which is worth (0-1 points)
Give the Sophistication point if the student does any of the following:
1. Crafting a nuanced argument by consistently identifying and exploring complexities or tensions.
2. Articulating the implications or limitations of an argument (either the student's argument or an argument related to the
prompt) by situating it within a broader context.
3. Making effective rhetorical choices that consistently strengthen the force and impact of the student's argument.
4. Employing a style that is consistently vivid and persuasive`;
        return ans;
      }
    } else if (
      subjectName === "AP Calculus BC" ||
      subjectName === "AP Math" ||
      subjectName === "AP Calculus AB"
    ) {
      ans =
        "Each FRQ is worth 9 points. Allocate the points along the parts (if there are any) such that the sum is 9. Award points based on whether the students method was correct and whether or not the student explained the method. Be reasonable in expecting explanations.";
    }
    return ans;
  }

  getPrompt(subjectName, customQuestionText, userAnswer, questionNumber = 2) {
    var s =
      "Grade this " +
      subjectName +
      " FRQ based on the following rubric from the college board: " +
      this.getRubric(subjectName, questionNumber) +
      " If the student's entered answer or the students entered question aren't related to college board FRQS, please respond with the following text: Please provide an appropriate response or an appropriate question. " +
      " The students entered question is '" +
      customQuestionText +
      "'. The students answer was '" +
      userAnswer +
      "'.";
    console.log(s);
    return s;
  }
  async reviewFRQ(reviewId, subjectName, customQuestionText, userAnswer) {
    //console.log(this.getPrompt(subjectName, customQuestionText, userAnswer));
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: this.getPrompt(subjectName, customQuestionText, userAnswer),
        },
      ],
      temperature: 0,
    });
    //console.log("in");
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
        //console.log("this review:");
        //console.log(result[i]);
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
