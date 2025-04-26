import DocListItem from "./DocListItem";

export default function DocList({ results, isLoading }) {

  return (
    <table id="doc-list" className={`${isLoading ? "loading" : ""}`}>
      <thead>
        <tr>
          <th width="4%"></th>
          <th width="44%">Title</th>
          <th width="29%">Description</th>
          <th width="18%">Tags</th>
          <th width="5%">Actions</th>
        </tr>
      </thead>
      <tbody>
        {results.map((doc) => (
          <DocListItem key={doc.content.id} doc={doc} />
        ))}
      </tbody>
    </table>
  )
}