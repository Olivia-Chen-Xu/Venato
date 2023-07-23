import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment/InputAdornment';
import { KeyboardArrowLeft, SearchOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function ReusableHeader() {

    const navigate = useNavigate();

    return (
        <header className='p-8 bg-white'
                style={{ minHeight: '7rem', maxHeight: '20rem', background: 'white' }}>
            <nav className='flex flex-[1_0_100%]'>
                <Button
                    startIcon={<KeyboardArrowLeft fontSize='large'/>}
                    disableElevation
                    onClick={() => navigate(-1)}
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
                                <SearchOutlined/>
                            </InputAdornment>
                        )
                    }}
                />
            </nav>
        </header>
    );
}
