import { AbstractControlOptions, AsyncValidatorFn, ValidatorFn } from '@angular/forms'
import { TypedFormControl } from './typed-form-control'
import { SimpleFormArray } from './simple-form-array'

export type SimpleListConfig<T> = {
  /**
   * An array item construction of child controls. Each child control is given an index where it is registered.
   */
  constructListItem: (index?: number, values?: T[]) => TypedFormControl<T>

  /**
   * initial list size where it is registered.
   */
  size: number
}
/**
 * Handy class to extend for creating homogenous typed list,
 * equivalent to `TypedFormArray<TypedFormControl<T>>`
 *
 */
export class SimpleList<T> extends SimpleFormArray<TypedFormControl<T>> {
  /**
   * Creates a new `SimpleFormArray` instance.
   *
   * @usageNotes
   * ### Create a SimpleFormArray with homogeneous type `string | null`
   *
   * ```
   * const arr = new SimpleList<string | null>({
   *   constructListItem: () => new TypedFormControl<string | null>(null),
   *   size: 2
   * });
   * console.log(arr.value);   // [null, null]
   *
   * arr.setValue(['Nancy', 'Drew']);
   * console.log(arr.value);   // ['Nancy', 'Drew']
   * ```
   *
   * @param listConfig An initialize configuration
   *
   * @param validatorOrOpts A synchronous validator function, or an array of
   * such functions, or an `AbstractControlOptions` object that contains validation functions
   * and a validation trigger.
   *
   * @param asyncValidator A single async validator or array of async validator functions
   *
   */
  constructor(
    public listConfig: SimpleListConfig<T>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super(
      {
        constructArrayItem: (index: number, values: T[]) => listConfig.constructListItem(index, values),
        size: listConfig.size,
      },
      validatorOrOpts,
      asyncValidator,
    )
  }
}
