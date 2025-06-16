import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const CreatePost = () => {
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  // Build headers with Authorization if token exists
  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const { mutate: createPost, isLoading: isPending, isError, error } = useMutation({
    mutationFn: async ({ text, img }) => {
      const res = await fetch(`${backend_url}/api/posts/create`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ text, img }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data;
    },
    onSuccess: () => {
      setText("");
      setImg(null);
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create post");
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
      reader.onload = () => setImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='flex p-4 items-start gap-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'>
      <div className='avatar'>
        <div className='w-10 h-10 rounded-full ring-2 ring-blue-200/50 dark:ring-blue-500/30 hover:ring-blue-400 transition-all duration-300'>
          <img
            src={authUser.profileImg || "/avatar-placeholder.png"}
            className='w-full h-full object-cover rounded-full hover:scale-105 transition-transform duration-300'
            alt="Profile"
          />
        </div>
      </div>

      <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit}>
        <textarea
          className='w-full p-3 text-base resize-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 
                              focus:outline-none border border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 transition-colors
                              rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/30 focus:bg-white dark:focus:bg-gray-800/50'
          placeholder='Share your cosmic thoughts... 🌌'
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
        />

        {img && (
          <div className='relative w-full max-w-2xl group'>
            <IoCloseSharp
              className='absolute top-2 right-2 text-gray-700 dark:text-gray-200 bg-gray-100/90 dark:bg-gray-900/90 rounded-full w-6 h-6 
                                     cursor-pointer hover:bg-red-500 hover:text-white transition-colors p-1 shadow-sm'
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              className='w-full h-96 object-cover rounded-xl border border-gray-200 dark:border-gray-700 
                                    group-hover:border-blue-500/30 transition-all duration-300'
              alt="Post preview"
            />
          </div>
        )}

        <div className='flex justify-between items-center pt-2'>
          <div className='flex gap-4 items-center'>
            <CiImageOn
              className='w-6 h-6 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-blue-500 
                                    transition-colors duration-300'
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill
              className='w-5 h-5 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-blue-500 
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
            className={`px-5 py-1.5 rounded-full font-medium text-white transition-all duration-300
                                  ${isPending ? 'bg-blue-400 dark:bg-blue-600/50 cursor-not-allowed' :
                'bg-blue-500 dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-600 hover:bg-blue-600 dark:hover:from-blue-500 dark:hover:to-indigo-500'}
                                  shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95`}
            disabled={isPending}
          >
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>

        {isError && (
          <div className='mt-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800/50'>
            {error.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
