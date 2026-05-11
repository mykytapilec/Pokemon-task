import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

class PokemonDto {
  @IsNumber()
  id!: number;

  @IsString()
  name!: string;

  @IsNumber()
  weight!: number;
}

export class CreateCollectionDto {
  @IsString()
  name!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PokemonDto)
  pokemons!: PokemonDto[];
}
