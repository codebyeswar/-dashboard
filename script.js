let waterData = JSON.parse(localStorage.getItem("waterData")) || { intake: 0, target: 2.5 };
let sleepData = JSON.parse(localStorage.getItem("sleepData")) || { hours: 0, target: 8 };

// Initialize variables for charts

let sleepChart = null;
let areaChart = null;

// Function to Save Sleep & Update Chart
window.saveSleep = function() {
  let sleepHours = parseFloat(document.getElementById("sleep-hours").value) || 0;
  let sleepTarget = parseFloat(document.getElementById("sleep-target").value) || 8;

  sleepData = { hours: sleepHours, target: sleepTarget };
  localStorage.setItem("sleepData", JSON.stringify(sleepData));

  updateSleepChart();
};

// Fix Blurry Canvas (High-Resolution Scaling)
function fixCanvasResolution(canvas) {
    let ctx = canvas.getContext("2d");
    let dpr = window.devicePixelRatio || 1;
    let rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
}


// Update Sleep Donut Chart
function updateSleepChart() {
    let slept = sleepData.hours;
    let remaining = Math.max(sleepData.target - slept, 0);

    if (sleepChart) sleepChart.destroy(); // Destroy previous instance

    const ctxSleep = document.getElementById("sleep-chart").getContext("2d");
    fixCanvasResolution(document.getElementById("sleep-chart"));

    sleepChart = new Chart(ctxSleep, {
        type: "doughnut",
        data: {
            labels: ["Hours Slept", "Remaining"],
            datasets: [{
                data: [slept, remaining],
                backgroundColor: ["#9e9ea4", "#2d2d2d"],
                borderWidth: 0,
            }]
        },
        options: {
            devicePixelRatio: 2, // Ensure high DPI
            cutout: "70%",
            responsive: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true },
                datalabels: {
                    color: "#fff",
                    font: { weight: "bold", size: 16 },
                    formatter: (value, ctx) => {
                        let total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        let percentage = ((value / total) * 100).toFixed(1) + "%";
                        return percentage;
                    }
                }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const currentWeightInput = document.getElementById("current-weight");
  const targetWeightInput = document.getElementById("target-weight");
  const currentDateInput = document.getElementById("current-date");

  // Automatically set today's date
  const today = new Date().toISOString().split("T")[0];
  currentDateInput.value = today;

  // Load previous target weight from localStorage
  let savedTargetWeight = localStorage.getItem("targetWeight");
  if (savedTargetWeight) {
      targetWeightInput.value = savedTargetWeight;
  }

  // Load weight for today if available
  const existingEntry = weights.weights.find(w => w.day === today);
  if (existingEntry) {
      currentWeightInput.value = existingEntry.weight;
      targetWeightInput.value = existingEntry.targetWeight || targetWeightInput.value; // Keep saved target weight
  } else {
      currentWeightInput.value = ""; // Keep empty instead of defaulting to 0
  }

  // Ensure charts are updated with the loaded data
  updateSleepChart();
  updateAreaChart();
});





// SIDEBAR TOGGLE

let sidebarOpen = false;
const sidebar = document.getElementById('sidebar');

let weights = JSON.parse(localStorage.getItem("weights")) || { weights: [] };

// Ensure weights.weights is always an array
if (!Array.isArray(weights.weights)) {
  weights.weights = [];
}

function openSidebar() {
  if (!sidebarOpen) {
    sidebar.classList.add('sidebar-responsive');
    sidebarOpen = true;
  }
}

function closeSidebar() {
  if (sidebarOpen) {
    sidebar.classList.remove('sidebar-responsive');
    sidebarOpen = false;
  }
}



// ---------- CHARTS ----------

// BAR CHART
const barChartOptions = {
  series: [
    {
      data: [150, 250, 70], // Protein, Carbs, Fat
      name: 'Macronutrients',
    },
  ],
  chart: {
    type: 'bar',
    background: 'transparent',
    height: 350,
    toolbar: { show: false },
  },
  colors: ['#ff5733', '#33b5e5', '#ff33ff'], // Red for Protein, Blue for Carbs, Pink for Fat
  plotOptions: {
    bar: {
      distributed: true,
      borderRadius: 4,
      horizontal: false,
      columnWidth: '50%',
    },
  },
  dataLabels: { enabled: false },
  fill: { opacity: 1 },
  grid: {
    borderColor: '#55596e',
    yaxis: { lines: { show: true } },
    xaxis: { lines: { show: true } },
  },
  legend: {
    labels: { colors: '#f5f7ff' },
    show: true,
    position: 'top',
  },
  stroke: { colors: ['transparent'], show: true, width: 2 },
  tooltip: {
    shared: true,
    intersect: false,
    theme: 'dark',
  },
  xaxis: {
    categories: ['Protein (g)', 'Carbs (g)', 'Fat (g)'], // Removed Calories
    title: { style: { color: '#f5f7ff' } },
    axisBorder: { show: true, color: '#55596e' },
    axisTicks: { show: true, color: '#55596e' },
    labels: { style: { colors: '#f5f7ff' } },
  },
  yaxis: {
    title: { text: 'Amount (grams)', style: { color: '#f5f7ff' } },
    axisBorder: { color: "#55596e", show: true },
    axisTicks: { color: "#55596e", show: true },
    labels: { style: { colors: "#f5f7ff" } },
  },
};

// Add this function to make sure barChart is created after DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  const barChart = new ApexCharts(
    document.querySelector('#bar-chart'),
    barChartOptions
  );
  barChart.render();

  // AREA CHART
  // Make sure we have at least one weight entry
  if (!weights.weights.length) {
    weights.weights = [{ day: new Date().toISOString(), weight: 0 }];
  }

  const areaChartOptions = {
    series: [
      {
        name: "Weight (kg)", // ✅ Changed from lbs to kg
        data: weights.weights.map(w => Number(w.weight)),
      },
      {
        name: "Target Weight (kg)", // ✅ Changed from lbs to kg
        data: weights.weights.map(w => Number(w.targetWeight) || 70), // Default target weight in kg
      },
    ],
    chart: {
      type: "line",
      background: "transparent",
      height: 350,
      stacked: false,
      zoom: {
        enabled: true,
        type: "x", // Zooms only along the x-axis
      },
      toolbar: {
        show: true,
        tools: {
          zoomin: true,
          zoomout: true,
          reset: true,
          Pan: true,
          download: false,
          zoom: false,
        },
      },
    },
    colors: ["#D49D37", "rgba(255, 0, 0, 0.8)"], // Gold for weight, red for target
    labels: weights.weights.map(w => w.day || new Date().toISOString()),
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 3, // Line thickness
      dashArray: [0, 5], // Dashed line for Target Weight
    },
    grid: {
      borderColor: "#55596e",
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: true } },
      padding: { bottom: 20 }, // Adds space below labels
    },
    legend: {
      labels: { colors: "#f5f7ff" },
      show: true,
      position: "top",
    },
    markers: {
      size: 5, // Dots on data points
      strokeColors: "#1b2635",
      strokeWidth: 3,
    },
    xaxis: {
      type: "datetime", // Ensures correct time formatting
      axisBorder: { color: "#55596e", show: true },
      axisTicks: { color: "#55596e", show: true },
      labels: { offsetY: 5, style: { colors: "#f5f7ff" } },
    },
    yaxis: [
      {
        title: { text: "Weight (kg)", style: { color: "#f5f7ff" } }, // ✅ Changed from lbs to kg
        labels: { style: { colors: ["#f5f7ff"] } },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      theme: "dark",
      y: {
        formatter: function (val) {
          return val + " kg"; // ✅ Changed from lbs to kg
        },
      },
    },
  };
  
  areaChart = new ApexCharts(document.querySelector("#area-chart"), areaChartOptions);
  areaChart.render();
});  

