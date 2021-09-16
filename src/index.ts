import {
  Scene,
  Engine,
  Vector3,
  HemisphericLight,
  Color4,
  Mesh,
  PBRMetallicRoughnessMaterial,
  ArcRotateCamera,
  MeshBuilder,
  Texture,
} from "babylonjs"


const canvas = document.getElementById("canvas") as HTMLCanvasElement
const engine = new Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true})

const scene = new Scene(engine)
const camera = new ArcRotateCamera("camera", 0, 0, 5, Vector3.Zero(), scene)
camera.attachControl(canvas, false)
new HemisphericLight("HemiLight", new Vector3(0, 1, 0), scene);

scene.clearColor = new Color4(0, 0, 0, 0)

const imagePlanes: Mesh[] = []
;(async () => {
  for (let i = 0; i < 14; i++) {
    const imgNumStr = i < 10 ? "0" + i : i.toString()
    const imgUrl = (await import(`./images/sparrow-${imgNumStr}.png`)).default
    const p = MeshBuilder.CreatePlane("plane", {
      size: 2
    }, scene)
    const m = new PBRMetallicRoughnessMaterial("m" + imgNumStr, scene)
    m.roughness = 1
    m.metallic = 0
    m.baseTexture = new Texture(imgUrl, scene)
    m.baseTexture.hasAlpha = true
    p.material = m
    p.rotation.x = Math.PI / 2
    p.rotation.y = - Math.PI / 2
    imagePlanes.push(p)
  }
})()

let time = 0
engine.runRenderLoop(function() {
  time += 1
  imagePlanes.forEach((p, i) => {
    p.position.y = Math.abs(Math.sin(time / 100)) * i * 0.1
  })
  scene.render()
})

window.addEventListener("resize", function() {
  engine.resize()
})