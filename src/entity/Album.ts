import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Photo } from "./Photo";

@Entity()
export class Album {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @ManyToMany((type) => Photo, (photo) => photo.albums)
  @JoinTable() // to specify this is the owner side of relationship.
  photos: Photo[];
}
