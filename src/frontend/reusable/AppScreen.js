import { Skeleton, CircularProgress } from "@mui/material"

export default function AppScreen(props) {

    const { isLoading, isEmpty, empty, title, children } = props

    return (
        <>
            <div className="w-full bg-white h-[5vh] px-8">
                {isLoading  ? (<Skeleton animation="wave" sx={{ fontSize: '1.875rem', lineHeight: '2.25rem', width: '25%' }} />)
                            : (<h1 className='text-neutral-800 text-3xl'>{title}</h1>)}
            </div>
            <div className="mt-5 h-[80vh] overflow-auto">
                {isLoading  ? (<div className="flex justify-center items-center h-full"><CircularProgress /></div>)
                    : isEmpty ? (<div className='flex justify-center content-center my-[7rem]'>{empty}</div>)
                            : children }
            </div>
        </>

    )
}