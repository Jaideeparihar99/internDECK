import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import '../../styles/global.css';

export default function StudentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [interviews] = useState([
    { date: '2024-03-22', company: 'TCS', time: '10:00 AM' },
    { date: '2024-03-25', company: 'Google', time: '2:00 PM' },
    { date: '2024-03-28', company: 'Microsoft', time: '11:30 AM' },
  ]);

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDay = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const days = [];
  const total = daysInMonth(currentDate);
  const start = firstDay(currentDate);

  for (let i = 0; i < start; i++) {
    days.push(null);
  }

  for (let i = 1; i <= total; i++) {
    days.push(i);
  }

  const sidebarItems = [
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'My Profile', path: '/student/profile' },
    { label: 'Matches', path: '/student/matches' },
    { label: 'Browse', path: '/student/browse' },
    { label: 'Applications', path: '/student/applications' },
    { label: 'Calendar', path: '/student/calendar' },
    { label: 'Certificates', path: '/student/certificates' },
  ];

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <Sidebar items={sidebarItems} />
        <main className="dashboard-main">
          <h1>Interview Calendar</h1>

          <div className="calendar-grid">
            <div className="calendar">
              <div className="calendar-header">
                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
                  ← Previous
                </button>
                <h3>{monthName}</h3>
                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
                  Next →
                </button>
              </div>

              <div className="calendar-weekdays">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="weekday">
                    {day}
                  </div>
                ))}
              </div>

              <div className="calendar-days">
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={`calendar-day ${day ? 'active' : ''} ${
                      interviews.some(
                        (i) =>
                          day &&
                          i.date ===
                            `${currentDate.getFullYear()}-${String(
                              currentDate.getMonth() + 1
                            ).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                      )
                        ? 'has-interview'
                        : ''
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            <div className="upcoming-interviews">
              <h2>Upcoming Interviews</h2>
              {interviews.map((interview, index) => (
                <div key={index} className="interview-card">
                  <h4>{interview.company}</h4>
                  <p className="interview-date">{interview.date}</p>
                  <p className="interview-time">{interview.time}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
