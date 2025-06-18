export function formatDate(value: string | Date): string {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });
}
