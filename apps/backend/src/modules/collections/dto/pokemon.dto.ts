import { IsInt, IsString } from 'class-validator';

export class PokemonDto {
  @IsInt()
  id!: number;

  @IsString()
  name!: string;

  @IsInt()
  weight!: number;
}
