import { TypedFormControl } from './typed-form-control'

export class TypedNumberFormControl<T extends number | null> extends TypedFormControl<T> {
  /**
   * Sets and converts the new value to number for the form control
   *
   * @param value The new value for the control.
   * @param options Configuration options that determine how the control propagates changes
   * and emits events when the value changes.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
   * false.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges`
   * observables emit events with the latest status and value when the control value is updated.
   * When false, no events are emitted.
   * * `emitModelToViewChange`: When true or not supplied  (the default), each change triggers an
   * `onChange` event to
   * update the view.
   * * `emitViewToModelChange`: When true or not supplied (the default), each change triggers an
   * `ngModelChange`
   * event to update the model.
   *
   */
  setValue(
    value: T,
    options?: {
      onlySelf?: boolean
      emitEvent?: boolean
      emitModelToViewChange?: boolean
      emitViewToModelChange?: boolean
    },
  ): void {
    if (value === undefined || value === null || (value as any) === '') {
      super.setValue(null as any, options)
    } else {
      super.setValue(Number(value) as any, options)
    }
  }
}
