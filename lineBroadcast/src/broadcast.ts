/**
 * index.ts
 **
 * function：LINE braodcast app
 **/

// import global interface
import {} from "../@types/globalsql";

// modules
import { config as dotenv } from "dotenv"; // secret
import { BrowserWindow, app, ipcMain, Tray, Menu, nativeImage } from "electron"; // electron
import * as path from "path"; // path
import * as https from "https"; // https
import sanitizeHtml from "sanitize-html"; // sanitizer
import ImageSize from "image-size"; // imagesize changer
import Client from "ssh2-sftp-client"; // sfpt client
import { setTimeout } from "node:timers/promises"; // wait for seconds
import ELLogger from "./class/ELLogger0217"; // Electron-logger
import SQL from "./class/MySql0117"; // DB operation
import CSV from "./class/ElectronCsv0119"; // csv
import Dialog from "./class/ElectronDialog0120"; // dialog
import MKDir from "./class/Mkdir0217"; // DB operation

// constants
const PAGECOUNT: number = 15; // page number
const CSV_ENCODING: string = "SJIS"; // csv char code

// module
const logger: ELLogger = new ELLogger(
  path.join(app.getPath("home"), "ebisudo", "linebroadcast"),
  "access"
); // logger
const csvMaker: CSV = new CSV(CSV_ENCODING); // csv
const dialogMaker: Dialog = new Dialog(); // dialog
const mkdirManager = new MKDir(); // mkdir

// secret file
dotenv({ path: path.join(__dirname, "../.env") });

// db info
let sqlHost: string; // SQL hostname
let sqlUser: string; // SQL username
let sqlPass: string; // SQL password
let sqlDb: string; // SQL database

// dev mode
sqlHost = process.env.SQL_HOST!; // host name
sqlUser = process.env.SQL_COMMONUSER!; // SQL username
sqlPass = process.env.SQL_COMMONPASS!; // SQL password
sqlDb = process.env.SQL_DBNAME!; // SQL database

// db
const myDB: SQL = new SQL(
  sqlHost, // hostname
  sqlUser, // username
  sqlPass, // password
  Number(process.env.SQL_PORT), // port
  sqlDb // DB
);

/*
 electron operation
*/
/* main */
// mainwindow
let mainWindow: Electron.BrowserWindow;
// isquiting
let isQuiting: boolean;
// createwindow
const createWindow = (): void => {
  try {
    // mainwindow
    mainWindow = new BrowserWindow({
      width: 1200, // width
      height: 1000, // height
      webPreferences: {
        nodeIntegration: false, // Node.js
        contextIsolation: true, // context
        preload: path.join(__dirname, "preload.js"), // preload
      },
    });

    // menubar
    mainWindow.setMenuBarVisibility(false);
    // index.html load
    mainWindow.loadFile(path.join(__dirname, "../index.html"));
    // ready-to-show
    mainWindow.once("ready-to-show", () => {
      // dev mode
      //mainWindow.webContents.openDevTools();
    });

    // minimize
    mainWindow.on("minimize", (event: any): void => {
      logger.info("window: minimize app");
      // cancel click
      event.preventDefault();
      // hide window
      mainWindow.hide();
      // false
      event.returnValue = false;
    });

    // close
    mainWindow.on("close", (event: any): void => {
      logger.info("window: close app");
      // is quiting
      if (!isQuiting) {
        // apple
        if (process.platform !== "darwin") {
          // quit
          app.quit();
          // false
          event.returnValue = false;
        }
      }
    });

    // close window
    mainWindow.on("closed", (): void => {
      logger.info("window: closed app");
      // destroy window
      mainWindow.destroy();
    });
  } catch (e: unknown) {
    // show error message
    logger.error(e);
  }
};
// sandbox
app.enableSandbox();

// avoid mainprocess(Nodejs)double boot
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  logger.info("app: main process duplicate.");
  app.quit();
}

// ready
app.on("ready", async () => {
  logger.info("app: electron is ready");
  // make directory
  await mkdirManager.mkDir(
    path.join(app.getPath("home"), "ebisudo", "linebroadcast")
  );
  // open window
  createWindow();
  // icon
  const icon: any = nativeImage.createFromPath(
    path.join(__dirname, "../assets/broacast.ico")
  );
  // tray
  const mainTray: Electron.Tray = new Tray(icon);
  // context menu
  const contextMenu: Electron.Menu = Menu.buildFromTemplate([
    {
      // show
      label: "show",
      click: () => {
        mainWindow.show();
      },
    },
    {
      // close
      label: "close",
      click: () => {
        isQuiting = true;
        app.quit();
      },
    },
  ]);
  // set context menu
  mainTray.setContextMenu(contextMenu);
  // double click
  mainTray.on("double-click", () => mainWindow.show());
});

// activate
app.on("activate", async () => {
  logger.info("app: activate app");
  // no window
  if (BrowserWindow.getAllWindows().length === 0) {
    // reboot
    createWindow();
  }
});

