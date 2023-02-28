var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cron = require("node-cron");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var sendMessageRouter = require("./routes/sendMessage");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/send-message", sendMessageRouter);

cron.schedule("0 0 17 * * *", async () => {
  const queryNextDate = await dbApp("appoint as a")
    .leftJoin("person as p", "p.id", "a.person_id")
    .where("a.appoint_date", moment().add(1, "days").format("YYYY-MM-DD"))
    .whereNotNull("p.lineId")
    .select("*");
  const queryNowDate = await await dbApp("appoint as a")
    .leftJoin("person as p", "p.id", "a.person_id")
    .where("a.create_date", moment().format("YYYY-MM-DD"))
    .whereNotNull("p.lineId")
    .select("*");
  // queryNowDate
  if (queryNowDate.length > 0) {
    queryNowDate.map(async (item) => {
      let headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer nRQZbaijIr1AEIimb2uFO8EnJsJhWIWWqnrcmdf1iTXE6urF6yjp3FLDfUtiqFlySbm8mHPnEUh79qGgrfDu3xed5ae8+iju2d7tpx4V72+ksjKYdkF/M3B92Hc5rWazhopzgFphcduyDAN8rIP0mwdB04t89/1O/w1cDnyilFU=`,
      };
      let data = {
        to: `${item.lineId}`,
        messages: [
          {
            type: "text",
            text: `แจ้งเตือนการนัดตรวจสุขภาพ \nสวัดดีค่ะ \nคุณ ${item.fname} ${
              item.lname
            } \nคุณมีการนัดตรวจสุขภาพใน \nวันที่ : ${moment(
              item.appoint_date_time
            ).format("YYYY-MM-DD hh:mm:ss")} น. \n`,
          },
        ],
      };
      await axios.post("https://api.line.me/v2/bot/message/push", data, {
        headers: headers,
      });
    });
  }
  // queryNextDate
  if (queryNextDate.length > 0) {
    queryNextDate.map(async (item) => {
      let headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer nRQZbaijIr1AEIimb2uFO8EnJsJhWIWWqnrcmdf1iTXE6urF6yjp3FLDfUtiqFlySbm8mHPnEUh79qGgrfDu3xed5ae8+iju2d7tpx4V72+ksjKYdkF/M3B92Hc5rWazhopzgFphcduyDAN8rIP0mwdB04t89/1O/w1cDnyilFU=`,
      };
      let data = {
        to: `${item.lineId}`,
        messages: [
          {
            type: "text",
            text: `แจ้งเตือนการนัดตรวจสุขภาพ \nสวัดดีค่ะ \nคุณ ${item.fname} ${
              item.lname
            } \nคุณมีการนัดตรวจสุขภาพใน \nวันที่ : ${moment(
              item.appoint_date_time
            ).format("YYYY-MM-DD hh:mm:ss")} น. \n`,
          },
        ],
      };
      await axios.post("https://api.line.me/v2/bot/message/push", data, {
        headers: headers,
      });
    });
  }
});
module.exports = app;
