import "reflect-metadata";
import "./env";
import { createConnection } from "typeorm";
import * as express from "express";

import { Url } from "./entity/Url";
import { Photo } from "./entity/Photo";
import { PhotoMetadata } from "./entity/PhotoMetadata";
import { Album } from "./entity/Album";
import bodyParser = require("body-parser");
import router from "./routes";
import { errorHandler } from "./utils/CustomMiddleware";

const PORT = process.env.PORT || 3000;

createConnection()
  .then(async (connection) => {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use("/", router);

    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`✅ Express server listening on localhost:${PORT}`);
    });
  })
  .catch((error) => console.log("TypeORM connection error: " + error));

const testUrlEntity = async (connection) => {
  const url = new Url();
  url.url = "https://www.naver.com";
  url.access_key = "A9eqZ1";
  //await connection.manager.save(url);
  const urlRepository = connection.getRepository(Url);

  await urlRepository.save(url);
  console.log("Saved a new url with id: " + url.id);

  console.log("Loading urls from the database...");
  //const urls = await connection.manager.find(Url);
  const urls = await urlRepository.find();
  console.log("Loaded urls: ", urls);
  urls.forEach((url) => urlRepository.remove(url));
};

const testPhoto = async (connection) => {
  const album1 = new Album();
  album1.name = "Bears";
  await connection.manager.save(album1);

  const album2 = new Album();
  album2.name = "Me";
  await connection.manager.save(album2);

  const photo = new Photo();
  photo.name = "Me and Bears";
  photo.description = "I am near polar bears";
  photo.filename = "photo-with-bears.jpg";
  photo.albums = [album1, album2];
  photo.isPublished = true;

  const metadata = new PhotoMetadata();
  metadata.height = 640;
  metadata.width = 480;
  metadata.compressed = true;
  metadata.comment = "cybershoot";
  metadata.orientation = "portrait";

  photo.metadata = metadata;

  const photoRepository = connection.getRepository(Photo);

  await photoRepository.save(photo);

  console.log(
    await photoRepository.findOne(photo.id, {
      relations: ["metadata", "albums"],
    })
  );
  let photos = await connection
    .getRepository(Photo)
    .createQueryBuilder("photo") // first argument is an alias. Alias is what you are selecting - photos. You must specify it.
    .innerJoinAndSelect("photo.metadata", "metadata")
    .leftJoinAndSelect("photo.albums", "album")
    .where("photo.isPublished = true")
    .andWhere("(photo.name = :photoName OR photo.name = :bearName)")
    .orderBy("photo.id", "DESC")
    .skip(5)
    .take(10)
    .setParameters({ photoName: "My", bearName: "Mishka" })
    .getMany();
  // console.log(
  //   await photoRepository
  //     .createQueryBuilder("photo")
  //     .innerJoinAndSelect("photo.metadata", "metadata")
  //     .where(`photo.id = ${photo.id}`)
  //     .getOne()
  // );
  // console.log(
  //   photoRepository
  //     .createQueryBuilder("photo")
  //     .innerJoinAndSelect("photo.metadata", "metadata")
  //     .getSql()
  // );
  //console.log(metadata);
};
