<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import hieloImageSrc from '~/assets/Canva/Effects/Hielo.png'
import frameImageSrc from '~/assets/Canva/Frames/Default.png'

const canvasRef = ref(null)
const ctx = ref(null)
const powerImg = ref(null)
const mousePosition = reactive({ x: 0, y: 0 })

const frameWidth = 2490
const frameHeight = 1650

const paddingLeft = 211
const paddingRight = 227
const paddingTop = 150
const paddingBottom = 80

const innerWidth = frameWidth - paddingLeft - paddingRight
const innerHeight = frameHeight - paddingTop - paddingBottom

const canvasWidth = ref(0)
const canvasHeight = ref(0)

const canvasInnerWidth = ref(0)
const canvasInnerHeight = ref(0)

const canvasInnerLeft = ref(0)
const canvasInnerTop = ref(0)

function MouseMove(event) {
  if (!canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  mousePosition.x = event.clientX - rect.left
  mousePosition.y = event.clientY - rect.top
}

function drawCanva() {
  if (!ctx.value || !powerImg.value) return
  ctx.value.drawImage(powerImg.value, mousePosition.x - 25, mousePosition.y - 25, 50, 50)
  console.log(`Mouse Position: X: ${mousePosition.x}, Y: ${mousePosition.y}`)
}

function canvasResize() {
  const maxWidth = window.innerWidth * 0.8
  const maxHeight = window.innerHeight * 0.8

  let width = maxWidth
  let height = (frameHeight / frameWidth) * width

  if (height > maxHeight) {
    height = maxHeight
    width = (frameWidth / frameHeight) * height
  }

  const scaleValue = width / frameWidth

  canvasWidth.value = width
  canvasHeight.value = height

  canvasInnerLeft.value = paddingLeft * scaleValue
  canvasInnerTop.value = paddingTop * scaleValue

  canvasInnerWidth.value = width - (paddingLeft + paddingRight) * scaleValue
  canvasInnerHeight.value = height - (paddingTop + paddingBottom) * scaleValue
}

let canvas, mouseMoveListener, clickListener

onMounted(() => {
  const image = new Image()
  image.src = hieloImageSrc
  image.onload = () => {
    powerImg.value = image
  }

  canvas = canvasRef.value
  if (!canvas) return

  ctx.value = canvas.getContext('2d')

  // Definir los listeners como funciones referenciables para remover luego
  mouseMoveListener = MouseMove
  clickListener = drawCanva

  canvas.addEventListener('mousemove', mouseMoveListener)
  canvas.addEventListener('click', clickListener)

  canvasResize()
  window.addEventListener('resize', canvasResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', canvasResize)
  if (canvas) {
    canvas.removeEventListener('mousemove', mouseMoveListener)
    canvas.removeEventListener('click', clickListener)
  }
})
</script>
Explicación y mejora

<template>
  <div
    class="canvas-wrapper"
    :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px', position: 'relative' }"
  >
    <div
      class="canvas-inner"
      :style="{
        position: 'absolute',
        top: canvasInnerTop + 'px',
        left: canvasInnerLeft + 'px',
        width: canvasInnerWidth + 'px',
        height: canvasInnerHeight + 'px',
        overflow: 'hidden'
      }"
    >
      <canvas
        ref="canvasRef"
        :width="canvasInnerWidth"
        :height="canvasInnerHeight"
        :style="{ width: canvasInnerWidth + 'px', height: canvasInnerHeight + 'px', border: '1px solid rgb(6,65,141)', backgroundColor: '#eee' }"
      />
    </div>
    <img
      :src="frameImageSrc"
      alt="Marco"
      class="frame"
      :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px', pointerEvents: 'none', userSelect: 'none', position: 'absolute', top: 0, left: 0, zIndex: 2 }"
    />
  </div>
</template>

<style scoped>
.canvas-wrapper {
  margin: auto;
}

.frame {
  /* ya se usa style inline para posicionar */
}
</style>
