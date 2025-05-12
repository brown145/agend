import { LoaderCircle } from "lucide-react";

export default function Loader({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <LoaderCircle className="h-12 w-12 animate-spin" />
      {text && <div className="mt-4">{text}</div>}
    </div>
  );
}
