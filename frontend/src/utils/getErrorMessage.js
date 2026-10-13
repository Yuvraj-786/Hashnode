/** Prefer the backend's response.data.message, then fall back gracefully. */
export default function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const backendMessage = error?.response?.data?.message;
  if (backendMessage) return backendMessage;
  if (error?.request && !error?.response) return 'Cannot reach the server. Check your connection.';
  return error?.message || fallback;
}
