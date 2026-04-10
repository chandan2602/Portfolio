import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { profile } from '../../data/profile.data';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class AboutComponent {
  @ViewChild('filePicker') filePicker!: ElementRef<HTMLInputElement>;

  bio = signal(profile.bio);
  photoSrc = signal('/images/me.jpeg');

  highlights = [
    { value: '2+',   label: 'Years Experience' },
    { value: '10K+', label: 'Monthly Users' },
    { value: '92%',  label: 'ML Accuracy' },
    { value: '3',    label: 'Live Projects' },
  ];

  triggerPicker() {
    this.filePicker.nativeElement.click();
  }

  onPhotoChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => this.photoSrc.set(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }
}
