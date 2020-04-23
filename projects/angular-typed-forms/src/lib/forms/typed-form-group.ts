import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormGroup, ValidatorFn } from '@angular/forms'
import { Observable } from 'rxjs'
import {
  FormStatus,
  InferTypedFormGroup,
  InferTypedFormGroupPartial,
  InferTypedFormPartial,
  KeyValueControl,
} from '../types'
import { syncControl } from '../sync-control'

export class TypedFormGroup<T extends KeyValueControl<T>> extends FormGroup {
  constructor(
    public initialControls: T,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super(initialControls, validatorOrOpts, asyncValidator)
  }

  readonly controls: T
  readonly valueChanges: Observable<InferTypedFormGroup<T>>
  readonly statusChanges: Observable<FormStatus>
  readonly value: InferTypedFormGroup<T>

  /**
   * Fully-typed and synchronize the children form control with the value recursively.
   * Sets the value of the `FormGroup`. Before settings the value in the `FormGroup`,
   * it try to synchronize with the value and creates necessary form controls.
   *
   * If you had lots `FormControl` already bind to UI. Be careful to the performance
   * and tune it will the options.
   *
   * If you only want to update a portion of the `FormGroup`
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
    value: InferTypedFormGroup<T>,
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
   * Patches the value of the `FormGroup`. Before settings the value in the `FormGroup`,
   * it try to synchronize with the value and creates necessary form controls.
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
    value: InferTypedFormGroupPartial<T>,
    options?: {
      onlySelf?: boolean
      emitEvent?: boolean
    },
  ): void {
    syncControl(this, value, options)
    super.patchValue(value, options)
  }

  registerControl(name: string, control: T[keyof T] & AbstractControl): T[keyof T] & AbstractControl {
    return super.registerControl(name, control) as T[keyof T] & AbstractControl
  }

  addControl(name: keyof T & string, control: T[keyof T] & AbstractControl): void {
    super.addControl(name, control)
  }

  removeControl(name: keyof T & string): void {
    super.removeControl(name)
  }

  setControl(name: keyof T & string, control: T[keyof T] & AbstractControl): void {
    super.setControl(name, control)
  }

  contains(controlName: string): boolean {
    return super.contains(controlName)
  }

  setValue(
    value: InferTypedFormGroup<T>,
    options?: {
      onlySelf?: boolean
      emitEvent?: boolean
    },
  ): void {
    super.setValue(value, options)
  }

  patchValue(
    value: InferTypedFormGroupPartial<T>,
    options?: {
      onlySelf?: boolean
      emitEvent?: boolean
    },
  ): void {
    super.patchValue(value, options)
  }

  reset(
    value?:
      | InferTypedFormGroupPartial<T>
      | { [key in keyof T]: { value: InferTypedFormPartial<T[key]>; disabled: boolean } },
    options?: {
      onlySelf?: boolean
      emitEvent?: boolean
    },
  ): void {
    super.reset(value, options)
  }

  getRawValue(): InferTypedFormGroup<T> {
    return super.getRawValue() as InferTypedFormGroup<T>
  }
}
