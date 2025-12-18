export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("OK")
  }

  console.log(
    process.env.LINE_CHANNEL_SECRET
      ? "LINE 環境變數 OK"
      : "LINE 環境變數 沒抓到"
  )

  const event = req.body.events?.[0]
  const userMessage = event?.message?.text || "沒有文字"

  return res.status(200).json({
    reply: `我收到你的訊息：${userMessage}`,
  })
}
