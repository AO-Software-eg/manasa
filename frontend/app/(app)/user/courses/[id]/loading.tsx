function Loading() {
    return (

        <div>
            <div className="w-full h-64 bg-gray-300 rounded-t-2xl animate-pulse mb-4" />
            <div className="p-6 md:p-8 space-y-6 bg-[#e6d3a3]/10 backdrop-blur-md rounded-b-2xl">
                <div className="h-8 bg-gray-300 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse" />
                <div className="h-12 bg-gray-300 rounded w-full animate-pulse" />
            </div>
        </div>

    )
}

export default Loading