// close button
app.on("before-quit", () => {
  logger.info("app: before-quit app");
  // isQuittings
  isQuiting = true;
});

// exit
app.on("window-all-closed", () => {
  logger.info("app: window-all-closed app");
  // close app
  app.quit();
});

/*
 IPC operation
*/
/* page */
ipcMain.on("page", async (event, arg) => {
  try {
    logger.info("ipc: page mode");
    // url
    let url: string = "";
    // plan master flg
    let planMasterFlg: boolean = false;
    // genre master flg
    let genreMasterFlg: boolean = false;
    // channel master flg
    let channelMasterFlg: boolean = false;
    // broadcast type flg
    let typeMethodMasterFlg: boolean = false;
    // history flg
    let historyFlg: boolean = false;
    // plan regist flg
    let planRegistFlg: boolean = false;

    // url set
    switch (arg) {
      // top
      case "top_page":
        // url
        url = "../index.html";
        break;

      // immediate
      case "immediate_page":
        // url
        url = "../immediate.html";
        break;

      // plan
      case "regist_plan_page":
        // url
        url = "../registplan.html";
        break;

      // genre
      case "regist_genre_page":
        // url
        url = "../registgenre.html";
        break;

      // channel
      case "regist_channel_page":
        // url
        url = "../registchannel.html";
        break;

      // delete plan
      case "delete_plan_page":
        // url
        url = "../deleteplan.html";
        break;

      // delete genre
      case "delete_genre_page":
        // url
        url = "../deletegenre.html";
        break;

      // delete channel
      case "delete_channel_page":
        // url
        url = "../deletechannel.html";
        break;

      // history
      case "history_page":
        // url
        url = "../history.html";
        break;

      default:
        // url
        url = "";
        logger.debug("out of scope.");
    }
    logger.info(`page: ${url}`);

    // load page
    await mainWindow.loadFile(path.join(__dirname, url));

    // url set
    switch (arg) {
      // immediate
      case "immediate_page":
        // plan flg
        planMasterFlg = true;
        // channel flg
        channelMasterFlg = true;
        break;

      // plan registration
      case "regist_plan_page":
        // genre flg
        genreMasterFlg = true;
        // type method
        typeMethodMasterFlg = true;
        // plan flg
        planRegistFlg = true;
        break;

      // genre registration
      case "regist_genre_page":
        break;

      // channel registration
      case "regist_channel_page":
        break;

      // delete plan registration
      case "delete_plan_page":
        // plan flg
        planMasterFlg = true;
        break;

      // delete genre registration
      case "delete_genre_page":
        // genre flg
        genreMasterFlg = true;
        break;

      // delete channel registration
      case "delete_channel_page":
        // channel flg
        channelMasterFlg = true;
        break;

      // history
      case "history_page":
        // history flg
        historyFlg = true;
        break;

      default:
        // url
        url = "";
        logger.debug("out of scope.");
    }

    // channel flg
    if (channelMasterFlg) {
      logger.info("page: channel master mode");
      // data
      const channelSelectArgs: selectargs = {
        table: "channel", // table
        columns: ["usable"], // column
        values: [[1]], // value
      };
      // extract channel data
      const channelData: any = await myDB.selectDB(channelSelectArgs);

      // error
      if (channelData === "error") {
        // error
        throw new Error("DB: failed channel registration");
      } else {
        logger.info("page: channel select success");
        // show error list
        event.sender.send("channelMasterllist", channelData);
      }
    }

    // genre master
    if (genreMasterFlg) {
      logger.info("page: genre master mode");
      // data
      const genreSelectArgs: selectargs = {
        table: "genre", // table
        columns: ["usable"], // column
        values: [[1]], // value
      };
      // extract genre data
      const genreData: any = await myDB.selectDB(genreSelectArgs);

      // error
      if (genreData === "error") {
        // error
        throw new Error("DB: failed channel selection");
      } else {
        logger.info("page: genre select success");
        // show genre list
        event.sender.send("genreMasterlist", genreData);
      }
    }

    // type master
    if (typeMethodMasterFlg) {
      logger.info("page: linemethod master mode");
      // data
      const linemethodSelectArgs: selectargs = {
        table: "linemethod", // table
        columns: ["usable"], // column
        values: [[1]], // value
      };
      // extract method data
      const linemethodData: any = await myDB.selectDB(linemethodSelectArgs);

      // error
      if (linemethodData === "error") {
        // error
        throw new Error("DB: failed channel line method selection");
      } else {
        logger.info("page: linemethod select success");
        // send line method
        event.sender.send("lineMethodMasterlist", linemethodData);
      }
    }

    // plan
    if (planMasterFlg) {
      logger.info("page: plan master mode");
      // data
      const planSelectArgs: selectargs = {
        table: "plan", // table
        columns: ["usable"], // column
        values: [[1]], // value
      };
      // extract plan data
      const planData: any = await myDB.selectDB(planSelectArgs);

      // error
      if (planData === "error") {
        // error
        throw new Error("DB: failed plan selection");
      } else {
        logger.info("page: plan select success");
        // send plan data
        event.sender.send("planMasterllist", planData);
      }
    }

    // history
    if (historyFlg) {
      logger.info("page: broadcast history mode");
      // result
      const resultObj: any = await gethistory(0, PAGECOUNT);
      logger.debug("broadcast history extracted");
      // send history data
      event.sender.send("history_finish", resultObj);
    }

    // plan regist
    if (planRegistFlg) {
      logger.info("page: plan register mode");
      // send history data
      event.sender.send("planInitialize", "");
    }
  } catch (e: unknown) {
    // error
    logger.error(e);
  }
});

