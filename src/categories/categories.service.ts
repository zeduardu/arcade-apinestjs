import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';

@Injectable()
export class CategoriesService {
  /**
   *
   */
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name, url } = createCategoryDto;
    // Gerar o url automaticamente a partir do name
    if (!url) {
      createCategoryDto.url = slugify(name, {
        lower: true,
        strict: true,
      });
    }
    return this.categoryRepository.save(createCategoryDto);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category | null> {
    return this.categoryRepository.findOne({ where: { id } });
  }

  async findOneByUrl(url: string): Promise<Category | null> {
    return this.categoryRepository.findOne({ where: { url } });
  }

  async findByIds(ids: number[]): Promise<Category[]> {
    return this.categoryRepository
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids: ids })
      .getMany();
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    return this.categoryRepository.delete(id);
  }
}
