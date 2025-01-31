const LoadingSpinner = ({ size = 'md' }) => {
	// Define a mapping from size prop to Tailwind width and height classes
	const sizeClasses = {
	  sm: 'w-4 h-4',
	  md: 'w-6 h-6',
	  lg: 'w-8 h-8',
	  xl: 'w-12 h-12'
	};
  
	// Default to medium size if the provided size key doesn't exist
	const spinnerClass = sizeClasses[size] || sizeClasses.md;
  
	return (
	  <div className={`border-t-transparent rounded-full animate-spin ${spinnerClass} border-4 border-gray-400`}></div>
	);
  };
  
  export default LoadingSpinner;
  