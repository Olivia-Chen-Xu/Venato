import icon from '../../assets/icon.svg';

export const QuickViewUI = () => {
    return (
        <div>
            <div className="Logo">
                <img width="100" height="100" alt="icon" src={icon} />
            </div>
            <h1 className="Title">Job Title</h1>
            <h2 className="Company">Company</h2>
            <div className="Border">
                <h2 style={{top: "200", textAlign: "center", color: "black", fontWeight: '400'}}>Location</h2>
            </div>
            <div className="Deadline-Divider"></div>
            <button className="Edit">Edit</button>
            <div className="Hello">
                <a href="https://electron-react-boilerplate.js.org/" target="_blank" rel="noreferrer"></a>
                <a href="https://github.com/sponsors/electron-react-boilerplate" target="_blank" rel="noreferrer">
                    <button className="ViewCal" type="button">
                        View Calendar
                    </button>
                </a>
            </div>
        </div>
    );
};
