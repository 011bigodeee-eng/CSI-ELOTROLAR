import { Zap } from "lucide-react";
import { officialLogo } from "@/lib/visual-assets";
export function Brand() {
  if (officialLogo)
    return (
      <span className="brand brand-official">
        <img
          src={officialLogo}
          alt="C.S.I. EletroLar — identidade oficial"
          width={256}
          height={256}
          decoding="async"
        />
      </span>
    );
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
