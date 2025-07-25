<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Refs: acceso a canvas y contexto 2D
const canvasRef = ref(null)
const ctx = ref(null)

const mouseX = ref(0)
const mouseY = ref(0)

// Imagen de dibujo
const drawImage = ref(null)
import hieloImageSrc from '~/assets/Canva/Effects/Hielo.png'

// ResizeObserver
let resizeObserver = null

// =======================
// Utilidades
// =======================

function debounce(func, delay) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), delay)
  }
}

// =======================
// Dibujo
// =======================

function drawGrid(cellSize = 50) {
  if (!ctx.value || !canvasRef.value) return

  const width = canvasRef.value.width
  const height = canvasRef.value.height

  ctx.value.save()
  ctx.value.strokeStyle = 'rgba(200,200,200,0.5)'
  ctx.value.lineWidth = 1

  // Líneas verticales
  for (let x = 0; x <= width; x += cellSize) {
    ctx.value.beginPath()
    ctx.value.moveTo(x, 0)
    ctx.value.lineTo(x, height)
    ctx.value.stroke()
  }

  // Líneas horizontales
  for (let y = 0; y <= height; y += cellSize) {
    ctx.value.beginPath()
    ctx.value.moveTo(0, y)
    ctx.value.lineTo(width, y)
    ctx.value.stroke()
  }

  ctx.value.restore()
}

function drawPower(from, angle) {
  if (!ctx.value) return

  const length = 100
  const rad = (angle * Math.PI) / 180
  const toX = from.x + length * Math.cos(rad)
  const toY = from.y + length * Math.sin(rad)

  ctx.value.strokeStyle = 'rgba(0,255,255,0.7)'
  ctx.value.lineWidth = 5
  ctx.value.beginPath()
  ctx.value.moveTo(from.x, from.y)
  ctx.value.lineTo(toX, toY)
  ctx.value.stroke()
}
function drawImageAt(x, y) {
  if (!ctx.value || !drawImage.value?.complete) return

  const size = 50
  ctx.value.drawImage(drawImage.value, x, y, size, size)
}


// =======================
// Canvas setup
// =======================

function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()

  if (canvas.width !== rect.width || canvas.height !== rect.height) {
    canvas.width = rect.width
    canvas.height = rect.height

    ctx.value.strokeStyle = 'rgba(0,255,255,0.7)'
    ctx.value.lineWidth = 5

    drawGrid()
  }
}

function onMouseMove(event) {
  const rect = canvasRef.value.getBoundingClientRect()
  mouseX.value = event.clientX - rect.left
  mouseY.value = event.clientY - rect.top
}
function onCanvasClick(event) {
  const rect = canvasRef.value.getBoundingClientRect()
  const rawX = event.clientX - rect.left
  const rawY = event.clientY - rect.top

  const gridSize = 50
  const alignedX = Math.floor(rawX / gridSize) * gridSize
  const alignedY = Math.floor(rawY / gridSize) * gridSize

  drawImageAt(alignedX, alignedY)
  console.log(`Dibujando imagen en X=${alignedX}, Y=${alignedY}`)
}

function onDrawPowerEvent(event) {
  const { from, angle } = event.detail
  drawPower(from, angle)
}

// =======================
// Ciclo de vida
// =======================

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return console.error('Canvas no encontrado')

  ctx.value = canvas.getContext('2d')

  const debouncedResize = debounce(resizeCanvas, 100)

  resizeCanvas()

  if (canvas.parentElement) {
    resizeObserver = new ResizeObserver(debouncedResize)
    resizeObserver.observe(canvas.parentElement)
    canvas.parentElement.addEventListener('mousemove', onMouseMove)
  }

  canvas.addEventListener('click', onCanvasClick)
  window.addEventListener('draw-power-on-canvas', onDrawPowerEvent)

  // Cargar imagen
  drawImage.value = new Image()
  drawImage.value.src = hieloImageSrc
  drawImage.value.onload = () => console.log('Imagen cargada')
  drawImage.value.onerror = () => console.error('Error al cargar imagen')
})

onBeforeUnmount(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  resizeObserver?.disconnect()
  canvas.removeEventListener('click', onCanvasClick)
  canvas.parentElement?.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('draw-power-on-canvas', onDrawPowerEvent)
})
</script>

<template>
  <canvas ref="canvasRef" class="w-full h-full"></canvas>
</template>

<style scoped>
canvas {
  cursor: url('/assets/Canva/mira.png'), auto;
    border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
}
</style>
