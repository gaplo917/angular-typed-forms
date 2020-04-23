import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, ValidatorFn } from '@angular/forms'
import { TypedFormArray } from './typed-form-array'
import { KeyValueControl } from '../types'
import { TypedFormGroup } from './typed-form-group'
import { TypedFormControl } from './typed-form-control'

/**
 * Handy class to extend
 */
export class SimpleForm<T extends KeyValueControl<T>> extends TypedFormGroup<T> {
  constructor(
    initialControls: T,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super(initialControls, validatorOrOpts, asyncValidator)
  }
}

/**
 * Handy class to extend
 */
export class SimpleList<T extends KeyValueControl<T>> extends TypedFormArray<TypedFormControl<T>> {
  constructor(
    private listConfig: { constructListItem: () => TypedFormControl<T>; size: number },
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super(
      {
        constructArrayItem: () => listConfig.constructListItem(),
        size: listConfig.size,
      },
      validatorOrOpts,
      asyncValidator,
    )
  }
}

export class BaseTable<T extends AbstractControl> extends TypedFormArray<T> {
  constructor(
    private tableConfig: { constructRow: () => T; size: number },
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super(
      {
        constructArrayItem: () => tableConfig.constructRow(),
        size: tableConfig.size,
      },
      validatorOrOpts,
      asyncValidator,
    )
  }

  get rows(): T[] {
    return this.controls
  }

  get size(): number {
    return this.controls.length
  }

  rowAt(index: number): T {
    return this.rows[index]
  }

  appendRow(): void {
    super.push(this.tableConfig.constructRow())
  }

  prependRow(): void {
    super.insert(0, this.tableConfig.constructRow())
  }

  removeRow(index: number): void {
    super.removeAt(index)
  }

  insertRow(index: number): void {
    super.insert(index, this.tableConfig.constructRow())
  }
}

// alias for better understanding
export type Column<T extends KeyValueControl<T>> = TypedFormGroup<T>

/**
 * Handy class to extend to create Table-like form model
 */
export class SimpleTable<T extends KeyValueControl<T>> extends BaseTable<Column<T>> {}
