import { Module } from '@nestjs/common';
import { TypesService } from './types.service';
import { TypesResolver } from './types.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Type } from './entities/type.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Type]), JwtModule],
  providers: [TypesResolver, TypesService],
  exports: [TypeOrmModule],
})
export class TypesModule {}