/* registration */
// plan registration
ipcMain.on("planregister", async (event, arg) => {
  try {
    logger.info("ipc: planregister mode");
    // image width
    let imgWidth: number;
    // image height
    let imgHeight: number;
    // image height
    let insertedPlanId: number;
    // mainfile url
    let mainFileUri: string;
    // upload result
    let uploadResult: string;
    // plan name
    const planname: string = sanitizeHtml(arg.planname);
    // broadcastID
    const linemethodId: number = Number(arg.linemethod);
    // genreID
    const genreId: number = Number(arg.genre);
    // baseURL
    const baseUrl: string = sanitizeHtml(arg.baseurl);
    // textbox
    const planText: string = arg.textSet;
    // image path
    const imagePath: string[] = arg.imagedata;
    // base http url
    const baseHttpUri: string = "https://ebisuan.sakura.ne.jp/assets/image/";
    // plan column
    const planColumns: string[] = [
      "planname", // planname
      "genre_id", // genreID
      "linemethod_id", // broadcastID
      "baseurl", // baseURL
      "usable", // usable
    ];
    // plan values
    const planValues: any[] = [
      planname, // planname
      genreId, // genreID
      linemethodId, // broadcastID
      baseUrl, // baseURL
      1, // usable
    ];
    // insert plan
    const insertPlanArgs: insertargs = {
      table: "plan", // table
      columns: planColumns, // column
      values: planValues, // value
    };
    // plandb insert
    const tmpPlanReg: any = await myDB.insertDB(insertPlanArgs);

    // fail plan registration
    if (tmpPlanReg == "error") {
      // error
      throw new Error("DB: failed plan registration");
    } else {
      logger.info("plan registered");
    }

    // insert broadcastID
    if (tmpPlanReg > 0) {
      // insert broadcastID
      insertedPlanId = tmpPlanReg;
    } else {
      // error
      throw new Error("plan id is incorrect.");
    }

    // swich on linemethod
    switch (linemethodId) {
      // text
      case 1:
        logger.info("1: text mode");
        // regist plan text
        await registTxt(insertedPlanId, [planText]);
        break;
      // image/selection mode
      case 2:
        logger.info("2: image mode");
        // regist plan text
        await registTxt(insertedPlanId, [planText]);
        // image path is empty
        if (imagePath[0] == "") {
          // error
          throw new Error("no image");
        }
        // upload file to server
        uploadResult = await uploadFile(imagePath[0]);
        // success
        if (uploadResult != "success") {
          // error
          throw new Error("failed image registration");
        } else {
          logger.info("page: upload success");
        }
        // main file name
        mainFileUri = `${baseHttpUri}${path.basename(
          sanitizeHtml(imagePath[0])
        )}`;
        // image size
        const dimensions: any = ImageSize(imagePath[0]);
        // image width
        imgWidth = dimensions.width;
        // image height
        imgHeight = dimensions.height;
        // regist image
        await registImage(insertedPlanId, mainFileUri, imgWidth, imgHeight);
        break;
      // default mode
      default:
        logger.debug("no linemethod");
    }
    // show error message
    dialogMaker.showmessage(
      "info",
      `プランを登録しました。プラン名:${planname}`
    );
    // send plan finished
    event.sender.send("operation_finish", "plan");
  } catch (e: unknown) {
    // show error message
    logger.error(e);
  }
});

// regist genre
ipcMain.on("genreregister", async (event, arg) => {
  try {
    logger.info("ipc: genreregister mode");
    // genre name
    const genrename: string = sanitizeHtml(arg);
    // genre column
    const genreColumns: string[] = [
      "genrename", // genre name
      "usable", // usable
    ];
    // genre values
    const genreValues: any[] = [
      genrename, // genre name
      1, // usable
    ];
    // inser genre
    const insertGenreArgs: insertargs = {
      table: "genre", // table
      columns: genreColumns, // column
      values: genreValues, // value
    };
    // insert to transaction db
    const tmpTransReg: any = await myDB.insertDB(insertGenreArgs);

    // error
    if (tmpTransReg == "error") {
      // error
      throw new Error("genreregister: failed genre registeration");
    } else {
      // show message
      dialogMaker.showmessage(
        "info",
        `ジャンル登録成功。ジャンル名:${genrename}`
      );
      logger.info("genreregister: plan registered");
      // finished
      event.sender.send("operation_finish", "genre");
    }
  } catch (e: unknown) {
    // show error message
    logger.error(e);
  }
});

