<template>
  <div>
    <v-row>
      <v-col cols="12" md="8">
        <div class="chart-wrapper">
          <Line 
            :data="chartData" 
            :options="chartOptions" 
            ref="chartRef"
            :width="1920"
            :height="400"
          />
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <v-btn color="primary" @click="startCollecting" :disabled="collecting">Iniciar recogida</v-btn>
        <v-btn color="error" class="mt-2" @click="stopCollecting" :disabled="!collecting">Parar</v-btn>
        <v-btn class="mt-2" @click="exportImage">Exportar imagen</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'
import { ref, onBeforeUnmount } from 'vue'
import { useVumetroStore } from '@/stores/vumetro'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

const vumetro = useVumetroStore()
const chartRef = ref(null)
const collecting = ref(false)

let sumValues = 0
let countValues = 0

// Configuración optimizada
const MAX_POINTS = 5000 // Máximo de puntos a mostrar (ajustable)
const SAMPLE_INTERVAL = 150 // ms entre muestras (ajustable)

// Datos del gráfico
// const chartData = ref({
//   labels: [],
//   datasets: [{
//     label: 'Nivel (0–130)',
//     data: [],
//     borderColor: 'rgb(75, 192, 192)',
//     backgroundColor: 'rgba(75, 192, 192, 0.1)',
//     tension: 0.1,
//     fill: true,
//     pointRadius: 0, // Mejor rendimiento sin puntos
//     borderWidth: 1
//   }]
// })
const chartData = ref({
  labels: Array(MAX_POINTS).fill(''), // Vacío ya que no mostraremos el eje X
  datasets: [
    {
      data: [],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.1)',
      tension: 0.1,
      fill: true,
      pointRadius: 0,
      borderWidth: 1
    },
    {
      data: [],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'transparent',
      tension: 0.1,
      pointRadius: 0,
      borderWidth: 2,
      borderDash: [5, 5]
    }
  ]
})

const chartOptions = {
  responsive: false,
  animation: {
    duration: 0
  },
  scales: {
    y: {
      min: 0,
      max: 130,
      title: { display: false }, // Ocultar título del eje Y
      grid: {
        display: true // Mantener líneas de grid
      },
      ticks: {
        display: true // Mostrar valores numéricos
      }
    },
    x: {
      display: false, // Ocultar completamente el eje X
      grid: {
        display: false // Ocultar líneas de grid del eje X
      }
    }
  },
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false // Ocultar todas las leyendas
    },
    tooltip: {
      enabled: true,
      mode: 'nearest',
      intersect: false
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'xy'
      },
      zoom: {
        wheel: {
          enabled: true
        },
        pinch: {
          enabled: true
        },
        mode: 'xy'
      }
    }
  }
}

let collectionInterval = null
let timeCounter = 0

function startCollecting() {
  collecting.value = true
  timeCounter = 0
  sumValues = 0
  countValues = 0
  
  // Reiniciar datos
  chartData.value = {
    labels: [],
    datasets: [
      {
        ...chartData.value.datasets[0],
        data: []
      },
      {
        ...chartData.value.datasets[1],
        data: []
      }
    ]
  }

  collectionInterval = setInterval(() => {
    const newValue = vumetro.level130
    
    // Actualizar acumuladores para la media
    sumValues += newValue
    countValues++
    const currentAverage = sumValues / countValues
    
    // Añadir nuevos datos
    chartData.value.labels.push(timeCounter.toString())
    chartData.value.datasets[0].data.push(newValue)
    chartData.value.datasets[1].data.push(currentAverage)
    
    // Mantener un máximo de puntos
    if (chartData.value.labels.length > MAX_POINTS) {
      chartData.value.labels.shift()
      chartData.value.datasets[0].data.shift()
      chartData.value.datasets[1].data.shift()
      // Recalcular la suma total si es necesario
      // (Opcional, para mantener precisión en la media a largo plazo)
    }

    if (chartRef.value?.chart) {
      chartRef.value.chart.update()
    }

    timeCounter++
  }, SAMPLE_INTERVAL)
}
// function startCollecting() {
//   collecting.value = true
//   timeCounter = 0
//   // Reiniciar datos
//   chartData.value = {
//     labels: [],
//     datasets: [{
//       ...chartData.value.datasets[0],
//       data: []
//     }]
//   }

//   collectionInterval = setInterval(() => {
//     const newValue = vumetro.level130
    
//     // Añadir nuevos datos
//     chartData.value.labels.push(timeCounter.toString())
//     chartData.value.datasets[0].data.push(newValue)
    
//     // Mantener un máximo de puntos para buen rendimiento
//     if (chartData.value.labels.length > MAX_POINTS) {
//       chartData.value.labels.shift()
//       chartData.value.datasets[0].data.shift()
//     }

//     // Actualizar gráfico manualmente
//     if (chartRef.value?.chart) {
//       chartRef.value.chart.update()
//     }

//     timeCounter++
//   }, SAMPLE_INTERVAL)
// }

function stopCollecting() {
  collecting.value = false
  if (collectionInterval) {
    clearInterval(collectionInterval)
    collectionInterval = null
  }
}

function exportImage() {
  if (chartRef.value?.chart) {
    // Forzar actualización antes de exportar
    chartRef.value.chart.update()
    
    setTimeout(() => {
      const link = document.createElement('a')
      link.download = `grafica-audio-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.png`
      link.href = chartRef.value.chart.toBase64Image('image/png', 1)
      link.click()
    }, 50)
  }
}

onBeforeUnmount(() => {
  stopCollecting()
})
</script>
<style scoped>
.chart-container {
  width: 100%;
  overflow-x: auto;
}

.chart-wrapper {
  width: 1920px;
  height: 400px;
}
</style>