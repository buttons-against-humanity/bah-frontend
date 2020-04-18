import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

class AlertConfirm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { input: '' };
    this.inputRef = React.createRef();
  }
  render() {
    const { title, message, onOk, onCancel, inputtype, size, placeholder, closeOnOutClick } = this.props;
    let dialogSize = size || 'sm';
    return (
      <div className="ak-confirm-alert">
        <div
          className="modal fade show"
          style={{ display: 'block', zIndex: 10005 }}
          onClick={e => {
            if (closeOnOutClick) {
              this.unrender(onCancel || onOk);
            }
          }}
        >
          <div className={'modal-dialog modal-dialog-centered modal-' + dialogSize} role="document">
            <div className="modal-content " onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h5 className="modal-title">{title}</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={e => this.unrender(onCancel || onOk)}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {message}
                {inputtype && (
                  <div className="my-3">
                    <form
                      onSubmit={e => {
                        e.stopPropagation();
                        e.preventDefault();
                        this.unrender(onOk);
                      }}
                    >
                      <input
                        ref={this.inputRef}
                        className="form-control"
                        type={inputtype}
                        value={this.state.input}
                        placeholder={placeholder || ''}
                        onChange={e => this.setState({ input: e.target.value })}
                      />
                    </form>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {onCancel && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                    onClick={e => {
                      e.stopPropagation();
                      this.unrender(onCancel);
                    }}
                  >
                    CANCEL
                  </button>
                )}
                <button
                  autoFocus={true}
                  type="submit"
                  className="btn btn-primary"
                  onClick={e => {
                    e.stopPropagation();
                    this.unrender(onOk);
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop fade show" style={{ zIndex: 10001 }} />
      </div>
    );
  }

  componentDidMount() {
    const { inputtype, defaultValue } = this.props;
    if (inputtype) {
      this.inputRef.current.focus();
    }
    if (defaultValue) {
      this.setState({ input: defaultValue });
    }
  }

  unrender = next => {
    const { elementRootName, inputtype } = this.props;
    setImmediate(() => {
      if (next) {
        if (inputtype) {
          next(this.state.input);
        } else {
          next();
        }
      }
    });
    ReactDOM.unmountComponentAtNode(elementRootName);
  };
}

export const AKAlertConfirm = opts => {
  const { title, message, onOk, onCancel, inputtype, defaultValue, size, placeholder, closeOnOutClick } = opts;

  const elementRootName = document.createElement('div');
  document.body.appendChild(elementRootName);
  ReactDOM.render(
    <AlertConfirm
      title={title}
      message={message}
      onOk={onOk}
      onCancel={onCancel}
      inputtype={inputtype}
      defaultValue={defaultValue}
      elementRootName={elementRootName}
      size={size}
      placeholder={placeholder}
      closeOnOutClick={closeOnOutClick}
    />,
    elementRootName
  );
};

export const akAlert = (message, title, onOk) => {
  if (title) {
    if (typeof title === 'function') {
      onOk = title;
      title = 'ALERT';
    }
  } else {
    title = 'ALERT';
  }
  return AKAlertConfirm({ title, message, onOk });
};

export const akPrompt = opts => {
  const { message, onOk, onCancel, inputtype, title, size, defaultValue } = opts;
  return AKAlertConfirm({
    title: title || 'PROMPT',
    defaultValue,
    message,
    onOk,
    onCancel,
    size,
    inputtype: inputtype || 'text'
  });
};
