import { Request, Response, NextFunction, response } from "express";
import { getManager } from "typeorm";
import { Post } from "../../entity/Post/Post";
import { CustomError } from "../../utils/CustomError";

export async function postGetByIdAction(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;
  const postRepository = getManager().getRepository(Post);
  const post = await postRepository.findOne(id);
  if (!post) {
    return next(new CustomError("NOT_FOUND", 404, "The post does not exist."));
  }
  res.send(post);
}