let clearBtn = document.getElementById("clear-data-btn");
if (clearBtn) {
    clearBtn.addEventListener("click", clearCurrentDateData);
}




// Add a function to save macros data
window.saveMacros = function() {
  const protein = parseFloat(document.getElementById("proteinInput").value) || 0;
  const carbs = parseFloat(document.getElementById("carbInput").value) || 0;
  const fat = parseFloat(document.getElementById("fatInput").value) || 0;
  
  // Calculate calories
  const calories = (protein * 4) + (carbs * 4) + (fat * 9);
  
  // Update display
  document.getElementById("caloriesOutput").textContent = calories.toFixed(0);
  
  // Save data
  localStorage.setItem("macros", JSON.stringify({
    protein: protein,
    carbs: carbs,
    fat: fat,
    calories: calories
  }));
  
  // Update chart (if needed)
  if (typeof barChart !== 'undefined') {
    barChart.updateSeries([{
      data: [protein, carbs, fat]
    }]);
  }
};

// Add a function to save weight data
// Modify saveWeight function to enforce current date
window.saveWeight = function () {
  const currentWeightInput = document.getElementById("current-weight");
  const targetWeightInput = document.getElementById("target-weight");
  const currentDate = document.getElementById("current-date").value;

  if (!currentDate) {
      alert("Please enter the current date.");
      return;
  }

  const currentWeight = parseFloat(currentWeightInput.value);
  let targetWeight = parseFloat(targetWeightInput.value);

  if (!currentWeight) {
      alert("Please enter your current weight in kg.");
      return;
  }

  // ✅ Load existing target weight from localStorage if user has set it before
  let savedTargetWeight = localStorage.getItem("targetWeight");
  if (!targetWeight && savedTargetWeight) {
      targetWeight = parseFloat(savedTargetWeight);
  }

  // ✅ Save target weight only if user entered a new one
  if (targetWeight) {
      localStorage.setItem("targetWeight", targetWeight);
  }

  // ✅ Remove existing entry for today before adding new one
  weights.weights = weights.weights.filter(w => w.day !== currentDate);

  // ✅ Add new weight entry
  weights.weights.push({
      day: currentDate,
      weight: currentWeight,
      targetWeight: targetWeight
  });

  // Sort by date (ensure chronological order)
  weights.weights.sort((a, b) => new Date(a.day) - new Date(b.day));

  // Save to localStorage
  localStorage.setItem("weights", JSON.stringify(weights));

  // ✅ Update Graph Instantly
  updateAreaChart();

  alert("Weight data saved successfully!");
};





