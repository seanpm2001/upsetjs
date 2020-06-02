/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISets, ISet } from '../model';
import { PostprocessSetOptions, postprocessSets } from './asSets';

/**
 * extract sets out of a given element array, where an accessor is used to specify the set names
 * @param elements list of elements
 * @param acc accessor to get the list of sets the element belong to
 * @param options postprocess options
 */
export default function extractSets<T>(
  elements: ReadonlyArray<T>,
  acc: (elem: T) => string[],
  options?: PostprocessSetOptions
): ISets<T>;
/**
 * extract sets out of a given element array which have a `.sets` property
 * @param elements
 * @param options postprocess options
 */
export default function extractSets<T extends { sets: string[] }>(
  elements: ReadonlyArray<T>,
  options?: PostprocessSetOptions
): ISets<T>;

export default function extractSets<T>(
  elements: ReadonlyArray<T>,
  accOrOptions?: PostprocessSetOptions | ((elem: T) => string[]),
  o: PostprocessSetOptions = {}
): ISets<T> {
  const acc = typeof accOrOptions === 'function' ? accOrOptions : (e: T) => ((e as unknown) as { sets: string[] }).sets;
  const options: PostprocessSetOptions = (typeof accOrOptions !== 'function' ? accOrOptions : o) ?? {};

  const sets = new Map<string, T[]>();

  elements.forEach((elem) => {
    acc(elem).forEach((set) => {
      const s = String(set);
      if (!sets.has(s)) {
        sets.set(s, [elem]);
      } else {
        sets.get(s)!.push(elem);
      }
    });
  });
  return postprocessSets(
    Array.from(sets).map(([set, elems]) => {
      const r: ISet<T> = {
        type: 'set',
        elems,
        name: String(set),
        cardinality: elems.length,
      };
      return r;
    }),
    options
  );
}
