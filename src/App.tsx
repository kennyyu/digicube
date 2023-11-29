import React, { useRef, useEffect, useState } from 'react';
import RubiksCube from './RubiksCube';
import materials from './materials';

// TODO: add button to allow changing cube size
// Add buttons to turn new faces
// Add color type
// Add rotations on the type
// Layout the faces together
function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRefLeft = useRef<HTMLCanvasElement>(null);
  const canvasRefBack = useRef<HTMLCanvasElement>(null);
  const canvasRefDown = useRef<HTMLCanvasElement>(null);
  const [cube, setCube] = useState<RubiksCube>();
  const [cubeSize, setCubeSize] = useState(3);
  const setCubeSizeWrapper = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCubeSize(parseInt(event.target.value));
  }

  useEffect(() => {
    if (canvasRef.current
      && canvasRefLeft.current
      && canvasRefBack.current
      && canvasRefDown.current) {
      setCube(new RubiksCube(
        cubeSize,
        canvasRef.current,
        canvasRefLeft.current,
        canvasRefBack.current,
        canvasRefDown.current,
        materials.classic,
        100,
      ));
    }
  }, [cubeSize]);

  return (
    <>
      <center>
        <table>
          <tr>
            <center>
            <div onChange={setCubeSizeWrapper}>
              <input type="radio" value="3" name="cubeSize" defaultChecked /> 3x3x3
              <input type="radio" value="4" name="cubeSize" /> 4x4x4
              <input type="radio" value="5" name="cubeSize" /> 5x5x5
            </div>
            </center>
          </tr>
          <tr>
            <td>
              <center>
                <canvas width="100px" height="100px" ref={canvasRefLeft} />
                <canvas width="100px" height="100px" ref={canvasRef} />
                <canvas width="100px" height="100px" ref={canvasRefBack} />
              </center>
            </td>
          </tr>
          <tr>
            <td>
              <center>
                <canvas width="100px" height="100px" ref={canvasRefDown} />
              </center>
            </td>
          </tr>
          <tr>
            <td>
              <center>
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
              </center>
            </td>
          </tr>
          <tr>
            <center>
              <button onClick={() => { if (cube) cube.x() }}>x</button>
              <button onClick={() => { if (cube) cube.x(false) }}>x'</button>
              <button onClick={() => { if (cube) cube.y() }}>y</button>
              <button onClick={() => { if (cube) cube.y(false) }}>y'</button>
              <button onClick={() => { if (cube) cube.z() }}>z</button>
              <button onClick={() => { if (cube) cube.z(false) }}>z'</button>
            </center>
          </tr>
        </table>
      </center>
    </>
  );
}

export default App;
