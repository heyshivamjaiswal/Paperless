export function updateFirstHeading(blocks: any[], title: string) {
  let updated = false;

  const newBlocks = blocks.map((block) => {
    if (!updated && block.type === 'heading' && block.props?.level === 1) {
      updated = true;
      return {
        ...block,
        content: [{ type: 'text', text: title, styles: {} }],
      };
    }
    return block;
  });

  return updated ? newBlocks : blocks;
}
