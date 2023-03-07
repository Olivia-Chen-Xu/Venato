import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment/InputAdornment';
import { KeyboardArrowLeft, SearchOutlined } from '@mui/icons-material';
<<<<<<< HEAD

export default function ReusableHeader() {
    return (
        <header className='p-8 app-header' style={{ height: '15vh', background: 'white' }}>
            <nav className='flex flex-[1_0_100%]'>
                <span>{pathname}</span>
                <Button
                    startIcon={<KeyboardArrowLeft fontSize='large'/>}
                    disableElevation
                    onClick={() => nav('/chooseKanban')}
=======
import { useNavigate } from 'react-router-dom';

export default function ReusableHeader() {

    const navigate = useNavigate();

    return (
        <header className='p-8 app-header' style={{ height: '15vh', background: 'white' }}>
            <nav className='flex flex-[1_0_100%]'>
                <Button
                    startIcon={<KeyboardArrowLeft fontSize='large'/>}
                    disableElevation
                    onClick={() => navigate(-1)}
>>>>>>> 9313e2fa478e81b60b8c5f7c0a84964e025d3d2b
                    sx={{
                        color: '#757575',
                        paddingRight: '.7rem'
                    }}
                >
                    Back
                </Button>
                <TextField
                    placeholder='Search'
                    variant="outlined"
                    sx={{
                        marginLeft: 'auto',
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchOutlined />
                            </InputAdornment>
                        )
                    }}
                />
            </nav>
        </header>
    );
}
