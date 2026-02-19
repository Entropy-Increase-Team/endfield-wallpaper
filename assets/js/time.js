function updateClock() {
  const now = new Date();

  let hours = now.getHours();
  let minutes = now.getMinutes();

  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  let dayOfWeek = now.getDay();

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  const timeString = hours + ':' + minutes;
  const dateString = year + '/' + month + '/' + day + '\u00A0\u00A0\u00A0' + ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][dayOfWeek];

  document.getElementById('clock').innerText = timeString;
  document.getElementById('date').innerText = dateString;
}

setInterval(updateClock, 1000);
updateClock();