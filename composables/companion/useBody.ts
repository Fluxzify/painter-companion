import { ref } from 'vue'

export function useBody(
  initialX: number = 0,
  initialY: number = 0
) {
  const x = ref(initialX)
  const y = ref(initialY)
  const skin = ref('')

function draw(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  width?: number,
  height?: number
) {
  if (!img) return

  const finalWidth = width ?? img.width
  const finalHeight = height ?? img.height

  ctx.save()
  ctx.translate(x.value, y.value)
  ctx.drawImage(img, -finalWidth / 2, -finalHeight / 2, finalWidth, finalHeight)
  ctx.restore()
}

  return {
    x,
    y,
    skin,
    draw
  }
}
