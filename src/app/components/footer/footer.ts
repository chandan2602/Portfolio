import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { profile } from '../../data/profile.data';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
  github = profile.social.github;
  linkedin = profile.social.linkedin;
  email = profile.social.email;
}
