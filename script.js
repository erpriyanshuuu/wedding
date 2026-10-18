document.documentElement.classList.add('js');

// EDITABLE WEDDING DETAILS
    const WEDDING_DATE = '2026-11-26';
    const CEREMONY_TIME = '19:00'; // 24-hour local time in Sahibabad (IST)
    const TIME_ZONE_OFFSET = '+05:30';
    const COUPLE_NAMES = 'Shweta & Ujjwal';
    const VENUE_NAME = 'Royal Ballroom, Zestin Banquets';
    const VENUE_ADDRESS = '14/2, Sahibabad Rd, Plot Alpha, Sahibabad Industrial Area Site 4, Sahibabad, Ghaziabad, Uttar Pradesh 201010';

    // The event date/time is interpreted in India Standard Time (UTC+05:30).
    const eventStart = new Date(`${WEDDING_DATE}T${CEREMONY_TIME}:00${TIME_ZONE_OFFSET}`);
    const eventEnd = new Date(eventStart.getTime() + 60 * 60 * 1000);
    const countdownLabels = { days: document.getElementById('days'), hours: document.getElementById('hours'), minutes: document.getElementById('minutes'), seconds: document.getElementById('seconds') };
    const countdownSection = document.getElementById('countdown-title');
    let countdownInterval;
    function updateCountdown() {
      const remaining = eventStart.getTime() - Date.now();
      if (remaining <= 0) {
        Object.values(countdownLabels).forEach(el => { el.textContent = '00'; });
        if (countdownSection) countdownSection.textContent = 'The Celebration Begins';
        if (countdownInterval) clearInterval(countdownInterval);
        return;
      }
      const totalSeconds = Math.floor(remaining / 1000);
      countdownLabels.days.textContent = String(Math.floor(totalSeconds / 86400)).padStart(2, '0');
      countdownLabels.hours.textContent = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, '0');
      countdownLabels.minutes.textContent = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      countdownLabels.seconds.textContent = String(totalSeconds % 60).padStart(2, '0');
    }
    updateCountdown();
    countdownInterval = window.setInterval(updateCountdown, 1000);

    // Download a standards-compliant iCalendar event; start/end are encoded in UTC.
    document.getElementById('calendar-button').addEventListener('click', () => {
      const toIcsUtc = date => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
      const escapeIcs = text => text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
      const stamp = toIcsUtc(new Date());
      const ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Shweta and Ujjwal//Wedding Invitation//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
        'BEGIN:VEVENT', `UID:shweta-ujjwal-${WEDDING_DATE}@wedding-invitation`, `DTSTAMP:${stamp}`,
        `DTSTART:${toIcsUtc(eventStart)}`, `DTEND:${toIcsUtc(eventEnd)}`,
        `SUMMARY:${escapeIcs(`${COUPLE_NAMES} — The Wedding Ceremony`)}`,
        `LOCATION:${escapeIcs(`${VENUE_NAME}, ${VENUE_ADDRESS}`)}`,
        `DESCRIPTION:${escapeIcs('Join us for an unforgettable celebration of love and the beginning of a beautiful forever.')}`,
        'END:VEVENT', 'END:VCALENDAR'
      ].join('\r\n') + '\r\n';
      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Shweta-and-Ujjwal-Wedding-Ceremony.ics';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    });

    // Accessible mobile navigation.
    const menuButton = document.querySelector('.menu-toggle');
    const navigation = document.getElementById('primary-navigation');
    function closeMenu() {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation menu');
      navigation.classList.remove('is-open');
    }
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
      navigation.classList.toggle('is-open', !isOpen);
    });
    navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    document.addEventListener('click', event => {
      if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });

    // Scroll reveal, with a graceful fallback for older browsers.
    const revealItems = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            currentObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealItems.forEach(item => observer.observe(item));
    } else {
      revealItems.forEach(item => item.classList.add('is-visible'));
    }
