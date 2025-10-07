import { Controller, Get } from '@nestjs/common';

@Controller('api/admin/field-types')
export class FieldTypesController {
  @Get()
  getTypes() {
    const types = [
      { type: 'short_answer', label: 'Short answer', options_schema: { placeholder: 'string', max_length: 'number' } },
      { type: 'paragraph', label: 'Paragraph' },
      { type: 'multiple_choice', label: 'Multiple choice', options_schema: { choices: 'array', allow_other: 'boolean' } },
      { type: 'checkboxes', label: 'Checkboxes' },
      { type: 'dropdown', label: 'Dropdown' },
      { type: 'file_upload', label: 'File upload', options_schema: { max_files: 'number', max_size_mb: 'number' } },
      { type: 'linear_scale', label: 'Linear scale', options_schema: { min: 'number', max: 'number' } },
      { type: 'rating', label: 'Rating', options_schema: { min: 'number', max: 'number' } },
      { type: 'multiple_choice_grid', label: 'Multiple choice grid' },
      { type: 'checkbox_grid', label: 'Checkbox grid' },
      { type: 'date', label: 'Date' },
      { type: 'time', label: 'Time' },
    ];
    return { types };
  }
}
