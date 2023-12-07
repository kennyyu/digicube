import React, { useRef, useEffect, useState } from 'react';
import { RubiksCube } from './RubiksCube';
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

  // Buttons that can be triggered by hotkeys
  const [faceButtons, setFaceButtons] =
    useState<Map<string, HTMLButtonElement>>(new Map());
  const [layerInputs, setLayerInputs] =
    useState<Map<number, HTMLInputElement>>(new Map());

  // Currently selected layer
  const [layer, setLayer] = useState<number>(1);

  // Combines the selected layer and face and executes the move
  const moveFaceAndLayer = (faceName: string) => {
    const moveName =
      `${(layer === 1 || ["x", "x'", "y", "y'", "z", "z'"].includes(faceName))
        ? ""
        : layer}${faceName}`;
    cube?.doMove(moveName)
  };

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
      // Select layer 0 as default
      layerInputs.get(1)?.click();

      const hotkeyToFaceMap = new Map<string, string>([
        ["q", "F"],
        ["e", "B"],
        ["w", "U"],
        ["s", "D"],
        ["a", "L"],
        ["d", "R"],
        ["Q", "F'"],
        ["E", "B'"],
        ["W", "U'"],
        ["S", "D'"],
        ["A", "L'"],
        ["D", "R'"],
        ["l", "x"],
        ["k", "y"],
        ["j", "z"],
        ["L", "x'"],
        ["K", "y'"],
        ["J", "z'"],
      ]);

      const onKeyPressed = (event: KeyboardEvent) => {
        switch (event.key) {
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            const layerNum = parseInt(event.key);
            layerInputs.get(layerNum)?.click();
            break;
          default:
            const faceName = hotkeyToFaceMap.get(event.key);
            if (!faceName) {
              break;
            }
            faceButtons.get(faceName)?.click();
            break;
        }
      };
      document.addEventListener("keydown", onKeyPressed, false);
    }
  }, [props, faceButtons, layerInputs]);

  return (
    <>
      <table>
        <tbody>
          <tr>
            <td>
              <button onClick={() => { cube?.scramble() }}>
                Scramble
              </button>
              <button onClick={() => {
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
                }
              }}>
                Reset
              </button>
            </td>
          </tr>
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
              Full Cube Rotation:
              {
                ["x", "x'", "y", "y'", "z", "z'"]
                  .map((moveName) => (
                    <button
                      key={moveName}
                      onClick={() => { if (cube) cube.doMove(moveName); }}
                      ref={(ref) => {
                        if (ref) {
                          setFaceButtons(faceButtons.set(moveName, ref));
                        }
                      }}>
                      {moveName}
                    </button>
                  ))
              }
            </td>
          </tr>
          <tr>
            <td>
              Layer:
              {
                [...Array(Math.floor(props.cubeSize / 2)).keys()]
                  .map((layerNum: number) => layerNum + 1)
                  .map((layerNum: number) => (
                    <>
                      <input
                        type="radio"
                        value={layerNum}
                        id={`Layer${layerNum}`}
                        name="layerNum"
                        onChange={() => { setLayer(layerNum) }}
                        defaultChecked={layerNum === 1}
                        ref={(ref) => {
                          if (ref) {
                            setLayerInputs(layerInputs.set(layerNum, ref));
                          }
                        }}
                      />
                      <label htmlFor={`Layer${layerNum}`}>
                        {layerNum}
                      </label>
                    </>
                  ))
              }
            </td>
          </tr>
          <tr>
            <td>
              Face Rotation:
              {
                ["F", "F'", "B", "B'", "U", "U'", "D", "D'", "R", "R'", "L", "L'"]
                  .map((faceName) => (
                    <button
                      key={faceName}
                      onClick={() => { moveFaceAndLayer(faceName); }}
                      ref={(ref) => {
                        if (ref) {
                          setFaceButtons(faceButtons.set(faceName, ref));
                        }
                      }}>
                      {faceName}
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
