
import { Router } from "express";
import { postClimbingMovement, postOngoingMovement } from "./movement.controller";
import auth from "@/app/middleWear/auth";


const router = Router();

router.post("/ongoing", auth(), postOngoingMovement);
router.post("/on-climbing", auth(), postClimbingMovement);

export const MovementRoutes = router;
