import React, { useRef, useEffect, useState } from 'react';
import RubiksCube from './RubiksCube';
import materials from './materials';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);
  const [cube, setCube] = useState<RubiksCube>();

  useEffect(() => {
    if (canvasRef.current && canvasRef2.current) {
      setCube(new RubiksCube(
        canvasRef.current,
        canvasRef2.current,
        materials.classic,
        100));
    }
  }, []);

  return (
    <>
      <center>
        <table>
          <tr>
            <td>
              <canvas width="100px" height="100px" ref={canvasRef2} />
              <canvas width="100px" height="100px" ref={canvasRef} />
            </td>
          </tr>
          <tr>
            <td>
              <button onClick={() => { if (cube) cube.F() }}>F</button>
              <button onClick={() => { if (cube) cube.F(false) }}>F'</button>
              <button onClick={() => { if (cube) cube.B() }}>B</button>
              <button onClick={() => { if (cube) cube.B(false) }}>B'</button>
              <button onClick={() => { if (cube) cube.U() }}>U</button>
              <button onClick={() => { if (cube) cube.U(false) }}>U'</button>
              <button onClick={() => { if (cube) cube.D() }}>D</button>
              <button onClick={() => { if (cube) cube.D(false) }}>D'</button>
              <button onClick={() => { if (cube) cube.L() }}>L</button>
              <button onClick={() => { if (cube) cube.L(false) }}>L'</button>
              <button onClick={() => { if (cube) cube.R() }}>R</button>
              <button onClick={() => { if (cube) cube.R(false) }}>R'</button>
            </td>
          </tr>
          <tr>
            <button onClick={() => { if (cube) cube.x() }}>x</button>
            <button onClick={() => { if (cube) cube.x(false) }}>x'</button>
            <button onClick={() => { if (cube) cube.y() }}>y</button>
            <button onClick={() => { if (cube) cube.y(false) }}>y'</button>
            <button onClick={() => { if (cube) cube.z() }}>z</button>
            <button onClick={() => { if (cube) cube.z(false) }}>z'</button>
          </tr>
        </table>
      </center>
    </>
  );
}

export default App;
