import { useNavigate, useLocation } from 'react-router-dom';
import { AccountCircleOutlined, AutoAwesomeOutlined, CalendarMonthOutlined, ExpandMore, FolderZipOutlined, HomeOutlined, NotificationsOutlined, QuizOutlined, SearchOutlined } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { deleteAccount, signout } from "../auth/auth-functions";
import { auth } from "../../config/firebase";
import generateJobs from "../search/GenerateJobs";

const sidebarButtonOverrides = {
    justifyContent: 'left',
    color: '#333333',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '13px',
    lineHeight: '16px',
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap',
    padding: '1rem 1rem',
    textOverflow: 'clip'
}

export default function ReusableSideBar() {
    
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const [currentPage, setCurrentPage ] = useState('');
    let navigate = useNavigate();
    let location = useLocation();

    useEffect(() => {

        setCurrentPage(location.pathname)
    }, [location])

    const areHere = (page) => {

        if (typeof page === 'string') page = [page]
        return page.some(p => p === currentPage) ? 'active' : ''
    }

    const handleMenuOpen = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setAnchorEl(e.currentTarget)
    }

    const handleMenuClose = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setAnchorEl(null)
    }

    const handleSignOut = async (e) => {
        const signoutResult = signout();
        if (typeof signoutResult === "string") {
            setErrMsg(signoutResult);
            return;
        }
        signoutResult
            .then(() => {
                console.log(`Successfully signed out`);
                navigate("/");
            })
            .catch((err) => console.log(`Failed to sign out: ${JSON.stringify(err)}`));
    }

    const handleDeleteAccount = (e) => {
        if (auth.currentUser.email === "18rem8@queensu.ca") {
            handleSignOut(); // Don't delete the admin account
            return;
        }
        const deleteAccountResult = deleteAccount();
        if (typeof deleteAccountResult === "string") {
            setErrMsg(deleteAccountResult);
            return;
        }

        deleteAccountResult
            .then(() => {
                console.log(`Current user successfully deleted`);
                navigate("/");
            })
            .catch((error) => console.log(`Error deleting current user: ${JSON.stringify(error)}`));
    }

    const handleGenerateJobs = (e) => {
        generateJobs(40)
    }

    return (
        <>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                <MenuItem onClick={handleDeleteAccount}>Delete Account!</MenuItem>
                <MenuItem onClick={handleGenerateJobs}>Generate Jobs</MenuItem>
            </Menu>
            <aside
                className="min-w-[15rem]"
                style={{
                    boxShadow: '0px 5px 14px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #E0E0E0',
                    background: 'white',
                }}
            >
                <div className='flex px-3 py-6'>
                    <span>
                        <button onClick={handleMenuOpen}>
                            <AccountCircleOutlined></AccountCircleOutlined>
                            <ExpandMore fontSize="small"></ExpandMore>
                        </button>
                    </span>
                    <span className='ml-auto'>
                        <button>
                            <NotificationsOutlined></NotificationsOutlined>
                        </button>
                    </span>
                </div>
                <div className="mt-10 px-3 py-6 grid grid-rows-5 bg-white">

                    <Button className={areHere('/home')} onClick={() => navigate('/home')} sx={sidebarButtonOverrides} startIcon={<HomeOutlined />}>
                        Home
                    </Button>

                    <Button className={areHere(['/kanban', '/chooseKanban'])} onClick={() => { navigate('/chooseKanban') }} sx={sidebarButtonOverrides} startIcon={<FolderZipOutlined/>}>
                        Job Boards
                    </Button>

                    <Button className={areHere('/calendar')} onClick={() => { navigate('/calendar') }} sx={sidebarButtonOverrides} startIcon={<CalendarMonthOutlined />}>
                        Calendar
                    </Button>
                    <Button className={areHere('/job')} onClick={() => { navigate('/job') }} sx={sidebarButtonOverrides} startIcon={<SearchOutlined />}>
                        Job Search
                    </Button>
                    <Button className={areHere('/questions')} onClick={() => { navigate('/questions') }} sx={sidebarButtonOverrides} startIcon={<QuizOutlined />}>
                        Interview Questions
                    </Button>
                    <Button
                        className='mt-10 p-3 justify-center items-center'
                        style={{
                            border: '2px solid #7F5BEB',
                            borderRadius: '8px',
                            marginTop: '3rem'
                        }}
                        sx={{
                            ...sidebarButtonOverrides,
                            justifyContent: 'center'
                        }}
                        startIcon={<AutoAwesomeOutlined />}
                    >
                        Upgrade
                    </Button>
                </div>
            </aside>
        </>
    );
}
