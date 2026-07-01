type PopUpProps = {
  open: boolean;
  pending: boolean;
  done: boolean;
  title: string;
  description: string;
  confirmText: string;
  confirmClassName: string;
  onClose: () => void;
  onConfirm: () => void;
};

function PopUp({
  open,
  title,
  description,
  confirmText,
  confirmClassName,
  done,
  onClose,
  onConfirm,
  pending
}: PopUpProps) {
  return (
    <div
      className={`
        ${open ? 'flex' : 'hidden'}
        fixed inset-0
        bg-black/60
        backdrop-blur-sm
        items-center justify-center
        z-50
      `}
    >
      <div className="bg-[#111827] border border-gray-700 p-6 rounded-3xl shadow-xl w-[90%] max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-right">{title}</h2>

        <p className="mb-6 text-gray-300 text-right">{description}</p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-xl transition"
          >
            إلغاء
          </button>

          <button
            onClick={onConfirm}
            disabled={pending || done}
            className={`${confirmClassName} px-5 py-2 rounded-xl transition disabled:opacity-50 disabled:pointer-events-none`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopUp;