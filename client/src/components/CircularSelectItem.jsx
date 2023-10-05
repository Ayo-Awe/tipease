const CircularSelectItem = ({ isSelected, value, onSelect }) => {
  return (
    <div
      className={`rounded-full border h-8 w-8 md:h-10 md:w-10 font-bold mx-1 justify-center items-center inline-flex ${
        isSelected ? "bg-white text-black" : ""
      }`}
      onClick={() => onSelect()}
    >
      {value}
    </div>
  );
};

export default CircularSelectItem;
