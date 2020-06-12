import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormGroup, ValidatorFn } from '@angular/forms'
import { Observable } from 'rxjs'
import {
  FormStatus,
  InferTypedFormGroup,
  InferTypedFormGroupPartial,
  InferTypedFormPartial,
  KeyValueControl,
} from '../types'

/**
 * Extended the original `FormGroup`
 */
export class TypedFormGroup<T extends KeyValueControl<T>> extends FormGroup {
  /**
   * Creates a new `TypedFormGroup` instance.
   *
   * @param initialControls A collection of child controls. The key for each child is the name
   * under which it is registered.
   *
   * @param validatorOrOpts A synchronous validator function, or an array of
   * such functions, or an `AbstractControlOptions` object that contains validation functions
   * and a validation trigger.
   *
   * @param asyncValidator A single async validator or array of async validator functions
   *
   */
  constructor(
    public initialControls: T,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super(initialControls, validatorOrOpts, asyncValidator)
  }

  readonly controls: T

  /**
   * A multicasting observable that emits an event every time the value of the control changes, in
   * the UI or programmatically. It also emits an event each time you call enable() or disable()
   * without passing along {emitEvent: false} as a function argument.
   */
  readonly valueChanges: Observable<InferTypedFormGroup<T>>

  /**
   * A multicasting observable that emits an event every time the validation `status` of the control
   * recalculates.
   *
   * @see {@link AbstractControl.status}
   *
   */
  readonly statusChanges: Observable<FormStatus>

  /**
   * The current value of the control.
   */
  readonly value: InferTypedFormGroup<T>

  /**
   * Registers a control with the group's list of controls.
   *
   * This method does not update the value or validity of the control.
   * Use {@link FormGroup#addControl addControl} instead.
   *
   * @param name The control name to register in the collection
   * @param control Provides the control for the given name
   */
  registerControl(name: string, control: T[keyof T] & AbstractControl): T[keyof T] & AbstractControl {
    return super.registerControl(name, control) as T[keyof T] & AbstractControl
  }

  /**
   * Add a control to this group.
   *
   * This method also updates the value and validity of the control.
   *
   * @param name The control name to add to the collection
   * @param control Provides the control for the given name
   */
  addControl(name: keyof T & string, control: T[keyof T] & AbstractControl): void {
    super.addControl(name, control)
  }

  /**
   * Remove a control from this group.
   *
   * @param name The control name to remove from the collection
   */
  removeControl(name: keyof T & string): void {
    super.removeControl(name)
  }

  /**
   * Replace an existing control.
   *
   * @param name The control name to replace in the collection
   * @param control Provides the control for the given name
   */
  setControl(name: keyof T & string, control: T[keyof T] & AbstractControl): void {
    super.setControl(name, control)
  }

  /**
   * Check whether there is an enabled control with the given name in the group.
   *
   * Reports false for disabled controls. If you'd like to check for existence in the group
   * only, use {@link AbstractControl#get get} instead.
   *
   * @param controlName The control name to check for existence in the collection
   *
   * @returns false for disabled controls, true otherwise.
   */
  contains(controlName: string): boolean {
    return super.contains(controlName)
  }

