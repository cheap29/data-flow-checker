import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
  empty?: boolean;
};

export function ResultSection({ title, children, empty }: Props) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h2 className="text-base font-bold text-gray-800 mb-3">{title}</h2>
      {empty ? (
        <p className="text-sm text-gray-400">該当なし</p>
      ) : (
        children
      )}
    </section>
  );
}
