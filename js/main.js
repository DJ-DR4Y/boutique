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
            current: null,
            current_type: null,
            current_value: null,
            percent_value: null,
            sub_total: 0,
            percent: false,
            somme: 0,
            recherche: "Entrez votre code",
            products: [],
            cart: {},
            rabais: {},
            is_cart_open: true,
        }
    },

    mounted() {
        const url = "data/codes-promos.json"
        fetch(url).then(resp => resp.json()).then(data => {
            this.promos = data
        })
        this.getProducts()
        this.createPaypalButtons()
    },

    methods: {
        createPaypalButtons() {
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
                            "amount": {
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
        getProducts() {
            const url = "data/products.json"
            fetch(url).then(resp => resp.json()).then(data => {
                this.products = data.products
            })
        },
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
        isInCart(product) {
            return this.cart[product.id] != undefined

        },
        removeFromCart(product) {
            delete this.cart[product.id]
        },
        removePromoCart() {
            this.recherche = "Entrez votre code"
            this.current_type = ""
            // this.current_value = ""
            this.current = null
            this.current_value = 0
            this.percent_value = 0
            this.sub_total = 0


        },
        getCartTotal() {
            let somme = 0
            let sub_total = 0

            //    Pour un tableau utiliser in
            for (let key in this.cart) {
                let item = this.cart[key]
                somme += item.qty * item.price
            }
            if (somme + (- this.current_value) <= 0 && this.percent === false) {
                somme = 0
                return somme
            } else if (somme + (- this.current_value) >= 1 && somme > this.current_value && this.percent === false) {
                somme += - this.current_value
                return somme
            } else if (this.percent === true) {
                function percentage(num, per) {
                    return (num / 100) * per;
                }
                sub_total = (percentage(parseInt(somme), this.percent_value))
                somme += - sub_total
                return somme
            }
            else {
                this.percent = false
                this.recherche = ""
                this.current_type = ""
                somme + this.current_value + sub_total
            }

        },
        emptyCart() {
            this.cart = {}
            this.removePromoCart()
        },
        checkEmptyCartItem(item) {
            if (item.qty == 0) {
                this.removeFromCart(item)
            }
        },
        isCartEmpty() {
            return Object.keys(this.cart).length == 0
        },
        addPromoInCart(promo) {
            this.current = promo

        },

        keydownCoupon(e) {
            if (e.key == "Enter") {
                // submit
                e.preventDefault()
                if (this.recherche.length < 1 && this.recherche === "") {
                    this.recherche = "Aucun code"
                    this.current_type = "Aucun rabais"
                    this.current_value = 0
                    return true
                } else if (this.recherche.length > 0) {
                    promo = this.recherche
                    this.promoSubmit(promo)
                }

            }
        },

        promoSubmit(promo) {
            if (promo == this.promos[0].code) {
                this.percent = true
                this.current = this.promos[0]
                this.current_type = this.promos[0].type
                this.percent_value = this.promos[0].value
                this.recherche = this.promos[0].code
            } else if (promo == this.promos[1].code) {
                this.percent = false
                this.current = this.promos[1]
                this.current_type = this.promos[1].type
                this.current_value = this.promos[1].value
                this.recherche = this.promos[1].code
            } else if (promo == this.promos[2].code) {
                this.percent = false
                this.current = this.promos[2]
                this.current_type = this.promos[2].type
                this.current_value = this.promos[2].value
                this.recherche = this.promos[2].code
            } else {
                this.percent = false
                this.recherche = "Code invalide"
                this.current = null
            }

        },

    }
}

Vue.createApp(app).mount('#app')