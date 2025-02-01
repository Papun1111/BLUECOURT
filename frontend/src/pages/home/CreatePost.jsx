import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const imgRef = useRef(null);

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();

	const {
		mutate: createPost,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async ({ text, img }) => {
			try {
				const res = await fetch("/api/posts/create", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text, img }),
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},

		onSuccess: () => {
			setText("");
			setImg(null);
			toast.success("Post created successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		createPost({ text, img });
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
        <div className='flex p-6 items-start gap-4 border-b border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800'>
            <div className='avatar'>
                <div className='w-10 rounded-full ring-2 ring-blue-500/50 hover:ring-blue-400 transition-all duration-300'>
                    <img 
                        src={authUser.profileImg || "/avatar-placeholder.png"} 
                        className='hover:scale-105 transition-transform duration-300'
                    />
                </div>
            </div>
            
            <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit}>
                <textarea
                    className='w-full p-2 text-lg resize-none bg-transparent text-slate-100 placeholder-slate-400 
                              focus:outline-none border-b border-slate-700 focus:border-blue-500 transition-colors
                              rounded-lg hover:bg-slate-800/30 focus:bg-slate-800/50'
                    placeholder='What cosmic wonders are you pondering? 🌌'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                
                {img && (
                    <div className='relative w-full max-w-2xl group'>
                        <IoCloseSharp
                            className='absolute -top-3 -right-3 text-slate-100 bg-slate-900/90 rounded-full w-6 h-6 
                                     cursor-pointer hover:bg-blue-600 transition-colors p-1 shadow-lg'
                            onClick={() => {
                                setImg(null);
                                imgRef.current.value = null;
                            }}
                        />
                        <img 
                            src={img} 
                            className='w-full h-96 object-cover rounded-xl border-2 border-slate-800/50 
                                    group-hover:border-blue-500/30 transition-all duration-300'
                        />
                    </div>
                )}

                <div className='flex justify-between items-center pt-4'>
                    <div className='flex gap-4 items-center'>
                        <CiImageOn
                            className='w-7 h-7 cursor-pointer text-slate-400 hover:text-blue-400 
                                    transition-colors duration-300'
                            onClick={() => imgRef.current.click()}
                        />
                        <BsEmojiSmileFill 
                            className='w-6 h-6 cursor-pointer text-slate-400 hover:text-blue-400 
                                    transition-colors duration-300'
                        />
                    </div>
                    
                    <input 
                        type='file' 
                        accept='image/*' 
                        hidden 
                        ref={imgRef} 
                        onChange={handleImgChange} 
                    />
                    
                    <button 
                        className={`px-6 py-2 rounded-full font-semibold text-slate-100 transition-all duration-300
                                  ${isPending ? 'bg-blue-600/50 cursor-not-allowed' : 
                                    'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500'}
                                  shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02]`}
                        disabled={isPending}
                    >
                        {isPending ? "Launching..." : "Post"}
                    </button>
                </div>
                
                {isError && (
                    <div className='mt-3 px-4 py-2 bg-red-900/30 text-red-300 rounded-lg border border-red-800/50'>
                        {error.message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default CreatePost;