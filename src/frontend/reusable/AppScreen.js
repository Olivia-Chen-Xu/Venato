import { Skeleton, CircularProgress } from "@mui/material"

export default function AppScreen(props) {

    // className only effects the second div
    const { isLoading, isEmpty, empty, title, children, margin, className, style, ...rest} = props

    const classes = `flex-1 overflow-auto py-3 pt-5 app-screen ${margin} ${className ? className : ''}`
    const styles = {

        ...style
    };

    return (
        <>
            <div className={`w-full bg-white pb-4 px-${margin} flex-[0_1_auto]`}
            >
                <div className={`${margin ? margin : 'mx-10'}`}>
                {isLoading  ? (<Skeleton animation="wave" sx={{ fontSize: '1.875rem', lineHeight: '2.25rem', width: '25%' }} />)
                            : (<h1 className='text-neutral-800 text-3xl'>{title}</h1>)}
                </div>
            </div>
            <div className={classes} style={styles} {...rest} >
                { isLoading  ? (<div className="flex justify-center items-center h-full"><CircularProgress /></div>) : (
                    <>
                        { children }
                        { isEmpty && <div className='flex justify-center content-center my-[7rem]'>{empty}</div> }
                    </>
                    )}
            </div>
        </>

    )
}