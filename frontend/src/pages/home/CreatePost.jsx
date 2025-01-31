import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

const CreatePost = () => {
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);

    const imgRef = useRef(null);

    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    const data = {
        profileImg: "/avatars/boy1.png",
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsPending(true);
        // Simulating an API call
        try {
            setTimeout(() => {
                alert("Post created successfully");
                setIsPending(false);
                setText("");
                setImg(null);
            }, 2000);
        } catch (error) {
            setIsError(true);
            setIsPending(false);
        }
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
        <div className='flex p-4 items-start gap-4 border-b border-gray-700'>
            <div className='avatar'>
                <div className='w-8 h-8 rounded-full'>
                    <img src={data.profileImg || "/avatar-placeholder.png"} alt="Profile" />
                </div>
            </div>
            <form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
                <textarea
                    className='textarea bg-blue-100 w-full p-2 text-lg resize-none border-none focus:outline-none'
                    placeholder='What is happening?!'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                {img && (
                    <div className='relative w-full mx-auto'>
                        <IoCloseSharp
                            className='absolute top-0 right-0 text-white bg-blue-500 rounded-full w-5 h-5 cursor-pointer'
                            onClick={() => {
                                setImg(null);
                                imgRef.current.value = null;
                            }}
                        />
                        <img src={img} className='w-full mx-auto h-auto object-contain rounded' />
                    </div>
                )}

                <div className='flex justify-between items-center border-t py-2 border-gray-700'>
                    <div className='flex gap-2 items-center'>
                        <CiImageOn
                            className='text-blue-500 w-6 h-6 cursor-pointer'
                            onClick={() => imgRef.current.click()}
                        />
                        <BsEmojiSmileFill className='text-blue-500 w-5 h-5 cursor-pointer' />
                    </div>
                    <input type='file' hidden ref={imgRef} onChange={handleImgChange} />
                    <button className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-4 rounded-full'>
                        {isPending ? "Posting..." : "Post"}
                    </button>
                </div>
                {isError && <div className='text-red-500'>Something went wrong, please try again.</div>}
            </form>
        </div>
    );
};
export default CreatePost;
