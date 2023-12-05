import React, { useRef, useEffect, useState } from 'react';
import RubiksCube from './RubiksCube';
import materials from './materials';

function App() {
  const [cubeSize, setCubeSize] = useState(3);
  const setCubeSizeWrapper = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCubeSize(parseInt(event.target.value));
  }

  return (
    <>
      <center>
        <div onChange={setCubeSizeWrapper}>
          <input type="radio" value="2" name="cubeSize" /> 2x2x2
          <input type="radio" value="3" name="cubeSize" defaultChecked /> 3x3x3
          <input type="radio" value="4" name="cubeSize" /> 4x4x4
          <input type="radio" value="5" name="cubeSize" /> 5x5x5
          <input type="radio" value="6" name="cubeSize" /> 6x6x6
          <input type="radio" value="7" name="cubeSize" /> 7x7x7
          <input type="radio" value="8" name="cubeSize" /> 8x8x8
          <input type="radio" value="9" name="cubeSize" /> 9x9x9
          <input type="radio" value="10" name="cubeSize" /> 10x10x10
        </div>
        <CubeApp cubeSize={cubeSize} />
      </center>
    </>
  );
}

type CubeAppProps = {
  cubeSize: number;
};

function CubeApp(props: CubeAppProps) {
  // Main canvas to display the 3d cube
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas for each face of the cube
  const canvasRefUp = useRef<HTMLCanvasElement>(null);
  const canvasRefDown = useRef<HTMLCanvasElement>(null);
  const canvasRefFront = useRef<HTMLCanvasElement>(null);
  const canvasRefBack = useRef<HTMLCanvasElement>(null);
  const canvasRefRight = useRef<HTMLCanvasElement>(null);
  const canvasRefLeft = useRef<HTMLCanvasElement>(null);

  // Buttons to rotate the cube
  const buttonRefF = useRef<HTMLButtonElement>(null);
  const buttonRefB = useRef<HTMLButtonElement>(null);
  const buttonRefU = useRef<HTMLButtonElement>(null);
  const buttonRefD = useRef<HTMLButtonElement>(null);
  const buttonRefL = useRef<HTMLButtonElement>(null);
  const buttonRefR = useRef<HTMLButtonElement>(null);
  const buttonRefFinv = useRef<HTMLButtonElement>(null);
  const buttonRefBinv = useRef<HTMLButtonElement>(null);
  const buttonRefUinv = useRef<HTMLButtonElement>(null);
  const buttonRefDinv = useRef<HTMLButtonElement>(null);
  const buttonRefLinv = useRef<HTMLButtonElement>(null);
  const buttonRefRinv = useRef<HTMLButtonElement>(null);
  const buttonRefx = useRef<HTMLButtonElement>(null);
  const buttonRefy = useRef<HTMLButtonElement>(null);
  const buttonRefz = useRef<HTMLButtonElement>(null);
  const buttonRefxinv = useRef<HTMLButtonElement>(null);
  const buttonRefyinv = useRef<HTMLButtonElement>(null);
  const buttonRefzinv = useRef<HTMLButtonElement>(null);

  // State to store the current cube
  const [cube, setCube] = useState<RubiksCube>();

  useEffect(() => {
    if (canvasRef.current
      && canvasRefFront.current
      && canvasRefBack.current
      && canvasRefUp.current
      && canvasRefDown.current
      && canvasRefRight.current
      && canvasRefLeft.current
    ) {
      setCube(new RubiksCube(
        props.cubeSize,
        canvasRef.current,
        canvasRefFront.current,
        canvasRefBack.current,
        canvasRefUp.current,
        canvasRefDown.current,
        canvasRefRight.current,
        canvasRefLeft.current,
        materials.classic,
        100,
      ));

      // TODO: wasdxf, jkl controls
      const onKeyPressed = (event: KeyboardEvent) => {
        switch (event.key) {
          case "q":
            buttonRefF.current?.click();
            break;
          case "e":
            buttonRefB.current?.click();
            break;
          case "w":
            buttonRefU.current?.click();
            break;
          case "s":
            buttonRefD.current?.click();
            break;
          case "a":
            buttonRefL.current?.click();
            break;
          case "d":
            buttonRefR.current?.click();
            break;
          case "Q":
            buttonRefFinv.current?.click();
            break;
          case "E":
            buttonRefBinv.current?.click();
            break;
          case "W":
            buttonRefUinv.current?.click();
            break;
          case "S":
            buttonRefDinv.current?.click();
            break;
          case "A":
            buttonRefLinv.current?.click();
            break;
          case "D":
            buttonRefRinv.current?.click();
            break;
          case "l":
            buttonRefx.current?.click();
            break;
          case "k":
            buttonRefy.current?.click();
            break;
          case "j":
            buttonRefz.current?.click();
            break;
          case "L":
            buttonRefxinv.current?.click();
            break;
          case "K":
            buttonRefyinv.current?.click();
            break;
          case "J":
            buttonRefzinv.current?.click();
            break;
        }
      };
      document.addEventListener("keydown", onKeyPressed, false);
    }
  }, [props]);

  return (
    <>
      <table>
        <tbody>
          <tr>
            <td>
              <canvas width="400px" height="400px" ref={canvasRef} />
            </td>
          </tr>
          <tr>
            <td>
              <table>
                <tbody>
                  <tr>
                    <td />
                    <td>
                      <canvas width="100px" height="100px" ref={canvasRefUp} />
                      <br />
                      w
                    </td>
                    <td />
                    <td />
                  </tr>
                  <tr>
                    <td>
                      <canvas width="100px" height="100px" ref={canvasRefLeft} />
                      <br />
                      a
                    </td>
                    <td>
                      <canvas width="100px" height="100px" ref={canvasRefFront} />
                      <br />
                      q
                    </td>
                    <td>
                      <canvas width="100px" height="100px" ref={canvasRefRight} />
                      <br />
                      d
                    </td>
                    <td>
                      <canvas width="100px" height="100px" ref={canvasRefBack} />
                      <br />
                      e
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <canvas width="100px" height="100px" ref={canvasRefDown} />
                      <br />
                      s
                    </td>
                    <td />
                    <td />
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <button onClick={() => { if (cube) cube.F() }} ref={buttonRefF}>F</button>
              <button onClick={() => { if (cube) cube.F(false) }} ref={buttonRefFinv}>F'</button>
              <button onClick={() => { if (cube) cube.B() }} ref={buttonRefB}>B</button>
              <button onClick={() => { if (cube) cube.B(false) }} ref={buttonRefBinv}>B'</button>
              <button onClick={() => { if (cube) cube.U() }} ref={buttonRefU}>U</button>
              <button onClick={() => { if (cube) cube.U(false) }} ref={buttonRefUinv}>U'</button>
              <button onClick={() => { if (cube) cube.D() }} ref={buttonRefD}>D</button>
              <button onClick={() => { if (cube) cube.D(false) }} ref={buttonRefDinv}>D'</button>
              <button onClick={() => { if (cube) cube.L() }} ref={buttonRefL}>L</button>
              <button onClick={() => { if (cube) cube.L(false) }} ref={buttonRefLinv}>L'</button>
              <button onClick={() => { if (cube) cube.R() }} ref={buttonRefR}>R</button>
              <button onClick={() => { if (cube) cube.R(false) }} ref={buttonRefRinv}>R'</button>
            </td>
          </tr>
          <tr>
            <td>
              <button onClick={() => { if (cube) cube.x() }} ref={buttonRefx}>x</button>
              <button onClick={() => { if (cube) cube.x(false) }} ref={buttonRefxinv}>x'</button>
              <button onClick={() => { if (cube) cube.y() }} ref={buttonRefy}>y</button>
              <button onClick={() => { if (cube) cube.y(false) }} ref={buttonRefyinv}>y'</button>
              <button onClick={() => { if (cube) cube.z() }} ref={buttonRefz}>z</button>
              <button onClick={() => { if (cube) cube.z(false) }} ref={buttonRefzinv}>z'</button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default App;
