import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly service: CollectionsService) {}

  // CREATE
  @Post()
  create(@Body() dto: CreateCollectionDto) {
    return this.service.create(dto);
  }

  // GET ALL
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // GET ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // CLEAN REST UPDATE
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCollectionDto) {
    return this.service.update(id, dto);
  }

  // DELETE
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  // EXPORT
  @Get(':id/export')
  export(@Param('id') id: string) {
    return this.service.export(id);
  }

  // IMPORT
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  import(@UploadedFile() file: any) {
    return this.service.import(file);
  }
}
