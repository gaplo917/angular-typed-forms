import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, ValidatorFn } from '@angular/forms'
import { Observable } from 'rxjs'
import { FormStatus, InferTypedFormArray, InferTypedFormArrayPartial } from '../types'

/**
 * Extended the original `FormArray`
 */
export class TypedFormArray<T extends AbstractControl> extends FormArray {
  /**
   * Creates a new `TypedFormArray` instance.
   *
   * @param controls An initialize configuration
   *
   * @param validatorOrOpts A synchronous validator function, or an array of
   * such functions, or an `AbstractControlOptions` object that contains validation functions
   * and a validation trigger.
   *
   * @param asyncValidator A single async validator or array of async validator functions
   *
   */
  constructor(
    controls: T[],
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super(controls, validatorOrOpts, asyncValidator)
  }

  /**
   * The current value of the control.
   */
  readonly value: InferTypedFormArray<T>

  /**
   * A multicasting observable that emits an event every time the value of the control changes, in
   * the UI or programmatically. It also emits an event each time you call enable() or disable()
   * without passing along {emitEvent: false} as a function argument.
   */
  readonly valueChanges: Observable<InferTypedFormArray<T>>

  /**
   * A multicasting observable that emits an event every time the validation `status` of the control
   * recalculates.
   *
   * @see {@link AbstractControl.status}
   *
   */
  readonly statusChanges: Observable<FormStatus>

  readonly controls: T[]

  /**
   * Get the `T` at the given `index` in the array.
   *
   * @param index Index in the array to retrieve the control
   */
  at(index: number): T {
    return super.at(index) as T
  }

  /**
   * Insert a new `T` at the end of the array.
   *
   * @param control Form control to be inserted
   */
  push(control: T): void {
    super.push(control)
  }

  /**
   * Insert a new `T` at the given `index` in the array.
   *
   * @param index Index in the array to insert the control
   * @param control Form control to be inserted
   */
  insert(index: number, control: T): void {
    super.insert(index, control)
  }

  /**
   * Remove the control at the given `index` in the array.
   *
   * @param index Index in the array to remove the control
   */
  removeAt(index: number): void {
    super.removeAt(index)
  }

  /**
   * Replace an existing control.
   *
   * @param index Index in the array to replace the control
   * @param control The `T` control to replace the existing control
   */
  setControl(index: number, control: T): void {
    super.setControl(index, control)
  }

  /**
   * Sets the value of the `FormArray`. It accepts an array that matches
   * the structure of the control.
   *
   * This method performs strict checks, and throws an error if you try
   * to set the value of a control that doesn't exist or if you exclude the
   * value of a control.
   *
   * @usageNotes
   * ### Set the values for the controls in the form array
   *
   * ```
   * const arr = new TypedFormArray<TypedFormControl<string | null>>([
   *  new TypedFormControl<string | null>(null),
   *  new TypedFormControl<string | null>(null)
   * });
   * console.log(arr.value);   // [null, null]
   *
   * arr.setValue(['Nancy', 'Drew']);
   * console.log(arr.value);   // ['Nancy', 'Drew']
   * ```
   *
   * @param value Array of values for the controls
   * @param options Configure options that determine how the control propagates changes and
   * emits events after the value changes
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
   * is false.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges`
   * observables emit events with the latest status and value when the control value is updated.
   * When false, no events are emitted.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   */
  setValue(
    value: InferTypedFormArray<T>,
    options?: {
      onlySelf?: boolean
      emitEvent?: boolean
    },
  ): void {
    super.setValue(value, options)
  }

  /**
   * Patches the value of the `FormArray`. It accepts an array that matches the
   * structure of the control, and does its best to match the values to the correct
   * controls in the group.
   *
   * It accepts both super-sets and sub-sets of the array without throwing an error.
   *
   * @usageNotes
   * ### Patch the values for controls in a form array
   *
   * ```
   * const arr = new TypedFormArray<TypedFormControl<string | null>>([
   *  new TypedFormControl<string | null>(null),
   *  new TypedFormControl<string | null>(null)
   * });
   * console.log(arr.value);   // [null, null]
   *
   * arr.patchValue(['Nancy']);
   * console.log(arr.value);   // ['Nancy', null]
   * ```
   *
   * @param value Array of latest values for the controls
   * @param options Configure options that determine how the control propagates changes and
   * emits events after the value changes
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
   * is false.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges`
   * observables emit events with the latest status and value when the control value is updated.
   * When false, no events are emitted.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   */
  patchValue(
    value: InferTypedFormArrayPartial<T>,
    options?: {
      onlySelf?: boolean
      emitEvent?: boolean
    },
  ): void {
    super.patchValue(value, options)
  }

  /**
   * Resets the `FormArray` and all descendants are marked `pristine` and `untouched`, and the
   * value of all descendants to null or null maps.
   *
   * You reset to a specific form state by passing in an array of states
   * that matches the structure of the control. The state is a standalone value
   * or a form state object with both a value and a disabled status.
   *
   * @usageNotes
   * ### Reset the values in a form array
   *
   * ```ts
   * const arr = new TypedFormArray<TypedFormControl<string | null>>([
   *  new TypedFormControl<string | null>(null),
   *  new TypedFormControl<string | null>(null)
   * });
   * arr.reset(['name', 'last name']);
   *
   * console.log(this.arr.value);  // ['name', 'last name']
   * ```
   *
   * ### Reset the values in a form array and the disabled status for the first control
   *
   * ```
   * this.arr.reset([
   *   {value: 'name', disabled: true},
   *   'last'
   * ]);
   *
   * console.log(this.arr.value);  // ['name', 'last name']
   * console.log(this.arr.get(0).status);  // 'DISABLED'
   * ```
   *
   * @param value Array of values for the controls
   * @param options Configure options that determine how the control propagates changes and
   * emits events after the value changes
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
   * is false.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges`
   * observables emit events with the latest status and value when the control is reset.
   * When false, no events are emitted.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   */
  reset(
    value?: InferTypedFormArrayPartial<T> | Array<{ value: InferTypedFormArrayPartial<T>; disabled: boolean }>,
    options?: {
      onlySelf?: boolean
      emitEvent?: boolean
    },
  ): void {
    super.reset(value, options)
  }

  /**
   * The aggregate value of the array, including any disabled controls.
   *
   * Reports all values regardless of disabled status.
   * For enabled controls only, the `value` property is the best way to get the value of the array.
   */
  getRawValue(): InferTypedFormArray<T> {
    return super.getRawValue() as InferTypedFormArray<T>
  }
}
