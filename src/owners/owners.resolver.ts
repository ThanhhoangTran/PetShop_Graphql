import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { OwnersService } from './owners.service';
import { Owner } from './entities/owner.entity';
import { CreateOwnerInput } from './dto/create-owner.input';
import { UpdateOwnerInput } from './dto/update-owner.input';
import { LoginOwnerIntput } from './dto/login-owner.input';
import { OwnerDto } from './dto/owner.dto';
import { JwtService } from '@nestjs/jwt';
import { Auth } from 'src/guard/Auth.decorator';
import { CurrentUserDecorator } from 'src/decorators/current-user.decorator';
import { UpdateCurrentOwner } from './dto/update-current-owner.input';

@Resolver(() => Owner)
export class OwnersResolver {
  constructor(
    private readonly ownersService: OwnersService,
    private jwtService: JwtService,
  ) {}

  @Mutation(() => Owner)
  signup(
    @Args('createOwnerInput') createOwnerInput: CreateOwnerInput,
    @Context() context,
  ) {
    return this.ownersService.create(createOwnerInput);
  }

  @Query(() => [Owner], { name: 'owners' })
  @Auth('admin', 'staff')
  findAll() {
    return this.ownersService.findAll();
  }

  @Query(() => OwnerDto, { name: 'login' })
  async login(
    @Args('loginOwnerInput') loginOwnerInput: LoginOwnerIntput,
    @Context() context,
  ) {
    const user = await this.ownersService.loginUser(
      loginOwnerInput.email,
      loginOwnerInput.password,
    );
    const access_token = this.jwtService.sign({
      id: user.id,
      role: user.role,
    });

    context.res.cookie('token', access_token);
    return { ...user, access_token };
  }
  // @ResolveField(() => Pet)
  // pets(@Parent() owner: Owner) {
  //   return this.ownersService.findPets(owner.pets);
  // }

  @Query(() => Owner, { name: 'owner' })
  @Auth('admin', 'staff')
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.ownersService.findOne(id);
  }

  @Mutation(() => Owner)
  @Auth('admin')
  updateOwner(@Args('updateOwnerInput') updateOwnerInput: UpdateOwnerInput) {
    return this.ownersService.updateOwner(
      updateOwnerInput.id,
      updateOwnerInput,
    );
  }

  @Mutation(() => Owner, { name: 'deleteOwner' })
  @Auth('admin')
  removeOwner(@Args('id', { type: () => Int }) id: number) {
    return this.ownersService.remove(id);
  }

  @Mutation(() => Owner)
  @Auth('admin', 'staff', 'user')
  updateCurrentOwner(
    @Args('UpdateOwnerCurrent')
    updateOwnerCurrent: UpdateCurrentOwner,
    @CurrentUserDecorator() currentUser: Owner,
  ) {
    return this.ownersService.updateOwner(currentUser.id, updateOwnerCurrent);
  }
}
