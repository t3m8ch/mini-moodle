import type { PropsWithChildren } from 'react';

export function PageContainer({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">{children}</div>
  );
}
