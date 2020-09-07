import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Post } from "../../entity/Post/Post";

export async function postGetAllAction(req: Request, res: Response) {
  const postRepository = getManager().getRepository(Post);
  const posts = await postRepository.find();
  res.send(posts);
}
