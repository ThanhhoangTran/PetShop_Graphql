import { InputType, OmitType } from '@nestjs/graphql';
import { CreatePetInput } from './create-pet.input';

@InputType()
export class CreatePetCurrent extends OmitType(CreatePetInput, ['ownerId']) {}
