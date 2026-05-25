"use client";

type Props = {
  title: string;
  options: string[];
  selected?: string;
  onSelect: (value: string) => void;
};

export default function VariantSelector(props: Readonly<Props>) {
  const { title, options, selected, onSelect } = props;
  if (!options || options.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold mb-3">{title}</h3>

      <div className="flex gap-3 flex-wrap">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onSelect(o)}
            className={`px-4 py-2 rounded-xl border ${
              selected === o ? "bg-black text-white" : "bg-white"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
