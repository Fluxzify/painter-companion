import { ref, watch, onMounted } from 'vue'

export function useArm(initialX: number, initialY: number, initialRotation = 0) {
  const x = ref(initialX)
  const y = ref(initialY)
  const rotation = ref(initialRotation)

  // Este valor se puede usar si luego quieres persistir o cambiar el skin
  const skin = ref('')

  function draw(
    ctx: CanvasRenderingContext2D,
    width?: number,
    height?: number,
    skinSrc = ''
  ) {
    const img = new Image()
    img.src = skinSrc

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