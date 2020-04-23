import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormGroup, ValidatorFn } from '@angular/forms'
import { Observable } from 'rxjs'
import { InferTypedFormGroup, InferTypedFormGroupPartial, InferTypedFormPartial, KeyValueControl } from '../types'
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
  readonly value: InferTypedFormGroup<T>

  /**
   * The reason of this api is because `controls` don't fulfill `{ [key: string]: AbstractControl }` outside
   */
  asFormGroup(): FormGroup {
    return this as FormGroup
  }

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
