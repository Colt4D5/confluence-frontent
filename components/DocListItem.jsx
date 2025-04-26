import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { TbTagsFilled } from "react-icons/tb";
import { notify } from '@/lib/utilities';

export default function DocListItem({ doc }) {
  const MAX_LABELS = 3;
  const MAX_EXCERPT_LENGTH = 120;
  const MAX_TITLE_LENGTH = 50;
  const [labels, setLabels] = useState(doc?.content?.metadata?.labels?.results || []);
  const lastUpdated = doc?.content?.version.when || "";
  const excerpt = doc?.excerpt || "";
  const truncatedExcerpt = excerpt.length > MAX_EXCERPT_LENGTH ? excerpt.substring(0, MAX_EXCERPT_LENGTH) + "..." : excerpt;
  const truncatedTitle = doc.content.title.length > MAX_TITLE_LENGTH ? doc.content.title.substring(0, MAX_TITLE_LENGTH) + "..." : doc.content.title;


  const [open, setOpen] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [newTags, setNewTags] = useState("");

  const handleClose = () => {
    setOpen(false);
    // onClose(selectedValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleAddTag = async (docId, tagList) => {
    const tags = tagList.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
    
    if (tags.length === 0) {
      alert("Please enter at least one tag.");
      return;
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN_ROOT}/${process.env.NEXT_PUBLIC_API_VERSION}/search/id/${docId}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags }),
      });
      // if successful then add these tags to the list
      const newLabels = tags.map(tag => ({ id: tag, name: tag }));
      setLabels([...labels, ...newLabels]);
      setNewTags(""); // Clear the input field
      setShowInput(false); // Hide the input field
      notify("Tag added successfully");
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };

  const handleRemoveTag = async (docId, tag) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN_ROOT}/${process.env.NEXT_PUBLIC_API_VERSION}/search/id/${docId}/tags`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag }),
      });
      // if successful then remove this tag from the list
      setLabels(labels.filter(label => label.name !== tag));
      notify("Tag removed successfully");
    } catch (error) {
      console.error("Error removing tag:", error);
    }
  };

  return (
    <tr id={`doc-${doc.content.id}`} className="row-doc" key={doc.content.id}>
      <td className="col-icon">
        <input className={`doc-${doc.content.id}`} type="checkbox" id={`doc-${doc.content.id}-checkbox`} />
      </td>
      <td style={{ lineHeight: 1 }} className="col-title">{doc.content.title}<br/><br/><small style={{ opacity: 0.5 }}>Last Updated:<br/>{new Date(lastUpdated).toLocaleString()}</small></td>
      <td className="col-excerpt">{truncatedExcerpt}</td>
      <td className="col-labels">
        <ul className="tags list-style-none">
          {labels && labels.slice(0, MAX_LABELS).map((label) => (
            <li className="tag" key={label.id}>{label.name}</li>
          ))}
          {/* {labels.length > MAX_LABELS && (
            <li>+{labels.length - MAX_LABELS} more</li>
          )} */}
          {labels.length > MAX_LABELS && (
            <li className="tag more-tags">
              <span onClick={handleClickOpen}>
                +{labels.length - MAX_LABELS} more
              </span>
            </li>
          )}
          <Dialog onClose={handleClose} open={open}>
            <DialogTitle style={{ lineHeight: 1, borderBottom: '1px solid #ffffff11' }}>Tag List<br/><small style={{ opacity: 0.5 }}>{truncatedTitle}</small></DialogTitle>
            <div style={{ padding: '1rem 1.5rem 0.5rem' }}>
              <ul className="list-style-none">
                {labels.map((label) => (
                  <li key={label.id}>
                    <span className="tag">{label.name}</span>
                    <button className="outline" style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }} onClick={() => handleRemoveTag(doc.content.id, label.name)}>Remove</button>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: '1rem' }}>
                <button className="outline" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }} onClick={() => setShowInput(!showInput)}>Add Tag</button>
                {showInput && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Enter tags separated by commas"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
                    />
                    <button
                      className="outline"
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                      onClick={() => {
                        handleAddTag(doc.content.id, newTags);
                        setNewTags("");
                        setShowInput(false);
                      }}
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button onClick={handleClose}>Close</button>
          </Dialog>
        </ul>
      </td>
      <td className="col-actions">
        <button onClick={handleClickOpen}><TbTagsFilled /></button>
      </td>
    </tr>
  );
}