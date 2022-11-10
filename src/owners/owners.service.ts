import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateOwnerInput } from './dto/create-owner.input';
import { UpdateOwnerInput } from './dto/update-owner.input';
import { Owner } from './entities/owner.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
const bcrypt = require('bcrypt');
@Injectable()
export class OwnersService {
  constructor(
    @InjectRepository(Owner) private ownersRepository: Repository<Owner>,
  ) {}
  async create(createOwnerInput: CreateOwnerInput) {
    const user = await this.ownersRepository.findOne({
      where: { email: createOwnerInput.email },
    });
    if (user) {
      throw new BadRequestException(
        'User have just exists! Please try enter another email',
      );
    }

    const hashPassword = await bcrypt.hash(createOwnerInput.password, 12);

    const newOwner = this.ownersRepository.create({
      ...createOwnerInput,
      password: hashPassword,
    } as any);
    return this.ownersRepository.save(newOwner);
    // return true;
  }

  findAll() {
    return this.ownersRepository.find({
      relations: {
        pets: true,
      },
    });
    // .createQueryBuilder('owner')
    // .leftJoinAndSelect('owner.pets', 'pets')
    // .getMany()
  }

  async loginUser(email: string, passsword: string) {
    const user = await this.ownersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not Found');
    }
    const result = await bcrypt.compare(passsword, user.password);
    if (!result) {
      throw new BadRequestException('Password not correct');
    }
    return user;
  }
  async findOne(id: number) {
    const owner = await this.ownersRepository.findOne({
      where: { id },
      relations: { pets: true },
    });
    if (!owner) {
      throw new NotFoundException(`Owner can not found with id: ${id}`);
    }
    return owner;
  }

  async updateOwner(id: number, updateOwnerInput: any) {
    const owner = await this.ownersRepository.findOneBy({ id });
    if (!owner) {
      throw new NotFoundException(`Owner can not found with id: ${id}`);
    }
    Object.assign(owner, { ...updateOwnerInput });
    return this.ownersRepository.save(owner);
  }

  async remove(id: number) {
    const owner = await this.ownersRepository.findOneBy({ id });
    if (!owner) {
      throw new NotFoundException(`Owner can not found with id: ${id}`);
    }
    return this.ownersRepository.remove(owner);
  }
}
