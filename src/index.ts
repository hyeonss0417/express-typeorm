import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import { Url } from "./entity/Url";
import { Photo } from "./entity/Photo";
import { PhotoMetadata } from "./entity/PhotoMetadata";
import { Album } from "./entity/Album";

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

createConnection()
  .then(async (connection) => {
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

    console.log("Here you can setup and run express/koa/any other framework.");
  })
  .catch((error) => console.log(error));
