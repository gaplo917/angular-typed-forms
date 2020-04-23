import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, ValidatorFn } from '@angular/forms'
import { Observable } from 'rxjs'
import { InferTypedFormArray, InferTypedFormArrayPartial } from '../types'
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
  readonly controls: T[]

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
