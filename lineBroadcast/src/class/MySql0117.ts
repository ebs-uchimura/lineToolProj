/**
 * MySql.ts
 *
 * name：SQL
 * function：SQL operation
 * updated: 2025/1/17
 **/

"use strict";

// import global interface
import {} from "../../@types/globalsql";

// define modules
import * as mysql from "mysql2"; // mysql

// SQL class
class SQL {
  static pool: any; // sql pool
  static encryptkey: string; // encryptkey

  // construnctor
  constructor(
    host: string,
    user: string,
    pass: string,
    port: number,
    db: string,
    key?: string
  ) {
    console.log("db: initialize mode");
    // DB config
    SQL.pool = mysql.createPool({
      host: host, // host
      user: user, // username
      password: pass, // password
      database: db, // db name
      port: port, // port number
      waitForConnections: true, // wait for conn
      idleTimeout: 1000000, // timeout(ms)
      insecureAuth: false, // allow insecure
    });
    // encrypted key
    SQL.encryptkey = key!;
  }

  // inquire
  doInquiry = async (sql: string, inserts: string[]): Promise<any> => {
    return new Promise(async (resolve, _) => {
      try {
        // make query
        const qry: any = mysql.format(sql, inserts);
        // connect ot mysql
        const promisePool: any = SQL.pool.promise(); // spread pool
        const [rows, _] = await promisePool.query(qry); // query name

        // empty
        if (SQL.isEmpty(rows)) {
          // return error
          throw new Error("error");
        } else {
          // result object
          resolve(rows);
        }
      } catch (e: unknown) {
        // エラー型
        if (e instanceof Error) {
          // error
          console.log(e.message);
        }
        resolve("error");
      }
    });
  };

  // count db
  countDB = async (args: countargs): Promise<number> => {
    return new Promise(async (resolve, _) => {
      try {
        console.log("db: countDB mode");
        // total
        let total: number;
        // query string
        let queryString: string;
        // array
        let placeholder: any[];
        // table
        const table: string = args.table;
        // columns
        const columns: string[] = args.columns;
        // values
        const values: any[][] = args.values;
        // col length
        const colLen: number = columns.length;
        // value length
        const valLen: number = values.length;

        // query
        queryString = "SELECT COUNT(*) FROM ??";
        // placeholder
        placeholder = [table];

        // if column not null
        if (colLen > 0 && valLen > 0) {
          // add where phrase
          queryString += " WHERE";

          // loop for array
          for (let i: number = 0; i < colLen; i++) {
            // add in phrase
            queryString += " ?? IN (?)";
            // push column
            placeholder.push(columns[i]);
            // push value
            placeholder.push(values[i]);

            // other than last one
            if (i < colLen - 1) {
              // add 'and' phrase
              queryString += " AND";
            }
          }
        }

        // do query
        await this.doInquiry(queryString, placeholder)
          .then((result: any) => {
            // result exists
            if (result !== "error") {
              total = result[0]["COUNT(*)"];
            } else {
              total = 0;
            }
            console.log(`count: total is ${total}`);
            // return total
            resolve(total);
          })
          .catch((err: unknown) => {
            // error type
            if (err instanceof Error) {
              // error
              console.log(err);
            }
            resolve(0);
          });
      } catch (e: unknown) {
        // error type
        if (e instanceof Error) {
          // error
          console.log(e);
        }
        resolve(0);
      }
    });
  };

  // select db
  selectDB = async (args: selectargs): Promise<any> => {
    return new Promise(async (resolve, _) => {
      try {
        console.log("db: selectDB mode");
        // query string
        let queryString: string;
        // placeholder
        let placeholder: any[];
        // table
        const table: string = args.table;
        // columns
        const columns: string[] = args.columns;
        // values
        const values: any[][] = args.values;
        // fields (optional)
        const fields: any = args.fields ?? null;
        // spancol (optional)
        const spancol: any = args.spancol ?? null;
        // span (optional)
        const span: any = args.span ?? null;
        // reverse (optional)
        const reverse: any = args.reverse ?? false;
        // order (optional)
        const order: any = args.order ?? null;
        // limit (optional)
        const limit: any = args.limit ?? null;
        // order (optional)
        const offset: any = args.offset ?? null;
        // col length
        const colLen: number = columns.length;
        // value length
        const valLen: number = values.length;

        // if fields exists
        if (fields) {
          // query
          queryString = "SELECT ?? FROM ??";
          // placeholder
          placeholder = [fields, table];
        } else {
          // query
          queryString = "SELECT * FROM ??";
          // placeholder
          placeholder = [table];
        }

        // if column not null
        if (colLen > 0 && valLen > 0) {
          // add where phrase
          queryString += " WHERE";

          // loop for array
          for (let i: number = 0; i < colLen; i++) {
            // add in phrase
            queryString += " ?? IN (?)";
            // push column
            placeholder.push(columns[i]);
            // push value
            placeholder.push(values[i]);

            // other than last one
            if (i < colLen - 1) {
              // add 'and' phrase
              queryString += " AND";
            }
          }
        }

        // if column not null
        if (spancol && span) {
          // query
          queryString += " AND ?? > date(current_timestamp - interval ? HOUR)";
          // push span column
          placeholder.push(spancol);
          // push span limit
          placeholder.push(span);
        }

        // query
        queryString += " ORDER BY ??";

        // if reverse
        if (reverse) {
          // query
          queryString += " ASC";
        } else {
          // query
          queryString += " DESC";
        }

        // if order exists
        if (order) {
          // push order key
          placeholder.push(order);
        } else {
          // push default id
          placeholder.push("id");
        }

        // if limit exists
        if (limit) {
          // query
          queryString += " LIMIT ?";
          // push limit
          placeholder.push(limit);
        }

        // if offset exists
        if (offset) {
          // query
          queryString += " OFFSET ?";
          // push offset
          placeholder.push(offset);
        }

        // do query
        await this.doInquiry(queryString, placeholder)
          .then((result2: any) => {
            resolve(result2);
            console.log("select: db select success");
          })
          .catch((err: unknown) => {
            // error
            if (err instanceof Error) {
              // error
              console.log(err.message);
            }
            throw new Error("error");
          });
      } catch (e: unknown) {
        // error
        if (e instanceof Error) {
          // error
          console.log(e.message);
        }
        resolve("error");
      }
    });
  };

