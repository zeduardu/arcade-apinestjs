import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jw-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  //Rotas protegidas
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('featuredImage'))
  create(
    @UploadedFile() featuredImage: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
  ) {
    if (featuredImage) {
      createPostDto.featuredImage = featuredImage.path;
    }
    return this.postsService.create(createPostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get('briefly')
  brieflyFindAll() {
    return this.postsService.findAllBriefly();
  }

  @Get('to-posts-list-page')
  findAllToPostsListPage() {
    return this.postsService.findAllPostsToPostsListPage();
  }

  @Get('with-specific-fields')
  findAllWithSpecificFields() {
    return this.postsService.findAllWithSpecificFields();
  }

  @Get('to-post-detail-page/:url')
  findOneByUrlToDetailPage(@Param('url') url: string) {
    return this.postsService.findOneByUrl(url);
  }
}
