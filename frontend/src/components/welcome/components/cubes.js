import React, { useEffect } from 'react'
import * as THREE from 'three'

const cubeX = (x, y, z, edges, scene) => {
  const cube = new THREE.LineSegments(edges,
    new THREE.LineBasicMaterial({
      color: '#58d7b2',
      opacity: Math.random(),
      transparent: true,
      linewidth: 3,
      linecap: 'round', // ignored by WebGLRenderer
      linejoin: 'round' // ignored by WebGLRenderer
    }))
  cube.position.set(x, y, z)
  cube.scale.x = 0.01
  cube.scale.y = 0.01
  cube.scale.z = 0.01
  scene.add(cube) // adds the cube to the scene
  return cube
}

const cubeRotateAndScaleUp = (cube) => {
  cube.rotation.z += 0.005
  cube.rotation.x += 0.005
  cube.rotation.y += 0.005 // Runs every frame giving it the animation
  cube.scale.x += 0.001
  cube.scale.y += 0.001
  cube.scale.z += 0.001
}

const cubeRotateAndScaleDown = (cube) => {
  cube.material.opacity -= 0.0002
  cube.material.opacity -= 0.0002
}

const cubeReset = (cube) => {
  cube.material.opacity = 1
  cube.scale.x = 0.01
  cube.scale.y = 0.01
  cube.scale.z = 0.01
}

const Cubes = ({ children }) => {
  useEffect(() => {
    const height = 285
    const width = window.innerWidth

    // 3 must haves - SCENE , CAMERA, RENDERER

    let scene = new THREE.Scene() // Creates a new scene

    let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000) // Creates a camera and passes (field of view, aspect ratio, near clipping plane, far clipping plane)
    camera.position.set(0, 0, 5)// moves the camera back some so we won't be inside of the cube
    camera.lookAt(scene.position) // makes the camera always point toward the scene
    scene.add(camera)

    let light = new THREE.PointLight('rgb(88,215,178)')
    light.position.set(10, 0, 10)
    scene.add(light)

    let renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height) // sets size of render to the screen size
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = 0
    renderer.domElement.style.zIndex = -1
    renderer.domElement.style.height = '400px'
    document.getElementById('cube-placement').appendChild(renderer.domElement) // Renders a canvas tag to the DOM

    const geometry = new THREE.BoxGeometry()
    const sphereGeometry = new THREE.SphereGeometry(2, 32, 32, 0, 6.3, 0, 3)
    const edges = new THREE.EdgesGeometry(geometry)
    const sphereEdges = new THREE.EdgesGeometry(sphereGeometry)
    const cubes = [
      [15, 0, 0, 0],
      [15, -3, -1, 0],
      [18, 1, 0, 0],
      [19, -3, -1, 0],
      [-19, -3, -1, 0],
      [16, -2, 1, 0],
      [-15, 0, 0, 0],
      [-15, 1, 1, 0],
      [-18, -1, 0, 0],
      [-16, 2, -1, 0],
      [-17, 1, 0, 0],
      [-16, -2, -1, 0],
      [-16, 2, 0, 0],
      [15, 0, 0, 0],
      [15, -3, -1, 0],
      [18, 1, 0, 0],
      [-15, 0, 0, 0],
      [-15, 1, 1, 0],
      [-18, -1, 0, 0],
      [-16, 2, -1, 0],
      [-17, 1, 0, 0],
      [-16, -2, -1, 0],
      [-16, 2, 0, 0],
      [15, 0, 0, 0],
      [15, -3, -1, 0],
      [18, 1, 0, 0],
      [16, -2, 1, 0],
      [-15, 0, 0, 0],
      [-15, 1, 1, 0],
      [-18, -1, 0, 0],
      [-16, 2, -1, 0],
      [-17, 1, 0, 0],
      [-16, -2, -1, 0],
      [-16, 2, 0, 0],
      [15, 0, 0, 0],
      [15, -3, -1, 0],
      [18, 1, 0, 0],
      [16, -2, 1, 0],
      [-15, 0, 0, 0],
      [-15, 1, 1, 0],
      [-18, -1, 0, 0],
      [-16, 2, -1, 0],
      [-17, 1, 0, 0],
      [-16, -2, -1, 0],
      [-16, 2, 0, 0],
      [15, 0, 0, 0],
      [15, -3, -1, 0],
      [18, 1, 0, 0],
      [16, -2, 1, 0],
      [-15, 0, 0, 0],
      [-15, 1, 1, 0],
      [-18, -1, 0, 0],
      [-16, 2, -1, 0],
      [-17, 1, 0, 0],
      [-16, -2, -1, 0],
      [-16, 2, 0, 0]

    ]
    let cubesInstances = []
    const edgetTypes = [edges, sphereEdges]
    for (let i = 0; i < cubes.length; i++) {
      cubesInstances[i] = cubeX(cubes[i][0], cubes[i][1], cubes[i][2], edgetTypes[cubes[i][3]], scene)
    }

    // Render loop to display cube
    function render () {
      const animation = window.requestAnimationFrame(render) // requestAnimationFrame will pause when the user navigates to a new tab

      for (let i = 0; i < cubesInstances.length; i++) {
        cubeRotateAndScaleUp(cubesInstances[i])
        cubeRotateAndScaleDown(cubesInstances[i])
      }

      if (cubesInstances[0].material.opacity < 0) {
        window.cancelAnimationFrame(animation)
        for (let i = 0; i < cubesInstances.length; i++) {
          cubeReset(cubesInstances[i])
        }
        render()
      }
      renderer.render(scene, camera)
    };

    render()
  }, [])

  return (
    <div className='cube-container' id='cube-placement'>
      { children }
    </div>
  )
}

export default Cubes
