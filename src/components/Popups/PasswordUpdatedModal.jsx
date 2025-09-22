export default function PasswordUpdatedModal({ onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[400px] text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Password Updated!
        </h2>
        <p className="text-gray-600 mb-6">
          Your password has been changed successfully.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => onClose("signin")}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            Go to Sign In
          </button>
          <button
            onClick={() => onClose("home")}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
