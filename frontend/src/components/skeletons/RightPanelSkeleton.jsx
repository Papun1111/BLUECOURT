const RightPanelSkeleton = () => {
	return (
		<div className='flex flex-col gap-2 w-52 my-2 animate-pulse'>
			<div className='flex gap-2 items-center'>
				<div className='bg-blue-200 w-8 h-8 rounded-full shrink-0'></div>
				<div className='flex flex-1 justify-between'>
					<div className='flex flex-col gap-1'>
						<div className='bg-blue-200 h-2 w-12 rounded-full'></div>
						<div className='bg-blue-200 h-2 w-16 rounded-full'></div>
					</div>
					<div className='bg-blue-200 h-6 w-14 rounded-full'></div>
				</div>
			</div>
		</div>
	);
};
export default RightPanelSkeleton;
