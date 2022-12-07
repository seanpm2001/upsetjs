/**
 * @upsetjs/examples
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2019-2022 Samuel Gratzl <sam@sgratzl.com>
 */

import { KarnaughMapSkeleton, UpSetJSSkeleton, VennDiagramSkeleton } from '@upsetjs/react';
import React from 'react';
import './styles.css';

function UpSetPlot() {
  return (
    <div>
      <UpSetJSSkeleton width={780} height={500} />
      <VennDiagramSkeleton width={780} height={500} />
      <KarnaughMapSkeleton width={780} height={500} />
    </div>
  );
}

export default function App(): JSX.Element {
  // const isDarkTheme = window.matchMedia != null && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return (
    <div className="App">
      <UpSetPlot />
    </div>
  );
}
