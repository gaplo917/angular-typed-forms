import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, ValidatorFn } from '@angular/forms'
import { Injectable } from '@angular/core'
import { KeyValueControl } from './types'
import {
  BaseTableConfig,
  Column,
  SimpleForm,
  SimpleFormArray,
  SimpleFormArrayConfig,
  SimpleList,
  SimpleListConfig,
  SimpleTable,
  TypedFormControl,
  TypedNumberFormControl,
} from './forms'

@Injectable({
  providedIn: 'root',
})
export class SimpleFormBuilder {
  form<T extends KeyValueControl<T>>(
    controls: T,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ): SimpleForm<T> {
    return new SimpleForm<T>(controls, validatorOrOpts, asyncValidator)
  }

  formArray<T extends AbstractControl>(
    controlsConfig: SimpleFormArrayConfig<T>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ): SimpleFormArray<T> {
    return new SimpleFormArray<T>(controlsConfig, validatorOrOpts, asyncValidator)
  }

  list<T>(
    controlsConfig: SimpleListConfig<T>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    return new SimpleList(controlsConfig, validatorOrOpts, asyncValidator)
  }

  table<T extends KeyValueControl<T>>(
    controlsConfig: BaseTableConfig<Column<T>>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    return new SimpleTable(controlsConfig, validatorOrOpts, asyncValidator)
  }

  control<T>(
    formState: T,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ): TypedFormControl<T> {
    return new TypedFormControl(formState, validatorOrOpts, asyncValidator)
  }

  number<T extends number | null>(
    formState: T,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ): TypedFormControl<T> {
    return new TypedNumberFormControl(formState, validatorOrOpts, asyncValidator)
  }
}
