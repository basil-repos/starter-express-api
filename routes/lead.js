import express from "express";
import { get_leads, save_lead, update_read_status, update_status } from "../controllers/lead.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.post("/save-lead", save_lead);
router.get("/get-leads/:type", verifyToken, get_leads);
router.get("/update-lead-status/:id/:type", verifyToken, update_read_status);
router.get("/trash/:id", verifyToken, update_status);

export default router;