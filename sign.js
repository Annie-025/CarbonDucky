
let today = new Date().toISOString().split('T')[0]; // 例如 "2025-08-12"
let savedDate = localStorage.getItem("signInDate");

if (savedDate !== today) {
  // 如果保存的日期不是今天 → 重置
  signInData = { signedDays: [], totalDays: 0 };
  localStorage.setItem("signInData", JSON.stringify(signInData));
  localStorage.setItem("signInDate", today);
} else {
  // 否则读取现有数据
  signInData = JSON.parse(localStorage.getItem("signInData")) || { signedDays: [], totalDays: 0 };
}
// 渲染签到状态
function renderCheckin() {
  document.querySelectorAll(".checkin-item").forEach((item, index) => {
    let day = index + 1;
    if (signInData.signedDays.includes(day)) {
      item.classList.add("signed");
      item.classList.remove("missed");
      item.querySelector("span").innerText = "已签";
    } else if (!item.classList.contains("missed")) {
      item.querySelector("span").innerText = "签到";
    }
  });
  document.getElementById("days").innerText = signInData.totalDays;
}

// 签到
function signToday(day) {
  if (!signInData.signedDays.includes(day)) {
    signInData.signedDays.push(day);
    signInData.totalDays++;
    saveSignIn();
    renderCheckin();
  }
}

// 补签
function makeUp(day) {
  if (!signInData.signedDays.includes(day)) {
    signInData.signedDays.push(day);
    signInData.totalDays++;
    saveSignIn();
    renderCheckin();
  }
}

// 保存数据到 localStorage
function saveSignIn() {
  localStorage.setItem("signInData", JSON.stringify(signInData));
}

// 给每个签到格绑定点击事件
function bindEvents() {
  document.querySelectorAll(".checkin-item").forEach((item, index) => {
    let day = index + 1;
    item.addEventListener("click", () => {
      if (item.classList.contains("missed")) {
        makeUp(day);
      } else if (!item.classList.contains("signed")) {
        signToday(day);
      }
    });
  });
}

// 页面加载时绑定事件并渲染
document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  renderCheckin();
});

