/**
 * index.ts
 *
 * function：LINE WEBHOOK server
 **/

// module
import { config as dotenv } from "dotenv"; // secret info
import * as path from "path"; // path
import express from "express"; // express
import axios from "axios"; // http
import helmet from "helmet"; // secret
import sanitizeHtml from "sanitize-html"; // sanitizer
import CacheService from "./class/NodeCache0419"; // cache
import Logger from "./class/Logger0203"; // logger

// secret info setting
dotenv({ path: path.join(__dirname, "./keys/auto.env") });
// logger settting
const logger: Logger = new Logger(path.join(__dirname, "logs"));

// const
const LINE_DEFAULTURL: string = process.env.LINE_DEFAULTURL!; // LINE reply URL
const PORT: number = Number(process.env.PORT); // port
const TOKEN: string = process.env.LINE_ACCESS_TOKEN!; // LINE access token

// express
const app: any = express();

// express
app.use(express.json()); // json
app.use(
  express.urlencoded({
    extended: true, // body parser
  })
);

// helmet
app.use(helmet());

// test
app.get("/", (_: any, res: any) => {
  res.send("connected.");
});

// WEBHOOK
app.post("/webhook", async (req: any, _: any) => {
  // mode
  try {
    // type
    const eventtype: string = req.body.events[0].type ?? "";
    // LINE user ID
    const userId: string = req.body.events[0].source.userId ?? "";
    // reply token
    const replyToken: string = req.body.events[0].replyToken ?? "";
    // message array
    const messageArray: string[] = [
      "▼キャンペーンコードを入力してください(ない方は「無し」と回答ください)",
      "▼お店のお名前を入力してください",
      "▼お店のお電話番号を入力してください",
      "▼お店の郵便番号を入力してください",
      "▼お店のご住所を入力してください",
      "▼ラベルに入れたい文字を入力してください",
      "▼ラベルデザイン\nトーク画面下の【メニュー】\n↓\n【ラベルデザインテンプレート】\nからお好きな『ラベルNo』の番号をご入力ください。\n\n後ほどコンシェルジュより確認のご連絡をいたしますので、楽しみにお待ちください。",
    ];

    // friend
    if (eventtype == "follow") {
      logger.debug("follow mode");
      // cache
      const cache0: any = CacheService.get(`${userId}-0`) ?? "none";
      const cache1: any = CacheService.get(`${userId}-1`) ?? "none";
      const cache2: any = CacheService.get(`${userId}-2`) ?? "none";
      const cache3: any = CacheService.get(`${userId}-3`) ?? "none";
      const cache4: any = CacheService.get(`${userId}-4`) ?? "none";
      const cache5: any = CacheService.get(`${userId}-5`) ?? "none";
      const cache6: any = CacheService.get(`${userId}-6`) ?? "none";

      if (cache0 != "none") {
        CacheService.del([`${userId}-0`]);
      }
      if (cache1 != "none") {
        CacheService.del([`${userId}-1`]);
      }
      if (cache2 != "none") {
        CacheService.del([`${userId}-2`]);
      }
      if (cache3 != "none") {
        CacheService.del([`${userId}-3`]);
      }
      if (cache4 != "none") {
        CacheService.del([`${userId}-4`]);
      }
      if (cache5 != "none") {
        CacheService.del([`${userId}-5`]);
      }
      if (cache6 != "none") {
        CacheService.del([`${userId}-6`]);
      }
      logger.debug("cache cleared");

      // cache
      const obj: any = {
        no: 0,
        message: "init",
      };
      // cache
      CacheService.set(`${userId}-0`, obj);
      // initial string
      const initialString = JSON.stringify({
        replyToken: replyToken, // token
        messages: [
          {
            type: "text",
            text: messageArray[0],
          },
        ],
      });
      logger.debug("initialized cache.");
      // send message
      sendMessage(initialString);
      logger.debug("sent initial message.");
    } else if (eventtype == "message") {
      logger.debug("message mode");
      // string
      let dataString: string = "";
      // response no
      let responseNo: number = 0;
      // message
      const messageStr: string =
        zen2han(sanitizeHtml(req.body.events[0].message.text)).toLowerCase() ??
        "";
      logger.debug(`received ${messageStr}`);

      // campaign code
      const cache0: any = CacheService.get(`${userId}-0`) ?? "none";
      // initial
      const cache1: any = CacheService.get(`${userId}-1`) ?? "none";
      // 1.shopname：
      const cache2: any = CacheService.get(`${userId}-2`) ?? "none";
      // 2.zipcode：
      const cache3: any = CacheService.get(`${userId}-3`) ?? "none";
      // 3.address：
      const cache4: any = CacheService.get(`${userId}-4`) ?? "none";
      // 4.labeltext：
      const cache5: any = CacheService.get(`${userId}-5`) ?? "none";
      // exit：
      const cache6: any = CacheService.get(`${userId}-6`) ?? "none";

      if (cache0 != "none") {
        responseNo = 1;
      }
      if (cache1 != "none") {
        responseNo = 2;
      }
      if (cache2 != "none") {
        responseNo = 3;
      }
      if (cache3 != "none") {
        responseNo = 4;
      }
      if (cache4 != "none") {
        responseNo = 5;
      }
      if (cache5 != "none") {
        responseNo = 6;
      }
      if (cache6 != "none") {
        responseNo = 7;
      }
      logger.debug(`response no is ${responseNo}`);

      // response exists
      if (responseNo > 0) {
        // last one
        if (responseNo == 6) {
          // cache
          const obj: any = {
            no: responseNo,
            message: "",
          };
          // save cache
          CacheService.set(`${userId}-${responseNo}`, obj);
          // sending data
          dataString = JSON.stringify({
            replyToken: replyToken, // reply token
            messages: [
              {
                type: "text",
                text: messageArray[6],
              },
            ],
          });
          // send message
          sendMessage(dataString);
          logger.debug("sent final message.");
        } else if (responseNo < 6) {
          // cache
          const obj: any = {
            no: responseNo,
            message: messageStr,
          };
          // save cache
          CacheService.set(`${userId}-${responseNo}`, obj);
          // sending data
          dataString = JSON.stringify({
            replyToken: replyToken, // reply token
            messages: [
              {
                type: "text",
                text: messageArray[responseNo],
              },
            ],
          });
          // send message
          sendMessage(dataString);
          logger.debug("sent default message.");
        } else {
          logger.debug("out of target.");
        }
      }
    }
  } catch (e: unknown) {
    // error
    logger.error(e);
  }
});

// listen to 3000
app.listen(3000, () => {
  logger.debug(`awalove server listening at http://localhost:${PORT}`);
});

// send message
const sendMessage = async (dtString: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      // target data
      let targetData: any;
      // header
      const headers: any = {
        "Content-Type": "application/json", // Content-type
        Authorization: "Bearer " + TOKEN, // authorization
      };

      // post
      axios
        .post(LINE_DEFAULTURL, dtString, {
          headers: headers, // header
        })
        .then((response: any) => {
          // target data
          targetData = response.data.LinkUrl;

          // not error
          if (targetData != "error") {
            // return linkURL
            resolve();
          } else {
            // error
            reject();
          }
        })
        .catch((err: unknown) => {
          // error
          logger.error(err);
        });
    } catch (e: unknown) {
      // error
      logger.error(e);
      reject();
    }
  });
};

// format message
const zen2han = (input: string): string => {
  return input.replace(/[！-～]/g, (input) => {
    return String.fromCharCode(input.charCodeAt(0) - 0xfee0);
  });
};
