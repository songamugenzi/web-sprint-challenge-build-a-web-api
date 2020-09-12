const express = require("express");

const projectsRouter = require("../projects/projectsRouter.js");
const actionsRouter = require("../actions/actionsRouter.js");

const router = express.Router();

router.use(express.json());

router.get("/", (req, res) => {
  const motd = process.env.MOTD || "Hello World!";
  res.status(200).json({ api: "up", motd: motd });
});

router.use("/projects", projectsRouter);
router.use("/actions", actionsRouter);

router.use(errorHandler);

function errorHandler(error, req, res, next) {
  res.status(500).json(error.message);
}

module.exports = router;
