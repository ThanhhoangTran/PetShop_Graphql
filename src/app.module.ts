import { Module, ValidationPipe } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { PetsModule } from './pets/pets.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE, APP_GUARD } from '@nestjs/core';
import { OwnersModule } from './owners/owners.module';
import { TypesModule } from './types/types.module';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      fieldResolverEnhancers: ['guards', 'interceptors'],
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }) => {
        const { token } = req.cookies;
        req.token = token || null;
        // console.log(token);
        return { req, res };
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Hoang@28022001',
      database: 'Graphql-demo',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    OwnersModule,
    PetsModule,
    TypesModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
