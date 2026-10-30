

import express from "express";
import contactController from "../controllers/contact.controller.js";
import authCtrl from "../controllers/auth.controller.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

// Public endpoint for visitors to send a contact message.
router.post(
  "/api/contact-messages",
  contactController.submitMessage
);

// Admin-only contact management.
router.route("/api/contacts")
  .get(
    authCtrl.requireSignin,
    requireAdmin,
    contactController.list
  )
  .post(
    authCtrl.requireSignin,
    requireAdmin,
    contactController.create
  )
  .delete(
    authCtrl.requireSignin,
    requireAdmin,
    contactController.removeAll
  );

router.route("/api/contacts/:id")
  .get(
    authCtrl.requireSignin,
    requireAdmin,
    contactController.read
  )
  .put(
    authCtrl.requireSignin,
    requireAdmin,
    contactController.update
  )
  .delete(
    authCtrl.requireSignin,
    requireAdmin,
    contactController.remove
  );

export default router;
