const express = require("express");
const router = express.Router();
const { getGroup,getGroups,addGroup,updateGroup,deleteGroup } = require("../controller/groupController");

router.get("/getGroup", getGroup);
router.get("/getGroups/:studentId", getGroups),
router.post("/addGroup", addGroup);
router.put("/updateGroup", updateGroup);
router.delete("/deleteGroup/:id", deleteGroup);

module.exports = router;
