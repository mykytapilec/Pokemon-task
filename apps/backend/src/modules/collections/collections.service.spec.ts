import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { CollectionsService } from './collections.service';
import { Collection } from './schemas/collection.schema';

describe('CollectionsService', () => {
  let service: CollectionsService;

  const mockModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create collection with calculated totalWeight', async () => {
    mockModel.create.mockImplementation(
      (dto: {
        name: string;
        pokemons: {
          id: number;
          name: string;
          weight: number;
        }[];
        totalWeight: number;
      }) => Promise.resolve(dto),
    );

    const result = await service.create({
      name: 'starter',
      pokemons: [
        {
          id: 1,
          name: 'bulbasaur',
          weight: 69,
        },
        {
          id: 4,
          name: 'charmander',
          weight: 85,
        },
        {
          id: 7,
          name: 'squirtle',
          weight: 90,
        },
      ],
    });

    expect(result.totalWeight).toBe(244);
  });

  it('should throw if collection exceeds max weight', async () => {
    await expect(
      service.create({
        name: 'heavy',
        pokemons: [
          {
            id: 3,
            name: 'venusaur',
            weight: 1000,
          },
          {
            id: 6,
            name: 'charizard',
            weight: 905,
          },
          {
            id: 9,
            name: 'blastoise',
            weight: 855,
          },
        ],
      }),
    ).rejects.toThrow();
  });
});
