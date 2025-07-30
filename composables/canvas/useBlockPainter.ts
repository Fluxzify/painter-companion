
// ...
import { useGridSystem } from "~/composables/canvas/useGridSystem"
import { useCanvasPainter } from "~/composables/canvas/useCanvasPainter"

export function useBlockPainter(
    canvasRef: Ref<HTMLCanvasElement | null>,
    ctx: Ref<CanvasRenderingContext2D | null>,
    powerImg: Ref<HTMLImageElement | null>,
    mousePosition: { x: number, y: number }
) {

    const { calculateBlockPos } = useGridSystem(canvasRef, mousePosition)
    const { draw } = useCanvasPainter(ctx, powerImg)

    const drawBlock = () => {
        const blockPos = calculateBlockPos()
        draw(blockPos)
    }

    return {
        drawBlock
    }
}
