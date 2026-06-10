import { PreviewFlow } from "@/components/PreviewFlow";

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template } = await searchParams;
  return <PreviewFlow templateId={template ?? "invoice"} />;
}