// regist channel
ipcMain.on("channelregist", async (event, arg) => {
  try {
    logger.info("ipc: channelregist mode");
    // channel name
    const channelname: string = sanitizeHtml(arg.channelname);
    // token
    const token: string = arg.token;
    // channel column
    const channelColumns: string[] = [
      "channelname", // channel name
      "token", // token
      "usable", // usable
    ];
    // channel values
    const channelValues: any = [
      channelname, // channel name
      token, // token
      1, // usable
    ];
    // insert data
    const insertChannelArgs: insertargs = {
      table: "channel", // table
      columns: channelColumns, // columns
      values: channelValues, // values
    };
    // insert to channel table
    const tmpChannelReg: any = await myDB.insertDB(insertChannelArgs);

    // error
    if (tmpChannelReg == "error") {
      // error
      throw new Error("channel registeration fail");
    } else {
      // show message
      dialogMaker.showmessage(
        "info",
        `チャネル登録完了。チャネル名:${channelname}`
      );
      logger.info("channelregist: channel registered");
      // send finished
      event.sender.send("operation_finish", "channel");
    }
  } catch (e: unknown) {
    // show error message
    logger.error(e);
  }
});

// delete
ipcMain.on("delete", async (event, arg) => {
  try {
    logger.info("ipc: delete mode");
    // target table
    const targettable: string = arg.table;
    // targetID
    const targetId: number = Number(arg.id);
    // target tablename
    const targetname: string = arg.name;
    // show dialog
    const selected: number = dialogMaker.showQuetion(
      "warning",
      "warning",
      `${targetname} を削除します。よろしいですか?`
    );

    // cancel
    if (selected == 1 || selected == -1) {
      // return false
      logger.info("page: canceled");
      return false;
    } else {
      // upload data
      const uploadTransArgs: updateargs = {
        table: targettable, // table
        setcol: ["usable"], // setcol
        setval: [0], // setval
        selcol: ["id", "usable"], // selcol
        selval: [targetId, 1], // selval
      };
      // update db
      const targetDel: any = await myDB.updateDB(uploadTransArgs);

      // error
      if (targetDel !== "error") {
        // update message
        logger.info(`delete: ID:${targetDel.insertId} updated`);
        // show update message
        dialogMaker.showmessage("info", "削除が完了しました。");
        // data
        const targetSelectArgs: selectargs = {
          table: targettable, // table
          columns: ["usable"], // column
          values: [[1]], // value
        };
        // extract target data
        const targetData: any = await myDB.selectDB(targetSelectArgs);

        // error
        if (targetData === "error") {
          // target data
          const sendata = {
            name: targettable,
            data: "",
          };
          // send plan data
          event.sender.send("delete_finish", sendata);
          // error
          throw new Error("DB: failed plan selection");
        } else {
          logger.info("delete: plan select success");
          // target data
          const sendata = {
            name: targettable,
            data: targetData,
          };
          // send plan data
          event.sender.send("delete_finish", sendata);
        }
      }
    }
  } catch (e: unknown) {
    // error
    logger.error(e);
  }
});

// image upload
ipcMain.on("upload", async (event, arg) => {
  try {
    logger.info("ipc: upload mode");
    // get file path
    const filepath: string | string[] = await getImageFile(arg);

    // no error
    if (filepath != "error") {
      // display path
      const displaypath: string =
        filepath.length == 1 ? filepath[0] : filepath[0] + "他";
      // send image path
      event.sender.send("image", {
        path: displaypath, // file path
        allpath: filepath, // image file paths
      });
    } else {
      // show error
      dialogMaker.showmessage("error", "ファイルが選択されていません。");
    }
  } catch (e: unknown) {
    // error
    logger.error(e);
  }
});

// CSV
ipcMain.on("csv", async (event, _) => {
  try {
    logger.info("ipc: csv mode");
    // get CSV data
    const result: any = await csvMaker.getCsvDataDialog();
    // send
    const sendObj: any = {
      record: result.record.flat(), // CSV data
      filename: result.filename, // file name
    };
    // send csv list
    event.sender.send("usersCsvlist", sendObj);
  } catch (e: unknown) {
    // error
    logger.error(e);
  }
});

