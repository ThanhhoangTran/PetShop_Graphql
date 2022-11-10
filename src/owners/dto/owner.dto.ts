import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OwnerDto {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  role: string;
  @Field()
  access_token: string;
}
