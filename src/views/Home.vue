<template>
  <div class="home">
    <div class="header">
      <div class="date-display">
        <h2>日期</h2>
        <p>{{ today }}</p>
      </div>
      <div class="season-week">
        <h2>季度</h2>
        <p>第 {{ currentSeason }} 季</p>
      </div>
      <div class="season-week">
        <h2>週數</h2>
        <p>第 {{ currentWeek }} 周</p>
      </div>
    </div>
    <div class="bulletin-board">
      <h2>布告欄</h2>
      <p>最新公告...</p>
    </div>
    <div class="task-list">
      <h2>本周進度</h2>
      <ul>
        <li>進度 1</li>
        <li>進度 2</li>
      </ul>
    </div>
    <div class="info-section">
      <div class="resource-links">
        <h2>資源連結</h2>
        <ul>
          <li><a href="#" target="_blank">連結 1</a></li>
          <li><a href="#" target="_blank">連結 2</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    const currentWeek = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay()) / 7);
    return {
      today: today.toLocaleDateString(),
      currentSeason: Math.floor(today.getMonth() / 3) + 1,
      currentWeek: currentWeek,
    };
  },
};
</script>

<style>
.home {
  font-family: "Segoe UI", "Arial", sans-serif;
  color: #333;
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.date-display,
.season-week {
  flex: 1;
  background-color: #fff;
  padding: 20px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 0 10px;
}

.bulletin-board,
.task-list {
  background-color: #fff;
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.resource-links {
  background-color: #fff;
  padding: 20px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

ul {
  list-style-type: none;
  padding: 0;
}

.resource-links ul li a {
  display: block;
  padding: 10px;
  background-color: #ffecd1;
  margin: 5px 0;
  border-radius: 5px;
  text-decoration: none;
  color: #333;
}

.resource-links ul li a:hover {
  background-color: #ffdaa5;
}

h2 {
  color: #ff8c00;
  margin-bottom: 15px;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    margin-bottom: 0;
  }

  .header > div {
    margin: 10px 0;
    flex: none;
    width: 100%;
  }

  .info-section {
    flex-direction: column;
  }

  .bulletin-board,
  .task-list {
    margin: 10px 0;
  }
}
</style>