/* broadcast */
// immediate boradcast
ipcMain.on("broadcast", async (event, arg) => {
  try {
    logger.info("ipc: broadcast mode");
    // success counter
    let successCounter: number = 0;
    // fail counter
    let failCounter: number = 0;
    // id counter
    let idCounter: number = 0;
    // done flg
    let doneFlg: number = 0;
    // inserted broadcast id
    let insertedBroadcastId: number;
    // broadcast time
    let broadcastTime: string;
    // empty object
    let messageObj: any = {
      contentTexts: [], // broadcast text
      linkurls: [], // URLs
      imgurls: [], // imageURLs
      width: 0, // image width
      height: 0, // image height
    };
    // broadcast name
    const broadcastname: string = sanitizeHtml(arg.bdname);
    // channelID
    const channelId: number = Number(arg.channel);
    // planID
    const planId: number = Number(arg.plan);
    // userID
    const userNoArray: string[] = arg.users;
    // total users
    const totalUsers: number = userNoArray.length;
    // now date
    const nowDate: Date = new Date();
    // no user
    if (totalUsers == 0) {
      // error
      throw new Error("no user");
    }
    logger.info(`a number of users is ${totalUsers}`);
    // broadcastTime
    broadcastTime = formatDateInYyyymmdd(nowDate);
    // broadcastTime columns
    const broadcastColumns: string[] = [
      "broadcastname", // broadcast name
      "plan_id", // planID
      "channel_id", // channelID
      "sendtime", // send time
      "done", // complate
      "usable", //usable
    ];
    // broadcast value
    const broadcastValues: any[] = [
      broadcastname, // broadcast name
      planId, // planID
      channelId, // channelID
      broadcastTime, // send time
      0, // complate
      1, // usable
    ];
    // broadcast args
    const insertBroadcastArgs: insertargs = {
      table: "broadcast", // table
      columns: broadcastColumns, // columns
      values: broadcastValues, // values
    };
    // insert to broadcast table
    const tmpBdReg: any = await myDB.insertDB(insertBroadcastArgs);
    // error
    if (tmpBdReg == "error") {
      // error
      throw new Error("DB: failed broadcast registration");
    }
    // success
    logger.info("sql: broadcast registration success");
    // channel list
    const channelSelectArgs: selectargs = {
      table: "channel", // table
      columns: ["id", "usable"], // column
      values: [[channelId], [1]], // value
    };
    // channel data
    const channelData: any = await myDB.selectDB(channelSelectArgs);

    // error
    if (channelData === "error") {
      // error
      throw new Error("DB: failed channel selection");
    } else {
      logger.info("sql: channel select success");
    }
    // token
    const token: string = channelData[0].token;
    // plan name
    const planSelectArgs: selectargs = {
      table: "plan", // table
      columns: ["id", "usable"], // column
      values: [[planId], [1]], // value
    };
    // plandata
    const planData: any = await myDB.selectDB(planSelectArgs);
    // error
    if (planData === "error") {
      throw new Error("DB: failed plan registration");
    } else {
      logger.info("sql: plan select success");
    }

    // plandata
    const title: string = planData[0].planname;
    // LINE method no
    const linemethodno: number = planData[0].linemethod_id;

    // other than image mode
    // plan text
    const planTextSelectArgs: selectargs = {
      table: "plantxt", // table
      columns: ["plan_id", "usable"], // column
      values: [[planId], [1]], // value
    };
    // plantext data
    const planTxtData: any = await myDB.selectDB(planTextSelectArgs);
    // error
    if (planTxtData === "error") {
      // error
      throw new Error("DB: failed to select plan message");
    } else {
      logger.info("sql: plantxt select success");

      // txt
      if (Array.isArray(planTxtData)) {
        // text array
        const txtArray: string[] = planTxtData.map((txt: any) =>
          sanitizeHtml(txt["plantxt"])
        );
        // set texts
        messageObj.contentTexts = txtArray;
      } else {
        // set plan data
        messageObj.contentTexts = [sanitizeHtml(planTxtData)];
      }
    }

    // plan image
    if (linemethodno == 2) {
      // plan text
      const planTxtSelectArgs: selectargs = {
        table: "plantxt", // table
        columns: ["plan_id", "usable"], // column
        values: [[planId], [1]], // value
      };
      // plantext
      const planTxtData: any = await myDB.selectDB(planTxtSelectArgs);

      // error
      if (planTxtData === "error") {
        // error
        throw new Error("DB: failed to select plan message");
      } else {
        logger.info("sql: plantxt select success");
        // url
        const urlArray: string[] = planTxtData.map((txt: any) => txt["url"]);
        // set url array
        messageObj.linkurls = urlArray;
      }
      // plan image
      const planImgSelectArgs: selectargs = {
        table: "planimg", // table
        columns: ["plan_id", "usable"], // column
        values: [[planId], [1]], // value
      };
      // plan image data
      const planImgData: any = await myDB.selectDB(planImgSelectArgs);
      // error
      if (planImgData === "error") {
        // error
        throw new Error("DB: failed to select plan image");
      } else {
        logger.info("sql: planimg select success");
        // width
        messageObj.width = planImgData[0].imgwidth;
        // height
        messageObj.height = planImgData[0].imgheight;
        // imageURL
        messageObj.imgurls = [planImgData[0].planimgurl];
      }
    }

    // line user
    const lineuserSelectArgs: selectargs = {
      table: "lineuser", // table
      columns: ["customerno", "usable"], // column
      values: [userNoArray, [1]], // value
      fields: ["customerno", "userid"], // fields
    };
    // line user ids
    const lineUserIds: any = await myDB.selectDB(lineuserSelectArgs);

    // error
    if (lineUserIds === "error") {
      // error
      throw new Error("DB: failed to select user");
    } else {
      logger.info("sql: lineuser select success");
    }

    // reg is over 0
    if (tmpBdReg > 0) {
      // insert broadcastID
      insertedBroadcastId = tmpBdReg;
    } else {
      // error
      throw new Error("broadcast id is incorrect.");
    }

    // result
    await Promise.all(
      // LINE user ID
      lineUserIds.map(async (uid: any): Promise<void> => {
        return new Promise(async (resolve, _) => {
          try {
            // result
            const result: string = await sendLineMessage(
              uid.userid,
              title,
              linemethodno,
              planData[0].baseurl,
              messageObj.contentTexts,
              messageObj.linkurls,
              messageObj.imgurls,
              token,
              messageObj.width,
              messageObj.height
            );
            // wait for 1 sec
            await setTimeout(1000);

            // result
            if (result == "〇") {
              // OK
              successCounter++;
            } else if (result == "×") {
              // NG
              failCounter++;
            }
            // objectID
            idCounter++;
            // return value
            resolve();
          } catch (err: unknown) {
            // error
            logger.error(err);
          }
        });
      })
    );
    // send finish
    event.sender.send("operation_finish", "broadcast");

    // no success
    if (successCounter == 0) {
      doneFlg = 0;
    } else {
      doneFlg = 1;
    }

    // upload data
    const uploadBroadcastArgs: updateargs = {
      table: "broadcast", // table
      setcol: ["success", "fail", "done", "usable"], // columns
      setval: [successCounter, failCounter, doneFlg, 1], // values
      selcol: ["id", "usable"], // ID
      selval: [insertedBroadcastId, 1], // broadcastID
    };
    // update DB
    const broadcastDel: any = await myDB.updateDB(uploadBroadcastArgs);
    // error
    if (broadcastDel !== "error") {
      // updated
      logger.info(`ID:${insertedBroadcastId} updated`);
    } else {
      // error
      throw new Error("DB: failed to select broadcast");
    }
    // success
    logger.info("line regstration success");
    // message
    dialogMaker.showmessage(
      "info",
      `配信を完了しました。配信名:${broadcastname}`
    );
  } catch (e: unknown) {
    // error
    logger.error(e);
  }
});

