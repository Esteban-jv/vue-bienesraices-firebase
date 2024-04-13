export const priceProperty =  (price) => //Pero aqui si
    Number(price).toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN'
    })