  /**
   * Sets the value of the `FormGroup`. It accepts an object that matches
   * the structure of the group, with control names as keys.
   *
   * @usageNotes
   * ### Set the complete value for the form group
   *
   * ```
   * interface Foo {
   *   first: TypedFormControl<string | null>
   *   last: TypedFormControl<string | null>
   * }
   *
   * const form = new TypedFormGroup<Foo>({
   *   first: new TypedFormControl<string | null>(null),
   *   last: new TypedFormControl<string | null>(null)
   * });
   *
   * console.log(form.value);   // {first: null, last: null}
   *
   * form.setValue({first: 'Nancy', last: 'Drew'});
   * console.log(form.value);   // {first: 'Nancy', last: 'Drew'}
   * ```
   *
   * @throws When strict checks fail, such as setting the value of a control
   * that doesn't exist or if you exclude a value of a control that does exist.
   *
   * @param value The new value for the control that matches the structure of the group.
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
  setValue(
    value: InferTypedFormGroup<T>,
    options?: {
      onlySelf?: boolean
      emitEvent?: boolean
    },
  ): void {
    super.setValue(value, options)
  }

  /**
   * Patches the value of the `FormGroup`. It accepts an object with control
   * names as keys, and does its best to match the values to the correct controls
   * in the group.
   *
   * It accepts both super-sets and sub-sets of the group without throwing an error.
   *
   * @usageNotes
   * ### Patch the value for a form group
   *
   * ```
   * interface Foo {
   *   first: TypedFormControl<string | null>
   *   last: TypedFormControl<string | null>
   * }
   *
   * const form = new TypedFormGroup<Foo>({
   *   first: new TypedFormControl<string | null>(null),
   *   last: new TypedFormControl<string | null>(null)
   * });
   * console.log(form.value);   // {first: null, last: null}
   *
   * form.patchValue({first: 'Nancy'});
   * console.log(form.value);   // {first: 'Nancy', last: null}
   * ```
   *
   * @param value The object that matches the structure of the group.
   * @param options Configuration options that determine how the control propagates changes and
   * emits events after the value is patched.
   * * `onlySelf`: When true, each change only affects this control and not its parent. Default is
   * true.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges`
   * observables emit events with the latest status and value when the control value is updated.
   * When false, no events are emitted.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   */
  patchValue(
    value: InferTypedFormGroupPartial<T>,
    options?: {
      onlySelf?: boolean
      emitEvent?: boolean
    },
  ): void {
    super.patchValue(value, options)
  }

  /**
   * Resets the `FormGroup`, marks all descendants are marked `pristine` and `untouched`, and
   * the value of all descendants to null.
   *
   * You reset to a specific form state by passing in a map of states
   * that matches the structure of your form, with control names as keys. The state
   * is a standalone value or a form state object with both a value and a disabled
   * status.
   *
   * @param value Resets the control with an initial value,
   * or an object that defines the initial value and disabled state.
   *
   * @param options Configuration options that determine how the control propagates changes
   * and emits events when the group is reset.
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
   * false.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges`
   * observables emit events with the latest status and value when the control is reset.
   * When false, no events are emitted.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   *
   * @usageNotes
   *
   * ### Reset the form group values
   *
   * ```ts
   * interface Foo {
   *   first: TypedFormControl<string | null>
   *   last: TypedFormControl<string | null>
   * }
   *
   * const form = new TypedFormGroup<Foo>({
   *   first: new TypedFormControl<string | null>(null),
   *   last: new TypedFormControl<string | null>(null)
   * });
   *
   * console.log(form.value);  // {first: 'first name', last: 'last name'}
   *
   * form.reset({ first: 'name', last: 'last name' });
   *
   * console.log(form.value);  // {first: 'name', last: 'last name'}
   * ```
   *
   * ### Reset the form group values and disabled status
   *
   * ```
   * interface Foo {
   *   first: TypedFormControl<string | null>
   *   last: TypedFormControl<string | null>
   * }
   *
   * const form = new TypedFormGroup<Foo>({
   *   first: new TypedFormControl<string | null>(null),
   *   last: new TypedFormControl<string | null>(null)
   * });
   *
   * form.reset({
   *   first: {value: 'name', disabled: true},
   *   last: 'last'
   * });
   *
   * console.log(this.form.value);  // {first: 'name', last: 'last name'}
   * console.log(this.form.get('first').status);  // 'DISABLED'
   * ```
   */
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

  /**
   * The aggregate value of the `FormGroup`, including any disabled controls.
   *
   * Retrieves all values regardless of disabled status.
   * The `value` property is the best way to get the value of the group, because
   * it excludes disabled controls in the `FormGroup`.
   */
  getRawValue(): InferTypedFormGroup<T> {
    return super.getRawValue() as InferTypedFormGroup<T>
  }
}
