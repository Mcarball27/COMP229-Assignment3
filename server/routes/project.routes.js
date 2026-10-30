
import express from "express";
import projectController from "../controllers/project.controller.js";
import authCtrl from "../controllers/auth.controller.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

router.route("/api/projects")
  .get(projectController.list)
  .post(authCtrl.requireSignin, requireAdmin, projectController.create)
  .delete(authCtrl.requireSignin, requireAdmin, projectController.removeAll);

router.route("/api/projects/:id")
  .get(projectController.read)
  .put(authCtrl.requireSignin, requireAdmin, projectController.update)
  .delete(authCtrl.requireSignin, requireAdmin, projectController.remove);

export default router;
