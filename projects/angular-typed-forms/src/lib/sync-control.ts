import { AbstractControl } from '@angular/forms'
import { TypedFormArray, TypedFormGroup } from './forms'

export function syncControl(
  control: AbstractControl,
  value: any,
  options?: {
    onlySelf?: boolean
    emitEvent?: boolean
  },
): void {
  if (control instanceof TypedFormArray) {
    if (Array.isArray(value)) {
      // sync number of controls
      const diff = control.controls.length - value.length
      for (let i = 0; i < Math.abs(diff); i++) {
        if (diff > 0) {
          control.removeAt(control.controls.length - 1)
        } else {
          control.push(control.controlsConfig.constructArrayItem(control.controls.length + i, value))
        }
      }
      value.forEach((v, i) => {
        syncControl(control.controls[i], v, options)
      })
    } else {
      throw new Error(
        `expected the data structure is array because the control is ${
          control.constructor.name
        }, value: ${JSON.stringify(value)}`,
      )
    }
  } else if (control instanceof TypedFormGroup) {
    if (typeof value === 'object') {
      for (const key of Object.keys(value)) {
        if (!control.controls[key]) {
          control.setControl(key, control.initialControls[key])
        }
        syncControl(control.controls[key], value[key], options)
      }
    } else {
      throw new Error(
        `expected data structure is object because the control is ${control.constructor.name}, value: ${JSON.stringify(
          value,
        )}`,
      )
    }
  }
}
