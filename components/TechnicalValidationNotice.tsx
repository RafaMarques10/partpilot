import { AlertTriangle } from "lucide-react";

export function TechnicalValidationNotice() {
  return (
    <div className="rounded-md border border-signal/40 bg-signal/10 px-3 py-2 text-sm leading-6 text-slate-700">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 shrink-0 text-amber-700" size={16} />
        <span>
          Validar sempre no Inventor/CAM e simular antes de usar em contexto
          real.
        </span>
      </div>
    </div>
  );
}
