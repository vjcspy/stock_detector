export function parseCookies(response: any) {
  const raw = response.headers.raw()['set-cookie'];
  return raw
    .map((entry) => {
      const parts = entry.split(';');
      const cookiePart = parts[0];
      return cookiePart;
    })
    .join(';');
}
