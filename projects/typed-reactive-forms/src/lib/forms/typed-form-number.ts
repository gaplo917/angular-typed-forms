import { TypedFormControl } from './typed-form-control'

export class TypedNumberFormControl<T extends number | null> extends TypedFormControl<T> {
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
