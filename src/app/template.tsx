import type { ReactNode } from "react";
import "./extras.css";

export default function Template({ children }: { children: ReactNode }) {
  return <div className="route-stage">{children}</div>;
}
