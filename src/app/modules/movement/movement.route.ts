
import { Router } from "express";
import { postClimbingMovement, postOngoingMovement } from "./movement.controller";
import auth from "../../middleWear/auth";


const router = Router();

router.post("/ongoing", auth("user"), postOngoingMovement);
router.post("/on-climbing", auth("user"), postClimbingMovement);

export const MovementRoutes = router;
