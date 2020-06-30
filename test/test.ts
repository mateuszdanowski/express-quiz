import {driver} from 'mocha-webdriver';
import {expect} from 'chai';

const PROD_PORT = 8081;
const DEV_PORT = 3000;
const ROOT_URL = `http://localhost:${DEV_PORT}`;
const LOGIN_URL = ROOT_URL + '/';
const QUIZ_URL = ROOT_URL + '/quiz';
const LOGOUT_URL = ROOT_URL + '/logout';
const PASSWORD_URL = ROOT_URL + '/password';

async function logIn(username: string, password: string) {
  await driver.get(LOGIN_URL);
  await driver.find('#username-input').sendKeys(username);
  await driver.find('#pwd-input').sendKeys(password);
  await driver.find('#login-btn').click();
}

async function logOut() {
  await driver.get(LOGOUT_URL);
}

async function changePassword(currentPassword: string, newPassword: string) {
  await driver.get(PASSWORD_URL);
  await driver.find('#current-password-input').sendKeys(currentPassword);
  await driver.find('#new-password-input').sendKeys(newPassword);
  await driver.find('#new-password-confirmation-input').sendKeys(newPassword);
  await driver.find('#change-password-btn').click();
}

async function getQuizSelectOption(quizId: string) {
  return driver.find(`option[value="${quizId}"]`);
}

async function startQuiz(quizNr: string) {
  await driver.find(`option[value="${quizNr}"]`).click();
  await driver.find('button[type="submit"]').click();
}

async function getQuestionNumber() {
  return Number(await driver.find('#question-number').getText());
}

async function getNumberOfQuestions() {
  return Number(await driver.find('#question-count').getText());
}

async function getNextButton() {
  return await driver.find('#next-button');
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


describe('Quiz tests', async function () {
  this.timeout(0);

  before(async () => {
    await driver.manage().setTimeouts({pageLoad: 2000, implicit: 2000});
  });

  it('User cannot do the same quiz twice', async () => {
    await logIn('user1', 'user1');

    await startQuiz('2');

    const nextButton = await getNextButton();
    const questionsCount = await getNumberOfQuestions();
    let currentQuestionNumber;
    while (true) {
      currentQuestionNumber = await getQuestionNumber();
      await driver.find('input[name="answer"]').sendKeys('1');
      if (currentQuestionNumber === questionsCount) {
        await driver.find('#finish-button').click();
        break;
      }
      await nextButton.click();
    }
    expect(questionsCount).to.equal(4);

    const quizOption = await getQuizSelectOption('2');
    const enabled = await quizOption.isEnabled();
    // tslint:disable-next-line:no-unused-expression
    expect(enabled).to.be.false;
    await logOut();
  });


  it('User sessions should be logged out on password change', async () => {
    const loggedIn = async () => {
      try {
        await driver.find('#logout-btn');
      } catch (err) {
        return false;
      }
      return true;
    };
    await logIn('user2', 'user2');
    let logged = await loggedIn();
    // tslint:disable-next-line:no-unused-expression
    expect(logged).to.be.true;
    const sessionCookie = await driver.manage().getCookie('connect.sid');

    await changePassword('user2', '123');

    await driver.manage().addCookie({name: sessionCookie.name, value: sessionCookie.value});
    logged = await loggedIn();
    // tslint:disable-next-line:no-unused-expression
    expect(logged).to.be.false;
    await logIn('user2', '123');
    await changePassword('123', 'user2');
    logged = await loggedIn();
    // tslint:disable-next-line:no-unused-expression
    expect(logged).to.be.false;
  });


  it('App should send answers and statistics back to server', async () => {
    const loggedIn = async () => {
      try {
        await driver.find('#logout-btn');
      } catch (err) {
        return false;
      }
      return true;
    };
    const quizEnabled = async (quizId: number) => {
      try {
        await driver.find(`option[value="${quizId}"]`);
      } catch (err) {
        return false;
      }
      return true;
    };
    const quizScoreDisplayed = async (quizId: number) => {
      try {
        await driver.find(`#data-quiz-id-${quizId}`);
      } catch (err) {
        return false;
      }
      return true;
    };
    await logIn('user2', 'user2');
    const logged = await loggedIn();
    // tslint:disable-next-line:no-unused-expression
    expect(logged).to.be.true;

    // Check if quizzes loaded properly
    const quiz1Enabled = await quizEnabled(1);
    const quiz2Enabled = await quizEnabled(2);
    const quiz3Enabled = await quizEnabled(3);
    // tslint:disable-next-line:no-unused-expression
    expect(quiz1Enabled).to.be.true;
    // tslint:disable-next-line:no-unused-expression
    expect(quiz2Enabled).to.be.true;
    // tslint:disable-next-line:no-unused-expression
    expect(quiz3Enabled).to.be.false;

    await startQuiz('1');
    const nextButton = await getNextButton();
    const finishButton = await driver.find('#finish-button');

    // 1st question
    let questionStatement = await driver.find('#question').getText();
    expect(questionStatement).to.equal('Ile to 2+2?');
    await driver.find('input[name="answer"]').sendKeys('4'); // send correct answer
    // wait 1 second
    await delay(1000);
    await nextButton.click();

    // 2nd question
    questionStatement = await driver.find('#question').getText();
    expect(questionStatement).to.equal('Ile wynosi 10*10?');
    await driver.find('input[name="answer"]').sendKeys('10'); // send incorrect answer
    // wait 2 seconds
    await delay(2000);
    await finishButton.click();

    // check scores and times
    await driver.find('#display-scores-btn').click();

    // check if score is displayed
    const scoreDisplayed = await quizScoreDisplayed(1);
    // tslint:disable-next-line:no-unused-expression
    expect(scoreDisplayed).to.be.true;

    // number of correct answers should be 1 out of 2
    const correctAnswers = await driver.find(`#correct-for-quiz-id-1`).getText();
    expect(correctAnswers).to.equal('1');

    const numberOfQuestions = await driver.find(`#questions-number-for-quiz-id-1`).getText();
    expect(numberOfQuestions).to.equal('2');

    // users time spend should be about 1sec and 2sec for 1st and 2nd question
    let usersTime = parseFloat(await driver.find(`#users-time-for-quiz-id-1-and-q-0`).getText());
    expect(usersTime).to.be.above(1);
    expect(usersTime).to.be.below(1.4);

    usersTime = parseFloat(await driver.find(`#users-time-for-quiz-id-1-and-q-1`).getText());
    expect(usersTime).to.be.above(2);
    expect(usersTime).to.be.below(2.4);
  });
});


