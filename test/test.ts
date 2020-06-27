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
});


