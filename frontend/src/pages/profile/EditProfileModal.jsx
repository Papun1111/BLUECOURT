import { useEffect, useState } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const EditProfileModal = ({ authUser }) => {
	const [formData, setFormData] = useState({
		fullName: "",
		username: "",
		email: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "",
	});

	const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		if (authUser) {
			setFormData({
				fullName: authUser.fullName,
				username: authUser.username,
				email: authUser.email,
				bio: authUser.bio,
				link: authUser.link,
				newPassword: "",
				currentPassword: "",
			});
		}
	}, [authUser]);

	return (
		<>
			<button
				className='btn btn-sm rounded-full border border-gray-600 hover:border-gray-500 bg-transparent text-gray-300 hover:bg-gray-800/50 transition-all'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg shadow-2xl shadow-gray-900/50'>
					<h3 className='text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6'>
						Update Profile
					</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault();
							updateProfile(formData);
						}}
					>
						<div className='flex flex-wrap gap-3'>
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								value={formData.fullName}
								name='fullName'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Username'
								className='flex-1 input bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								value={formData.username}
								name='username'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-3'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<textarea
								placeholder='Bio'
								className='flex-1 input bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-3'>
							<input
								type='password'
								placeholder='Current Password'
								className='flex-1 input bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='New Password'
								className='flex-1 input bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								value={formData.newPassword}
								name='newPassword'
								onChange={handleInputChange}
							/>
						</div>
						<input
							type='text'
							placeholder='Link'
							className='flex-1 input bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>
						<button 
							className='btn mt-4 bg-gradient-to-r from-blue-600 to-purple-600 border-none text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50'
							disabled={isUpdatingProfile}
						>
							{isUpdatingProfile ? (
								<span className='animate-pulse'>Updating...</span>
							) : 'Update Profile'}
						</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop bg-black/60 backdrop-blur-sm'>
					<button className='cursor-default'></button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;