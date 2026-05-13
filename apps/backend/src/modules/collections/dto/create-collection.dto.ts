import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PokemonDto } from './pokemon.dto';

export class CreateCollectionDto {
  @IsString()
  name!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PokemonDto)
  pokemons!: PokemonDto[];
}
