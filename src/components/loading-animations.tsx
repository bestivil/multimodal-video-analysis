export const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-t-gray-500 border-b-gray-300 border-l-transparent border-r-transparent animate-spin" />
      </div>
    </div>
  );
};
