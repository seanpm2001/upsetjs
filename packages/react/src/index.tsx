/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { RefAttributes, ReactElement } from 'react';
import { UpSetJS, UpSetProps } from './UpSetJS';

export * from './exporter';
export * from './UpSetJS';
export * from './fillDefaults';
export * from '@upsetjs/model';

/**
 * UpSetJS main pure functional stateless React component, the generic argument T refers to the type of the elements
 *
 * with React.forwardRef support to specify a reference to the SVG element
 */
export default UpSetJS as <T>(p: UpSetProps<T> & RefAttributes<SVGSVGElement>) => ReactElement;
