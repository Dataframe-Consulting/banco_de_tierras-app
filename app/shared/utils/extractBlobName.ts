export function extractBlobName(url: string, containerName: string): string {
  const urlObj = new URL(url);
  const parts = urlObj.pathname.split(`/${containerName}/`);
  return parts[1];
}
