const Loading = () => (
    <div className="absolute inset-y-0 left-0 z-10 right-0 flex justify-center items-center">
        <div className='bg-gray-800 p-4 rounded-lg flex flex-col justify-center items-center'>
            <div style={{ width: `35px`, height: `35px` }} className="animate-spin">
                <div className="h-full w-full border-4 border-t-blue-500 border-b-blue-700 rounded-[50%]" />
            </div>
            <div className='mt-3 text-white font-medium'>Loading...</div>
        </div>
    </div>
)

export default Loading