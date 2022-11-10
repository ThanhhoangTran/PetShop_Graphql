import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
@InputType()
export class UpdateCurrentOwner {
  @Field()
  @IsOptional()
  name: string;

  @Field()
  @IsOptional()
  email: string;
}
