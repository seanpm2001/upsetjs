/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetComposite, ISetLike, isSetLike, UpSetSelection } from '@upsetjs/react';
import { RefObject, useLayoutEffect, useMemo } from 'react';
import { View } from 'vega';
import { SingleSelection } from 'vega-lite/build/src/selection';

export interface IBinSetComposite<T> extends ISetComposite<T> {
  readonly subType: 'bin';
  readonly attr: string;
  readonly bins: ReadonlyArray<[number, number]>;
}

export function isBinSetComposite<T>(s: UpSetSelection<T> | undefined, attr: string): s is IBinSetComposite<T> {
  return (
    s != null &&
    isSetLike(s) &&
    s.type === 'composite' &&
    (s as IBinSetComposite<T>).subType === 'bin' &&
    (s as IBinSetComposite<T>).attr === attr
  );
}

export function createBinSetComposite<T>(
  attr: string,
  elems: ReadonlyArray<T>,
  bins: ReadonlyArray<[number, number]>
): IBinSetComposite<T> {
  return {
    name: `Bin ${attr}: ${bins.map((bin) => `[${bins[0]},${bin[1]})`).join(', ')}`,
    type: 'composite',
    subType: 'bin',
    cardinality: elems.length,
    degree: 0,
    elems,
    sets: new Set(),
    bins,
    attr,
  };
}

function sameIntervalArray(a: [number, number], b: [number, number]): boolean {
  return a === b || (a != null && b != null && a[0] === b[0] && a[1] === b[1]);
}

function sameBins(a: ReadonlyArray<[number, number]>, b: ReadonlyArray<[number, number]>) {
  return a === b || (a.length === b.length && a.every((ai, i) => sameIntervalArray(ai, b[i])));
}

interface IBinStructure {
  _vgsid_: number;
  bin_maxbins_10_v: number;
  bin_maxbins_10_v_end: number;
}

function sameIds(a: number[], b: number[]) {
  if (a.length !== b.length) {
    return false;
  }
  const bs = new Set(b);
  return a.every((ai) => bs.has(ai));
}

function updateBins(selection: string, view: View, s: IBinSetComposite<any>) {
  const v = view.signal(`${selection}_tuple`) as { values: number[] };
  const allBins: IBinStructure[] = view.data('data_1');
  const values = allBins.filter((b) => s.bins.find((sb) => sb[0] === b.bin_maxbins_10_v)).map((d) => d._vgsid_);

  const current = v ? v.values : [];
  if (sameIds(current, values)) {
    return;
  }
  const entry = v
    ? Object.assign({}, v, { values })
    : { unit: 'layer_0', fields: view.signal(`${selection}_tuple_fields`, values) };
  view.signal(`${selection}_tuple`, entry);
}

function clearBins(selection: string, view: View) {
  const v = view.signal(`${selection}_tuple`) as { values: number[] };
  if (!v || v.values.length === 0) {
    return;
  }
  view.signal(`${selection}_tuple`, null);
}

export function useVegaBinSelection<T>(
  viewRef: RefObject<View>,
  selection: UpSetSelection<T> | undefined,
  name: string,
  onClick?: (v: ISetLike<T> | ReadonlyArray<T> | null) => void,
  onHover?: (v: ISetLike<T> | ReadonlyArray<T> | null) => void,
  selectionName = 'select'
) {
  const listeners = useMemo(() => {
    if (!onClick && !onHover) {
      return undefined;
    }
    const r: { [key: string]: (type: string, item: unknown) => void } = {};
    const generate = (listener: (v: ISetLike<T> | ReadonlyArray<T> | null) => void) => (
      _type: string,
      item: unknown
    ) => {
      if (!viewRef.current) {
        return;
      }
      const data = item as { _vgsid_: number[] };
      if (data._vgsid_.length === 0) {
        listener(null);
        return;
      }
      const contained = new Set(data._vgsid_);
      const allBins: IBinStructure[] = viewRef.current.data('data_1');
      const bins = allBins
        .filter((d) => contained.has(d._vgsid_))
        .map((bin) => [bin.bin_maxbins_10_v, bin.bin_maxbins_10_v_end] as [number, number]);
      if (isBinSetComposite(selection, name) && sameBins(selection.bins, bins)) {
        return;
      }
      const table: { v: number; e: T }[] = viewRef.current.data('table');
      const elems = table.filter((d) => bins.some((b) => b[0] <= d.v && d.v <= b[1])).map((d) => d.e);
      const set = createBinSetComposite(name, elems, bins);
      listener(set);
    };
    if (onClick) {
      r[selectionName] = generate(onClick);
    }
    if (onHover) {
      r[`${selectionName}_hover`] = generate(onHover);
    }
    return r;
  }, [onClick, onHover, viewRef, name, selection, selectionName]);

  // update bin selection with selection
  useLayoutEffect(() => {
    if (!viewRef.current) {
      return;
    }
    if (isBinSetComposite(selection, name)) {
      updateBins(selectionName, viewRef.current, selection);
    } else if (selection == null) {
      clearBins(selectionName, viewRef.current);
    }
  }, [viewRef, selection, name, selectionName]);

  return {
    signalListeners: listeners,
    selectionName,
    selection: {
      [selectionName]: { type: 'single', empty: 'none' } as SingleSelection,
      [`${selectionName}_hover`]: { type: 'single', empty: 'none', on: 'mouseover' } as SingleSelection,
    },
  };
}
