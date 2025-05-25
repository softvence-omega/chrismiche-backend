import express from "express";

import { createMovement, getMyMovements } from "./movement.controller";
import auth from "../../middleWear/auth";

const router = express.Router();

router.post("/", auth("user"), createMovement);
router.get("/me", auth("user"), getMyMovements);

export const MovementRoutes = router;
