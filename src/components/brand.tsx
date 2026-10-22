import { Zap } from "lucide-react";
export function Brand() {
  return (
    <span className="brand">
      <span className="brand-symbol">
        <Zap fill="currentColor" strokeWidth={1.3} />
      </span>
      <span>
        <b>
          CSI<span className="brand-dot">.</span>
        </b>
        <small>ELETROLAR</small>
      </span>
    </span>
  );
}
