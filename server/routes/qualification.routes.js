
import express from "express";
import qualificationController from "../controllers/qualification.controller.js";
import authCtrl from "../controllers/auth.controller.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

router.route("/api/qualifications")
  .get(qualificationController.list)
  .post(authCtrl.requireSignin, requireAdmin, qualificationController.create)
  .delete(authCtrl.requireSignin, requireAdmin, qualificationController.removeAll);

router.route("/api/qualifications/:id")
  .get(qualificationController.read)
  .put(authCtrl.requireSignin, requireAdmin, qualificationController.update)
  .delete(authCtrl.requireSignin, requireAdmin, qualificationController.remove);

export default router;
