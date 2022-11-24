const { Router } = require("express");
const EnsureAuthentication = require('../middlewares/ensureAuthentication');
const TagsController = require("../controlers/TagsController");
const tagsRoutes = Router();

const tagsController = new TagsController();

tagsRoutes.use(EnsureAuthentication);

tagsRoutes.get("/", tagsController.index);

module.exports = tagsRoutes;