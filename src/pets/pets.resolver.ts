import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  Resolver,
  Int,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { CurrentUserDecorator } from 'src/decorators/current-user.decorator';
import { Auth } from 'src/guard/Auth.decorator';
import { GqlAuthGuard } from 'src/guard/auth.guard';
import { Owner } from '../owners/entities/owner.entity';
import { CreatePetCurrent } from './dto/create-pet-current.input';
import { CreatePetInput } from './dto/create-pet.input';
import { Pet } from './pet.entity';
import { PetsService } from './pets.service';

@Resolver((of) => Pet)
export class PetsResolver {
  constructor(private petsService: PetsService) {}
  @Query((returns) => Pet)
  @Auth('admin', 'staff')
  getPet(@Args('id', { type: () => Int }) id: number): Promise<Pet> {
    return this.petsService.findOne(id);
  }

  @Query((returns) => [Pet])
  @Auth('admin', 'staff')
  pets(): Promise<Pet[]> {
    return this.petsService.findAll();
  }

  @Query((returns) => [Pet])
  @Auth('admin', 'staff', 'user')
  getPetByCurrentUser(@CurrentUserDecorator() current) {
    return this.petsService.getAllPetByCurrent(current.id);
  }

  @ResolveField((returns) => Owner)
  owner(@Parent() pet: Pet): Promise<Owner> {
    return this.petsService.getOwner(pet.ownerId);
  }

  @Mutation((returns) => Pet)
  @Auth('admin', 'staff')
  createPet(
    @Args('createPetInput') createPetInput: CreatePetInput,
  ): Promise<Pet> {
    return this.petsService.createPet(createPetInput);
  }

  @Mutation((returns) => Pet)
  @Auth('admin', 'staff', 'user')
  createPetByCurrentUser(
    @Args('createPetInput') createPetInput: CreatePetCurrent,
    @CurrentUserDecorator() current,
  ) {
    return this.petsService.createPet(createPetInput, current.id);
  }

  @Mutation((returns) => Pet)
  @Auth('admin', 'staff')
  deletePet(@Args('id', { type: () => Int }) id: number): Promise<Pet> {
    return this.petsService.deletePet(id);
  }

  @Mutation((returns) => Pet)
  @Auth('user')
  deletePetToCurrent(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUserDecorator() current,
  ) {
    return this.petsService.deletePetByCurrent(id, current.id);
  }
}
