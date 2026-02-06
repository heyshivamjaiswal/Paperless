export default function getTitleFromFirstHeading(blocks: any[]) {
  const heading = blocks.find(
    (block) =>
      block.type === 'heading' &&
      block.props?.level === 1 &&
      Array.isArray(block.content) &&
      block.content.length > 0
  );

  if (!heading) return null;

  return heading.content
    .map((c: any) => c.text)
    .join('')
    .trim();
}
