import React, { useRef, useEffect, useState } from 'react';
import { RubiksCube, CUBE_MOVE_MAP } from './RubiksCube';
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

  // State to store the current cube
  const [cube, setCube] = useState<RubiksCube>();

  // State to store all buttons to perform moves
  const [buttons, setButtons] = useState<Map<string, HTMLButtonElement>>(new Map());

  // All possible moves
  const allMoves = CUBE_MOVE_MAP.get(props.cubeSize)?.keys();
  if (!allMoves) {
    throw new Error(`No moves found for cube size ${props.cubeSize}`);
  }


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

      const onKeyPressed = (event: KeyboardEvent) => {
        switch (event.key) {
          case "q":
            buttons.get("F")?.click();
            break;
          case "e":
            buttons.get("B")?.click();
            break;
          case "w":
            buttons.get("U")?.click();
            break;
          case "s":
            buttons.get("D")?.click();
            break;
          case "a":
            buttons.get("L")?.click();
            break;
          case "d":
            buttons.get("R")?.click();
            break;
          case "Q":
            buttons.get("F'")?.click();
            break;
          case "E":
            buttons.get("B'")?.click();
            break;
          case "W":
            buttons.get("U'")?.click();
            break;
          case "S":
            buttons.get("D'")?.click();
            break;
          case "A":
            buttons.get("L'")?.click();
            break;
          case "D":
            buttons.get("R'")?.click();
            break;
          case "l":
            buttons.get("x")?.click();
            break;
          case "k":
            buttons.get("y")?.click();
            break;
          case "j":
            buttons.get("z")?.click();
            break;
          case "L":
            buttons.get("x'")?.click();
            break;
          case "K":
            buttons.get("y'")?.click();
            break;
          case "J":
            buttons.get("z'")?.click();
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
                      Up
                    </td>
                    <td />
                    <td />
                  </tr>
                  <tr>
                    <td>
                      <canvas width="100px" height="100px" ref={canvasRefLeft} />
                      <br />
                      Left
                    </td>
                    <td>
                      <canvas width="100px" height="100px" ref={canvasRefFront} />
                      <br />
                      Front
                    </td>
                    <td>
                      <canvas width="100px" height="100px" ref={canvasRefRight} />
                      <br />
                      Right
                    </td>
                    <td>
                      <canvas width="100px" height="100px" ref={canvasRefBack} />
                      <br />
                      Back
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <canvas width="100px" height="100px" ref={canvasRefDown} />
                      <br />
                      Down
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
              {
                [...allMoves].map((moveName) => (
                  <button
                    key={moveName}
                    onClick={() => { if (cube) cube.doMove(moveName); }}
                    ref={(ref) => {
                      if (ref) {
                        setButtons(buttons.set(moveName, ref));
                      }
                    }}>
                    {moveName}
                  </button>
                ))
              }
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default App;
