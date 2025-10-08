// src/modules/forms/forms.service.ts
import {
    Injectable,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FormField } from '../../models/form-fields.model';
import { Form } from '../../models/form.model';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { validateOptionsForFieldType } from './validators/options.validator';
import { AddFieldFromTypeDto } from './dto/add-field-from-type.dto';

function simpleSlug(input = '') {
    return String(input)
        .toLowerCase()
        .trim()
        .replace(/[\s\_]+/g, '-')
        .replace(/[^a-z0-9\-]/g, '') // keep alphanumeric and dashes
        .replace(/\-{2,}/g, '-')
        .replace(/^\-+|\-+$/g, '');
}

@Injectable()
export class FormsService {
    constructor(
        @InjectModel(FormField) private readonly fieldModel: typeof FormField,
        @InjectModel(Form) private readonly formModel: typeof Form,
    ) { }

    private getSequelizeInstance() {
        const sequelize = (this.fieldModel as any)?.sequelize;
        if (!sequelize) {
            throw new InternalServerErrorException('Sequelize instance is not available on model');
        }
        return sequelize;
    }
    async getFields(formId: number) {
        // optional: ensure form exists
        const form = await this.formModel.findByPk(formId);
        if (!form) throw new NotFoundException('Form not found');

        const fields = await this.fieldModel.findAll({
            where: { form_id: formId, is_deleted: false },
            order: [['order_index', 'ASC']],
        });
        return fields;
    }

    async getFieldById(formId: number, fieldId: number) {
        const field = await this.fieldModel.findOne({
            where: { id: fieldId, form_id: formId, is_deleted: false },
        });
        if (!field) throw new NotFoundException('Field not found');
        return field;
    }
    async createForm(userId: number, dto: any) {
        // ensure title exists (DTO should have validated)
        const title = String(dto.title || 'untitled').trim();

        if (!title) throw new BadRequestException('Title is required');

        // generate slug candidate
        const rawSlug = dto.slug && String(dto.slug).trim().length > 0
            ? simpleSlug(String(dto.slug))
            : simpleSlug(title || `form-${Date.now()}`);

        // ensure slug unique, append suffix if necessary
        let slug = rawSlug || `form-${Date.now()}`;
        let counter = 0;
        while (true) {
            const existing = await this.formModel.findOne({ where: { slug } });
            if (!existing) break;
            counter += 1;
            slug = `${rawSlug}-${counter}`;
            if (counter > 50) {
                throw new InternalServerErrorException('Unable to generate unique slug');
            }
        }

        const form = await this.formModel.create({
            user_id: userId,
            title,
            description: dto.description ?? null,
            slug,
            status: dto.status ?? 'draft',
            settings: dto.settings ?? {},
            theme_config: dto.theme_config ?? {},
            expires_at: dto.expires_at ?? null,
            max_responses: dto.max_responses ?? null,
            is_public: typeof dto.is_public === 'boolean' ? dto.is_public : true,
        });

        return { success: true, form };
    }
    ////////////////////////////////////////////////////////////////////////////////idhr tak formfield tak ki methods h ////////////////////////
    
//       async createField(formId: number, dto: CreateFieldDto) {
//     // use managed transaction style (recommended)
//     return await this.sequelize.transaction(async (t) => {
//       const field = await this.fieldModel.create({
//         form_id: formId,
//         ...dto,
//       }, { transaction: t });

//       // ...other DB operations using { transaction: t }

//       return { success: true, field };
//     });
//   }
            // agar getsequelizeInstance() is approach ka use nai kare hote to to oopr jsi method se kia h we would have done that
    
    async createField(formId: number, dto: CreateFieldDto) {

        const form = await this.formModel.findByPk(formId);

        if (!form) throw new NotFoundException('Form not found');

        const err = validateOptionsForFieldType(dto.field_type, dto.options);

        if (err) throw new BadRequestException(err);

        if (dto.order_index == null) {
            const max = await this.fieldModel.max('order_index', { where: { form_id: formId } });
            dto.order_index = (typeof max === 'number' ? max + 1 : 0);
        }

        const sequelize = this.getSequelizeInstance();

        const t = await sequelize.transaction();

        try {
            const field = await this.fieldModel.create({
                form_id: formId,
                field_type: dto.field_type,
                label: dto.label,
                placeholder: dto.placeholder,
                description: dto.description,
                is_required: dto.is_required || false,
                validation_rules: dto.validation_rules || null,
                options: dto.options || null,
                order_index: dto.order_index,
            }, { transaction: t });

            await t.commit();
            return { success: true, field };
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }

    async updateField(formId: number, fieldId: number, dto: UpdateFieldDto) {

        const field = await this.fieldModel.findOne({ where: { id: fieldId, form_id: formId } });
        if (!field) throw new NotFoundException('Field not found');

        const fieldTypeToValidate = (dto as any).field_type || field.field_type;

        if ((dto as any).options) {
            const err = validateOptionsForFieldType(fieldTypeToValidate, (dto as any).options);
            if (err) throw new BadRequestException(err);
        }

        await field.update(dto as any);
        return { success: true, field };
    }

    async deleteField(formId: number, fieldId: number) {

        const field = await this.fieldModel.findOne({ where: { id: fieldId, form_id: formId } });

        if (!field) throw new NotFoundException('Field not found');
        await field.destroy();
        return { success: true };
    }

    async reorderFields(formId: number, order: { field_id: number, order_index: number }[]) {
        const sequelize = this.getSequelizeInstance();
        const t = await sequelize.transaction();
        try {
            for (const o of order) {
                await this.fieldModel.update(
                    { order_index: o.order_index },
                    { where: { id: o.field_id, form_id: formId }, transaction: t },
                );
            }
            await t.commit();
            return { success: true };
        } catch (e) {
            await t.rollback();
            throw e;
        }
    }

    async getFormWithFields(formId: number) {
        const form = await this.formModel.findByPk(formId, {
            include: [{ model: FormField }],
        });
        if (!form) throw new NotFoundException('Form not found');

        if (Array.isArray((form as any).fields)) {
            (form as any).fields = (form as any).fields.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
        }
        return form;
    }

    async addFieldFromType(formId: number, dto: AddFieldFromTypeDto, adminUserId: number) {
  // 1. ensure form exists and admin has permission (optional ownership check)
  const form = await this.formModel.findByPk(formId);
  if (!form) throw new NotFoundException('Form not found');

  // optional: check ownership:
  // if (form.user_id !== adminUserId && adminUserIdRole !== 'superadmin') throw new ForbiddenException();

  // 2. validate options based on field type
  const err = validateOptionsForFieldType(dto.field_type, dto.options);
  if (err) throw new BadRequestException(err);

  // 3. compute order_index if not provided (append to end)
  // (dto may not include order_index field — compute next)
  const max = await this.fieldModel.max('order_index', { where: { form_id: formId } });
  const order_index = (typeof max === 'number' ? max + 1 : 0);

  // 4. create field inside a transaction (recommended)
  const sequelize = this.getSequelizeInstance();
  return await sequelize.transaction(async (t) => {
    const field = await this.fieldModel.create({
      form_id: formId,
      field_type: dto.field_type,
      label: dto.label,
      placeholder: dto.placeholder ?? null,
      is_required: !!dto.is_required,
      options: dto.options ?? null,
      order_index,
      created_by: adminUserId, // optional
    }, { transaction: t });

    return { success: true, field };
  });
}

}
