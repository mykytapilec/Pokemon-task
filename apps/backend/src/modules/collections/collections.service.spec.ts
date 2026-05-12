import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CollectionsService } from './collections.service';
import { Collection, CollectionDocument } from './schemas/collection.schema';
import { CreateCollectionDto } from './dto/create-collection.dto';

type MockModel = Partial<Record<keyof Model<CollectionDocument>, jest.Mock>>;

describe('CollectionsService', () => {
  let service: CollectionsService;

  const mockModel: MockModel = {
    create: jest.fn((dto: CreateCollectionDto) =>
      Promise.resolve({
        _id: '1',
        ...dto,
      } as unknown as Collection),
    ),

    find: jest.fn(() => ({
      exec: jest.fn().mockResolvedValue([]),
    })),

    findById: jest.fn(() => ({
      exec: jest.fn().mockResolvedValue({
        _id: '1',
        name: 'test',
        pokemons: [],
        totalWeight: 0,
      }),
    })),

    findByIdAndDelete: jest.fn(() => ({
      exec: jest.fn().mockResolvedValue({
        _id: '1',
      }),
    })),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CollectionsService,
        {
          provide: getModelToken(Collection.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get(CollectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create collection', async () => {
    const result = await service.create({
      name: 'test',
      pokemons: [
        { id: 1, name: 'bulbasaur', weight: 69 },
        { id: 4, name: 'charmander', weight: 85 },
        { id: 7, name: 'squirtle', weight: 90 },
      ],
    });

    expect(result.name).toBe('test');
    expect(result.totalWeight).toBe(244);
  });
});
