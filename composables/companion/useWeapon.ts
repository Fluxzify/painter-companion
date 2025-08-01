import { ref } from 'vue'

export function useWeapon(
  initialX: number = 0,
  initialY: number = 0,
  initialRotation: number = 0
) {
  const x = ref(initialX)
  const y = ref(initialY)
  const rotation = ref(initialRotation)
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
  ctx.rotate((rotation.value * Math.PI) / 180)
  ctx.drawImage(img, -finalWidth / 2, -finalHeight / 2, finalWidth, finalHeight)
  ctx.restore()
}

  return {
    x,
    y,
    rotation,
    skin,
    draw
  }
}
