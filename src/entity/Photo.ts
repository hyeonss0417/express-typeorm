import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  ManyToMany,
} from "typeorm";
import { PhotoMetadata } from "./PhotoMetadata";
import { Author } from "./Author";
import { Album } from "./Album";

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 100 })
  name: string;
  @Column("text")
  description: string;
  @Column()
  filename: string;
  @Column({ default: 0 })
  views: number;
  @Column()
  isPublished: boolean;
  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;
  @OneToOne((type) => PhotoMetadata, (photoMetadata) => photoMetadata.photo, {
    cascade: true,
  })
  metadata: PhotoMetadata;
  @ManyToOne((type) => Author, (author) => author.photos)
  author: Author;
  @ManyToMany((type) => Album, (album) => album.photos)
  albums: Album[];
}