// Function to clear data for the current date
window.clearCurrentDateData = function() {
  const currentDate = document.getElementById("current-date").value;

  if (!currentDate) {
      alert("Please enter the current date to clear the data.");
      return;
  }

  if (!confirm("Are you sure you want to clear today's weight data?")) {
      return;
  }

  // Filter out the weight data for the current date
  weights.weights = weights.weights.filter(w => w.day !== currentDate);

  // Save the updated data to localStorage
  localStorage.setItem("weights", JSON.stringify(weights));

  // Clear input fields
  document.getElementById("current-weight").value = "";
  document.getElementById("target-weight").value = "";

  // Update Area Chart dynamically
  updateAreaChart();

  alert("Weight data for the current date has been cleared!");
};




// Function to update the Area Chart dynamically
function updateAreaChart() {
  if (areaChart && weights.weights.length) {
      // Filter out invalid (0 or undefined) weight entries
      let validWeights = weights.weights.filter(w => w.weight > 0);
      let validTargetWeights = validWeights.map(w => w.targetWeight || localStorage.getItem("targetWeight") || 70);

      // Ensure we have valid data before updating chart
      if (validWeights.length === 0) {
          console.warn("No valid weight data to display.");
          return;
      }

      areaChart.updateSeries([
          {
              name: "Weight (kg)",
              data: validWeights.map(w => Number(w.weight)), // Ensure numbers
          },
          {
              name: "Target Weight (kg)",
              data: validTargetWeights.map(w => Number(w)), // Ensure numbers
          },
      ]);

      areaChart.updateOptions({
          yaxis: {
              title: { text: "Weight (kg)", style: { color: "#f5f7ff" } },
              labels: { style: { colors: ["#f5f7ff"] } },
          },
          tooltip: {
              y: {
                  formatter: function (val) {
                      return val + " kg"; // Ensure correct unit
                  },
              },
          },
      });
  }
}