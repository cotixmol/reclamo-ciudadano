'use client';

import { useEffect } from 'react';

const PreloadMapSelector = () => {
  useEffect(() => {
    import('./MapSelector');
  }, []);

  return null;
};

export default PreloadMapSelector;
