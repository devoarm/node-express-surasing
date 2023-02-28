var express = require("express");
const { dbApp } = require("../config");
var router = express.Router();
var moment = require("moment");
const axios = require("axios");
require("moment/locale/th");
/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    const query = await dbApp("appoint as a")
      .leftJoin("person as p", "p.id", "a.person_id")
      .where("a.create_date", moment().format("YYYY-MM-DD"))
      .whereNotNull("p.lineId")
      .select("*");
    if (query.length > 0) {
      query.map(async (item) => {
        let headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer nRQZbaijIr1AEIimb2uFO8EnJsJhWIWWqnrcmdf1iTXE6urF6yjp3FLDfUtiqFlySbm8mHPnEUh79qGgrfDu3xed5ae8+iju2d7tpx4V72+ksjKYdkF/M3B92Hc5rWazhopzgFphcduyDAN8rIP0mwdB04t89/1O/w1cDnyilFU=`,
        };
        let data = {
          to: `${item.lineId}`,
          messages: [
            {
              type: "text",
              text: `แจ้งเตือนการนัดตรวจสุขภาพ \nสวัดดีค่ะ \nคุณ ${
                item.fname
              } ${item.lname} \nคุณมีการนัดตรวจสุขภาพใน \nวันที่ : ${moment(
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
    res.json({
      status: 200,
      results: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
  } catch (error) {
    res.json({ status: 500, results: error.message });
  }
});

module.exports = router;
