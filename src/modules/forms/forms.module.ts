import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';
// import { FieldTypesController } from './field-types.controller';
import { Form } from '../../models/form.model';
import { FormField } from '../../models/form-fields.model';
import { FieldTypesController } from './field.types.controller';

@Module({
  imports: [SequelizeModule.forFeature([Form, FormField])],
  controllers: [FormsController, FieldTypesController],
  providers: [FormsService],
  exports: [FormsService],
})
export class FormsModule {}
