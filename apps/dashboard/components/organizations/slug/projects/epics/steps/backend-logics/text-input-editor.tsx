// components/backend-logics/TextInputEditor.tsx
'use client';

import { Textarea } from '@workspace/ui/components/textarea';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function TextInputEditor({ value, onChange }: Props) {
  return (
    <Textarea
      value={value}
      onChange={onChange}
      placeholder={`For example:
- User authentication requires email verification
- Product inventory should be updated in real-time
- Payment processing should integrate with Stripe
- User roles: Admin, Editor, Viewer with different permissions`}
      className="min-h-[200px]"
    />
  );
}
