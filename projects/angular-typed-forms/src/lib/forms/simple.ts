import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, ValidatorFn } from '@angular/forms'
import { TypedFormArray } from './typed-form-array'
import { KeyValueControl } from '../types'
import { TypedFormGroup } from './typed-form-group'
import { TypedFormControl } from './typed-form-control'

/**
 * Handy class to extend, equivalent to `TypedFormGroup<T>`
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
 *   constructor(private fb: TypedFormBuilder) {
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
  constructor(
    initialControls: T,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super(initialControls, validatorOrOpts, asyncValidator)
  }
}

export type SimpleListConfig<T> = {
  /**
   * An array item construction of child controls. Each child control is given an index where it is registered.
   */
  constructListItem: (index?: number) => TypedFormControl<T>

  /**
   * initial list size where it is registered.
   */
  size: number
}
/**
 * Handy class to extend for creating homogenous typed list,
 * equivalent to `TypedFormArray<TypedFormControl<T>>`
 *
 * @usageNotes
 * ### Create a username list
 * ```ts
 *
 * class FooForm extends SimpleList<string> {
 *   constructor(private fb: TypedFormBuilder) {
 *     super({
 *       constructListItem: () => fb.control('') // default empty
 *       size: 2
 *     })
 *   }
 * }
 */
export class SimpleList<T> extends TypedFormArray<TypedFormControl<T>> {
  constructor(
    private listConfig: SimpleListConfig<T>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super(
      {
        constructArrayItem: (index: number) => listConfig.constructListItem(index),
        size: listConfig.size,
      },
      validatorOrOpts,
      asyncValidator,
    )
  }
}

export type BaseTableConfig<T> = {
  /**
   * An array item construction of child controls. Each child control is given an index where it is registered.
   */
  constructRow: (index?: number) => T

  /**
   * initial row size where it is registered.
   */
  size: number
}

/**
 * Base implementation of table-like structures
 */
export class BaseTable<T extends AbstractControl> extends TypedFormArray<T> {
  constructor(
    private tableConfig: BaseTableConfig<T>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super(
      {
        constructArrayItem: (index: number) => tableConfig.constructRow(index),
        size: tableConfig.size,
      },
      validatorOrOpts,
      asyncValidator,
    )
  }

  /**
   * Get Rows `T`
   */
  get rows(): T[] {
    return this.controls
  }

  /**
   * Row size
   */
  get size(): number {
    return this.controls.length
  }

  /**
   * Get the row `T` at the given `index`
   *
   * @param index Index of the rows
   */
  rowAt(index: number): T {
    return this.rows[index]
  }

  /**
   * Insert a row at the end of the table
   */
  appendRow(): void {
    super.push(this.tableConfig.constructRow(this.size))
  }

  /**
   * Insert a row at the beginning of the table
   */
  prependRow(): void {
    super.insert(0, this.tableConfig.constructRow(0))
  }

  /**
   * Remove the row at the given `index` in the table.
   *
   * @param index Index in the array to remove the control
   */
  removeRow(index: number): void {
    super.removeAt(index)
  }

  /**
   * Insert a default row items at the given `index` in the table.
   *
   * @param index Index in the array to insert the control
   */
  insertRow(index: number): void {
    super.insert(index, this.tableConfig.constructRow(index))
  }
}

// alias for better understanding
export type Column<T extends KeyValueControl<T>> = TypedFormGroup<T>

/**
 * Handy class to extend for creating Table-like form model,
 * equivalent to `TypedFormArray<TypedFormGroup<T>>`.
 *
 * @usageNotes
 * ### Create a user table
 * ```ts
 * interface FooTableType {
 *   id: TypedFormControl<string | null>
 *   username: TypedFormControl<string | null>
 *   createdAt: TypedFormControl<Date | null>
 *   firstName?: TypedFormControl<string>
 *   lastName?: TypedFormControl<string>
 *   age?: TypedFormControl<number>
 * }
 *
 * class FooTable extends SimpleTable<FooTableType> {
 *   constructor(private fb: TypedFormBuilder) {
 *     super({
 *       constructRow: () =>
 *         fb.group<FooTableType>({
 *           id: fb.control(null),
 *           username: fb.control(null),
 *           createdAt: fb.control(null),
 *           firstName: fb.control(''), // default value
 *           // lastName, age are optional
 *         }),
 *       size: 1,
 *     })
 *   }
 * }
 * ```
 */
export class SimpleTable<T extends KeyValueControl<T>> extends BaseTable<Column<T>> {}
