type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BottomCommentSheet = ({ isOpen, onClose, children }: BottomSheetProps) => {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${isOpen ? "visible opacity-100" : "invisible opacity-0"
        } transition-opacity duration-300`}
      onClick={onClose}
    >
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg transform ${isOpen ? "translate-y-0" : "translate-y-full"
          } transition-transform duration-300`}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: '40%',
          minHeight: '40%',
          overflowY: 'auto'
        }}
      >
        <div className='flex justify-end sticky top-0 px-4 bg-white h-10 border-b-[0.5px]'>
          <button
            type='button'
            onClick={onClose}
            className='flex items-center justify-center self-center border w-5 h-5 text-[10px] px-2 rounded-md hover:ring-1 hover:ring-offset-1 ring-black'
          >
            X
          </button>
        </div>

        <div>
          {children}
        </div>
      </div>
    </div>
  );
};


export default BottomCommentSheet