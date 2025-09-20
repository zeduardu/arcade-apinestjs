import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const { post_id, user_id, text } = createCommentDto;
    const user = await this.usersService.findOneById(user_id);
    const post = await this.postsService.findOneById(post_id);

    if (!user || !post) {
      throw new NotFoundException();
    }

    const comment = this.commentRepository.create({
      post: post,
      user: user,
      text: text,
    });

    return this.commentRepository.save(comment);
  }

  async findAll() {
    return this.commentRepository.find();
  }

  async findOneById(id: number) {
    return this.commentRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.commentRepository.update(id, updateCommentDto);
  }

  async remove(id: number) {
    return this.commentRepository.delete(id);
  }
}
