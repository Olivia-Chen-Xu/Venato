export default function PageTitle(props) {

    return (
        <div className="w-full bg-white h-[5vh] px-8">
            {typeof props.children === 'string' ? <h1 className='text-neutral-800 text-3xl'>{props.children}</h1>: props.children}
        </div>
    )
}