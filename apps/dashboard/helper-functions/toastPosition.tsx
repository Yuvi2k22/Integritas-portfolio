import { ToastT } from '@workspace/ui/components/sonner';

export const userStoryToastPosition: Omit<
  ToastT,
  'type' | 'promise' | 'delete' | 'id' | 'title' | 'jsx'
> = {
  position: 'top-center',
  style: {
    left: '80px',
  },
};
