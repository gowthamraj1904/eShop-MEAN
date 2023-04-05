import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BannerComponent } from './banner/banner.component';
import { ButtonModule } from 'primeng/button';
import { GalleryComponent } from './gallery/gallery.component';

@NgModule({
    imports: [CommonModule, RouterModule, ButtonModule],
    declarations: [BannerComponent, GalleryComponent],
    exports: [BannerComponent, GalleryComponent]
})
export class UiModule {}