/* history */
// chage history
ipcMain.on("changehistory", async (event: any, arg: any) => {
  try {
    // mode
    logger.info("ipc: change history mode");
    // start position
    let startPosition: number;
    // received
    const page: number = arg.page; // page no
    const direction: string = arg.direction; // page direction

    // prev
    if (direction == "prev") {
      // start position
      startPosition = page - PAGECOUNT + 1;
    } else if (direction == "forward") {
      // start position
      startPosition = PAGECOUNT + page + 1;
    } else {
      // start position
      startPosition = 1;
    }

    // get history
    const resultArray: any = await gethistory(page, PAGECOUNT);

    // history finish
    event.sender.send("history_finish", {
      start: startPosition, // start position
      total: resultArray.total, // total price
      result: resultArray.result, // result
    });
  } catch (e: unknown) {
    // error
    logger.error(e);
  }
});

/* general */
// exit
ipcMain.on("exit", (event, _) => {
  try {
    logger.info("ipc: exit mode");
    // other than apple
    if (process.platform !== "darwin") {
      // quit
      app.quit();
      // false
      event.returnValue = false;
    }
  } catch (e: unknown) {
    // error
    logger.error(e);
  }
});

// show message
ipcMain.on("showmessage", (_: any, arg: any) => {
  try {
    // mode
    logger.info("ipc: showmessage mode");
    // show message
    dialogMaker.showmessage(arg.type, arg.message);
  } catch (e: unknown) {
    // error
    logger.error(e);
  }
});

// error
ipcMain.on("error", async (_, arg) => {
  try {
    // error
    logger.info(arg);
    // show message
    dialogMaker.showmessage("error", arg);
  } catch (e: unknown) {
    // error
    logger.error(e);
  }
});

