import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class PokemonDto {
  @IsNumber()
  id!: number;

  @IsString()
  name!: string;

  @IsNumber()
  weight!: number;
}

export class UpdateCollectionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PokemonDto)
  pokemons?: PokemonDto[];
}
