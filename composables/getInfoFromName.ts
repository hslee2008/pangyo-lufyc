export default function getInfoFromName(text: string) {
  if (!text) return {}

  const number = text.slice(0, 4);
  const name = text.slice(4, text.length);

  return {
    number,
    name,
  };
}
