import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;
    // Criptografar a senha com bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Criar um novo usuário
    const newUser = this.usersRepository.create({
      ...rest,
      password: hashedPassword,
    });
    return await this.usersRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOneById(user_id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id: user_id });
  }

  findOneByEmail(user_email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email: user_email });
  }

  async update(
    user_id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.usersRepository.update(user_id, updateUserDto);
  }

  async remove(user_id: number): Promise<DeleteResult> {
    return await this.usersRepository.delete(user_id);
  }
}
