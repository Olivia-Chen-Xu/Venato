import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';

const SearchBar = () => {
    const [company, setCompany] = useState('');
    const [position, setPosition] = useState('');
    const [location, setLocation] = useState('');

    const handleSearch = async () => {
        const result = httpsCallable(getFunctions(), 'jobSearch');
        console.log(position.toLowerCase().split(' '));
        console.log(JSON.stringify(await result({ company, position, location }), null, 4));
    };

    return (
        <div>
            <label htmlFor="company">
                Company
                <input
                    type="email"
                    name="company"
                    value={company}
                    placeholder=""
                    onChange={(e) => {
                        setCompany(e.target.value);
                    }}
                />
            </label>

            <label htmlFor="position">
                Position
                <input
                    type="email"
                    name="email"
                    value={position}
                    placeholder=""
                    onChange={(e) => {
                        setPosition(e.target.value);
                    }}
                />
            </label>

            <label htmlFor="location">
                Location
                <input
                    type="email"
                    name="location"
                    value={location}
                    placeholder=""
                    onChange={(e) => {
                        setLocation(e.target.value);
                    }}
                />
            </label>

            <button type="submit" onClick={handleSearch}>
                Search
            </button>
        </div>
    )
}

export default SearchBar;
