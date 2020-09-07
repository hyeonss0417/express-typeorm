import { postGetAllAction } from "./controllers/PostGetAllAction";
import { postGetByIdAction } from "./controllers/PostGetByIdAction";
import { postSaveAction } from "./controllers/PostSaveAction";
import { Router, Request, Response, NextFunction } from "express";

const router = Router();

interface Route {
  path: string;
  method: "get" | "post";
  action: (req: Request, res: Response, next: NextFunction) => any;
}

const AppRoutes: Route[] = [
  {
    path: "/",
    method: "get",
    action: (req, res) => res.send("root"),
  },
  {
    path: "/error",
    method: "get",
    action: (req, res, next) => next(new Error("Test Error")),
  },
  {
    path: "/posts",
    method: "get",
    action: postGetAllAction,
  },
  {
    path: "/posts/:id",
    method: "get",
    action: postGetByIdAction,
  },
  {
    path: "/posts",
    method: "post",
    action: postSaveAction,
  },
];

AppRoutes.forEach((route) => {
  router[route.method](route.path, route.action);
});

export default router;
