import React, { useContext } from 'react';
import plusImg from '../../../../assets/icons/256x256.png';
import GlobalContext from '../context/GlobalContext';

export default function CreateEvent() {
    const { setShowEventModal } = useContext(GlobalContext);
    return (
        <button
            onClick={() => setShowEventModal(true)}
            className="border p-2 rounded-full flex items-center shadow-md hover:shadow-2xl"
        >
            <img src={plusImg} alt="Plus " className="w-7 h-7" />
            <span className="pl-3 pr-7">Create</span>
        </button>
    );
}
