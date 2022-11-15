const express = require("express");
const router = express.Router();
router.post("/demo", async (req, res) => {
    const pos_id = req.body.posid;
    console.log("=======",pos_id);
    // const user = await Users.findOne({ where: { sapId: reqData.sapId } });
});
module.exports = router;