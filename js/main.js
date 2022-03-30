/*

À faire:
1- Liste de produits (data/products.json)

2- Objet Panier:
Panier {
    id:
    quantity:

}

3- code promos: array
4- Le total serait une méthode et pas nécessairement dans le DATA (return)
*/

const app = {
    data() {
        return {
            promos: {},
            coupons: {},
            // coupons: {},
            products: [],
            cart: {},
            rabais: {},
            is_cart_open: true,
        }
    },

    mounted() {
        this.getPromos()
        this.getProducts()
        this.createPaypalButtons()
    },

    methods: {
        createPaypalButtons(){
            paypal.Buttons({
                style: {
                    shape: 'rect',
                    color: 'gold',
                    layout: 'vertical',
                    label: 'paypal',
                },
            
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            "amount":{
                                "currency_code": "CAD",
                                "value": this.getCartTotal()
                            }
                        }]
                    })
                },
            
                onApprove: (data, actions) => {
                    return actions.order.capture().then((orderData) => {
                    
                        // paiement terminé
                        // console.log(orderData)
                        //
                        this.emptyCart()
                        this.is_cart_open = false
                        console.log("Paiement terminé")


                    
                    })
                },
            
                onError: err => {
                    console.log(err)
                }
            }).render('#paypal-bts')
            
        },

        isCartEmpty() {
            return Object.keys(this.cart).length == 0
        },
        getProducts(){
            const url = "data/products.json"
            fetch(url).then(resp =>resp.json()).then(data =>{
                this.products = data.products
            })
        },

        getPromos(){
            const url = "data/codes-promos.json"
            fetch(url).then(resp =>resp.json()).then(data =>{
                this.promos = data
                this.coupons = data

                for (let key in this.promos){
                    this.coupons = this.promos[key]
                    // this.coupons = coupons
                    // somme += item.qty * item.price
                    console.log(this.coupons)
                }

                
                // console.log(this.promos[0].code) // 
            })
        },
        addCouponToCart (coupon){
            let promo_in_cart = this.rabais[coupon.id]
                if (promo_in_cart == undefined) {
                    this.rabais[coupon.id] = {
                        id: coupon.id,
                        code: coupon.code,
                        value: coupon.value,
                    }
                } else if ((promo_in_cart == 1)){
                    this.cart[coupon.id].qty = 1  // Augmenter la quantité seulement (.qty)
                } else {
                    this.cart[coupon.id].qty = 0
                }

        },
        // getPromos(){
        //     const url = "data/codes-promos.json"
        //     fetch(url).then(resp =>resp.json()).then(data =>{
        //         this.promos = data
        //         this.coupons = data

        //         for (let key in this.promos){
        //             this.coupons = this.promos[key]
        //             // this.coupons = coupons
        //             // somme += item.qty * item.price
        //             console.log(this.coupons)
        //         }

        //         // console.log(this.promos[0].code) // 
        //     })
        // },
        addToCart(product) {
                let product_in_cart = this.cart[product.id]
                if (product_in_cart == undefined) {
                    this.cart[product.id] = {
                        id: product.id,
                        qty: 1, 
                        price: product.price,
                        name: product.name,
                    }
                } else {

                    this.cart[product.id].qty += 1  // Augmenter la quantité seulement (.qty)
                }

        },
        isInCart (product){
            return this.cart[product.id] != undefined

        },

        removeFromCart(product) {
            delete this.cart[product.id]
        },
        getCartTotal() {
            let somme = 0

            //    Pour un tableau utiliser in
            for (let key in this.cart){
                let item = this.cart[key]
                somme += item.qty * item.price
            }

            return somme
        },
        emptyCart() {

            this.cart = {}

        },
        checkEmptyCartItem(item) {
            if (item.qty == 0) {
                this.removeFromCart(item)
            }
        },
    }
}

Vue.createApp(app).mount('#app')