import { Field, InputType, Int } from '@nestjs/graphql';
import { IsAlpha, IsArray } from 'class-validator';

@InputType()
export class CreatePetInput {
  @IsAlpha()
  @Field()
  name: string;

  @IsArray()
  @Field(() => [Number], { nullable: true })
  types?: number[];

  @Field((type) => Int)
  ownerId: number;
}
