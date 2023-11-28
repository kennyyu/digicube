import React, { useRef, useEffect, useState } from 'react';
import RubiksCube from './RubiksCube';
import materials from './materials';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cube, setCube] = useState<RubiksCube>();

  useEffect(() => {
    if (canvasRef.current) {
      setCube(new RubiksCube(canvasRef.current, materials.classic, 100));
    }
  }, []);

  return (
    <>
      <canvas width="200px" height="200px" ref={canvasRef} />
      <button onClick={() => { if (cube) cube.F() }}>F</button>
      <button onClick={() => { if (cube) cube.F(false) }}>F'</button>
      {/** ... **/}
    </>
  );
}

export default App;
