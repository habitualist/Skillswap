// components/Toast/index.jsx
import './styles.css';

const icons = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
};

const Toast = ({ toasts, removeToast }) => {
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type}`}
          onClick={() => removeToast(toast.id)}
        >
          <span className="toast-icon">{icons[toast.type]}</span>
          <span className="toast-message">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Toast;