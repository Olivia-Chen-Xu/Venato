import AppRoutes from '../routes';

const Profile = () => {
return(
    <>
        <div>
            <text className="TopText">Venato profile</text>
            {buttons.signout}
            {buttons.deleteAccount}
            {errMsg}
        </div>
        <AppRoutes />
    </>
)
}

export default Profile;
