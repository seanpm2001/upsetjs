# UpSet.js

[![NPM Package][npm-image]][npm-url] [![Github Actions][github-actions-image]][github-actions-url]

UpSet.js is a JavaScript re-implementation of [UpSetR](https://www.rdocumentation.org/packages/UpSetR/) which itself is based on [UpSet](http://vcg.github.io/upset/about/) to create interactive set visualizations for more than three sets. The core library is written in React but provides also bundle editions for plain JavaScript use. The `UpSetJS` React component is implemented as a pure functional component solely depending on the given properties.

![interactions](https://user-images.githubusercontent.com/4129778/80863076-f0f8f380-8c79-11ea-8790-f6ad86738b28.png)

More details about UpSet.js can be found on the Medium article series about it:

1. [UpSet.js — The UpSet.js Ecosystem](https://medium.com/@sgratzl/upset-js-the-upset-js-ecosystem-ab6692d2f34a?source=friends_link&sk=6925bb1f754f4c480009d82720a796b9)
1. [UpSet.js — JavaScript Tutorial](https://medium.com/@sgratzl/upset-js-javascript-tutorial-1b84bfd6896d?source=friends_link&sk=964cb1a70e194ded26f31e371639c67e)
1. [UpSet.js — Behind the (technical) Scenes](https://medium.com/@sgratzl/upset-js-behind-the-technical-scenes-6eb0c880a03e?source=friends_link&sk=2e90d4b2e21a9f65e1d387985612dc2b)

This monorepo contains following packages:

- [@upsetjs/model](https://github.com/upsetjs/upsetjs/tree/main/packages/model) the data model definition of UpSet.js
  [![Open Docs][docs]](https://upset.js.org/api/model/modules.hml)

- [@upsetjs/react](https://github.com/upsetjs/upsetjs/tree/main/packages/react) the main UpSet.js React component
  [![Open Docs][docs]](https://upset.js.org/api/react/modules.hml)

- [@upsetjs/math](https://github.com/upsetjs/upsetjs/tree/main/packages/math) utility package for computing stats

- [@upsetjs/addons](https://github.com/upsetjs/upsetjs/tree/main/packages/addons) extensions to the React component for rendering boxplots
  [![Open Docs][docs]](https://upset.js.org/api/addons/modules.hml)

- [@upsetjs/bundle](https://github.com/upsetjs/upsetjs/tree/main/packages/bundle) zero dependency bundle of the react and addons component using Preact
  [![Open Docs][docs]](https://upset.js.org/api/bundle/modules.hml)

- [@upsetjs/plots](https://github.com/upsetjs/upsetjs/tree/main/packages/plots) VEGA plot helper to be linked with UpSet.js
  [![Open Docs][docs]](https://upset.js.org/api/plots/modules.hml)

- [@upsetjs/app](https://github.com/upsetjs/upsetjs/tree/main/packages/app) example application to explore datasets using UpSet.js with import and export features
  [![Open Example][example]](https://upset.js.org/app)

- [@upsetjs/vue](https://github.com/upsetjs/upsetjs/tree/main/packages/vue) vue wrapper based on the bundled version

In addition, there are the following sibling repositories and projects

- [upsetjs_r](https://github.com/upsetjs/upsetjs_r) R HTMLWidget wrapper around UpSet.js
  [![CRAN][cran-image]][cran-url] [![Open in Binder][binder]][binder-r-url] [![Open Docs][docs]][docs-r-url] [![Open example][example]][example-r-url]

- [upsetjs_jupyter_widget](https://github.com/upsetjs/upsetjs_jupyter_widget) Jupyter Widget wrapper around UpSet.js
  [![Open in NBViewer][nbviewer]][nbviewer-url] [![Open in Binder][binder]][binder-j-url] [![Open API Docs][docs]][docs-j-url] [![Open Example][example]][example-j-url]

- [upsetjs_powerbi_visuals](https://upset.js.org/integrations/powerbi/) PowerBI Custom Visuals around UpSet.js
- [upsetjs_tableau_extension](https://upset.js.org/integrations/tableau/) Tableau extension around UpSet.js
- [upset-js](https://observablehq.com/@sgratzl/upset-js) Observable HQ wrapper around UpSet.js [![Open Example][example]][example-o-url]

## Usage and Installation

### React

```sh
npm install @upsetjs/react react react-dom
```

```ts
import React from 'react';
import UpSetJS, { extractCombinations, ISetLike } from '@upsetjs/react';

const elems = [
  { name: 'A', sets: ['S1', 'S2'] },
  { name: 'B', sets: ['S1'] },
  { name: 'C', sets: ['S2'] },
  { name: 'D', sets: ['S1', 'S3'] },
];

const { sets, combinations } = extractCombinations(elems);

<UpSetJS sets={sets} combinations={combinations} width={500} height={300} />;
```

with stored selection

```ts
const UpSetJSSelection = (props: any) => {
  [selection, setSelection] = React.useState(null as ISetLike<any> | null);

  return <UpSetJS {...props} selection={selection} onHover={setSelection} />;
};

<UpSetJSSelection sets={sets} combinations={combinations} width={500} height={300} />;
```

![simple](https://user-images.githubusercontent.com/4129778/79372711-4cc33d00-7f56-11ea-865e-e1f74261ccb2.png)

### Bundled version

```sh
npm install @upsetjs/bundle
```

```js
import { extractCombinations, render } from '@upsetjs/bundle';

const elems = [
  { name: 'A', sets: ['S1', 'S2'] },
  { name: 'B', sets: ['S1'] },
  { name: 'C', sets: ['S2'] },
  { name: 'D', sets: ['S1', 'S3'] },
];

const { sets, combinations } = extractCombinations(elems);

render(document.body, { sets, combinations, width: 500, height: 300 });
```

with stored selection

```js
let selection = null;

function onHover(set) {
  selection = set;
  rerender();
}

function rerender() {
  const props = { sets, combinations, width: 500, height: 300, selection, onHover };
  render(document.body, props);
}

rerender();
```

![simple](https://user-images.githubusercontent.com/4129778/79372711-4cc33d00-7f56-11ea-865e-e1f74261ccb2.png)

see also [![Open in CodePen][codepen]](https://codepen.io/sgratzl/pen/GRpoMZY)

## Venn Diagrams

For comparison and convenience reasons UpSet.js also has a Venn Diagram component for rendering two or three sets.

```ts
import React from 'react';
import { VennDiagram, extractSets, ISetLike } from '@upsetjs/react';

const elems = [
  { name: 'A', sets: ['S1', 'S2'] },
  { name: 'B', sets: ['S1'] },
  { name: 'C', sets: ['S2'] },
  { name: 'D', sets: ['S1', 'S3'] },
];

const sets = extractSets(elems);

<VennDiagram sets={sets} width={500} height={300} />;
```

with stored selection

```ts
const VennDiagramSelection = (props: any) => {
  [selection, setSelection] = React.useState(null as ISetLike<any> | null);

  return <VennDiagram {...props} selection={selection} onHover={setSelection} />;
};

<VennDiagramSelection sets={sets} width={500} height={300} />;
```

![venn diagram](https://user-images.githubusercontent.com/4129778/84775176-2580fe80-afdf-11ea-80b6-7b7a45a32b72.png)

```js
import { extractSets, renderVennDiagram } from '@upsetjs/bundle';

const elems = [
  { name: 'A', sets: ['S1', 'S2'] },
  { name: 'B', sets: ['S1'] },
  { name: 'C', sets: ['S2'] },
  { name: 'D', sets: ['S1', 'S3'] },
];

const sets = extractSets(elems);

renderVennDiagram(document.body, { sets, width: 500, height: 300 });
```

with stored selection

```js
let selection = null;

function onHover(set) {
  selection = set;
  rerender();
}

function rerender() {
  const props = { sets, width: 500, height: 300, selection, onHover };
  renderVennDiagram(document.body, props);
}

rerender();
```

## Karnaugh Maps

UpSet.js also has a variant of a Karnaugh Map for rendering set intersections in a dense matrix way.

```ts
import React from 'react';
import { KarnaughMap, extractSets, ISetLike } from '@upsetjs/react';

const elems = [
  { name: 'A', sets: ['S1', 'S2'] },
  { name: 'B', sets: ['S1'] },
  { name: 'C', sets: ['S2'] },
  { name: 'D', sets: ['S1', 'S3'] },
];

const sets = extractSets(elems);

<KarnaughMap sets={sets} width={550} height={300} />;
```

with stored selection

```ts
const KarnaughMapSelection = (props: any) => {
  [selection, setSelection] = React.useState(null as ISetLike<any> | null);

  return <KarnaughMap {...props} selection={selection} onHover={setSelection} />;
};

<KarnaughMapSelection sets={sets} width={550} height={300} />;
```

```js
import { extractSets, renderKarnaughMap } from '@upsetjs/bundle';

const elems = [
  { name: 'A', sets: ['S1', 'S2'] },
  { name: 'B', sets: ['S1'] },
  { name: 'C', sets: ['S2'] },
  { name: 'D', sets: ['S1', 'S3'] },
];

const sets = extractSets(elems);

renderKarnaughMap(document.body, { sets, width: 550, height: 300 });
```

with stored selection

```js
let selection = null;

function onHover(set) {
  selection = set;
  rerender();
}

function rerender() {
  const props = { sets, width: 550, height: 300, selection, onHover };
  renderKarnaughMap(document.body, props);
}

rerender();
```

![Karnaugh Map](https://user-images.githubusercontent.com/4129778/85573750-75db0a80-b636-11ea-819c-8ee1525edab0.png)

## Interactivity

By specifying `onHover` and `selection` UpSet.js is fully interactive. As an alternative there is also the `onClick` property.

![interactions](https://user-images.githubusercontent.com/4129778/80863076-f0f8f380-8c79-11ea-8790-f6ad86738b28.png)

## Queries

Similar to the original UpSetR, UpSet.js allows to specify queries by a set of elements which are then highlighted in the plot.
The first query is shown in full detail while others are shown using small indicators.

```ts
const queries = [
  { name: 'Q1', color: 'steelblue', elems: elems.filter(() => Math.random() > 0.7) },
  { name: 'Q2', color: 'red', elems: elems.filter(() => Math.random() > 0.8) },
];

render(document.body, { sets, width: 1000, height: 500, queries });
```

![queries](https://user-images.githubusercontent.com/4129778/80863309-a2e4ef80-8c7b-11ea-834d-9c5da34a386a.png)

see also [![Open in CodePen][codepen]](https://codepen.io/sgratzl/pen/BaNmpJq)

## Addons

Similar to the original UpSet and UpSetR, `UpSet` allows to render boxplot for showing numerical aggregates of sets and set combinations.

```ts
import { extractSets, render, boxplotAddon } from '@upsetjs/bundle';

const elems = [
  { name: '1', sets: ['one', 'two', 'three'], value: Math.random() },
  { name: '2', sets: ['one', 'two'], value: Math.random() },
  { name: '3', sets: ['one'], value: Math.random() },
  { name: '4', sets: ['two'], value: Math.random() },
  { name: '5', sets: ['one', 'two', 'three'], value: Math.random() },
  { name: '6', sets: ['three'], value: Math.random() },
  { name: '7', sets: ['one', 'three'], value: Math.random() },
  { name: '8', sets: ['one', 'three'], value: Math.random() },
  { name: '9', sets: ['three'], value: Math.random() },
  { name: '10', sets: ['two', 'three'], value: Math.random() },
  { name: '11', sets: ['one'], value: Math.random() },
  { name: '12', sets: ['one', 'three'], value: Math.random() },
  { name: '13', sets: ['one', 'three'], value: Math.random() },
];
const sets = extractSets(elems);

render(document.body, {
  sets,
  width: 500,
  height: 300,
  setAddons: [boxplotAddon('value', elems)],
  combinationAddons: [boxplotAddon('value', elems, { orient: 'vertical' })],
});
```

![addons](https://user-images.githubusercontent.com/4129778/79564225-85762a00-80ae-11ea-80ae-1d01a43ec45a.png)

## Plots

Similar to the original UpSet and UpSetR, support plots showing histograms, scatterplots, bar charts, or pie charts of attributes of the elements can be created and linked.

The [@upsetjs/plots](https://github.com/upsetjs/upsetjs/tree/main/packages/plots) package contains wrappers around VEGA plots which support selection and queries, to be easily linked with UpSet.js plots.

![plots](https://user-images.githubusercontent.com/4129778/84775584-b0fa8f80-afdf-11ea-9875-f4ae8b9baccb.png)

## UpSet.js App

The UpSet.js App is an web application for exploring sets and set intersections. It is the counterpart to the original [UpSet](http://vcg.github.io/upset/about/) and [UpSet2](https://vdl.sci.utah.edu/upset2/). The app is deployed at [https://upset.js.org/app](https://upset.js.org/app).

![upset_app1](https://user-images.githubusercontent.com/4129778/80863152-97dd8f80-8c7a-11ea-8677-c86598fc6161.png)

### UpSetJS

The most relevant and required properties of the `UpSetJS` component are:

```ts
{
  width: number;
  height: number;

  sets: ISet<T>[];
  combinations?: ISetCombination<T>[] | GenerateCombinationOptions<T>;

  selection?: ISetLike<T> | readonly T[] | null;

  onHover?(selection: ISetLike<T> | null): void;
  onClick?(selection: ISetLike<T> | null): void;

  queries?: UpSetQuery<T>[];
}
```

## Data

`UpSetJS` requires sets and optionally combinations of sets as input. There are some utility function to help creating the required data structures:

- `extractSets<T extends { sets: string[] }>(elements: readonly T[]): ISet<T>[]`
  given an array of elements where each is having a property called `.sets` containing a list of set names in which this element is part of. e.g. `{ sets: ['Blue Hair', 'Female']}`. The return value is a list of sets in the required data structures and having a `.elems` with an array of the input elements.
- `asSets<T, S extends { name: string; elems: readonly T[] }>(sets: readonly S[]): (S & ISet<T>)[]`
  extends the given basic set objects (`name` and `elems`) with the required attributes for `UpSetJS`
- `generateCombinations<T>(sets: ISets<T>, { type = 'intersection', min = 0, max = Infinity, empty = false } = {}): ISetCombination<T>[]`
  one needs to generate the list of the combinations to show in case of customized sorting or filtering. This function takes the array of sets as input and computed all possible set intersections (aka. power set). The options allow to limit the generation to skip `empty` set combinations or enforce a minimum/maximum amount of sets in the set combinations. There are three types: `intersection` to generate set intersections, `union` for set unions, and `distinctIntersection` for set intersections that do not appear in any other set

## Integration

### Observable HQ

[![Open Example][example]][example-o-url]

A [ObservableHQ](https://observablehq.com/) wrapper is located at [upset-js](https://observablehq.com/@sgratzl/upset-js)

```js
data = fetch(
  'https://raw.githubusercontent.com/upsetjs/upsetjs/main/packages/bundle/example/got.json'
).then(r => r.json())
}
```

```js
import { extractSets, UpSetJSElement, generateIntersections } from '@sgratzl/upset-js';
```

```js
sets = extractSets(data);
```

```js
intersections = generateIntersections(sets);
```

```js
viewof selection = UpSetJSElement(sets, intersections)
```

```js
selection ? selection.elems.map((d) => d.name) : 'None';
```

[ObservableHQ](https://observablehq.com/@sgratzl/upset-js)

An advanced example showing all datasets from the live UpSet demo is located at [ObservableHQ](https://observablehq.com/@sgratzl/upset-observable-dataset-chooser-example)

### R/RMarkdown/RShiny HTMLWidget

[![CRAN][cran-image]][cran-url] [![Open in Binder][binder]][binder-r-url] [![open docs][docs]][docs-r-url] [![open example][example]][example-r-url]

A R wrapper using [HTMLWidgets](https://www.htmlwidgets.org/) is located at [upset_r](https://github.com/upsetjs/upsetjs_r). The API follows the building pattern using the chaining operator `%>%`.
In contrast to the original UpsetR implementation it focusses on the UpSet plot itself only. However it supports interactivity either using custom Shiny events or HTMLWidgets Crosstalk. See also Shiny examples.

```R
# CRAN version
install.packages('upsetjs')
# or
devtools::install_url("https://github.com/upsetjs/upsetjs_r/releases/latest/download/upsetjs.tar.gz")
library(upsetjs)
```

```R
listInput <- list(one = c(1, 2, 3, 5, 7, 8, 11, 12, 13), two = c(1, 2, 4, 5, 10), three = c(1, 5, 6, 7, 8, 9, 10, 12, 13))
upsetjs() %>% fromList(listInput) %>% interactiveChart()
```

![List Input Example](https://user-images.githubusercontent.com/4129778/79375541-10dda700-7f59-11ea-933a-a3ffbca1bfd2.png)

see also [Basic.Rmd](https://github.com/upsetjs/upsetjs_r/main/vignettes/basic.Rmd)

### Jupyter Widget

[![Open in NBViewer][nbviewer]][nbviewer-url] [![Open in Binder][binder]][binder-j-url] [![Open API Docs][docs]][docs-j-url] [![Open Example][example]][example-j-url]

A Jupyter Widget wrapper is located at [upsetjs_jupyter_widget](https://github.com/upsetjs/upsetjs_jupyter_widget).

```bash
pip install upsetjs_jupyter_widget
jupyter labextension install @jupyter-widgets/jupyterlab-manager@3.0.0-alpha.0
```

```python
from upsetjs_jupyter_widget import UpSetJSWidget
```

```python
w = UpSetJSWidget[str]()
w.from_dict(dict(one = ['a', 'b', 'c', 'e', 'g', 'h', 'k', 'l', 'm'], two = ['a', 'b', 'd', 'e', 'j'], three = ['a', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'm']))
w
```

![upset_from_dict](https://user-images.githubusercontent.com/4129778/79368564-e4715d00-7f4f-11ea-92f5-23ee89b5332f.png)

### PowerBI

A [PowerBI Custom Visual](https://powerbi.microsoft.com/en-us/developers/custom-visualization/?cdn=disable) is located at [upsetjs_powerbi_visuals](https://upset.js.org/integrations/powerbi).

Download the latest package from [https://upset.js.org/integrations/powerbi/upsetjs.pbiviz](https://upset.js.org/integrations/powerbi/upsetjs.pbiviz) and install into your PowerBI environment.

![UpSet.js Report](https://user-images.githubusercontent.com/4129778/80864985-9b771380-8c86-11ea-809c-a4473b32ed3b.png)

Another PowerBI Custom Visual for rendering Venn Diagrams can be downloaded from [https://upset.js.org/integrations/powerbi/upsetjs_venn.pbiviz](https://upset.js.org/integrations/powerbi/upsetjs_venn.pbiviz).

![UpSet.js Report](https://user-images.githubusercontent.com/4129778/85765896-d6417900-b716-11ea-8b89-8ae01f6456a0.png)

### Tableau

A [Tableau](https://tableau.com) extension is located at [upsetjs_tableau_extension](https://upset.js.org/integrations/tableau).

1. Download the extension description file at [upsetjs.trex](https://upset.js.org/integrations/tableau/upsetjs.trex)
1. Create a new dashboard and show at least one sheet in the dashboard
1. Follow [https://tableau.github.io/extensions-api/docs/trex_overview.html](https://tableau.github.io/extensions-api/docs/trex_overview.html) and choose the downloaded file
1. Use the `configure` button or the `configure` menu entry to specify the input data

![image](https://user-images.githubusercontent.com/4129778/80864773-04f62280-8c85-11ea-8db5-6df21683de0f.png)

## Dev Environment

```sh
npm i -g yarn
yarn install
```

### Commands

### Testing

```sh
yarn test
```

### Linting

```sh
yarn lint
```

### Building

```sh
yarn install
yarn build
```

### Release

[Release-it](https://github.com/release-it/release-it/) is used:

```sh
yarn release
```

### Release Policy

to simplify this monorepo together with its siblings the following strategy for versioning is used:
Major and Minor versions should be in sync. Patch version are independent except the 10 potent.
Thus, a next unified patch release should be increased to the next 10 potent.

e.g.,

```
upsetjs -> 0.5.0, upsetjs_r -> 0.5.0 good
upsetjs -> 0.5.2, upsetjs_r -> 0.5.3 good since 0.5.02 ~ 0.5.03
upsetjs -> 0.5.10, upsetjs_r -> 0.5.5 bad should be upsetjs_r -> 0.5.10, too
```

## Privacy Policy

UpSet.js is a client only library. The library and all of its integrations (such as `Ultimate UpSet Plot` and `Ultimate Venn Digramm` for PowerBI) don't track you or transfer your data or personal information to any server.
The uploaded data in the app (located at https://upset.js.org/app) are stored in your browser only using IndexedDB. The Tableau extension can run in a sandbox environment prohibiting any server requests.
However, as soon as you export your session within the app (located at https://upset.js.org/app) to an external service (e.g., Codepen.io) your data will be transferred.

## License / Terms of Service

### Commercial license

If you want to use UpSet.js for a commercial application or in a commercial environment, the commercial license is the appropriate license. Contact [@sgratzl](mailto:sam@sgratzl.com) for details.

### Open-source license

This library is released under the `GNU AGPLv3` version to be used for private and academic purposes.
In case of a commercial use, please get in touch regarding a commercial license.

[npm-image]: https://badge.fury.io/js/%40upsetjs%2Freact.svg
[npm-url]: https://npmjs.org/package/@upsetjs/react
[github-actions-image]: https://github.com/upsetjs/upsetjs/workflows/ci/badge.svg
[github-actions-url]: https://github.com/upsetjs/upsetjs/actions
[codepen]: https://img.shields.io/badge/CodePen-open-blue?logo=codepen
[codesandbox]: https://img.shields.io/badge/CodeSandbox-open-blue?logo=codesandbox
[nbviewer]: https://img.shields.io/badge/NBViewer-open-blue?logo=jupyter
[nbviewer-url]: https://nbviewer.jupyter.org/github/upsetjs/upsetjs_jupyter_widget/blob/main/examples/introduction.ipynb
[binder]: https://mybinder.org/badge_logo.svg
[binder-r-url]: https://mybinder.org/v2/gh/upsetjs/upsetjs_r/master?urlpath=rstudio
[binder-j-url]: https://mybinder.org/v2/gh/upsetjs/upsetjs_jupyter_widget/master?urlpath=lab/tree/examples/introduction.ipynb
[docs]: https://img.shields.io/badge/API-open-blue
[docs-r-url]: https://upset.js.org/integrations/r/
[docs-j-url]: https://upset.js.org/api/jupyter/
[example]: https://img.shields.io/badge/Example-open-red
[example-r-url]: https://upset.js.org/integrations/r/articles/basic
[example-j-url]: https://upset.js.org/integrations/jupyter/
[example-o-url]: https://observablehq.com/@sgratzl/upset-observable-example
[cran-image]: https://img.shields.io/cran/v/upsetjs
[cran-url]: https://www.rdocumentation.org/packages/upsetjs
