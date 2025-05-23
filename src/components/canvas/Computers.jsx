import React from 'react'
import { Suspense, useEffect, useState } from 'react';
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from '../Loader.jsx';


const Computers = ({ isMobile }) => {
  const computer = useGLTF("../desktop_pc/scene.gltf")


  return (
    <mesh>
      <hemisphereLight 
            intensity={0.15}
            groundColor='black'
      />
      <pointLight 
            intensity={1} />
      <spotLight 
            angle={0.12}
            position={[-20, 50, 10]} 
            penumbra={1}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            />
      <primitive 
            object={computer.scene} 
            scale={isMobile ? 0.7 : 0.75}
            position={isMobile ? [0, -3, -2.2] : [0, -4, -1.5]}
            rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  )
}

const ComputersCanvas = () => {
  const [isMobile, setisMobile] = useState(false);

  useEffect(() => {
    // Add event listener for changes to the screen size
    const mediaQuery = window.matchMedia(
      '(max-width: 500px)');
      

      // Set the initial value of isMobile state variable
      setisMobile(mediaQuery.matches);

      
      //Define a callback function to handle changes to the media query
      const handleMediaQueryChange = (event) => {
        setisMobile(event.matches);
      };


      // Add the callback function as a listener for changes to the media query
      mediaQuery.addEventListener('change', handleMediaQueryChange);
      

      // Remove the event listener when the component unmounts
      return () => {
        mediaQuery.removeEventListener('change', handleMediaQueryChange);
      }
  }, [])

  return (
    <Canvas
    frameLoop='demand'
    shadows
    camera={{ position: [20, 3, 5], fov: 25 }}
    gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls 
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
        enableZoom={false} 
        />
        <Computers isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  )
}

export default ComputersCanvas;
