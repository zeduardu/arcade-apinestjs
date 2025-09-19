import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  url: string;

  @Column()
  title: string;

  @Column('text')
  summary: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  featuredImage: string;

  @CreateDateColumn()
  date: Date;

  @UpdateDateColumn()
  modified: Date;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @ManyToMany(() => Category)
  @JoinTable({ name: 'posts_to_categories' })
  categories: Category[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
