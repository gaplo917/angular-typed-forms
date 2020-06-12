import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, ValidatorFn } from '@angular/forms'
import { InferTypedFormArray, InferTypedFormArrayPartial } from '../types'
import { TypedFormArray } from './typed-form-array'
import { syncControl } from '../sync-control'

export type SimpleFormArrayConfig<T> = {
  /**
   * An array item construction of child controls. Each child control is given an index where it is registered.
   */
  constructArrayItem: (index?: number, values?: InferTypedFormArray<T>) => T

  /**
   * initial array size where it is registered.
   */
  size: number
}

/**
 * Handy class to extend, compatible to `TypedFormArray<T>` usage and added `fullSync` and `partialSync` API.
 * Noted that the `*sync` API require a construct function to work properly.
 * Only `SimpleFormArray` type will be apply `*sync` recursively.
 *
 * @usageNotes
 * ### Create a SimpleFormArray with homogeneous type `string | null`
 *
 * ```
 * const arr = new SimpleFormArray<TypedFormControl<string | null>>({
 *   constructArrayItem: () => new TypedFormControl<string | null>(null),
 *   size: 2
 * });
 * console.log(arr.value);   // [null, null]
 *
 * arr.setValue(['Nancy', 'Drew']);
 * console.log(arr.value);   // ['Nancy', 'Drew']
 * ```
 */
export class SimpleFormArray<T extends AbstractControl> extends TypedFormArray<T> {
  /**
   * Creates a new `SimpleFormArray` instance.
   *
   * @param controlsConfig An initialize configuration
   *
   * @param validatorOrOpts A synchronous validator function, or an array of
   * such functions, or an `AbstractControlOptions` object that contains validation functions
   * and a validation trigger.
   *
   * @param asyncValidator A single async validator or array of async validator functions
   *
   */
  constructor(
    public controlsConfig: SimpleFormArrayConfig<T>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super(
      new Array(controlsConfig.size).fill(0).map((e, idx) => controlsConfig.constructArrayItem(idx)),
      validatorOrOpts,
      asyncValidator,
    )
  }

  /**
   * Fully-typed and synchronize the children form control with the value recursively.
   * Before setting the value of the `FormArray`, it tries to add/remove necessary `Control`
   * according to the value.
   *
   * If you had lots `FormControl` already bind to UI. Be careful to the performance
   * and tune it will the options.
   *
   * If you only want to update a portion of the `FormArray`
   * @see `partialSync`
   *
   * Noted that: Only `SimpleFormArray` and `SimpleForm` type will be apply `*sync` recursively.
   *
   * @throws If you are protected by the type check guard, normally it wouldn't fail.
   * When strict checks fail, such as setting the value of a control
   * that doesn't exist or if you exclude a value of a control that does exist.
   *
   * @param value The new value for the control that matches the type of the group.
   * @param options Configuration options that determine how the control propagates changes
   * and emits events after the value changes.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
   * false.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges`
   * observables emit events with the latest status and value when the control value is updated.
   * When false, no events are emitted.
   */
  fullSync(
    value: InferTypedFormArray<T>,
    options?: {
      onlySelf?: boolean
      emitEvent?: boolean
    },
  ): void {
    syncControl(this, value, options)
    super.setValue(value, options)
  }

  /**
   * Partially-typed synchronize the children form control with the value recursively.
   * Before patching the value of the `FormArray`, it tries to add/remove necessary `Control`
   * according to the value.
   *
   * Noted that: Only `SimpleFormArray` and `SimpleForm` type will be apply `*sync` recursively.
   *
   * @throws If you are protected by the type check guard, normally it wouldn't fail.
   * When strict checks fail, such as setting the value of a control
   * that doesn't exist or if you exclude a value of a control that does exist.
   *
   * @param value The new value for the control that matches the type of the group.
   * @param options Configuration options that determine how the control propagates changes
   * and emits events after the value changes.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
   * false.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges`
   * observables emit events with the latest status and value when the control value is updated.
   * When false, no events are emitted.
   */
  partialSync(
    value: InferTypedFormArrayPartial<T>,
    options?: {
      onlySelf?: boolean
      emitEvent?: boolean
    },
  ): void {
    syncControl(this, value, options)
    super.patchValue(value, options)
  }
}
