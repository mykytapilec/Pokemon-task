import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CollectionDocument = HydratedDocument<Collection>;

@Schema({ timestamps: true })
export class Collection {
  @Prop({ required: true })
  name!: string;

  @Prop({
    type: [
      {
        id: Number,
        name: String,
        weight: Number,
      },
    ],
    default: [],
  })
  pokemons!: {
    id: number;
    name: string;
    weight: number;
  }[];

  @Prop({ default: 0 })
  totalWeight!: number;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
