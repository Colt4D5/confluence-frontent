import { TbTagsFilled } from "react-icons/tb";

export default function DocListItem({ doc, handleAddTag, handleRemoveTag }) {
  const MAX_LABELS = 3;
  const MAX_EXCERPT_LENGTH = 120;
  const labels = doc?.content?.metadata?.labels?.results || [];
  const lastUpdated = doc?.content?.version.when || "";
  const excerpt = doc?.excerpt || "";
  const truncatedExcerpt = excerpt.length > MAX_EXCERPT_LENGTH ? excerpt.substring(0, MAX_EXCERPT_LENGTH) + "..." : excerpt;
  doc.excerpt = truncatedExcerpt;

  return (
    <tr id={`doc-${doc.content.id}`} className="row-doc" key={doc.content.id}>
      <td style={{ lineHeight: 1 }} className="col-title">{doc.content.title}<br/><br/><small style={{ opacity: 0.5 }}>Last Updated:<br/>{new Date(lastUpdated).toLocaleString()}</small></td>
      <td className="col-excerpt">{truncatedExcerpt}</td>
      <td className="col-labels">
        <ul className="tags">
          {labels && labels.slice(0, MAX_LABELS).map((label) => (
            <li className="tag" key={label.id}>{label.name}</li>
          ))}
          { labels.length > MAX_LABELS && (
            <li>+{labels.length - MAX_LABELS} more</li>
          )}
        </ul>
      </td>
      <td className="col-actions">
        <button onClick={() => handleAddTag(doc.id, "example-tag")}><TbTagsFilled /></button>
      </td>
    </tr>
  );
}