type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const BottomSheet = ({ isOpen, onClose, children }: BottomSheetProps) => {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      } transition-opacity duration-300`}
      onClick={onClose}
    >
      <div
        className={`fixed bottom-0 left-0 right-0 bg-gray-100 rounded-t-xl shadow-lg transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } transition-transform duration-300`}
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxHeight: '90%', 
          minHeight: '90%', 
          overflowY: 'auto' 
        }} 
      >
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};


export default BottomSheet