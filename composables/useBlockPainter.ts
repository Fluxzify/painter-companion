
// ...
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
        console.log(`Block drawn at position: (${blockPos.x}, ${blockPos.y})`)
    }

    return {
        drawBlock
    }
}
