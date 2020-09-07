import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Post } from "../../entity/Post/Post";

export async function postSaveAction(req: Request, res: Response) {
  const postRepository = getManager().getRepository(Post);
  const newPost = new Post();
  newPost.title = req.body.title;
  newPost.text = req.body.text;

  await postRepository.save(newPost);
  res.send(newPost);
}
