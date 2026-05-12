import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCollectionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Get(':id/export')
  async export(@Param('id') id: string, @Res() res: Response) {
    const collection = await this.service.findOne(id);

    const fileContent = JSON.stringify(collection, null, 2);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=collection-${id}.json`,
    );

    return res.send(fileContent);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importFile(@UploadedFile() file: { buffer: Buffer }) {
    const raw = file.buffer.toString('utf-8');
    const parsed: unknown = JSON.parse(raw);

    const data = parsed as CreateCollectionDto;

    return this.service.create({
      name: data.name,
      pokemons: data.pokemons,
    });
  }
}
