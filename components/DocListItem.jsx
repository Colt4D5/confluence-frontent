import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { TbTagsFilled } from "react-icons/tb";

export default function DocListItem({ doc, handleAddTag, handleRemoveTag }) {
  const MAX_LABELS = 3;
  const MAX_EXCERPT_LENGTH = 120;
  const MAX_TITLE_LENGTH = 50;
  const labels = doc?.content?.metadata?.labels?.results || [];
  const lastUpdated = doc?.content?.version.when || "";
  const excerpt = doc?.excerpt || "";
  const truncatedExcerpt = excerpt.length > MAX_EXCERPT_LENGTH ? excerpt.substring(0, MAX_EXCERPT_LENGTH) + "..." : excerpt;
  const truncatedTitle = doc.content.title.length > MAX_TITLE_LENGTH ? doc.content.title.substring(0, MAX_TITLE_LENGTH) + "..." : doc.content.title;


  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    // onClose(selectedValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <tr id={`doc-${doc.content.id}`} className="row-doc" key={doc.content.id}>
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
              
              <Dialog onClose={handleClose} open={open}>
                <DialogTitle style={{ lineHeight: 1, borderBottom: '1px solid #ffffff11' }}>Tag List<br/><small style={{ opacity: 0.5 }}>{truncatedTitle}</small></DialogTitle>
                <div style={{ padding: '1rem 1.5rem 0.5rem' }}>
                  <ul className="list-style-none">
                    {labels.map((label) => (
                      <li key={label.id}>
                        <span className="tag">{label.name}</span>
                        <button className="outline" style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }} onClick={() => handleRemoveTag(doc.id, label.name)}>Remove</button>
                      </li>
                    ))}
                  </ul>
                </div>
                <button onClick={handleClose}>Close</button>
              </Dialog>
            </li>
          )}
        </ul>
      </td>
      <td className="col-actions">
        <button onClick={() => handleAddTag(doc.id, "example-tag")}><TbTagsFilled /></button>
      </td>
    </tr>
  );
}