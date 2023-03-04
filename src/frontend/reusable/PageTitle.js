export default function PageTitle(props) {

    return (
        <div className="z-10 block w-full background bg-white pb-5 px-8 mb-8">
            {typeof props.children === 'string' ? <h1 className='text-neutral-800 text-3xl'>{props.children}</h1>: props.children}
        </div>
    )
}