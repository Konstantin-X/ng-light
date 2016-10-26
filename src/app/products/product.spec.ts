import {Product} from './product';

describe('Product', () => {
    it('checks Product properties', () => {
        let product = new Product(1, 'img01.jpg', 'Product description', 'Product 1');

        expect(product instanceof Product).toBeTruthy();
        expect(product.id).toBe(1);
        expect(product.img).toBe('img01.jpg');
        expect(product.text).toBe('Product description');
        expect(product.title).toBe('Product 1');
    });
});
