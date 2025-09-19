import { Post } from 'src/posts/entities/post.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  url: string;

  @Column()
  name: string;

  @Column('text')
  summary: string;

  @ManyToMany(() => Post, (post) => post.categories)
  posts: Post[];
}
