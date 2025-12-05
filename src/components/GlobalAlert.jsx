import { useAlert } from "../AlertContext";
import Alert from "./Alert";

export default function GlobalAlert() {
  const { alert, hideAlert } = useAlert();

  return (
    <Alert
      type={alert.type}
      message={alert.message}
      onClose={hideAlert}
      duration={alert.duration || 3000}
    />
  );
}
