let userStates = {}  // 儲存使用者狀態

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(200).send("OK")

  const event = req.body.events?.[0]
  if (!event || event.type !== "message") return res.status(200).send("OK")

  const userId = event.source.userId
  const text = event.message.text

  // 初始化使用者狀態
  if (!userStates[userId]) userStates[userId] = { step: "START", data: {} }

  const state = userStates[userId]

  let reply = "我不懂你說什麼"

  // 狀態流程
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
    console.log("使用者資料：", state.data) // 可以改成存資料庫或 Google Sheet
  }

  // 回覆 LINE
  res.status(200).json({
    replyToken: event.replyToken,
    messages: [{ type: "text", text: reply }],
  })
}.
