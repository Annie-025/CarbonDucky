let today = new Date().toISOString().split('T')[0];
let savedDate = localStorage.getItem("signInDate");
let signInData;

// 初始化数据
if (savedDate !== today) {
  signInData = { signedDays: [], totalDays: 0 };
  localStorage.setItem("signInData", JSON.stringify(signInData));
  localStorage.setItem("signInDate", today);
} else {
  signInData = JSON.parse(localStorage.getItem("signInData")) || { signedDays: [], totalDays: 0 };
}

// 辅助函数：获取YYYY-MM-DD格式的日期
function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 判断是否为过去日期
function isPastDate(day, currentDate) {
  const targetDate = new Date(currentDate);
  targetDate.setDate(day);
  return getDateString(targetDate) < getDateString(new Date());
}

function renderCheckin() {
  const currentDate = new Date();
  document.querySelectorAll(".checkin-item").forEach((item, index) => {
    const day = index + 1;
    const isSigned = signInData.signedDays.includes(day);
    const isPast = isPastDate(day, currentDate);

    // 重置所有状态
    item.classList.remove("signed", "missed");
    item.onclick = null;

    if (isSigned) {
      item.classList.add("signed");
      item.querySelector("span").innerText = "已签";
    } else if (isPast) {
      item.classList.add("missed");
      item.querySelector("span").innerText = "补签";
      item.onclick = () => makeUp(day);
    } else {
      item.querySelector("span").innerText = "签到";
      item.onclick = () => signToday(day);
    }
  });
  document.getElementById("days").innerText = signInData.totalDays;
}

function signToday(day) {
  if (!signInData.signedDays.includes(day)) {
    signInData.signedDays.push(day);
    signInData.totalDays++;
    saveSignIn();
    renderCheckin();
  }
}

function makeUp(day) {
  if (!signInData.signedDays.includes(day)) {
    signInData.signedDays.push(day);
    signInData.totalDays++;
    saveSignIn();
    renderCheckin();
  }
}

function saveSignIn() {
  localStorage.setItem("signInData", JSON.stringify(signInData));
}

document.addEventListener("DOMContentLoaded", renderCheckin);
