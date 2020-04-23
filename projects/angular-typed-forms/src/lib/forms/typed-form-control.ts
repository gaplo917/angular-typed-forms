import { AbstractControlOptions, AsyncValidatorFn, FormControl, ValidatorFn } from '@angular/forms'
import { Observable } from 'rxjs'
import { FormStatus } from '../types'

export class TypedFormControl<T> extends FormControl {
  constructor(
    formState?: T,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super(formState, validatorOrOpts, asyncValidator)
  }

  readonly value: T
  readonly valueChanges: Observable<T>
  readonly statusChanges: Observable<FormStatus>

  setValue(
    value: T,
    options?: {
      onlySelf?: boolean
      emitEvent?: boolean
      emitModelToViewChange?: boolean
      emitViewToModelChange?: boolean
    },
  ): void {
    super.setValue(value, options)
  }

  patchValue(
    value: T,
    options?: {
      onlySelf?: boolean
      emitEvent?: boolean
      emitModelToViewChange?: boolean
      emitViewToModelChange?: boolean
    },
  ): void {
    super.patchValue(value, options)
  }

  reset(
    formState?: T,
    options?: {
      onlySelf?: boolean
      emitEvent?: boolean
    },
  ): void {
    super.reset(formState, options)
  }
}
