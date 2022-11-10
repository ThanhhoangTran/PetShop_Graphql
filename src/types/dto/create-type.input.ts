import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTypeInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
