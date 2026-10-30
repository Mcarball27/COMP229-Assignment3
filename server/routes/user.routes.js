
import express from "express";
import userController from "../controllers/user.controller.js";
import authCtrl from "../controllers/auth.controller.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

router.route("/api/users")
  .get(authCtrl.requireSignin, requireAdmin, userController.list)
  .post(userController.create)
  .delete(authCtrl.requireSignin, requireAdmin, userController.removeAll);

router.route("/api/users/:id")
  .get(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    userController.read
  )
  .put(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    userController.update
  )
  .delete(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    userController.remove
  );

router.param("id", userController.userByID);

export default router;
