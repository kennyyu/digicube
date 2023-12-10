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

enum CubeTouchEventDirection {
  BottomRight = "BottomRight",
  TopLeft = "TopLeft",
  TopRight = "TopRight",
  BottomLeft = "BottomLeft",
  HorizontalRight = "HorizontalRight",
  HorizontalLeft = "HorizontalLeft",
};

enum ScreenHalf {
  Upper = "Upper",
  Lower = "Lower",
};

type CubeTouchEvent = {
  numFingers: number;
  direction: CubeTouchEventDirection;
  screenHalf: ScreenHalf;
};

type TouchState = {
  activeTouchMap: Map<number, Touch>;
};

function getMoveFromCubeTouchEvent(event: CubeTouchEvent): string | undefined {
  const touchEventMap = new Map<CubeTouchEventDirection, Map<number, Map<ScreenHalf, string>>>([
    [CubeTouchEventDirection.BottomRight, new Map([
      [1, new Map([
        [ScreenHalf.Upper, "B"],
        [ScreenHalf.Lower, "F"],
      ])],
      [2, new Map([
        [ScreenHalf.Upper, "z"],
        [ScreenHalf.Lower, "z"]
      ])],
    ])],
    [CubeTouchEventDirection.TopLeft, new Map([
      [1, new Map([
        [ScreenHalf.Upper, "B'"],
        [ScreenHalf.Lower, "F'"],
      ])],
      [2, new Map([
        [ScreenHalf.Upper, "z'"],
        [ScreenHalf.Lower, "z'"]
      ])],
    ])],
    [CubeTouchEventDirection.TopRight, new Map([
      [1, new Map([
        [ScreenHalf.Upper, "L"],
        [ScreenHalf.Lower, "R"],
      ])],
      [2, new Map([
        [ScreenHalf.Upper, "x"],
        [ScreenHalf.Lower, "x"]
      ])],
    ])],
    [CubeTouchEventDirection.BottomLeft, new Map([
      [1, new Map([
        [ScreenHalf.Upper, "L'"],
        [ScreenHalf.Lower, "R'"],
      ])],
      [2, new Map([
        [ScreenHalf.Upper, "x'"],
        [ScreenHalf.Lower, "x'"]
      ])],
    ])],
    [CubeTouchEventDirection.HorizontalRight, new Map([
      [1, new Map([
        [ScreenHalf.Upper, "U'"],
        [ScreenHalf.Lower, "D'"],
      ])],
      [2, new Map([
        [ScreenHalf.Upper, "y'"],
        [ScreenHalf.Lower, "y'"]
      ])],
    ])],
    [CubeTouchEventDirection.HorizontalLeft, new Map([
      [1, new Map([
        [ScreenHalf.Upper, "U"],
        [ScreenHalf.Lower, "D"],
      ])],
      [2, new Map([
        [ScreenHalf.Upper, "y"],
        [ScreenHalf.Lower, "y"]
      ])],
    ])],
  ]);

  return touchEventMap.get(event.direction)?.get(event.numFingers)?.get(event.screenHalf);
}

let touchHandlerRegistered = false;

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

      // Stores the map of active touches
      let touchState: TouchState = {
        activeTouchMap: new Map(),
      };

      const onTouchStart = (event: TouchEvent) => {
//        event.preventDefault();

        for (const touch of event.changedTouches) {
          touchState.activeTouchMap.set(touch.identifier, touch);
        }
      };

      const onTouchEnd = (event: TouchEvent) => {
//        event.preventDefault();

        const isMultipleFingers = event.changedTouches.length > 1;

        for (const touch of event.changedTouches) {
          console.log("touch end");
          console.log(touch);
          const startTouch = touchState.activeTouchMap.get(touch.identifier);
          if (!startTouch) {
            continue;
          }
          console.log("touch start");
          console.log(startTouch);

          // If x and y are too close, ignore
          if (Math.abs(startTouch.clientX - touch.clientX) < 10
            && Math.abs(startTouch.clientY - touch.clientY) < 10) {
            continue;
          }

          // Get direction
          const isGoingRight = startTouch.clientX < touch.clientX;
          const isGoingDown = startTouch.clientY < touch.clientY;
          // TODO: remove constant
          const isHorizontal = Math.abs(startTouch.clientY - touch.clientY) < 10;
          let direction = CubeTouchEventDirection.BottomLeft;
          if (isGoingRight && isHorizontal) {
            direction = CubeTouchEventDirection.HorizontalRight;
          } else if (isGoingRight && isGoingDown) {
            direction = CubeTouchEventDirection.BottomRight;
          } else if (isGoingRight && !isGoingDown) {
            direction = CubeTouchEventDirection.TopRight;
          } else if (!isGoingRight && isHorizontal) {
            direction = CubeTouchEventDirection.HorizontalLeft;
          } else if (!isGoingRight && isGoingDown) {
            direction = CubeTouchEventDirection.BottomLeft;
          } else if (!isGoingRight && !isGoingDown) {
            direction = CubeTouchEventDirection.TopLeft;
          }

          // Get screen half
          // TODO: remove constants
          let midPosY = 0;
          switch (direction) {
            case CubeTouchEventDirection.TopLeft:
            case CubeTouchEventDirection.BottomRight:
              midPosY = 248;
              break;
            case CubeTouchEventDirection.BottomLeft:
            case CubeTouchEventDirection.TopRight:
              midPosY = 248;
              break;
            case CubeTouchEventDirection.HorizontalRight:
            case CubeTouchEventDirection.HorizontalLeft:
              midPosY = 426;
              break;

          }
          const screenHalf = (
            (midPosY - startTouch.clientY)
            + (midPosY - touch.clientY)
          ) > 0
            ? ScreenHalf.Upper
            : ScreenHalf.Lower;

          const cubeTouchEvent = {
            numFingers: isMultipleFingers ? 2 : 1,
            direction: direction,
            screenHalf: screenHalf,
          };
          console.log(cubeTouchEvent);
          const faceName = getMoveFromCubeTouchEvent(cubeTouchEvent);
          if (!faceName) {
            continue;
          }
          faceButtons.get(faceName)?.click();
          // Only execute cube rotation once
          if (isMultipleFingers) {
            break;
          }
        }
        for (const touch of event.changedTouches) {
          touchState.activeTouchMap.delete(touch.identifier);
        }
      };

      document.addEventListener("keydown", onKeyPressed, false);

      // Ensure the handler is registered only once
      if (!touchHandlerRegistered) {
        canvasRef.current.addEventListener("touchstart", onTouchStart, { passive: false });
        canvasRef.current.addEventListener("touchend", onTouchEnd, { passive: false });
        touchHandlerRegistered = true;
      }
    }
  }, [props, faceButtons, layerInputs]);

  return (
    <>
      <table>
        <tbody>
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
        </tbody>
      </table>
    </>
  );
}

export default App;
