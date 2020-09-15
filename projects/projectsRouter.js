const express = require("express");

const ProjectsDb = require("../data/helpers/projectModel.js");
const ActionsDb = require("../data/helpers/actionModel.js");

const router = express.Router();

// CREATE & post new project //
router.post("/", validateProject, (req, res) => {
  ProjectsDb.insert(req.body)
    .then((project) => {
      res.status(201).json({ project });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Error adding new project." });
    });
});

// CREATE & post new action to specific project //
router.post("/:id/actions", validateProjectID, validateAction, (req, res) => {
  ActionsDb.insert(req.body)
    .then((action) => {
      res.status(201).json({ action });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Error adding new action." });
    });
});

// READ & get list of projects //
router.get("/", (req, res) => {
  ProjectsDb.get()
    .then((projectsList) => {
      res.status(200).json({ projectsList });
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "Error retrieving projects from our database." });
    });
});

// READ & get specific project //
router.get("/:id", validateProjectID, (req, res) => {
  const validProject = req.project;
  res.status(200).json({ validProject });
});

// READ & get list of specific project's actions //
router.get("/:id/actions", validateProjectID, (req, res) => {
  ProjectsDb.getProjectActions(req.project.id)
    .then((actions) => [res.status(200).json({ actions })])
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "Error retrieving actions from our database." });
    });
});

// DELETE specific project //
router.delete("/:id", validateProjectID, (req, res) => {
  const deleteProject = req.params.id;
  ProjectsDb.remove(deleteProject)
    .then((count) => {
      if (count > 0) {
        res
          .status(200)
          .json({ message: "Project successfully deleted from our database." });
      } else {
        res
          .status(404)
          .json({ message: "Project with the specified ID does not exist." });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Project could not be removed." });
    });
});

// UPDATE & put new project changes in the database //
router.put("/:id", validateProjectID, validateProject, (req, res) => {
  const changes = req.body;
  const updateProject = req.params.id;

  ProjectsDb.update(updateProject, changes)
    .then((project) => {
        res.status(200).json({
          message: "Project successfully updated in our database.",
          project
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Project could not be updated.", error });
    });
});

// CUSTOM MIDDLEWARE //

function validateProjectID(req, res, next) {
  const id = req.params.id;

  ProjectsDb.get(id)
    .then((project) => {
      if (!project) {
        res.status(400).json({ message: "invalid project ID." });
      } else {
        req.project = project;
        next();
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "There was an error retrieving the project from our database.",
      });
    });
}

function validateProject(req, res, next) {
  const body = req.body;
  const name = body.name;
  const description = body.description;

  if (!body) {
    res.status(400).json({ message: "Missing project data." });
  }
  if (!name || !description) {
    res
      .status(400)
      .json({ message: "Missing required field: name or description." });
  }
  if (typeof name !== "string" || typeof description !== "string") {
    res
      .status(400)
      .json({ message: "Enter valid text for name and description." });
  } else {
    next();
  }
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
