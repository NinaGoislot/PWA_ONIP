import React from "react";

function ClearCacheButton() {
  function handleClick() {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
      });
    });
  }

  return <button onClick={handleClick}>Clear Cache</button>;
}

export default ClearCacheButton;
