import { Box } from "@mui/material"

export default function EventCard(props) {

    const { title, bgColor, accentColor, textColor, background, footer, handleClick } = props

    return (
        <div
            className={`p-5 place-content-between rounded-2xl flex flex-col ${background}`}
            style={{
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'bottom right',
                boxShadow: '0px 5px 14px rgba(0, 0, 0, 0.1)',
                backgroundColor: bgColor,
                color: textColor || 'inherit'
            }}
            onClick={handleClick}
        >
            <Box className="flex mb-5">
                    <span style={{
                        flex: '1 0 100%',
                        background: accentColor,
                        maxWidth: '0.25em',
                        borderRadius: '14px',
                    }}/>

                <div className='ml-4'>
                    {title}
                    {/* <h1 className="text-3xl">
                            {event.title}
                        </h1>

                        <h1 className="text-md align-middle">
                            @{event.company}
                        </h1> */}
                </div>
            </Box>
            <Box className="mr-3 self-end mt-5 bg-url">
                <div className="ml-5 mt-1">
                    {footer}
                    {/* <h1 className="text-md">
                            {new Date(event.date * 1000).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </h1>
                        <h1 className='text-md flex items-center flex-wrap'>
                            <QueryBuilder />
                            <span>{new Date(event.date * 1000).toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })}</span>
                        </h1> */}
                </div>
            </Box>
        </div>
    )
}
