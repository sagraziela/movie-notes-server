const { Router } = require("express");
const EnsureAuthentication = require('../middlewares/ensureAuthentication');
const UsersController = require("../controlers/UsersController");
const UserAvatarController = require("../controlers/UserAvatarController");
const uploadConfig = require("../config/upload")
const multer = require("multer");

const usersRoutes = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

const upload = multer(uploadConfig.MULTER);

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", EnsureAuthentication, usersController.update);
usersRoutes.patch("/avatar", EnsureAuthentication, upload.single("avatar"), userAvatarController.update);

module.exports = usersRoutes;