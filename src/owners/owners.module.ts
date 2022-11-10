import { Global, Module } from '@nestjs/common';
import { OwnersService } from './owners.service';
import { OwnersResolver } from './owners.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from './entities/owner.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstant } from 'src/jwtConstant';
@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Owner]),
    JwtModule.register({
      secret: jwtConstant.jwtKey,
      signOptions: { expiresIn: jwtConstant.expiredIn },
    }),
  ],
  providers: [OwnersResolver, OwnersService],
  exports: [OwnersService],
})
export class OwnersModule {}
