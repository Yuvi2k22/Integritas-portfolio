interface TogglePointerEventsProps {
  pointerEventEnable: boolean;
  enableSpecificDataAttribute?: string;
  disableSpecificDataAttribute?: string;
}

const setPointerEvents = (id: string, value: 'auto' | 'none') => {
  const element = document.getElementById(id);
  if (element) {
    element.style.pointerEvents = value;
  }
};

function TogglePointerEvents({
  pointerEventEnable,
  enableSpecificDataAttribute,
  disableSpecificDataAttribute
}: TogglePointerEventsProps) {
  if (pointerEventEnable) {
    if (enableSpecificDataAttribute) {
      document.body.style.pointerEvents = 'none';
      setPointerEvents(enableSpecificDataAttribute, 'auto');
    }
    if (disableSpecificDataAttribute) {
      setPointerEvents(disableSpecificDataAttribute, 'none');
    }
  } else {
    document.body.style.pointerEvents = 'auto';
    if (enableSpecificDataAttribute) {
      setPointerEvents(enableSpecificDataAttribute, 'auto');
    }
  }
}

export { TogglePointerEvents };
