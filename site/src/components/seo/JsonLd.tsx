/** JSON-LD в <script>. «<» экранируется, чтобы текст из данных не мог закрыть тег. */
export function JsonLd({ data }: { data: object | null }) {
  if (!data) return null;
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
