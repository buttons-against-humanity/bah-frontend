import React from 'react';
import ReactDOM from 'react-dom';

let tout;

const AKToast = (message, autohide, error = false) => {
  const elementRootName = document.createElement('div');
  document.body.appendChild(elementRootName);

  const unrender = () => {
    if (tout) {
      clearTimeout(tout);
    }
    ReactDOM.unmountComponentAtNode(elementRootName);
    elementRootName.remove();
  };
  const toast = (
    <div className="x-toast-wrapper" style={{ position: 'fixed', top: 10, right: 10, zIndex: 9999 }}>
      <div className="x-toast m-2" style={{ opacity: 1 }}>
        <div className={'alert p-4 alert-' + (error ? 'danger' : 'info')}>{message}</div>
      </div>
    </div>
  );
  ReactDOM.render(toast, elementRootName);
  tout = setTimeout(unrender, autohide || 2000);
};

export const akToast = (message, autohide, error) => {
  AKToast(message, autohide, error);
};
