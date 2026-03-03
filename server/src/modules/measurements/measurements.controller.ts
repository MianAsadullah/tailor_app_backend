import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MeasurementsService } from './measurements.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
import { FromTemplateDto } from './dto/from-template.dto';
import { JwtAuthGuard } from '../../middlewares/jwt-auth.guard';

@ApiTags('measurements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('measurements')
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Get('templates')
  getTemplates() {
    return this.measurementsService.getTemplates();
  }

  @Post(':id/duplicate')
  duplicate(@Param('id') id: string) {
    return this.measurementsService.duplicate(id);
  }

  @Post('from-template')
  fromTemplate(@Body() dto: FromTemplateDto) {
    return this.measurementsService.createFromTemplate(dto);
  }

  @Get('customer/:customerId')
  findByCustomer(@Param('customerId') customerId: string) {
    return this.measurementsService.findByCustomer(customerId);
  }

  @Post()
  create(@Body() dto: CreateMeasurementDto) {
    return this.measurementsService.create(dto);
  }

  @Get()
  findAll() {
    return this.measurementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.measurementsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMeasurementDto) {
    return this.measurementsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.measurementsService.remove(id);
  }
}

