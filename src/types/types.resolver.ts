import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TypesService } from './types.service';
import { Type } from './entities/type.entity';
import { CreateTypeInput } from './dto/create-type.input';
import { UpdateTypeInput } from './dto/update-type.input';
import { Auth } from 'src/guard/Auth.decorator';

@Resolver(() => Type)
export class TypesResolver {
  constructor(private readonly typesService: TypesService) {}

  @Mutation(() => Type)
  @Auth('admin', 'staff')
  createType(@Args('type') name: string) {
    return this.typesService.create(name);
  }

  @Query(() => [Type], { name: 'types' })
  findAll() {
    return this.typesService.findAll();
  }

  @Query(() => Type, { name: 'type' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.typesService.findOne(id);
  }

  @Mutation(() => Type)
  @Auth('admin', 'staff')
  updateType(@Args('updateTypeInput') updateTypeInput: UpdateTypeInput) {
    return this.typesService.update(updateTypeInput.id, updateTypeInput);
  }

  @Mutation(() => Type)
  @Auth('admin')
  removeType(@Args('id', { type: () => Int }) id: number) {
    return this.typesService.remove(id);
  }
}
