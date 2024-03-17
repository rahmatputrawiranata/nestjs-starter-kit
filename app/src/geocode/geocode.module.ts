import { Module } from '@nestjs/common';
import { GeocodeController } from './geocode.controller';
import { GeocodeService } from './geocode.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Geocode, GeocodeSchema } from './geocode.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Geocode.name, schema: GeocodeSchema}]),
    UsersModule
  ],
  controllers: [GeocodeController],
  providers: [GeocodeService]
})
export class GeocodeModule {}
