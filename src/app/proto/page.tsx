import type { Metadata } from "next";
import { PrototypePicker } from "@/components/proto/PrototypePicker";

export const metadata: Metadata = { title: "Prototipos" };

export default function PrototypesPage() {
  return <PrototypePicker />;
}
