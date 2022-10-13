import React from 'react';
import CreateEvent from './CreateEvent';
import SmallCalendar from './SmallCalendar';
import Labels from './Labels';

export default function sidebar() {
  return (
    <aside className="border p-5 w-64">
      <CreateEvent />
      <SmallCalendar />
      <Labels />
    </aside>
  );
}
