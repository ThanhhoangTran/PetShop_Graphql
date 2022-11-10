import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Owner } from 'src/owners/entities/owner.entity';
import { Type } from 'src/types/entities/type.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
@ObjectType()
export class Pet {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field((type) => Int)
  ownerId: number;

  @ManyToOne((type) => Owner, (owner) => owner.pets)
  @Field((type) => Owner)
  owner: Owner;

  @ManyToMany((type) => Type, { nullable: true, cascade: true })
  @Field(() => [Type], { nullable: true })
  @JoinTable()
  types: Type[];
}
