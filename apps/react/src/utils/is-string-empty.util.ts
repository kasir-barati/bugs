export function isStringEmpty(value?: string): boolean {
  return !value || value?.trim()?.length === 0;
}
