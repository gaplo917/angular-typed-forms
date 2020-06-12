import { AbstractControlOptions, AsyncValidatorFn, ValidatorFn } from '@angular/forms'
import { InferTypedFormGroup, InferTypedFormGroupPartial, KeyValueControl } from '../types'
import { TypedFormGroup } from './typed-form-group'
import { syncControl } from '../sync-control'

/**
 * Handy class to extend, compatible to `TypedFormGroup<T>` usage and added `fullSync` and `partialSync` API
 *
 * @usageNotes
 * ### Create a user form
 * ```ts
 * interface FooFormType {
 *   id: TypedFormControl<string | null>
 *   username: TypedFormControl<string | null>
 *   createdAt: TypedFormControl<Date | null>
 *   firstName?: TypedFormControl<string>
 *   lastName?: TypedFormControl<string>
 *   age?: TypedFormControl<number>
 * }
 *
 * class FooForm extends SimpleForm<FooFormType> {
 *   constructor(private fb: SimpleFormBuilder) {
 *     super({
 *       id: fb.control(null),
 *       username: fb.control(null),
 *       createdAt: fb.control(null),
 *       firstName: fb.control(''), // default value
 *       // lastName, age are optional
 *     })
 *   }
 * }
 * ```
 */
export class SimpleForm<T extends KeyValueControl<T>> extends TypedFormGroup<T> {
  /**
   * Creates a new `SimpleForm` instance.
   *
   * @param initialControls A collection of child controls. The key for each child is the name
   * under which it is registered.
   *
   * @param validatorOrOpts A synchronous validator function, or an array of
   * such functions, or an `AbstractControlOptions` object that contains validation functions
   * and a validation trigger.
   *
   * @param asyncValidator A single async validator or array of async validator functions
   */
  constructor(
    initialControls: T,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super(initialControls, validatorOrOpts, asyncValidator)
  }

  /**
   * Fully-typed and synchronize the children form control with the value recursively.
   * Before setting the value in the `SimpleForm`, it tries to create/remove necessary `Control`.
   * according to the value.
   *
   * If you had lots `FormControl` already bind to UI. Be careful to the performance
   * and tune it will the options.
   *
   * If you only want to update a portion of the `SimpleForm`
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
   * Before patching the value in the `SimpleForm`, it tries to create/remove necessary `Control`.
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
    value: InferTypedFormGroupPartial<T>,
    options?: {
      onlySelf?: boolean
      emitEvent?: boolean
    },
  ): void {
    syncControl(this, value, options)
    super.patchValue(value, options)
  }
}
