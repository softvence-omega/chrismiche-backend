import express from "express";
import { postTrackingClimb, postTrackingRun } from "./instantMovement.controller";

const router = express.Router();

router.post("/tracking-run", postTrackingRun);
router.post("/tracking-climb", postTrackingClimb);

export const instantMovement =  router;
