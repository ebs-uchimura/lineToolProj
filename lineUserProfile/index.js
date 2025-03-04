import { readFile, writeFile } from "fs/promises";
import fetch from "node-fetch";
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * ユーザー ID のリストを入力するとプロフィールのリストを出力します。
 */
async function getProfiles(userIds) {
  const responseBodies = [];

  for (const userId of userIds) {
    const url = "https://api.line.me/v2/bot/profile/" + userId;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.EBISUDO_ACCESS_TOKEN}`,
      },
    });
    const result = await response.json();
    console.log(result);
    responseBodies.push(result);
  }

  return responseBodies;
}

async function main() {
  const userIds = JSON.parse(
    await readFile("data-01-follower-ids.json", "utf-8")
  );
  const responseBodies = await getProfiles(userIds);

  await writeFile(
    "data-02-get-profiles.json",
    JSON.stringify(responseBodies, null, 2)
  );
}

main().catch((err) => console.error(err));