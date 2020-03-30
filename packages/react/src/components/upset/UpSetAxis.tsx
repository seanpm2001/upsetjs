import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';
import { UpSetStyles } from './defineStyle';
import D3Axis from './D3Axis';
import { UpSetStyleClassNames, UpSetReactStyles } from '../config';
import { clsx } from './utils';

export default React.memo(function UpSetAxis({
  scales,
  styles,
  setName,
  combinationName,
  combinationNameAxisOffset,
  classNames,
  cStyles,
}: PropsWithChildren<{
  scales: UpSetScales;
  styles: UpSetStyles;
  setName: string | React.ReactNode;
  combinationName: string | React.ReactNode;
  combinationNameAxisOffset: number;
  classNames: UpSetStyleClassNames;
  cStyles: UpSetReactStyles;
}>) {
  return (
    <g>
      <g transform={`translate(${styles.sets.w + styles.labels.w},0)`}>
        <D3Axis
          d3Scale={scales.combinations.y}
          orient="left"
          integersOnly
          tickClassName={classNames.axisTick}
          tickStyle={cStyles.axisTick}
        />
        <line
          x1={0}
          x2={styles.combinations.w}
          y1={styles.combinations.h + 1}
          y2={styles.combinations.h + 1}
          className="axisLine"
        />
        <text
          className={clsx('chartTextStyle', 'middleText', classNames.chartLabel)}
          style={cStyles.chartLabel}
          transform={`translate(${-combinationNameAxisOffset}, ${styles.combinations.h / 2})rotate(-90)`}
        >
          {combinationName}
        </text>
      </g>
      <g transform={`translate(0,${styles.combinations.h})`}>
        <D3Axis
          d3Scale={scales.sets.x}
          orient="bottom"
          transform={`translate(0, ${styles.sets.h})`}
          integersOnly
          tickClassName={classNames.axisTick}
          tickStyle={cStyles.axisTick}
        />
        <text
          className={clsx('chartTextStyle', 'middleText', classNames.chartLabel)}
          style={cStyles.chartLabel}
          transform={`translate(${styles.sets.w / 2}, ${styles.sets.h + 30})`}
        >
          {setName}
        </text>
      </g>
    </g>
  );
});
