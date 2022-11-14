import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAsync } from 'react-async-hook';

const SearchBar = () => {
    const [company, setCompany] = useState<string>('');
    const [position, setPosition] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [jobs, setJobs] = useState<object[]>([]);
    const [isJobSearch, setIsJobSearch] = useState<boolean>(true);

    const companies = useAsync(httpsCallable(getFunctions(), 'getAllCompanies'), []);
    const locations = useAsync(httpsCallable(getFunctions(), 'getAllLocations'), []);

    const handleSearch = async () => {
        const result = await httpsCallable(
            getFunctions(),
            'jobSearch'
        )({ company, position, location });

        setJobs(result.data);
    };

    const handleSwapSearchType = () => {
        setIsJobSearch(!isJobSearch);
    };

    return (
        <div>
            {(companies.error || locations.error || companies.loading || locations.loading) && (
                <div>Loading...</div>
            )}
            {companies.result && locations.result && (
                <div>
                    <br />
                    {isJobSearch ? 'Job search' : 'Interview question search'}
                    <br />
                    <button type="submit" onClick={handleSwapSearchType}>
                        Switch to {isJobSearch ? 'Interview question search' : 'Job search'}
                    </button>

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

                    <label htmlFor="company">
                        Company:
                        <select name="company" onChange={(e) => setCompany(e.target.value)}>
                            <option />
                            {companies.result.data.map((c) => (
                                <option value={c}>{c}</option>
                            ))}
                        </select>
                    </label>

                    {isJobSearch && (
                        <label htmlFor="location">
                            Location:
                            <select name="location" onChange={(e) => setLocation(e.target.value)}>
                                <option />
                                {locations.result.data.map((c) => (
                                    <option value={c}>{c}</option>
                                ))}
                            </select>
                        </label>
                    )}

                    <button type="submit" onClick={handleSearch}>
                        Search
                    </button>
                    <br />

                    {isJobSearch
                        ? jobs.map((job: object, index: number) => {
                              return (
                                  <div>
                                      <h4>{`Job #${index + 1}:`}</h4>
                                      {`Company: ${job.company}`}
                                      <br />
                                      {`Position: ${job.position}`}
                                      <br />
                                      {`Location: ${job.location}`}
                                      <br />
                                      {`Description: ${job.details.description}`}
                                      <br />
                                      URL: <a href={job.details.url}>{job.details.url}</a>
                                      <br />
                                      Contacts:{' '}
                                      {job.contacts.map((contact) => (
                                          <div>
                                              <a href={contact}>{contact}</a>
                                              <br />
                                          </div>
                                      ))}
                                      <br />
                                      <br />
                                  </div>
                              );
                          })
                        : jobs.map((job: object, index: number) => {
                              return (
                                  <div>
                                      <h4>{`Job #${index + 1}:`}</h4>
                                      {`Company: ${job.company}`}
                                      <br />
                                      {`Position: ${job.position}`}
                                      <br />
                                      {`Description: ${job.details.description}`}
                                      <br />
                                      URL: <a href={job.details.url}>{job.details.url}</a>
                                      <br />
                                      Contacts:{' '}
                                      {job.contacts.map((contact) => (
                                          <div>
                                              <a href={contact}>{contact}</a>
                                              <br />
                                          </div>
                                      ))}
                                      <br />
                                      Interview questions:{' '}
                                      <ul>
                                          {
                                              job.interviewQuestions.map((question: string) => <li>{question}</li>)
                                          }
                                      </ul>
                                      <br />
                                      <br />
                                  </div>
                              );
                          })}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
