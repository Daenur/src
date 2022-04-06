const countries = ['US', 'Germany', 'UK', 'Japan', 'Italy', 'Greece'];
const products = ['Widget', 'Gadget', 'Doohickey'];
export function getData(count = 5) {
    const data = [];
    const dt = new Date();
    // add count items
    for (let i = 0; i < 20; i++) {
        // constants used to create data items
        let date = new Date(dt.getFullYear(), i % 12, 25, i % 24, i % 60, i % 60), countryId = Math.floor(Math.random() * countries.length), productId = Math.floor(Math.random() * products.length);
        // create the item
        let item = {
            id: i,
            start: date,
            end: date,
            country: countries[countryId],
            product: products[productId],
            sales: Math.random() * 10000,
            downloads: Math.round(Math.random() * 10000),
            active: i % 4 === 0
        };
        // make item immutable
        Object.freeze(item);
        // add the item to the list
        data.push(item);
    }
    // return the data
    return data;
}
