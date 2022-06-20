import { Client, types } from "pg";
import * as moment from "moment";
import { DBError } from "./errors";

const TIMESTAMP_OID = 1114;
const parseFn = function (val: any) {
  return val === null ? null : moment.utc(val).unix();
};
types.setTypeParser(TIMESTAMP_OID, parseFn);

class DB {
  client: Client | undefined;
  connected: boolean;
  constructor() {
    this.connected = false;
  }
  connect() {
    this.client = new Client({
      user: process.env.USERDB || "notification",
      host:
        process.env.DBHOST ||
        "notification-dev.cqfjrxgkswhg.ap-southeast-1.rds.amazonaws.com",
      database: process.env.DBNAME || "notification",
      password: process.env.DBPASSWORD || "ftEW6LPvAhfhrXWk",
      port: parseInt(process.env.DBPORT || "5432"),
    });
    return this.client.connect().then(() => {
      this.connected = true;
    });
  }
  async close() {
    this.connected = false;
    this.client?.end();
    this.client = undefined;
  }
  commit() {
    return this.client?.query("COMMIT");
  }
  begin() {
    return this.client?.query("BEGIN");
  }
  shouldAbort() {
    return this.client?.query("ROLLBACK");
    // return await this.client.end();
  }
  async query(qString: string, params?: any) {
    try {
      if (!this.connected) {
        await this.connect();
        await this.begin();
      }
      const res = await this.client?.query(qString, params);
      return res?.rows ?? [];
    } catch (error) {
      console.log("db error", error);
      await this.shouldAbort();
      await this.begin();
      throw new DBError(error);
    }
  }
  async queryForce(qString: string, params?: any) {
    try {
      if (!this.connected) {
        await this.connect();
        await this.begin();
      }
      else {
        await this.shouldAbort();
        await this.begin();
      }
      const res = await this.client?.query(qString, params);
      await this.commit();
      return res?.rows ?? [];
    } catch (error) {
      console.log("db error", error);
      await this.shouldAbort();
      await this.begin();
      throw new DBError(error);
    }
  }
}
const db = new DB();

export default db;
