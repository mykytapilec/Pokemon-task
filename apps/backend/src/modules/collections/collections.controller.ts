import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { PokemonDto } from './dto/pokemon.dto';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly service: CollectionsService) {}

  @Post()
  create(@Body() dto: CreateCollectionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Patch(':id/name')
  rename(@Param('id') id: string, @Body('name') name: string) {
    return this.service.rename(id, name);
  }

  @Post(':id/pokemons')
  addPokemon(@Param('id') id: string, @Body() pokemon: PokemonDto) {
    return this.service.addPokemon(id, pokemon);
  }

  @Delete(':id/pokemons/:pokemonId')
  removePokemon(
    @Param('id') id: string,
    @Param('pokemonId') pokemonId: string,
  ) {
    return this.service.removePokemon(id, Number(pokemonId));
  }

  @Get(':id/export')
  export(@Param('id') id: string) {
    return this.service.export(id);
  }
}
