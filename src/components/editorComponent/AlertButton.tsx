import { useComponentsContext } from '@blocknote/react';
import type { LinkToolbarProps } from '@blocknote/react';

// Custom Link Toolbar button to open a browser alert.
function AlertButton(props: LinkToolbarProps) {
  const Components = useComponentsContext()!;

  return (
    <Components.LinkToolbar.Button
      mainTooltip={'Open Alert with URL'}
      onClick={() => window.alert(`Link URL: ${props.url}`)}
    >
      Open Alert
    </Components.LinkToolbar.Button>
  );
}

export default AlertButton;
