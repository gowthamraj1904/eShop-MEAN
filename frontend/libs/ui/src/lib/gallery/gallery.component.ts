import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ui-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
    @Input() images: string[];

    selectedImage: string;

    get hasImages() {
        return this.images?.length > 0;
    }

    changeSelectedImage(image: string): void {
        this.selectedImage = image;
    }

    ngOnInit(): void {
        if (this.hasImages) {
            this.selectedImage = this.images?.[0];
        }
    }
}
