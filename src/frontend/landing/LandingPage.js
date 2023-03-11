import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Box } from '@mui/system';
import track from '../../images/landing/track.png';
import logo from '../../images/logo.png'
import whiteLogo from '../../images/logo_white.png'
import discover from '../../images/landing/discover.png';
import prepare from '../../images/landing/prepare.png';

export default function LandingPage() {

    const navigate = useNavigate();

    return (
        <div id="flex flex-col w-full gap-3">
            <header className="flex w-full shadow-xl p-4">
                <div className='flex w-full'>
                    <img src={logo} className="object-contain object-left h-[5vh]"/>
                    <span className='ml-auto flex justify-center align-items-center'>
                        <Button onClick={() => navigate('/welcome')} color="neutral" variant='contained'>
                            Sign In
                        </Button>
                    </span>
                </div>
            </header>

            <Box className="w-full flex flex-col gap-20 mt-20">

                <Box className='flex justify-center w-full'>
                    <div className="blob-header flex flex-col text-white bg-purple p-10 md:[w-75%]">
                        <img src={whiteLogo} className="flex md:h-[15vh] md:object-cover self-center"/>
                        <span className='flex self-center text-center'>Everything you need to secure a job.</span>
                    </div>
                </Box>

                <Box className='flex md:flex-row flex-col justify-center w-full gap-3'>
                    <span className='flex self-center mx-10 md:mx-40 font-extrabold text-4xl'>
                        Track your applications.
                    </span>
                    <img src={track} className="self-center"/>
                </Box>
                <Box className='flex md:flex-row flex-col justify-center w-full gap-3'>
                    <span className='flex self-center mx-10 md:mx-40 font-extrabold text-4xl md:order-2'>Discover new jobs.</span>
                    <img src={discover} className="flex self-center md:order-1" />
                </Box>
                <Box className='flex md:flex-row flex-col justify-center w-full gap-3'>
                    <span className='self-center mx-10 md:mx-40 font-extrabold text-4xl'>Prepare for your interviews.</span>
                    <img src={prepare} className="self-center" />
                </Box>
            </Box>
        </div>
    )
}