interface DiningOptionProps {
    label: string;
    selected: boolean;
    onClick: () => void;
}
export const DiningOption = ({ label, selected, onClick }: DiningOptionProps) => (
  <button
    onClick={onClick}
    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
      selected 
        ? 'border-orange-500 bg-orange-50' 
        : 'border-gray-200 hover:bg-gray-50'
    }`}
  >
    <span className={`text-sm font-medium ${selected ? 'text-orange-500' : 'text-gray-600'}`}>
      {label}
    </span>
  </button>
);