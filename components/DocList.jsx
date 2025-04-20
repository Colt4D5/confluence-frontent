import DocListItem from "./DocListItem";

export default function DocList({ results, limit }) {
  const handleAddTag = async (docId, tag) => {
    try {
      await fetch(`/api/docs/${docId}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag, limit }),
      });
      alert("Tag added successfully");
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };

  const handleRemoveTag = async (docId, tag) => {
    try {
      await fetch(`/api/docs/${docId}/tags`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag }),
      });
      alert("Tag removed successfully");
    } catch (error) {
      console.error("Error removing tag:", error);
    }
  };

  return (
    <table id="doc-list">
      <thead>
        <tr>
          <th width="40%">Title</th>
          <th width="35%">Description</th>
          <th width="12%">Tags</th>
          <th width="5%">Actions</th>
        </tr>
      </thead>
      <tbody>
        {results.map((doc) => (
          <DocListItem key={doc.content.id} doc={doc} handleAddTag={handleAddTag} handleRemoveTag={handleRemoveTag} />
        ))}
      </tbody>
    </table>
  )
}