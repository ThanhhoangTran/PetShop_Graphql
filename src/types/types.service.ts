import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTypeInput } from './dto/create-type.input';
import { UpdateTypeInput } from './dto/update-type.input';
import { Type } from './entities/type.entity';

@Injectable()
export class TypesService {
  constructor(@InjectRepository(Type) private typeRepo: Repository<Type>) {}
  create(name: string) {
    const type = this.typeRepo.create({ type: name });
    return this.typeRepo.save(type);
  }

  findAll() {
    return this.typeRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} type`;
  }

  update(id: number, updateTypeInput: UpdateTypeInput) {
    return `This action updates a #${id} type`;
  }

  remove(id: number) {
    return `This action removes a #${id} type`;
  }
}
