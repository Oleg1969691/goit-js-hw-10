'use strict';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const timerContainer = document.querySelector(".timer"); 
let countdownTimer;


timerContainer.style.display = "block";

const datePicker = flatpickr("#datetime-picker", {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const userSelectedDate = selectedDates[0];
    const currentDate = new Date();
    if (userSelectedDate < currentDate) {
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topRight"
      });
      document.querySelector("[data-start]").disabled = true;
    } else {
      document.querySelector("[data-start]").disabled = false;
    }
    clearInterval(countdownTimer);
  }
});

document.querySelector("[data-start]").addEventListener("click", () => {
  const selectedDate = datePicker.selectedDates[0];
  const currentDate = new Date();
  const timeDiff = selectedDate - currentDate;

  countdownTimer = setInterval(() => {
    const timeLeft = convertMs(selectedDate - new Date());
    updateTimer(timeLeft);
    if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
      clearInterval(countdownTimer);
    }
  }, 1000);

  document.querySelector("[data-start]").disabled = true;
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimer(time) {
  const daysEl = document.querySelector("[data-days]");
  const hoursEl = document.querySelector("[data-hours]");
  const minutesEl = document.querySelector("[data-minutes]");
  const secondsEl = document.querySelector("[data-seconds]");

  daysEl.textContent = addLeadingZero(time.days);
  hoursEl.textContent = addLeadingZero(time.hours);
  minutesEl.textContent = addLeadingZero(time.minutes);
  secondsEl.textContent = addLeadingZero(time.seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}
