const LoadingSpinner = () => {
	return (
		<div className="flex justify-center items-center space-x-2">
			<div className="w-8 h-8 border-4 border-t-4 border-gray-200 border-solid rounded-full animate-spin border-t-blue-500"></div>
			<span className="text-xl text-gray-700">
				Ładowanie...
			</span>
		</div>
	);
};

export default LoadingSpinner;
