import express from "express";
import { postTrackingClimb, postTrackingRun } from "./instantMovement.controller";
import auth from "@/app/middleWear/auth";

const router = express.Router();

router.post("/tracking-run", auth("user"), postTrackingRun);
router.post("/tracking-climb", auth("user"), postTrackingClimb);

export const instantMovementRoutes =  router;
