import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, ValidatorFn } from '@angular/forms'
import { Injectable } from '@angular/core'
import { KeyValueControl } from './types'
import { TypedFormGroup, TypedFormControl, TypedFormArray, TypedNumberFormControl } from './forms'

@Injectable({
  providedIn: 'root',
})
export class TypedFormBuilder {
  group<T extends KeyValueControl<T>>(
    controls: T,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ): TypedFormGroup<T> {
    return new TypedFormGroup<T>(controls, validatorOrOpts, asyncValidator)
  }

  control<T>(
    formState: T,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ): TypedFormControl<T> {
    return new TypedFormControl(formState, validatorOrOpts, asyncValidator)
  }

  array<T extends AbstractControl>(
    controlsConfig: { constructArrayItem: () => T; size: number },
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ): TypedFormArray<T> {
    return new TypedFormArray<T>(controlsConfig, validatorOrOpts, asyncValidator)
  }

  number<T extends number | null>(
    formState: T,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ): TypedFormControl<T> {
    return new TypedNumberFormControl(formState, validatorOrOpts, asyncValidator)
  }
}
