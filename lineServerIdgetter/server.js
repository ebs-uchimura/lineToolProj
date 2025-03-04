/**
 * server.js
 *
 * function：LINE WEBHOOK サーバ
 **/

'use strict'; // strict mode

// モジュール
const express = require('express'); // express
const helmet = require('helmet'); // helmet
const mysql = require('mysql2/promise');
require('dotenv').config(); // env設定

// 定数
const PORT = process.env.PORT || 3002; // ポート番号

// express設定
const app = express(); // express
app.use(express.json()); // json設定
app.use(
  express.urlencoded({
    extended: true // body parser使用
  })
);
app.use(helmet()); // ヘルメット

const pool = mysql.createPool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DB,
  connectionLimit: 3, // 接続を張り続けるコネクション数を指定
  namedPlaceholders: true // 設定必須
});

// テスト用
app.get('/', (_, res) => {
  res.send('connected.');
});

// テスト用
app.post('/', (_, res) => {
  res.send('connected.');
});

// WEBHOOK
app.post('/webhook/:channel', async (req, res) => {
  try {
    // チャンネル
    const channel = req.params.channel;

    // 分岐
    switch (channel) {
      case 'dummy':
        console.log('dummy mode');
        break;
      case 'ebisudo':
        console.log('ebisudo mode');
        break;
      case 'suijin':
        console.log('suijin mode');
        break;
      default:
        console.log(`Sorry, we are out of ${expr}.`);
    }

    // LINEユーザID
    const userId = req.body.events[0].source.userId;
    console.log(userId);
    const [
      resultRows
    ] = await pool.query(`INSERT INTO lineuser (channel, userid) VALUES (`, {
      id: 123
    });
    // ok
    res.send('ok');
  } catch (e) {
    // エラー
    console.log(e);
    res.status(404).render('404', {});
  }
});

// 3000番待機
app.listen(PORT, () => {
  console.log(`webhook app listening at ${PORT}`);
});
