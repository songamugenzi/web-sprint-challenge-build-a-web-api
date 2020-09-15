const express = require("express");

const ActionsDb = require("../data/helpers/actionModel.js");

const router = express.Router();

// READ & get list of actions //
router.get("/", (req, res) => {
  ActionsDb.get()
    .then((actionsList) => {
      res.status(200).json({ actionsList });
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "Error retrieving actions from our database." });
    });
});

// READ & get specific action //
router.get("/:id", validateActionID, (req, res) => {
  const validAction = req.action;
  res.status(200).json({ validAction });
});

// DELETE specific action //
router.delete("/:id", validateActionID, (req, res) => {
  const deleteAction = req.params.id;

  ActionsDb.remove(deleteAction)
    .then((count) => {
      if (count > 0) {
        res
          .status(200)
          .json({ message: "Action successfully deleted from our database." });
      } else {
        res
          .status(404)
          .json({ message: "Action with the specified ID does not exist." });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Action could not be removed." });
    });
});

// UPDATE & put new action changes in the database //
router.put("/:id", validateActionID, validateAction, (req, res) => {
  const changes = req.body;
  const updateAction = req.params.id;

  ActionsDb.update(updateAction, changes)
    .then((action) => {
        res.status(200).json({
          message: "Action successfully updated in our database.",
          action
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Action could not be updated." });
    });
});

// CUSTOM MIDDLEWARE //

function validateActionID(req, res, next) {
  const id = req.params.id;

  ActionsDb.get(id)
    .then((action) => {
      if (!action) {
        res.status(400).json({ message: "invalid action ID." });
      } else {
        req.action = action;
        next();
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "There was an error retrieving the action from our database.",
      });
    });
}

function validateAction(req, res, next) {
  const body = req.body;
  const description = body.description;
  const notes = body.notes;

  if (!body) {
    res.status(400).json({ message: "Missing action data." });
  }
  if (!description || !notes) {
    res
      .status(400)
      .json({ message: "Missing required field: description or notes." });
  }
  if (typeof description !== "string" || typeof notes !== "string") {
    res
      .status(400)
      .json({ message: "Enter valid text for description and notes." });
  }
  if (description.length > 128) {
    res
      .status(400)
      .json({ message: "Description must be less than 128 characters." });
  } else {
    next();
  }
}

module.exports = router;
