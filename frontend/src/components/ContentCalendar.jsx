import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ContentCalendar() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const token = localStorage.getItem('token');
  const API_URL =
    process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(`${API_URL}/schedules`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSchedules(response.data);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [API_URL, token]);

  if (loading) {
    return <div className="spinner"></div>;
  }

  const getDaysInMonth = (date) => {
    return new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    ).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);

  const days = [];

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Actual days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getSchedulesForDate = (day) => {
    if (!day) return [];

    const dateStr = `${currentMonth.getFullYear()}-${String(
      currentMonth.getMonth() + 1
    ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    return schedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.scheduledTime);

      if (isNaN(scheduleDate.getTime())) {
        return false;
      }

      return (
        scheduleDate.toISOString().split('T')[0] === dateStr
      );
    });
  };

  const isToday = (day) => {
    if (!day) return false;

    const today = new Date();

    return (
      today.getFullYear() === currentMonth.getFullYear() &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getDate() === day
    );
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1
      )
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      )
    );
  };

  return (
    <div className="content-calendar-page">

      {/* PAGE TITLE */}
      <div className="calendar-page-header">
        <div>
          <h1 className="card-title">Content Calendar</h1>
          <p className="calendar-subtitle">
            Plan and manage your upcoming content
          </p>
        </div>
      </div>

      {/* CALENDAR CARD */}
      <div className="calendar-card">

        {/* CALENDAR TOP BAR */}
        <div className="calendar-topbar">

          <button
            className="calendar-nav-btn"
            onClick={goToPreviousMonth}
          >
            ← Previous
          </button>

          <div className="calendar-month-title">
            {currentMonth.toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </div>

          <button
            className="calendar-nav-btn"
            onClick={goToNextMonth}
          >
            Next →
          </button>

        </div>

        {/* WEEK DAYS */}
        <div className="calendar-weekdays">
          {[
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat',
          ].map((day) => (
            <div
              key={day}
              className="calendar-weekday"
            >
              {day}
            </div>
          ))}
        </div>

        {/* CALENDAR GRID */}
        <div className="calendar-grid">

          {days.map((day, index) => {

            const daySchedules = getSchedulesForDate(day);

            return (
              <div
                key={index}
                className={`
                  calendar-day
                  ${!day ? 'calendar-empty' : ''}
                  ${isToday(day) ? 'calendar-today' : ''}
                  ${daySchedules.length > 0 ? 'has-schedules' : ''}
                `}
              >

                {day && (
                  <>
                    {/* DATE NUMBER */}
                    <div className="calendar-day-number">
                      {day}

                      {isToday(day) && (
                        <span className="today-label">
                          Today
                        </span>
                      )}
                    </div>

                    {/* SCHEDULES */}
                    <div className="calendar-events">

                      {daySchedules.map((schedule) => (
                        <div
                          key={schedule._id}
                          className="calendar-event"
                          title={`${schedule.platform}${
                            schedule.notes
                              ? ` - ${schedule.notes}`
                              : ''
                          }`}
                        >
                          <span className="event-dot"></span>

                          <span className="event-platform">
                            {schedule.platform}
                          </span>
                        </div>
                      ))}

                    </div>
                  </>
                )}

              </div>
            );
          })}

        </div>
      </div>

      {/* UPCOMING SCHEDULES */}
      <div className="card upcoming-schedules-card">

        <div className="upcoming-header">
          <div>
            <h2 className="card-title">
              Upcoming Schedules
            </h2>

            <p className="calendar-subtitle">
              Your next scheduled content
            </p>
          </div>
        </div>

        <div className="table-responsive">

          <table>

            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Platform</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>

            <tbody>

              {schedules
                .filter(
                  (schedule) =>
                    new Date(schedule.scheduledTime) > new Date()
                )
                .sort(
                  (a, b) =>
                    new Date(a.scheduledTime) -
                    new Date(b.scheduledTime)
                )
                .map((schedule) => (

                  <tr key={schedule._id}>

                    <td>
                      {new Date(
                        schedule.scheduledTime
                      ).toLocaleString()}
                    </td>

                    <td>
                      <span className="platform-badge">
                        {schedule.platform}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge badge-${schedule.status}`}
                      >
                        {schedule.status}
                      </span>
                    </td>

                    <td>
                      {schedule.notes || '—'}
                    </td>

                  </tr>

                ))}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}

export default ContentCalendar;