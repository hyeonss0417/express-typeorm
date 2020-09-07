import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;
  @Column("text")
  url: string;
  @Column({ length: 10, unique: true })
  access_key: string;
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdDate: string;
  @Column({ default: 0 })
  access_count: number;
}
