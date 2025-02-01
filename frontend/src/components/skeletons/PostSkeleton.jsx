const PostSkeleton = () => {
	return (
		<div className='bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg p-4 animate-pulse'>
			<div className='flex gap-3 items-center'>
				<div className='w-10 h-10 bg-gray-300 rounded-full'></div>
				<div className='flex-1 space-y-2'>
					<div className='h-4 bg-gray-300 rounded w-1/2'></div>
					<div className='h-3 bg-gray-300 rounded w-1/4'></div>
				</div>
			</div>
			<div className='mt-4 space-y-3'>
				<div className='h-4 bg-gray-300 rounded w-full'></div>
				<div className='h-4 bg-gray-300 rounded w-3/4'></div>
				<div className='h-4 bg-gray-300 rounded w-1/2'></div>
			</div>
		</div>
	);
};
export default PostSkeleton;