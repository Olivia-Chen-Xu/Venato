import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment/InputAdornment';
import { KeyboardArrowLeft, SearchOutlined } from '@mui/icons-material';

export default function ReusableHeader() {
    return (
        <header className='p-8 app-header' style={{ height: '15vh', background: 'white' }}>
            <nav className='flex flex-[1_0_100%]'>
                <span>{pathname}</span>
                <Button
                    startIcon={<KeyboardArrowLeft fontSize='large'/>}
                    disableElevation
                    onClick={() => nav('/chooseKanban')}
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
