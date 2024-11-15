import React, { useState } from "react";

function MediaProgressBar({ isMediaUploading, progress }) {
  const [showProgress, setShowProgress] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  return <div>MediaProgressBar</div>;
}

export default MediaProgressBar;
