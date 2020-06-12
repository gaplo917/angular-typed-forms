import { AbstractControl } from '@angular/forms'
import { TypedFormArray, TypedFormControl, TypedFormGroup } from '../forms'

export type KeyValueControl<T extends object> = object &
  {
    [key in keyof T]: T[key] & AbstractControl
  }

export type InferTypedForm<Type> = Type extends TypedFormControl<infer X>
  ? X
  : Type extends Array<TypedFormControl<infer X1>>
  ? X1[]
  : Type extends Array<TypedFormGroup<infer X2>>
  ? Array<InferTypedFormGroup<X2>>
  : Type extends TypedFormGroup<infer X3>
  ? InferTypedFormGroup<X3>
  : Type extends TypedFormArray<infer X4>
  ? Array<InferTypedForm<X4>>
  : never

export type InferTypedFormGroup<T> = { [key in keyof T]: InferTypedForm<T[key]> }

export type InferTypedFormArray<T> = InferTypedForm<T[]>

export type InferTypedFormPartial<Type> = Type extends TypedFormControl<infer X>
  ? X
  : Type extends Array<TypedFormControl<infer X1>>
  ? X1[]
  : Type extends Array<TypedFormGroup<infer X2>>
  ? Array<InferTypedFormGroupPartial<X2>>
  : Type extends TypedFormGroup<infer X3>
  ? InferTypedFormGroupPartial<X3>
  : Type extends TypedFormArray<infer X4>
  ? Array<InferTypedFormPartial<X4>>
  : never

export type InferTypedFormGroupPartial<T> = { [key in keyof T]?: InferTypedFormPartial<T[key]> }

export type InferTypedFormArrayPartial<T> = InferTypedFormPartial<T[]>

export type FormStatus = 'VALID' | 'INVALID' | 'DISABLED' | 'PENDING'