/*
 general function
*/
/* registration */
// registImage
const registImage = async (
  planid: number | undefined,
  imgurls: string | string[],
  imgWidth?: number,
  imgHeight?: number
): Promise<void> => {
  return new Promise(async (resolve1, reject1) => {
    try {
      logger.info("module: registImage mode");
      // not undefined
      if (planid === undefined) {
        // error
        throw new Error("plan id is incorrect.");
      }
      // is array
      if (Array.isArray(imgurls)) {
        // regist plan
        Promise.all(
          imgurls.map(async (img: string): Promise<void> => {
            return new Promise(async (resolve2, _) => {
              try {
                // plan image
                const planImgColumns: string[] = [
                  "plan_id", // planID
                  "planimgurl", // plan image URL
                  "imgwidth", // plan width
                  "imgheight", // plan height
                  "usable", // usable
                ];
                // plan image values
                const planImgValues: any[] = [
                  planid, // planID
                  img, // plan image URL
                  imgWidth, // plan width
                  imgHeight, // plan height
                  1, // usable
                ];
                // insert image
                const insertPlanImgArgs: insertargs = {
                  table: "planimg", // talbe
                  columns: planImgColumns, // column
                  values: planImgValues, // values
                };
                // plan imageDB
                const tmpPlanImgReg: any = await myDB.insertDB(
                  insertPlanImgArgs
                );

                // plan image
                if (tmpPlanImgReg == "error") {
                  // error
                  throw new Error("failed to regist plan image");
                } else {
                  logger.info("planimg registered");
                  // complete
                  resolve2();
                }
              } catch (err: unknown) {
                // error
                logger.error(err);
              }
            });
          })
        ).then(() => resolve1());
      } else {
        // image columns
        const planImgColumns: string[] = [
          "plan_id", // planID
          "planimgurl", // plan image URL
          "imgwidth", // plan image width
          "imgheight", // plan image height
          "usable", // usable
        ];
        // plan image values
        const planImgValues: any[] = [
          planid, // planID
          imgurls, // plan image URL
          imgWidth, // plan image width
          imgHeight, // plan image height
          1, // usable
        ];
        // plan image
        const insertPlanImgArgs: insertargs = {
          table: "planimg", // table
          columns: planImgColumns, // column
          values: planImgValues, // value
        };
        // plan image DB
        const tmpPlanImgReg: any = await myDB.insertDB(insertPlanImgArgs);

        // error
        if (tmpPlanImgReg == "error") {
          // error
          throw new Error("failed to regist plan image");
        } else {
          logger.info("planimg registered");
          // complete
          resolve1();
        }
      }
    } catch (e: unknown) {
      // error
      logger.error(e);
      // error
      reject1();
    }
  });
};

// text registration
const registTxt = async (
  planid: number,
  plantxts: string[],
  planurls?: string[]
): Promise<void> => {
  return new Promise(async (resolve1, reject1) => {
    try {
      logger.info("module: registtext mode");

      // regist plans
      Promise.all(
        plantxts.map(async (txt: any, idx: number): Promise<void> => {
          return new Promise(async (resolve2, _) => {
            try {
              // set url
              const tmpUrl: string = planurls ? planurls[idx] : "";
              // plan text column
              const planTxtColumns: string[] = [
                "plan_id", // planID
                "plantxt", // plan text
                "url", // url
                "usable", // usable
              ];
              // plan text value
              const planTxtValues: any[] = [
                planid,
                sanitizeHtml(txt),
                sanitizeHtml(tmpUrl),
                1,
              ];
              // insert plantext
              const insertplanTxtArgs: insertargs = {
                table: "plantxt", // table
                columns: planTxtColumns, // columns
                values: planTxtValues, // values
              };
              // regist to transactionDB
              const tmpPlanTxtReg: any = await myDB.insertDB(insertplanTxtArgs);

              // error
              if (tmpPlanTxtReg == "error") {
                // error
                throw new Error("DB: failed to regist plan text");
              } else {
                logger.info("plantxt registered");
                // complete
                resolve2();
                // wait for 1 sec
                await setTimeout(1000);
              }
            } catch (err: unknown) {
              // show error message
              logger.error(err);
            }
          });
        })
      ).then(() => resolve1());
    } catch (e: unknown) {
      // error
      logger.error(e);
      // reject
      reject1();
    }
  });
};

/* get */
// get history
const gethistory = async (offset: number, limit: number): Promise<any> => {
  return new Promise(async (resolve, _) => {
    try {
      logger.info("module: gethistory mode");
      // count arguments
      const bdcountargs: countargs = {
        table: "broadcast", // table
        columns: ['usable'], // columns
        values: [1], // values
      };
      // user count
      const ebisudoUserCount: number = await myDB.countDB(bdcountargs);
      // target boradcast args
      const broadcastSelectArgs: selectargs = {
        table: "broadcast", // table
        columns: ["usable"], // columns
        values: [[1]], // values
        limit: limit, // limit
        offset: offset, // offset
        order: "id", // id
        reverse: false, // reverse
        fields: [
          "broadcast.id",
          "broadcastname",
          "plan_id",
          "channel_id",
          "sendtime",
          "success",
          "fail",
          "done",
        ], // selected column
      };
      // broadcast data
      const broadcastData: any = await myDB.selectDB(broadcastSelectArgs);
      // error
      if (broadcastData === "error") {
        throw new Error("DB: failed to regist broadcast");
      } else {
        logger.info("sql: broadcast select success");
      }

      // result object
      const resultObjects: any = JSON.parse(JSON.stringify(broadcastData));

      // history object
      const historyObj: any = {
        total: String(ebisudoUserCount), // total
        result: resultObjects, // result
      };
      // resolve
      resolve(historyObj);
    } catch (e: unknown) {
      // error
      logger.error(e);
    }
  });
};

