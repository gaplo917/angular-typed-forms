import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, ValidatorFn } from '@angular/forms'
import { Observable } from 'rxjs'
import { FormStatus, InferTypedFormArray, InferTypedFormArrayPartial } from '../types'
import { syncControl } from '../sync-control'

export class TypedFormArray<T extends AbstractControl> extends FormArray {
  constructor(
    public controlsConfig: { constructArrayItem: () => T; size: number },
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super(
      new Array(controlsConfig.size).fill(0).map(controlsConfig.constructArrayItem),
      validatorOrOpts,
      asyncValidator,
    )
  }

  readonly value: InferTypedFormArray<T>
  readonly valueChanges: Observable<InferTypedFormArray<T>>
  readonly statusChanges: Observable<FormStatus>
  readonly controls: T[]

  /**
   * Fully-typed and synchronize the children form control with the value recursively.
   * Sets the value of the `FormArray`. Before settings the value in the `FormArray`,
   * it try to synchronize with the input array and add/remove necessary rows.
   *
   * If you had lots `FormControl` already bind to UI. Be careful to the performance
   * and tune it will the options.
   *
   * If you only want to update a portion of the `FormArray`
   * @see `partialSync`
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
   * Patches the value of the `FormArray`. Before settings the value in the `FormArray`,
   * it try to synchronize with the input array and add/remove necessary rows.
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

  at(index: number): T {
    return super.at(index) as T
  }

  push(control: T): void {
    super.push(control)
  }

  insert(index: number, control: T): void {
    super.insert(index, control)
  }

  removeAt(index: number): void {
    super.removeAt(index)
  }

  setControl(index: number, control: T): void {
    super.setControl(index, control)
  }

  setValue(
    value: InferTypedFormArray<T>,
    options?: {
      onlySelf?: boolean
      emitEvent?: boolean
    },
  ): void {
    super.setValue(value, options)
  }

  patchValue(
    value: InferTypedFormArrayPartial<T>,
    options?: {
      onlySelf?: boolean
      emitEvent?: boolean
    },
  ): void {
    super.patchValue(value, options)
  }

  reset(
    value?: InferTypedFormArrayPartial<T> | Array<{ value: InferTypedFormArrayPartial<T>; disabled: boolean }>,
    options?: {
      onlySelf?: boolean
      emitEvent?: boolean
    },
  ): void {
    super.reset(value, options)
  }

  getRawValue(): InferTypedFormArray<T> {
    return super.getRawValue() as InferTypedFormArray<T>
  }
}
