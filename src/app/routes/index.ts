import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { MovementRoutes } from "../modules/movement/movement.route";
import { instantMovementRoutes } from "../modules/instantMovement/instantMovement.route";


const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/movements",
    route: MovementRoutes,
  },
  {
    path: "/instant-movements",
    route: instantMovementRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
