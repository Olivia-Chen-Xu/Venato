import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAsync } from 'react-async-hook';

const SearchBar = () => {
    const [company, setCompany] = useState('');
    const [position, setPosition] = useState('');
    const [location, setLocation] = useState('');

    const companies = useAsync(httpsCallable(getFunctions(), 'getAllCompanies'), []);
    const locations = useAsync(httpsCallable(getFunctions(), 'getAllLocations'), []);

    const handleSearch = async () => {
        const result = httpsCallable(getFunctions(), 'jobSearch');
        console.log(JSON.stringify(await result({ company, position, location }), null, 4));
    };

    return (
        <div>
            {(companies.error || locations.error || companies.loading || locations.loading) && (
                <div>Loading...</div>
            )}
            {companies.result && locations.result && (
                <div>
                    <label htmlFor="company">
                        Company:
                        <select name="company" onChange={(e) => setCompany(e.target.value)}>
                            {companies.result.data.map((c) => (
                                <option value={c}>{c}</option>
                            ))}
                        </select>
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
            )}
        </div>
    );
};

export default SearchBar;
