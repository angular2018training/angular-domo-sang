/**
 * Base layer to draw each layer of the chart
 */

import { Margin, Size } from '../interfaces';
import { Container } from '../containers/container';

export class Layer {

    /**
     * Data must be a array object with keys in the first element of each object.
     * Must convert data before draw anything
     */
    public render(container : Container) : void {
    }
}