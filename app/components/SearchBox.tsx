interface SearchBoxProps {
  inputVal: string;
  labelName: string;
  setInput: (city: string) => void;
  onClear: () => void;
  onEnter: () => void;
}

export default function SearchBox({ inputVal, labelName, setInput, onClear, onEnter }: SearchBoxProps) {
  
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    //console.log("button--",event.key);
    if (event.key === 'Enter') {
      onEnter();
    }
  };
  
  return (
    <div className="relative mb-4">
      <input
        type="text"
        value={inputVal}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={`Enter ${labelName}`}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
      />
      {inputVal && (
        <button
          onClick={onClear}
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 text-3xl"
        >
          &times;
        </button>
      )}
    </div>
  );
}
