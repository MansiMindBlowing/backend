export function validateOptionsForFieldType(fieldType: string, options: any): string | null {
  if (!options) {
    if (['multiple_choice', 'checkboxes', 'dropdown'].includes(fieldType)) {
      return 'options.choices is required for choice-based fields';
    }
    return null;
  }

  switch (fieldType) {
    case 'multiple_choice':
    case 'checkboxes':
    case 'dropdown':
      if (!Array.isArray(options.choices) || options.choices.length === 0) {
        return 'options.choices must be a non-empty array';
      }
      for (const c of options.choices) {
        if (!c.label) return 'each choice must have a label';
        // ensure choice id present for stable IDs; create if missing
        if (!c.id) c.id = generateChoiceId(c.label);
      }
      return null;

    case 'file_upload':
      if (options.max_files != null && typeof options.max_files !== 'number') return 'options.max_files must be number';
      if (options.allowed_mime_types && !Array.isArray(options.allowed_mime_types)) return 'allowed_mime_types must be array';
      return null;

    case 'linear_scale':
    case 'rating':
      if (typeof options.min !== 'number' || typeof options.max !== 'number') {
        return 'options.min and options.max must be numbers';
      }
      if (options.min >= options.max) return 'min must be < max';
      return null;

    case 'multiple_choice_grid':
    case 'checkbox_grid':
      if (!Array.isArray(options.rows) || !Array.isArray(options.columns)) return 'rows and columns arrays required';
      if (options.rows.length === 0 || options.columns.length === 0) return 'rows/columns cannot be empty';
      return null;

    default:
      return null;
  }
}

function generateChoiceId(label: string) {
  return 'c_' + Buffer.from(String(label)).toString('base64').slice(0, 8);
}
