/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2019-2022 Samuel Gratzl <sam@sgratzl.com>
 */

export const DEG2RAD = (1 / 180) * Math.PI;

export function pointAtCircle(cx: number, cy: number, radius: number, angle: number) {
  return {
    x: cx + Math.cos(angle * DEG2RAD) * radius,
    y: cy + Math.sin(angle * DEG2RAD) * radius,
  };
}
