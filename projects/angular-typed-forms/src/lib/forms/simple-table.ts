import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, ValidatorFn } from '@angular/forms'
import { InferTypedFormArray, KeyValueControl } from '../types'
import { SimpleFormArray } from './simple-form-array'
import { SimpleForm } from './simple-form'

export type BaseTableConfig<T> = {
  /**
   * An array item construction of child controls. Each child control is given an index where it is registered.
   */
  constructRow: (index?: number, values?: InferTypedFormArray<T>) => T

  /**
   * initial row size where it is registered.
   */
  size: number
}

/**
 * Base implementation of table-like structures
 */
export class BaseTable<T extends AbstractControl> extends SimpleFormArray<T> {
  constructor(
    private tableConfig: BaseTableConfig<T>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null,
  ) {
    super(
      {
        constructArrayItem: (index: number, values: InferTypedFormArray<T>) => tableConfig.constructRow(index, values),
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
export type Column<T extends KeyValueControl<T>> = SimpleForm<T>

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
 *   constructor(private fb: SimpleFormBuilder) {
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
