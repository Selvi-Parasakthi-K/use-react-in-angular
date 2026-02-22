import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Segment {
  text: string;
  fillStyle: string;
  textColor: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // ─── Flat primitives (change detection works perfectly on these) ───
  wheelSize = 420;
  centerButtonColor = '#FFD700';
  pointerColor = '#E91E63';
  standImage = '/assets/seasoul-stand.png';
  outerRingImage = '/assets/spin-wheel-border.png';
  centerImage = '/assets/logo.jfif';

  spinLabel = 'SPIN NOW';
  spinBgColor = '#E91E63';
  spinTextColor = '#ffffff';

  ctaText = 'Spin & Unlock Surprises!';
  ctaColor = '#ffffff';

  segments: Segment[] = [
    { text: 'Prize 1', fillStyle: '#FF6B6B', textColor: '#ffffff' },
    { text: 'Prize 2', fillStyle: '#4ECDC4', textColor: '#ffffff' },
    { text: 'Prize 3', fillStyle: '#45B7D1', textColor: '#ffffff' },
    { text: 'Prize 4', fillStyle: '#96CEB4', textColor: '#ffffff' },
  ];

  // ─── CRITICAL FIX ─────────────────────────────────────────────────
  // Web components don't respond to Angular's property diff for nested objects.
  // By binding [attr.key]="renderKey" on the element, we force Angular to
  // re-evaluate ALL bindings on that element whenever renderKey changes.
  // We increment this on every single user interaction.
  renderKey = 0;
  private tick() {
    this.renderKey++;
  }

  // ─── Computed object getters (rebuilt fresh on every render cycle) ─
  get spinButtonConfig() {
    return {
      label: this.spinLabel,
      backgroundColor: this.spinBgColor,
      textColor: this.spinTextColor,
    };
  }

  get spinCtaTextStyle() {
    return { spinCtaText: this.ctaText, color: this.ctaColor };
  }

  // ─── Change handlers — always call tick() ─────────────────────────
  set(prop: 'wheelSize', val: string): void;
  set(
    prop:
      | 'centerButtonColor'
      | 'pointerColor'
      | 'standImage'
      | 'outerRingImage'
      | 'centerImage'
      | 'spinLabel'
      | 'spinBgColor'
      | 'spinTextColor'
      | 'ctaText'
      | 'ctaColor',
    val: string,
  ): void;
  set(prop: any, val: string): void {
    (this as any)[prop] = prop === 'wheelSize' ? +val : val;
    this.tick();
  }

  onSegmentText(i: number, val: string) {
    this.segments[i] = { ...this.segments[i], text: val };
    this.segments = [...this.segments];
    this.tick();
  }

  onSegmentFill(i: number, val: string) {
    this.segments[i] = { ...this.segments[i], fillStyle: val };
    this.segments = [...this.segments];
    this.tick();
  }

  onSegmentTextColor(i: number, val: string) {
    this.segments[i] = { ...this.segments[i], textColor: val };
    this.segments = [...this.segments];
    this.tick();
  }

  addSegment() {
    const palette = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FFEAA7',
      '#DDA0DD',
      '#98D8C8',
      '#F7DC6F',
    ];
    this.segments = [
      ...this.segments,
      {
        text: `Prize ${this.segments.length + 1}`,
        fillStyle: palette[this.segments.length % palette.length],
        textColor: '#ffffff',
      },
    ];
    this.tick();
  }

  removeSegment(i: number) {
    this.segments = this.segments.filter((_, idx) => idx !== i);
    this.tick();
  }
}
