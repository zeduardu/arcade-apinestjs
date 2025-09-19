import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CategoriesService } from 'src/categories/categories.service';
import slugify from 'slugify';

@Injectable()
export class PostsService {
  /**
   *
   */
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    if (!createPostDto.url) {
      createPostDto.url = slugify(createPostDto.title, { lower: true });
    }

    const user = await this.usersService.findOneById(
      Number(createPostDto.user_id),
    );
    if (!user) {
      throw new Error('User not found');
    }

    const categories = await this.categoriesService.findByIds(
      createPostDto.category_ids.map((id) => Number(id)),
    );

    const post = this.postsRepository.create({
      url: createPostDto.url,
      title: createPostDto.title,
      summary: createPostDto.summary,
      content: createPostDto.content,
      featuredImage: createPostDto.featuredImage,
      user,
      categories,
    });

    return await this.postsRepository.save(post);
  }

  async update(
    post_id: number,
    updatePostDto: UpdatePostDto,
  ): Promise<UpdateResult> {
    return await this.postsRepository.update(post_id, updatePostDto);
  }

  async remove(post_id: number): Promise<DeleteResult> {
    return await this.postsRepository.delete(post_id);
  }

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.find();
  }

  async findAllBriefly(): Promise<Post[]> {
    return await this.postsRepository
      .createQueryBuilder('post')
      .leftJoin('post.user', 'user')
      .leftJoin('post.comments', 'comment')
      .select([
        'post.id',
        'post.title',
        'post.summary',
        'post.modified',
        'user.id',
        'user.name',
        'comment.id',
        'comment.text',
      ])
      .orderBy('post.modified', 'DESC')
      .getMany();
  }

  async findAllPostsToPostsListPage(): Promise<Post[]> {
    return await this.postsRepository.find({
      relations: {
        user: true,
        comments: true,
      },
      select: {
        id: true,
        url: true,
        title: true,
        summary: true,
        featuredImage: true,
        modified: true,
        user: {
          id: true,
          email: true,
        },
        comments: {
          id: true,
        },
      },
    });
  }

  async findAllWithSpecificFields(): Promise<Post[]> {
    return await this.postsRepository.find({
      select: {
        id: true,
        title: true,
        summary: true,
      },
    });
  }

  async findOneById(post_id: number): Promise<Post | null> {
    return await this.postsRepository.findOne({ where: { id: post_id } });
  }

  async findOneByUrl(url: string): Promise<Post | null> {
    return await this.postsRepository.findOne({ where: { url: url } });
  }
}
