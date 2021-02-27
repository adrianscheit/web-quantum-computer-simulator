import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

describe('AppComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppModule],
        }).compileComponents();
    });

    it('getIndexes', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app.getIndexes(0)).toEqual([]);
        expect(app.getIndexes(1)).toEqual([0]);
        expect(app.getIndexes(5)).toEqual([0, 1, 2, 3, 4]);
    });
});
