import { Test, TestingModule } from '@nestjs/testing';
import { TypesResolver } from './types.resolver';
import { TypesService } from './types.service';

describe('TypesResolver', () => {
  let resolver: TypesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypesResolver, TypesService],
    }).compile();

    resolver = module.get<TypesResolver>(TypesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
