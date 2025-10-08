// import { Controller, Get } from '@nestjs/common';

// @Controller('api/admin/field-types')
// export class FieldTypesController {
//   @Get()
//   getTypes() {
//     const types = [
//       { type: 'short_answer', label: 'Short answer', options_schema: { placeholder: 'string', max_length: 'number' } },
//       { type: 'paragraph', label: 'Paragraph' },
//       { type: 'multiple_choice', label: 'Multiple choice', options_schema: { choices: 'array', allow_other: 'boolean' } },
//       { type: 'checkboxes', label: 'Checkboxes' },
//       { type: 'dropdown', label: 'Dropdown' },
//       { type: 'file_upload', label: 'File upload', options_schema: { max_files: 'number', max_size_mb: 'number' } },
//       { type: 'linear_scale', label: 'Linear scale', options_schema: { min: 'number', max: 'number' } },
//       { type: 'rating', label: 'Rating', options_schema: { min: 'number', max: 'number' } },
//       { type: 'multiple_choice_grid', label: 'Multiple choice grid' },
//       { type: 'checkbox_grid', label: 'Checkbox grid' },
//       { type: 'date', label: 'Date' },
//       { type: 'time', label: 'Time' },
//     ];
//     return { types };
//   }
// }


import { Controller, Get } from '@nestjs/common';

@Controller('api/admin/field-types')
export class FieldTypesController {
  @Get()
  getTypes() {
    const types = [
      // short answer: light options like placeholder and max length
      {
        type: 'short_answer',
        label: 'Short answer',
        options_schema: {
          placeholder: { type: 'string', description: 'Input placeholder text (optional)' },
          max_length: { type: 'number', description: 'Maximum characters allowed (optional)' },
          // pattern: { type: 'string', description: 'Regex pattern for validation (optional)' }
        }
      },

      // paragraph: multiline short answer
      {
        type: 'paragraph',
        label: 'Paragraph',
        options_schema: {
          placeholder: { type: 'string', description: 'Input placeholder text (optional)' },
          max_length: { type: 'number', description: 'Maximum characters allowed (optional)' }
        }
      },

      // radio / multiple choice: requires choices
      {
        type: 'multiple_choice',
        label: 'Multiple choice',
        options_schema: {
          choices: { type: 'array', items: { type: 'object', properties: { label: { type: 'string' }, value: { type: 'string' } } }, description: 'Array of {label,value} objects - at least 1 required' },
          allow_other: { type: 'boolean', description: 'Show "Other" option allowing custom answer' },
          // shuffle: { type: 'boolean', description: 'Shuffle options (optional)' }
        }
      },

      // checkboxes: requires choices
      {
        type: 'checkboxes',
        label: 'Checkboxes',
        options_schema: {
          choices: { type: 'array', items: { type: 'object', properties: { label: { type: 'string' }, value: { type: 'string' } } }, description: 'Array of {label,value} objects - at least 1 required' },
          allow_other: { type: 'boolean', description: 'Show "Other" option allowing custom answer' },
          min_selections: { type: 'number', description: 'Minimum selections allowed (optional)' },
          max_selections: { type: 'number', description: 'Maximum selections allowed (optional)' }
        }
      },

      // dropdown: requires choices
      {
        type: 'dropdown',
        label: 'Dropdown',
        options_schema: {
          choices: { type: 'array', items: { type: 'object', properties: { label: { type: 'string' }, value: { type: 'string' } } }, description: 'Array of {label,value} objects - at least 1 required' },
          placeholder: { type: 'string', description: 'Placeholder text (optional)' },
          allow_search: { type: 'boolean', description: 'Allow search inside dropdown (optional)' }
        }
      },

      // // file upload: constraints
      // {
      //   type: 'file_upload',
      //   label: 'File upload',
      //   options_schema: {
      //     max_files: { type: 'number', description: 'Maximum number of files allowed' },
      //     max_size_mb: { type: 'number', description: 'Maximum size per file in MB' },
      //     allowed_types: { type: 'array', items: { type: 'string' }, description: 'MIME types or extensions allowed (optional)' }
      //   }
      // },

      // linear scale / rating
      {
        type: 'linear_scale',
        label: 'Linear scale',
        options_schema: {
          min: { type: 'number', description: 'Minimum scale value (e.g., 1)' },
          max: { type: 'number', description: 'Maximum scale value (e.g., 5)' },
          step: { type: 'number', description: 'Step size (optional, default 1)' },
          min_label: { type: 'string', description: 'Label for minimum value (optional)' },
          max_label: { type: 'string', description: 'Label for maximum value (optional)' }
        }
      },

      {
        type: 'rating',
        label: 'Rating',
        options_schema: {
          min: { type: 'number' },
          max: { type: 'number' },
          step: { type: 'number', description: 'Optional step' }
        }
      },

      // multiple choice grid: needs rows (questions) and columns (choices)
      // {
      //   type: 'multiple_choice_grid',
      //   label: 'Multiple choice grid',
      //   options_schema: {
      //     rows: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, label: { type: 'string' } } }, description: 'Array of row objects (questions)' },
      //     columns: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, label: { type: 'string' } } }, description: 'Array of column objects (choices)' },
      //     allow_other_in_columns: { type: 'boolean', description: 'Allow "Other" for columns (optional)' }
      //   }
      // },

      // checkbox grid
      // {
      //   type: 'checkbox_grid',
      //   label: 'Checkbox grid',
      //   options_schema: {
      //     rows: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, label: { type: 'string' } } } },
      //     columns: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, label: { type: 'string' } } } }
      //   }
      // },

      // date/time - usually no choices but optional constraints
      {
        type: 'date',
        label: 'Date',
        options_schema: {
          min: { type: 'string', description: 'Earliest allowed date (ISO yyyy-mm-dd) (optional)' },
          max: { type: 'string', description: 'Latest allowed date (optional)' }
        }
      },

      {
        type: 'time',
        label: 'Time',
        options_schema: {
          min_time: { type: 'string', description: 'Earliest allowed time (HH:MM) (optional)' },
          max_time: { type: 'string', description: 'Latest allowed time (optional)' }
        }
      }
    ];

    return { types };
  }
}
