const express = require("express");

const {
  registerSociety,
  loginSociety,
  createEvent,
  getSocietyEvents,
  deleteEvent,
  getSingleEvent,
  updateEvent,
  addJudge,
  getEventJudges,
  judgeLogin,
  addEntry,
  getEventEntries,
  getJudgeDashboardData,
  getLeaderboard,
  submitScore,
  deleteJudge,
  generateCertificate,
} = require("../controllers/societyController");

const upload = require("../multerConfig");

const router = express.Router();

router.post(
  "/register",
  upload.single("societyLogo"),
  registerSociety
);
router.post("/login", loginSociety);
router.post("/create-event", createEvent);
router.get("/events/:societyId", getSocietyEvents);
router.delete("/delete-event/:eventId", deleteEvent);
router.get("/event/:eventId", getSingleEvent);
router.put("/update-event/:eventId", updateEvent);
router.post("/add-judge", addJudge);
router.get("/judges/:eventId", getEventJudges);
router.post("/judge-login", judgeLogin);
router.post("/add-entry", addEntry);
router.get("/entries/:eventId", getEventEntries);
router.get("/judge-dashboard/:judgeId", getJudgeDashboardData);
router.post("/submit-score", submitScore);
router.get("/leaderboard/:societyId", getLeaderboard);
router.delete("/delete-judge/:judgeId", deleteJudge);
router.post(
  "/generate-certificate",
  upload.fields([
    { name: "facultyHeadSignature", maxCount: 1 },
    { name: "directorSignature", maxCount: 1 },
    { name: "convenerSignature", maxCount: 1 },
  ]),
  generateCertificate
);
module.exports = router;