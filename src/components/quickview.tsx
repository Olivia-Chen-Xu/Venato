import icon from '../../assets/icon.svg';

export const QuickViewUI = () => {
    return (
        <div>
            <div className="Logo">
                <img width="100" height="100" alt="icon" src={icon} />
            </div>
            <h1 className="Title">Job Title</h1>
            <h2 className="Company">Company</h2>
            <form>
                <fieldset>
                    <label>
                        <p>Name</p>
                        <input name="name" />
                    </label>
                </fieldset>
                <button type="submit">Submit</button>
            </form>
            <div className="Border">
                <h2
                    style={{
                        top: '300',
                        textAlign: 'center',
                        color: 'black',
                        fontWeight: '400',
                    }}
                >
                    Location
                </h2>
            </div>
            <div className="Deadline-Divider"></div>
            <div className="Deadline-Tabs">Upcoming Deadlines</div>
            <div id="next-deadline" className="Deadline-Tabs">
                Next Deadline
            </div>
            <button className="Edit">Edit</button>
            <button className="ViewCal" type="button">View Calendar</button>
        </div>
    );
};
