import { Client } from "@line/bot-sdk"

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
}

const client = new Client(config)

let userStates = {}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(200).send("OK")

  const events = req.body.events
  if (!events) return res.status(200).send("OK")

  await Promise.all(events.map(async (event) => {
    if (event.type !== "message" || event.message.type !== "text") return

    const userId = event.source.userId
    const text = event.message.text

    if (!userStates[userId]) userStates[userId] = { step: "START", data: {} }
    const state = userStates[userId]

    let reply = "我不懂你說什麼"

    if (state.step === "START" && text === "評估") {
      reply = "請輸入姓名"
      state.step = "NAME"
    } else if (state.step === "NAME") {
      state.data.name = text
      reply = "請輸入完整身份證號碼"
      state.step = "ID_FULL"
    } else if (state.step === "ID_FULL") {
      state.data.id = text
      reply = "請輸入出生年月日"
      state.step = "BIRTH"
    } else if (state.step === "BIRTH") {
      state.data.birth = text
      reply = "請輸入手機號碼"
      state.step = "PHONE"
    } else if (state.step === "PHONE") {
      state.data.phone = text
      reply = "收到，評估資料已完整"
      state.step = "DONE"
      console.log("使用者資料：", state.data)
    }

    // 使用 LINE Messaging API 回覆訊息
    await client.replyMessage(event.replyToken, {
      type: "text",
      text: reply,
    })
  }))

  res.status(200).send("OK")
}
