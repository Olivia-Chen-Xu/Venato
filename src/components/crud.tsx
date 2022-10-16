import icon from '../../assets/icon.svg';

export const QuickViewUI = () => {
    return (
        <div>
            <div className="Logo">
                <img width="200" alt="icon" src={icon} />
            </div>
            <h1>Job Title</h1>
            <div className="Hello">
                <a
                    href="https://electron-react-boilerplate.js.org/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <button type="button">
                        <span role="img" aria-label="books">
                            📚
                        </span>
                        Read our docs
                    </button>
                </a>
                <a
                    href="https://github.com/sponsors/electron-react-boilerplate"
                    target="_blank"
                    rel="noreferrer"
                >
                    <button type="button">
                        <span role="img" aria-label="folded hands">
                            🙏
                        </span>
                        Donate
                    </button>
                </a>
            </div>
        </div>
    );
};
