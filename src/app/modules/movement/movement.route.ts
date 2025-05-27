
import { Router } from "express";
import { getAllMovements, postClimbingMovement, postOngoingMovement } from "./movement.controller";
import auth from "../../middleWear/auth";


const router = Router();

router.post("/ongoing", auth("user"), postOngoingMovement);
router.post("/on-climbing", auth("user"), postClimbingMovement);
router.get("/all-movements-history", auth("user"), getAllMovements);

export const MovementRoutes = router;
