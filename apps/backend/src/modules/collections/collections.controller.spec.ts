import { Test } from '@nestjs/testing';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';

describe('CollectionsController', () => {
  let controller: CollectionsController;

  const mockService = {
    update: jest.fn().mockResolvedValue({
      _id: '1',
      name: 'updated',
      pokemons: [],
      totalWeight: 0,
    }),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CollectionsController],
      providers: [
        {
          provide: CollectionsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get(CollectionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
