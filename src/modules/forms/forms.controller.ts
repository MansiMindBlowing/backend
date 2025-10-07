import { Controller, Post, Body, Param, UseGuards, Put, Delete, Get, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { FormsService } from './forms.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { ReorderFieldsDto } from './dto/reorder-field.dto';
import { CreateFormDto } from './dto/create-form.dto';
// import { ReorderFieldsDto } from './dto/reorder-fields.dto';
// import { Request } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('api/admin/forms')
export class FormsController {
    constructor(private readonly formsService: FormsService) { }

    @Post()
    createForm(@Req() req: Request, @Body() dto: CreateFormDto) {
        // request.user is set by JwtStrategy (we return user object/JSON)
        const user = (req as any).user;
        const userId = user && (user.id ?? user.userId ?? user.sub);
        return this.formsService.createForm(Number(userId), dto);
    }
    @Post(':formId/fields')
    createField(@Param('formId') formId: string, @Body() dto: CreateFieldDto) {
        return this.formsService.createField(+formId, dto);
    }

    @Put(':formId/fields/:id')
    updateField(@Param('formId') formId: string, @Param('id') id: string, @Body() dto: UpdateFieldDto) {
        return this.formsService.updateField(+formId, +id, dto);
    }

    @Delete(':formId/fields/:id')
    deleteField(@Param('formId') formId: string, @Param('id') id: string) {
        return this.formsService.deleteField(+formId, +id);
    }

    @Put(':formId/fields/reorder')
    reorder(@Param('formId') formId: string, @Body() body: ReorderFieldsDto) {
        return this.formsService.reorderFields(+formId, body.order);
    }

    @Get(':formId')
    getForm(@Param('formId') formId: string) {
        return this.formsService.getFormWithFields(+formId);
    }
}
