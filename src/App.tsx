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
          <input type="radio" value="3" name="cubeSize" defaultChecked /> 3x3x3
          <input type="radio" value="4" name="cubeSize" /> 4x4x4
          <input type="radio" value="5" name="cubeSize" /> 5x5x5
          <input type="radio" value="6" name="cubeSize" /> 6x6x6
          <input type="radio" value="7" name="cubeSize" /> 7x7x7
          <input type="radio" value="8" name="cubeSize" /> 8x8x8
          <input type="radio" value="9" name="cubeSize" /> 9x9x9
          <input type="radio" value="10" name="cubeSize" /> 10x10x10
        </div>
      </center>
      <CubeApp cubeSize={cubeSize} />
    </>
  );
}

type CubeAppProps = {
  cubeSize: number;
};

function CubeApp(props: CubeAppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRefUp = useRef<HTMLCanvasElement>(null);
  const canvasRefDown = useRef<HTMLCanvasElement>(null);
  const canvasRefFront = useRef<HTMLCanvasElement>(null);
  const canvasRefBack = useRef<HTMLCanvasElement>(null);
  const canvasRefRight = useRef<HTMLCanvasElement>(null);
  const canvasRefLeft = useRef<HTMLCanvasElement>(null);
  const [cube, setCube] = useState<RubiksCube>();

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
          case "f":
            buttonRefF.current?.click();
            break;
          case "b":
            buttonRefB.current?.click();
            break;
          case "u":
            buttonRefU.current?.click();
            break;
          case "d":
            buttonRefD.current?.click();
            break;
          case "l":
            buttonRefL.current?.click();
            break;
          case "r":
            buttonRefR.current?.click();
            break;
          case "F":
            buttonRefFinv.current?.click();
            break;
          case "B":
            buttonRefBinv.current?.click();
            break;
          case "U":
            buttonRefUinv.current?.click();
            break;
          case "D":
            buttonRefDinv.current?.click();
            break;
          case "L":
            buttonRefLinv.current?.click();
            break;
          case "R":
            buttonRefRinv.current?.click();
            break;
          case "x":
            buttonRefx.current?.click();
            break;
          case "y":
            buttonRefy.current?.click();
            break;
          case "z":
            buttonRefz.current?.click();
            break;
          case "X":
            buttonRefxinv.current?.click();
            break;
          case "Y":
            buttonRefyinv.current?.click();
            break;
          case "Z":
            buttonRefzinv.current?.click();
            break;
        }
      };
      document.addEventListener("keydown", onKeyPressed, false);
    }
  }, [props]);

  return (
    <>
      <center>
        <table>
          <tr>
            <td>
              <center>
                <canvas width="400px" height="400px" ref={canvasRef} />
              </center>
            </td>
          </tr>
          <tr>
            <td>

            </td>
          </tr>
          <tr>
            <td>
              <center>
                <table>
                  <tr>
                    <td />
                    <td>
                      <canvas width="100px" height="100px" ref={canvasRefUp} />
                    </td>
                    <td />
                    <td />
                  </tr>
                  <tr>
                    <td>
                      <canvas width="100px" height="100px" ref={canvasRefLeft} />
                    </td>
                    <td>
                      <canvas width="100px" height="100px" ref={canvasRefFront} />
                    </td>
                    <td>
                      <canvas width="100px" height="100px" ref={canvasRefRight} />
                    </td>
                    <td>
                      <canvas width="100px" height="100px" ref={canvasRefBack} />
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <canvas width="100px" height="100px" ref={canvasRefDown} />
                    </td>
                    <td />
                    <td />
                  </tr>
                </table>
              </center>
            </td>
          </tr>
          <tr>
            <td>
              <center>
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
              </center>
            </td>
          </tr>
          <tr>
            <center>
              <button onClick={() => { if (cube) cube.x() }} ref={buttonRefx}>x</button>
              <button onClick={() => { if (cube) cube.x(false) }} ref={buttonRefxinv}>x'</button>
              <button onClick={() => { if (cube) cube.y() }} ref={buttonRefy}>y</button>
              <button onClick={() => { if (cube) cube.y(false) }} ref={buttonRefyinv}>y'</button>
              <button onClick={() => { if (cube) cube.z() }} ref={buttonRefz}>z</button>
              <button onClick={() => { if (cube) cube.z(false) }} ref={buttonRefzinv}>z'</button>
            </center>
          </tr>
        </table>
      </center>
    </>
  );
}

export default App;
