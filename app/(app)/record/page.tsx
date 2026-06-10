import { Recorder } from "@/components/Recorder";

export default async function RecordPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template } = await searchParams;
  return <Recorder templateId={template ?? "invoice"} />;
}
