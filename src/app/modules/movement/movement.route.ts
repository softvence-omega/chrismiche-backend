import { Router } from "express";
import { postClimbingMovement, postOngoingMovement } from "./movement.controller";


const router = Router();

router.post("/ongoing", postOngoingMovement);
router.post("/on-climbing", postClimbingMovement);

export default router;
