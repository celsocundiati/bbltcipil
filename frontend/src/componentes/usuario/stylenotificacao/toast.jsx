import { useEffect } from "react";
import {
  HiCheckCircle,
  HiXCircle,
  HiInformationCircle,
} from "react-icons/hi2";

function Toast({
  message,
  type = "success",
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      icon: HiCheckCircle,
      className:
        "fixed top-5 right-5 z-50 w-[320px] rounded-lg border border-green-500/30 bg-green-50 text-green-700 shadow-sm",
    },
    error: {
      icon: HiXCircle,
      className:
        "fixed top-5 right-5 z-50 w-[320px] rounded-lg border border-red-500/30 bg-red-50 text-red-700 shadow-sm",
    },
    info: {
      icon: HiInformationCircle,
      className:
        "fixed top-5 right-5 z-50 w-[320px] rounded-lg border border-blue-500/30 bg-blue-50 text-blue-700 shadow-sm",
    },
  };

  const config = styles[type] || styles.success;
  const Icon = config.icon;

  return (
    <div className={config.className}>
      <div className="grid grid-cols-[auto_1fr] gap-3 items-start px-4 py-3 text-sm overflow-hidden">
        <Icon className="w-5 h-5 mt-0.5" />

        <span className="leading-relaxed">
          {message}
        </span>
      </div>
    </div>
  );
}

export default Toast;





