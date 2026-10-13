/** True only for valid http/https URLs. Callers decide whether empty is allowed. */
export default function validateUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export const isHttpUrl = validateUrl;
