import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsResolver } from './pets.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './pet.entity';
import { OwnersModule } from '../owners/owners.module';
import { TypesModule } from 'src/types/types.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    TypeOrmModule.forFeature([Pet]),
    TypesModule,
    OwnersModule,
    JwtModule,
  ],
  providers: [PetsService, PetsResolver],
  exports: [PetsService],
})
export class PetsModule {}
