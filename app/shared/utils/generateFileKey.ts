export function generateFileKey(file: File): string {
  const fileName = file.name;
  const lastDotIndex = fileName.lastIndexOf(".");

  const baseName =
    lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
  const extension = lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : "";

  const safeBaseName = baseName
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "");
  const timestamp = new Date().getTime();

  return `${safeBaseName}-${timestamp}${extension}`;
}
