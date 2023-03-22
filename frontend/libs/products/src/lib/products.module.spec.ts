import { async, TestBed } from '@angular/core/testing';
import { ProductsModule } from './products.module';

describe('ProductsModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ProductsModule]
        }).compileComponents();
    }));

    // TODO: Add real tests here.
    //
    // NB: This particular test does not do anything useful.
    //     It does NOT check for correct instantiation of the module.
    it('should have a module definition', () => {
        expect(ProductsModule).toBeDefined();
    });
});
