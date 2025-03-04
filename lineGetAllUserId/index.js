import * as path from "path";
import fetch from "node-fetch";
import * as dotenv from 'dotenv';
import { writeFile } from "fs/promises";
dotenv.config();

/**
 * LINE 公式アカウントを友だち追加したユーザーのリストを出力します。
 */
async function getFollowerIds() {
  let userIds = [];
  let start;

  try {
    //for (;;) {
        const params = { limit: "1000" };
        const start = 'DTU5CZhYgS8lBfPiMVD0MS9f9tGUGEoWKAREshJiXV2Mz_gskRkdw9X75mzj-K4um00H1V19M55Oys7PISHZpIsiLu_5WK9oA0LQeb0CrfFW4Qu20LBQjXeqdwz-tRT6qJ6aJpxvYNmfRxOdAnDkHYDTLXNydjj6LUBhtxaXy04';
        const url = "https://api.line.me/v2/bot/followers/ids?" + new URLSearchParams(start ? { ...params, start } : params).toString();
          
        try {
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${process.env.EBISUDO_ACCESS_TOKEN}`,
            },
          });

          if (response.status !== 200) {
            console.error(await response.text());
            process.exit(1);
          }

          const responseBody = await response.json();

          if (!responseBody) {
            //break;
          } else {
            if (responseBody.userIds) {
              userIds = userIds.concat(responseBody.userIds);
            }
            if (responseBody.next) {
              console.log(responseBody.next);
            }
          }

      } catch(err) {
        if (err instanceof Error) {
          console.log(err.message);
          return [];
        }
        
      }
    //}
    return userIds;

  } catch(e) {
    if (e instanceof Error) {
      console.log(e.message);
    }
    return [];
  }
}

async function main() {
  const userIds = await getFollowerIds();
  await writeFile(
    "data-01-follower-ids.json",
    JSON.stringify(userIds, null, 2)
  );
}

main().catch((err) => console.error(err));