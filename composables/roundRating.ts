export default function getInfoFromName(acc: number, tot: number) {
  return Math.round((acc / tot) * 10) / 10;
}