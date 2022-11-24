const { Router } = require("express");
const NotesController = require("../controlers/NotesController");
const EnsureAuthentication = require("../middlewares/ensureAuthentication");

const notesRoutes = Router();
const notesController = new NotesController();

notesRoutes.use(EnsureAuthentication)

notesRoutes.get("/", notesController.index);
notesRoutes.post("/", notesController.create);
notesRoutes.get("/:id", notesController.show);
notesRoutes.delete("/:id", notesController.delete);

module.exports = notesRoutes;