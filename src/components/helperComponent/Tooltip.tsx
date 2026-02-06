function Tooltip({ text }: { text: string }) {
  return (
    <div className="absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
      {text}
    </div>
  );
}

export default Tooltip;
