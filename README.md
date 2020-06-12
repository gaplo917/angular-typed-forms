# Angular Typed Form

The missing piece of Angular.

```bash
npm install @gaplo917/angular-typed-forms

# OR

yarn add @gaplo917/angular-typed-forms
```

## Features

This library uses a `ControlType` instead of `ValueType` as the `FormGroup` and `FormArray` type constraints and
uses `infer` ([relatively new Typescript 2.8 feature](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html)) to extract the `ValueType` from the `ControlType`.

Thus, this implementation cannot be created earlier than Angular v6.1.

| Features                                                                                                                                                                                                                                                                                                                                                                                                                        | Status |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----: |
| Strict Type Check                                                                                                                                                                                                                                                                                                                                                                                                               |   ✅   |
| No Performance Degrade                                                                                                                                                                                                                                                                                                                                                                                                          |   ✅   |
| **Zero** Force Type Cast Guarantee on .ts/.html                                                                                                                                                                                                                                                                                                                                                                                 |   ✅   |
| Advance implementation to handle Complex Form Architecture([fullSync](https://github.com/gaplo917/angular-typed-forms/blob/6f80a5527cf75d1b40692f4e3359accc91568566/projects/angular-typed-forms/src/lib/forms/typed-form-group.ts#L85) & [partialSync](https://github.com/gaplo917/angular-typed-forms/blob/6f80a5527cf75d1b40692f4e3359accc91568566/projects/angular-typed-forms/src/lib/forms/typed-form-group.ts#L118) API) |   ✅   |
| 100% Compatible to [Reactive Forms](https://angular.io/guide/reactive-forms)                                                                                                                                                                                                                                                                                                                                                    |   ✅   |
| Enjoy slowly/partial migrate without learning a new library                                                                                                                                                                                                                                                                                                                                                                     |   ✅   |

## Live Demo

[![Edit gaplo917/angular-typed-form-codesandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/gaplo917/angular-typed-form-codesandbox/tree/master/?fontsize=14&hidenavigation=1&theme=dark)

## Basic Usage (Standard ReactiveForm API)

### Inject TypedFormBuilder / SimpleFormBuilder

- **TypedFormBuilder** - Added Strong Typing on original Angular Reactive Form Modules, no breaking changes)
- **SimpleFormBuilder** - Added advance implementation based on TypedForm to handle daily operation with minimal codes)

```ts
import { TypedFormGroup, TypedFormControl, TypedFormBuilder, SimpleFormBuilder } from '@gaplo917/angular-typed-forms'

interface Foo {
  first: TypedFormControl<string | null>
  last: TypedFormControl<string | null>
}

// original Reactive Form modules
@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css'],
})
export class DemoComponent implements OnInit {
  form: TypedFormGroup<Foo>

  constructor(private fb: TypedFormBuilder) {
    this.form = fb.group({
      first: fb.control(null),
      last: fb.control(null),
    })
  }
}

// Simple Reactive Form
@Component({
  selector: 'app-simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.css'],
})
export class SimpleComponent implements OnInit {
  form: SimpleForm<Foo>

  constructor(private fb: SimpleFormBuilder) {
    this.form = fb.form({
      first: fb.control(null),
      last: fb.control(null),
    })
  }
}
```

### TypedFormControl

```ts
new TypedFormControl<string | null>(null)
// or using from TypedFormBuilder
fb.control<string | null>(null)
```

### TypedNumberFormControl

This will convert the string input to number before calling `setValue`. Any non-number return will return `null`.
Enjoy getting a number type from the UI input.

```ts
new TypedNumberFormControl<number | null>(null)
// or using from  TypedFormBuilder
fb.number<number | null>(null)
```

### TypedFormGroup

```ts
import { TypedFormGroup, TypedFormControl, TypedFormBuilder } from '@gaplo917/angular-typed-forms'

interface Foo {
  first: TypedFormControl<string | null>
  last: TypedFormControl<string | null>
}
const fb = new TypedFormBuilder()
const form: TypedFormGroup<Foo> = fb.group({
  first: fb.control(null),
  last: fb.control(null),
})

console.log(form.value) // {first: null, last: null}

form.setValue({ first: 'Nancy', last: 'Drew' })
console.log(form.value) // {first: 'Nancy', last: 'Drew'}
```

### TypedFormArray

```ts
import { TypedFormArray, TypedFormControl, TypedFormBuilder } from '@gaplo917/angular-typed-forms'

const fb = new TypedFormBuilder()

const arr: TypedFormArray<TypedFormControl<string | null>> = fb.array({
  constructArrayItem: () => fb.control<string | null>(null),
  size: 2,
})
console.log(arr.value) // [null, null]

arr.setValue(['Nancy', 'Drew'])
console.log(arr.value) // ['Nancy', 'Drew']
```

### TypedFormArray<TypedFormGroup<T>> (Table)

```ts
import { TypedFormArray, TypedFormGroup, TypedFormControl, TypedFormBuilder } from '@gaplo917/angular-typed-forms'

interface Foo {
  first: TypedFormControl<string | null>
  last: TypedFormControl<string | null>
}

const fb = new TypedFormBuilder()

const arr: TypedFormArray<TypedFormGroup<Foo>> = fb.array([{
    fb.group<Foo>({
      first: fb.control(null),
      last: fb.control(null),
    }),
    fb.group<Foo>({
      first: fb.control(null),
      last: fb.control(null),
    })
}])
console.log(arr.value) // [{ first: null, last: null }, { first: null, last: null }]

arr.setValue([
  { first: 'Nancy', last: 'A' },
  { first: 'Drew', last: 'B' },
])
console.log(arr.value) // [{ first: 'Nancy', last: 'A' }, { first: 'Drew, last: 'B' }]
```

## Advance Usage (Simple Module)

This is an **EXTRA** implementation based on Reactive Form Modules for a common scenario.

- Added `fullSunc` & `partialSync` API that helps to sync remote API data to the form
- Added Table / List Handy abstraction and handy api for your daily operations.

### Added Types

- SimpleForm<T> (TypedFormGroup)
- SimpleFormArray<T> (TypedFormArray)
- SimpleList<T> (SimpleFormArray<TypedFormControl<T>>)
- SimpleTable<T> (SimpleFormArray<FormGroup<T>>)
- SimpleFormBuilder

Highly recommend creating a dedicated `class` to represent a complex form.

```ts
import { SimpleTable, SimpleFormBuilder, TypedFormControl, TypedNumberFormControl } from '@gaplo917/angular-typed-forms'

interface AddressType {
  address1: TypedFormControl<string | null>
  address2: TypedFormControl<string | null>
  address3: TypedFormControl<string | null>
}

/**
 * SimpleTable is equivalent to TypedFormArray<TypedFormGroup<AddressType>> but with more pre-defined API
 */
export class AddressTable extends SimpleTable<AddressType> {
  constructor(private fb: SimpleFormBuilder) {
    super({
      constructRow: () =>
        fb.form({
          address1: fb.control(null),
          address2: fb.control(null),
          address3: fb.control(null),
        }),
      size: 1,
    })
  }
}

interface UserTableType {
  id: TypedFormControl<string | null>
  username: TypedFormControl<string | null>
  birth: TypedFormControl<Date | null>
  isStudent: TypedFormControl<boolean>
  age?: TypedNumberFormControl<number | null>
  // nested form
  addresses: AddressTable
}

/**
 * SimpleTable is equivalent to TypedFormArray<TypedFormGroup<UserTableType>> but with more pre-defined API
 */
export class UserTable extends SimpleTable<UserTableType> {
  constructor(private fb: SimpleFormBuilder) {
    super({
      constructRow: (index: number) =>
        fb.form({
          id: fb.control(String('ID-' + index)),
          username: fb.control(null),
          birth: fb.control(null),
          isStudent: fb.control<boolean>(false),
          addresses: new AddressTable(fb),
        }),
      size: 2,
    })
  }
}
```

### Extra `fullSunc` & `partialSync` API

Fully-typed and synchronize the children form control with the value recursively.
Before setting the value of the `FormArray`, it tries to add/remove necessary `Control`
according to the value.

`fullSync` use `setValue` internally
`partialSync` use `patchValue` internally

```ts
import { TypedFormGroup, TypedFormControl, SimpleFormBuilder } from '@gaplo917/angular-typed-forms'

interface Bar {
  something: TypedFormControl<string | null>
}

interface Foo {
  first: TypedFormControl<string | null>
  last: TypedFormControl<string | null>
  bar: TypedFormGroup<Bar>
}

const fb = new SimpleFormBuilder()

const form = fb.formArray<Foo>([])

console.log(form.value) // []

// full strict type check
form.fullSync([{ first: 'Nancy', last: 'Drew', bar: { something: 'happen' } }]) // OK
form.fullSync([{ first: 'Nancy', last: 'Drew', bar: {} }]) // Not compile, missing `something`
form.fullSync([{ first: 'Nancy', last: 'Drew', bar: { something: 'happen' }, unknownKey: 'not suppose here' }]) // Not compile, redundant `unknownKey`

console.log(form.value) // {first: 'Nancy', last: 'Drew', bar: { something: 'happen' }}

// partial type check
form.partialSync([{ first: 'Nancy2', last: 'Drew2' }]) // OK
form.partialSync([{ first: 'Nancy', last: 'Drew', unknownKey: 'not suppose here' }]) // Not compile, redundant `unknownKey`

console.log(form.value) // {first: 'Nancy2', last: 'Drew2', bar: { something: 'happen' }}, `bar` remain unchanged
```

### Full Example

```ts
import { SimpleTable, SimpleFormBuilder, TypedFormControl, TypedNumberFormControl } from '@gaplo917/angular-typed-forms'

interface AddressType {
  address1: TypedFormControl<string | null>
  address2: TypedFormControl<string | null>
  address3: TypedFormControl<string | null>
}

/**
 * SimpleTable is equivalent to TypedFormArray<TypedFormGroup<AddressType>> but with more pre-defined API
 */
export class AddressTable extends SimpleTable<AddressType> {
  constructor(private fb: SimpleFormBuilder) {
    super({
      constructRow: () =>
        fb.form({
          address1: fb.control(null),
          address2: fb.control(null),
          address3: fb.control(null),
        }),
      size: 1,
    })
  }
}

interface UserTableType {
  id: TypedFormControl<string | null>
  username: TypedFormControl<string | null>
  birth: TypedFormControl<Date | null>
  isStudent: TypedFormControl<boolean>
  age?: TypedNumberFormControl<number | null>
  // nested form
  addresses: AddressTable
}

/**
 * SimpleTable is equivalent to TypedFormArray<TypedFormGroup<UserTableType>> but with more pre-defined API
 */
export class UserTable extends SimpleTable<UserTableType> {
  constructor(private fb: SimpleFormBuilder) {
    super({
      constructRow: (index: number) =>
        fb.form({
          id: fb.control(String('ID-' + index)),
          username: fb.control(null),
          birth: fb.control(null),
          isStudent: fb.control<boolean>(false),
          addresses: new AddressTable(fb),
        }),
      size: 2,
    })
  }
}

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css'],
})
export class DemoComponent {
  userTable: UserTable

  constructor(private fb: SimpleFormBuilder) {
    this.userTable = new UserTable(fb)
  }

  fullSync() {
    // fullSync requires strict type match of the value you input
    // this method will use the values to sync the controls
    // internally match the numbers of control before use `FormArray.setValue`
    this.userTable.fullSync([
      {
        id: '42e6f1fe-93bd-4993-ab1b-ebaec9ee8d10',
        username: 'Gary',
        birth: new Date('2000-01-01'),
        isStudent: false,
        // because `age` is optional in the definition
        // age: 1,
        addresses: [
          {
            address1: 'HK',
            address2: 'Earth',
            address3: '',
          },
        ],
      },
    ])
  }

  partialSync() {
    // partialSync only require Partial<T>, but it will also sync them number of controls
    // this method will use the values to sync the controls
    // internally match the numbers of control before use `FormArray.patchValue`
    this.userTable.partialSync([
      {
        id: '42e6f1fe-93bd-4993-ab1b-ebaec9ee8d10',
        username: 'Gary',
      },
    ])
  }

  reset() {
    this.userTable.reset()
  }
}
```

## Local Development

You can use [`npm link`](https://docs.npmjs.com/cli/link.html) to develop this library locally without pushing every change npm registry.

1. Build this library first.
2. Go into the `dist/angular-typed-forms` and run `npm link`.
3. Go into your project which depend on this library and run `npm link @gaplo917/angular-typed-forms`
4. Run `ng build --watch` in the root of this library (optional)
5. Done
