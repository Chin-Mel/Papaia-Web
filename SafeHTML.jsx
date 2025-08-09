import React from "react";
import DOMPurify from "dompurify";

const SafeHTML = ({ html }) => {
  const cleanHTML = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
};

export default SafeHTML;
