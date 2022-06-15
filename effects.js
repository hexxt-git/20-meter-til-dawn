let effectsCanvas = $('effectsCanvas')
let ec = effectsCanvas.getContext('2d')
effectsCanvas.width = width
effectsCanvas.height = height

function effcts(params) {
    requestAnimationFrame(effcts)
}
effcts()