/* tool */
// Line message
const sendLineMessage = (
  uid: string,
  title: string,
  linemethodno: number,
  url: string,
  contentTexts: string[],
  linkurls: string[],
  imgurls: string[],
  token: string,
  width: number,
  height: number
): Promise<string> => {
  return new Promise(async (resolve, _) => {
    try {
      logger.info("module: sendLineMessage mode");
      // id exists
      if (uid) {
        logger.info("func: makeMessage mode");
        // data string
        let dataString: string = "";

        // switch on linemethodno
        switch (linemethodno) {
          // text
          case 1:
            logger.info("1: text mode");
            // data string
            dataString = JSON.stringify({
              to: uid, // token
              messages: [
                {
                  type: "text", // text
                  text: contentTexts[0], // body
                },
              ],
            });
            break;

          // image
          case 2:
            logger.info("2: image mode");
            // data string
            dataString = JSON.stringify({
              to: uid, // token
              messages: [
                {
                  type: "flex", // flex
                  altText: title, // altenative text
                  contents: {
                    type: "bubble",
                    hero: {
                      type: "image",
                      url: imgurls[0],
                      size: "full",
                      aspectRatio: `${width}:${height}`,
                      aspectMode: "cover",
                      action: {
                        type: "uri",
                        uri: url,
                      },
                    },
                    body: {
                      type: "box",
                      layout: "vertical",
                      contents: [
                        {
                          type: "text",
                          text: contentTexts[0].replace(/\\n/g, "\n"),
                          weight: "regular",
                          size: "xs",
                          maxLines: 100,
                          scaling: true,
                          adjustMode: "shrink-to-fit",
                          wrap: true,
                          gravity: "top",
                          align: "start",
                          style: "normal",
                        },
                      ],
                    },
                  },
                },
              ],
            });
            break;

          default:
            // clear
            dataString = "";
            logger.debug(`Sorry, we are out of ${linemethodno}.`);
        }
        logger.info("func: makeBroadcast mode");
        // header
        const headers: any = {
          "Content-Type": "application/json", // Content-type
          Authorization: `Bearer ${token}`, // authorize token
        };

        // WEBHOOK option
        const webhookOptions: any = {
          hostname: "api.line.me", // hostname
          path: "/v2/bot/message/push", // path
          method: "POST", // authorize token
          headers: headers, // header
          body: dataString, // data
        };

        // request
        const request: any = https.request(webhookOptions, (res) => {
          try {
            res.on("data", (chunk: any) => {
              logger.debug(JSON.parse(chunk));
              // get success/fail
              if (JSON.parse(chunk).sentMessages) {
                logger.info(`${uid} data send success.`);
                // success
                resolve("〇");
              } else {
                logger.info(`${uid} data send failed.`);
                // fail
                resolve("×");
              }
            });
          } catch (e: unknown) {
            logger.error(e);
          }
        });
        logger.debug(dataString);
        // send message
        request.write(dataString);

        // error
        request.on("error", (error: unknown) => {
          // error
          logger.error(error);
        });
        // close
        request.end();
      }
    } catch (e: unknown) {
      logger.error(e);
    }
  });
};

// file upload
const uploadFile = async (localpath: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      logger.info("module: uploadFile mode");
      // upload path
      const uploadPath: string = `/home/ebisuan/www/assets/image/${path.basename(
        localpath
      )}`;
      // ssh port
      const port: number = 22;
      // SFTP hostname
      const host: string = process.env.SFTP_HOST!;
      // SFTP username
      const username: string = process.env.SFTP_USER!;
      // SFTP pass
      const password: string = process.env.SFTP_PASSWORD!;
      // SFTP client
      const sftpClient: any = new Client();
      // SFTP connection
      await sftpClient.connect({ host, port, username, password });
      // pload image file
      await sftpClient.put(localpath, uploadPath);
      // close
      await sftpClient.end();
      logger.info("sftp closed");
      // complete
      resolve("success");
    } catch (e: unknown) {
      // error
      logger.error(e);
      // reject
      reject();
    }
  });
};

// get image file
const getImageFile = (flg: boolean): Promise<string | string[]> => {
  return new Promise(async (resolve, _) => {
    try {
      logger.debug("module: getImageFile mode");
      // properties
      let fixedProperties: any[] = ["openFile"];
      // mode
      if (flg) {
        fixedProperties.push("multiSelections");
      }
      // file dialog
      const result: any = await dialogMaker.showImage(fixedProperties);
      // file path
      const filenames: string[] = result.filePaths;
      // file exists
      if (filenames.length > 0) {
        // success
        resolve(filenames);
      } else {
        // error
        throw new Error("error");
      }
    } catch (e: unknown) {
      // show error message
      logger.error(e);
    }
  });
};

// formate date
const formatDateInYyyymmdd = (date: Date) => {
  const y = date.getFullYear();
  const mh = date.getMonth() + 1;
  const d = date.getDate();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();

  const yyyy = y.toString();
  const mhmh = ("00" + mh).slice(-2);
  const dd = ("00" + d).slice(-2);
  const hh = ("00" + h).slice(-2);
  const mm = ("00" + m).slice(-2);
  const ss = ("00" + s).slice(-2);

  return `${yyyy}-${mhmh}-${dd} ${hh}:${mm}:${ss}`;
};
