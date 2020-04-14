import { useEffect } from 'react';

const useScript = (url, parentId) => {
  useEffect(() => {
    const wrapper = document.createElement('div');
    const script = document.createElement('script');

    script.src = url;
    script.async = true;

    const parent = parentId ? document.getElementById(parentId) : null;

    wrapper.appendChild(script);

    if (parentId) {
      parent.appendChild(wrapper);
    } else {
      document.body.appendChild(wrapper);
    }

    return () => {
      if (parentId) {
        parent.removeChild(wrapper);
      } else {
        document.body.removeChild(wrapper);
      }
    };
  }, [parentId, url]);
};

export default useScript;
