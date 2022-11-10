import { Injectable, NotFoundException } from '@nestjs/common';
import { Pet } from './pet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePetInput } from './dto/create-pet.input';
import { OwnersService } from '../owners/owners.service';
import { Owner } from '../owners/entities/owner.entity';
import { Type } from 'src/types/entities/type.entity';
@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet) private petsRepository: Repository<Pet>,
    private ownerService: OwnersService,
    @InjectRepository(Type) private typeRepository: Repository<Type>,
  ) {}

  async createPet(
    createPetInput: Partial<CreatePetInput>,
    idCurrent = 0,
  ): Promise<Pet> {
    const types = await Promise.all(
      createPetInput.types.map((el) =>
        this.typeRepository.findOne({ where: { id: el } }),
      ),
    );
    const newPet = this.petsRepository.create({
      ...createPetInput,
      ownerId: idCurrent > 0 ? idCurrent : createPetInput.ownerId,
      types: types,
    });

    return this.petsRepository.save(newPet); // insert
  }

  async findAll(): Promise<Pet[]> {
    return this.petsRepository.find({ relations: { types: true } }); //SELECT * pet
  }

  async findOne(id: number): Promise<Pet> {
    const pet = await this.petsRepository.findOneBy({ id });
    if (!pet) {
      throw new NotFoundException(`Pet can not found with id: ${id}`);
    }
    return pet;
  }

  getOwner(ownerId: number): Promise<Owner> {
    return this.ownerService.findOne(ownerId);
  }
  async deletePet(petId: number): Promise<Pet> {
    const pet = await this.petsRepository.findOne({ where: { id: petId } });
    if (!pet) {
      throw new NotFoundException('Pet not found id');
    }
    return this.petsRepository.remove(pet);
  }
  async deletePetByCurrent(id: number, userId: number) {
    const pet = await this.petsRepository.findOne({
      where: { id: id, ownerId: userId },
    });
    if (!pet) {
      throw new NotFoundException('Pet not found id by currentUser');
    }
    return this.petsRepository.remove(pet);
  }
  getAllPetByCurrent(id: number) {
    return this.petsRepository.find({
      where: { ownerId: id },
      relations: { owner: true, types: true },
    });
  }
}
