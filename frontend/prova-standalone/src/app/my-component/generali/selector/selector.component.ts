import { Component, forwardRef, Input} from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selector',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule,CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectorComponent),
      multi: true
    }
  ],
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectorComponent implements ControlValueAccessor {
  @Input() options: { value: number; label: string }[] = [];
  value!: string;

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setValue(value: string) {
    this.value = value;
    this.onChange(value);
  }

  onSelectChange(event: any) {
    this.setValue(event.value);
    this.onTouched();
  }
}
