import { async, TestBed } from '@angular/core/testing';
import { UiModule } from './ui.module';

describe('UiModule', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [UiModule]
        }).compileComponents();
    }));

    // TODO: Add real tests here.
    //
    // NB: This particular test does not do anything useful.
    //     It does NOT check for correct instantiation of the module.
    it('should have a module definition', () => {
        expect(UiModule).toBeDefined();
    });
});
