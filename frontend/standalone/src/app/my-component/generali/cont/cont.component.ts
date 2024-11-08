import { Component, forwardRef, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cont',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatInputModule, CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContComponent),
      multi: true,
    },
  ],
  templateUrl: './cont.component.html',
  styleUrls: ['./cont.component.css'],
})
export class ContComponent implements ControlValueAccessor {
  value = 18;

  @Input() min!: number;
  @Input() max!: number;
  @Input() step: number=1;
  

  onChange = (value: number) => {};
  onTouched = () => {};

  writeValue(value: number): void {
    this.value = value;
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setValue(value: number) {
    this.value = value;
    this.onChange(value);
  }

  onInputChange(event: Event) {
    const inputValue = (event.target as HTMLInputElement).valueAsNumber;
    this.setValue(inputValue);
    this.onTouched();
  }
  blockManualEntry(event: KeyboardEvent) {
    const allowedKeys = ['ArrowUp', 'ArrowDown'];
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  
}