  // update
  updateDB = async (args: updateargs): Promise<any> => {
    return new Promise(async (resolve1) => {
      try {
        console.log("db: updateDB mode");
        // not
        let tmpQuery: string = "";
        // placeholder array
        let placeholder: any[] = [];
        // tmp placeholder array
        let tmpPlaceholder: any[] = [];
        // table
        const table: string = args.table;
        // select columns
        const selcol: string[] = args.selcol;
        // select values
        const selval: any[] = args.selval;
        // set column
        const setcol: string[] = args.setcol;
        // set value
        const setval: any[] = args.setval;
        // span column
        const spancol: any = args.spancol ?? null;
        // span value
        const spanval: any = args.spanval ?? null;
        // selcol length
        const selcolLen: number = selcol.length;
        // setcol length
        const setcolLen: number = setcol.length;
        // promise
        const promises: Promise<any>[] = [];
        // query string
        let queryString: string = "UPDATE ?? SET ?? = ? WHERE ";

        // set all conditions
        for (let i: number = 0; i < selcolLen; i++) {
          // initialize
          tmpQuery = "";
          // not
          if (selcol[i].includes("*")) {
            queryString += "?? <> ?";
            tmpQuery = selcol[i].replace("*", "");
          } else {
            queryString += "?? = ?";
            tmpQuery = selcol[i];
          }

          // push column
          tmpPlaceholder.push(tmpQuery);
          // push value
          tmpPlaceholder.push(selval[i]);
          // other than last one
          if (i < selcolLen - 1) {
            // add 'and' phrase
            queryString += " AND ";
          }
        }

        // set all values and execute
        for (let j = 0; j < setcolLen; j++) {
          // placeholder
          placeholder = [table];
          // add promise
          promises.push(
            new Promise(async (resolve2, reject2) => {
              // push column
              placeholder.push(setcol[j]);
              // push value
              placeholder.push(setval[j]);
              // add conditions
              placeholder.push(...tmpPlaceholder);

              // add span
              if (spancol && spanval) {
                queryString +=
                  " AND ?? < date(current_timestamp - interval ? hour)";
                placeholder.push(spancol);
                placeholder.push(spanval);
              }
              // do query
              await this.doInquiry(queryString, placeholder)
                .then((result: any) => {
                  resolve2(result);
                  console.log("select: db update success");
                })
                .catch((err: unknown) => {
                  // error
                  if (err instanceof Error) {
                    // error
                    reject2(err.message);
                  }
                });
            })
          );
        }
        // complete
        Promise.all(promises).then((results: any) => {
          resolve1(results);
        });
      } catch (e: unknown) {
        // error
        if (e instanceof Error) {
          // error
          console.log(e.message);
          resolve1("error");
        }
      }
    });
  };

  // insert
  insertDB = async (args: insertargs): Promise<number> => {
    return new Promise(async (resolve) => {
      try {
        console.log("db: insertDB mode");
        // table
        const table: string = args.table;
        // columns
        const columns: string[] = args.columns;
        // values
        const values: any[] = args.values;
        // query string
        const queryString: string = "INSERT INTO ??(??) VALUES (?)";
        // placeholder
        const placeholder: any[] = [table, columns, values];

        // do query
        await this.doInquiry(queryString, placeholder)
          .then((result: any) => {
            // return inserted id
            resolve(result.insertId);
            console.log("select: db insert success");
          })
          .catch((err: unknown) => {
            // error
            if (err instanceof Error) {
              // error
              throw new Error(err.message);
            }
          });
      } catch (e: unknown) {
        // error
        if (e instanceof Error) {
          // error
          console.log(e.message);
          resolve(0);
        }
      }
    });
  };

  // empty or not
  static isEmpty(obj: Object) {
    // check whether blank
    return !Object.keys(obj).length;
  }
}

// export module
export default SQL;
