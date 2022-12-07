/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2019-2022 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetComposite, ISetLike, UpSetSelection, isSetCombination, ISetCombination } from '@upsetjs/react';
import { RefObject, useLayoutEffect, useMemo, MutableRefObject, useRef } from 'react';
import type { View } from 'vega';
import type { TopLevelSelectionParameter } from 'vega-lite/build/src/selection';
import { sameArray } from './utils';

export function createSetComposite<T>(elems: readonly T[]): ISetComposite<T> {
  return {
    name: 'Vega Selection',
    type: 'composite',
    cardinality: elems.length,
    degree: 0,
    elems,
    sets: new Set(),
  };
}

export function updateMulti<T>(
  selection: string,
  view: View,
  s: ISetCombination<T>,
  transformedData: string,
  unitData: string,
  elemField: string
) {
  const v = view.signal(`${selection}_tuple`) as { values: number[] };
  const allData: any[] = view.data(transformedData);
  const lookup = new Set(s.elems);
  const values = allData.filter((b) => lookup.has(b[elemField])).map((d) => d._vgsid_);

  const current = v ? v.values : [];
  if (sameArray(current, values)) {
    return;
  }
  const entry = v
    ? Object.assign({}, v, { values })
    : { unit: unitData, fields: view.signal(`${selection}_tuple_fields`, values) };
  view.signal(`${selection}_tuple`, entry);
}

/** @internal */
export function clearMulti(selection: string, view: View) {
  const v = view.signal(`${selection}_tuple`) as { values: number[] };
  if (!v || !Array.isArray(v.values) || v.values.length === 0) {
    return;
  }
  view.signal(`${selection}_tuple`, null);
}

/** @internal */
export function generateListener<T>(
  viewRef: RefObject<View>,
  selectionRef: RefObject<UpSetSelection<T> | undefined>,
  toElemKey: undefined | ((v: any) => string),
  listener: (v: ISetLike<T> | readonly T[] | null) => void,
  transformedData: string,
  elemField: string
) {
  return (_type: string, item: unknown) => {
    if (!viewRef.current) {
      return;
    }
    const data = item as { _vgsid_: number[] };
    if (!data || !data._vgsid_ || data._vgsid_.length === 0) {
      listener(null);
      return;
    }
    const contained = new Set(data._vgsid_);
    const allElems = viewRef.current.data(transformedData);
    const elems = allElems.filter((d) => contained.has(d._vgsid_)).map((d) => d[elemField] as T);
    if (elems.length === 0) {
      listener(null);
      return;
    }

    if (
      selectionRef.current &&
      isSetCombination(selectionRef.current) &&
      sameArray(selectionRef.current.elems, elems, toElemKey)
    ) {
      return;
    }
    const set = createSetComposite(elems);
    listener(set);
  };
}

export function useVegaMultiSelection<T>(
  mode: 'single' | 'multi',
  viewRef: RefObject<View>,
  toElemKey: undefined | ((v: any) => string),
  selection: UpSetSelection<T> | undefined,
  onClick?: (v: ISetLike<T> | readonly T[] | null) => void,
  onHover?: (v: ISetLike<T> | readonly T[] | null) => void,
  { paramName = 'select', transformedData = 'data_0', unitData = '', elemField = 'e' } = {}
) {
  const selectionRef = useRef(selection);
  const listeners = useMemo(() => {
    if (!onClick && !onHover) {
      return undefined;
    }
    const r: { [key: string]: (type: string, item: unknown) => void } = {};
    if (onClick) {
      r[paramName] = generateListener(viewRef, selectionRef, toElemKey, onClick, transformedData, elemField);
    }
    if (onHover) {
      r[`${paramName}_hover`] = generateListener(viewRef, selectionRef, toElemKey, onHover, transformedData, elemField);
    }
    return r;
  }, [onClick, onHover, viewRef, selectionRef, paramName, transformedData, elemField, toElemKey]);

  // update bin selection with selection
  useLayoutEffect(() => {
    (selectionRef as MutableRefObject<UpSetSelection<any>>).current = selection ?? null;
    if (!viewRef.current || !onClick) {
      return;
    }
    if (isSetCombination(selection)) {
      updateMulti(paramName, viewRef.current, selection, transformedData, unitData, elemField);
    } else if (selection == null) {
      clearMulti(paramName, viewRef.current);
    }
  }, [viewRef, selection, paramName, onClick, transformedData, unitData, elemField]);

  const paramSpec = useMemo(() => {
    const r: TopLevelSelectionParameter[] = [];
    if (onClick) {
      r.push({
        name: paramName,
        select: {
          type: mode === 'single' ? 'point' : 'interval',
        },
      });
    }
    if (onHover) {
      r.push({
        name: `${paramName}_hover`,
        select: {
          type: 'point',
          on: 'mouseover',
        },
      });
    }
    return r;
  }, [mode, paramName, onClick, onHover]);
  return {
    signalListeners: listeners,
    hoverParamName: onHover ? `${paramName}_hover` : null,
    paramName: onClick ? paramName : null,
    params: paramSpec,
  };
}
