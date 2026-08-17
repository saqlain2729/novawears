export default function AnnouncementBar({ text }: { text: string }) {
  return (
    <div className="bg-ink text-paper text-[11px] tracking-widest2 uppercase text-center py-2.5 px-4">
      {text}
    </div>
  );
}
