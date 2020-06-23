import sqlite3 from 'sqlite3'
import util from 'util';

export enum TableName {
  USERS,
  QUIZZES,
  SCORES
}

export class DbDao {

  private readonly dbFilePath = 'database';

  private db = new sqlite3.Database(this.dbFilePath);


  // tslint:disable-next-line:ban-types
  protected promisifiedDbFun(fun: Function) {
    return (stmt: string, paramsValues: any[]) =>
        util.promisify(fun).bind(this.db)(stmt, paramsValues);
  }


  protected promisifiedRun(stmt: string, paramsValues: any[] = []) {
    return this.promisifiedDbFun(this.db.run)(stmt, paramsValues);
  }


  protected promisifiedGet(stmt: string, paramsValues: any[] = []) {
    return this.promisifiedDbFun(this.db.get)(stmt, paramsValues);
  }


  protected promisifiedAll(stmt: string, paramsValues: any[] = []) {
    return this.promisifiedDbFun(this.db.all)(stmt, paramsValues);
  }


  public async createTable(name: TableName): Promise<void> {
    switch (name) {
      case TableName.USERS:
        return this.promisifiedRun('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, pwdHash TEXT)');
      case TableName.QUIZZES:
        return this.promisifiedRun('CREATE TABLE quizzes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, content TEXT)');
      case TableName.SCORES:
        return this.promisifiedRun('CREATE TABLE scores (id INTEGER PRIMARY KEY AUTOINCREMENT , quizId INTEGER REFERENCES quizzes (id), score INTEGER )');
    }
    return {} as any;
  }
}
