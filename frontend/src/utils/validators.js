export const isValidEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

/** Tags can be populated objects ({ name, slug }) or plain strings. */
export const getTagName = (tag) => (typeof tag === 'string' ? tag : tag?.name || '');

export const slugify = (value) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
