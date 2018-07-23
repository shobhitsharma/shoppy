package models

import collection.mutable.Map
  
case class CartItem(product: Product, quantity: Int)

object CartItem {
  
  import play.api.libs.json._
  
  implicit val cartItem2Json = new Writes[CartItem] {
    def writes(item: CartItem) = Json.obj(
      "productId" -> item.product.id,
      "name" -> item.product.name,
      "quantity" -> item.quantity,
      "price" -> item.product.price
    )
  }
  
}

object ShoppingCart {

  private var cart: Map[Long, CartItem] = Map()
  
  def items = (Seq() ++ cart.values) sortBy (_.product.name)

  def itemsCount = (cart.values :\ 0)(_.quantity + _)

  def add(productId: Long, amount: Int): Boolean = {
    cart.get(productId) map (updateItem(_, amount)) getOrElse (addItem(productId, amount)) 
  }

  private def updateItem(item: CartItem, amount: Int): Boolean = {
    if (Product.updateQuantity(item.product.id, -amount)) {
      cart(item.product.id) = item.copy(quantity = item.quantity + amount)
      true
    } else false
  }
  
  private def addItem(productId: Long, amount: Int): Boolean = {
    Product.findById(productId) map { p =>
      if (Product.updateQuantity(productId, -amount)) {
        cart(productId) = CartItem(p, amount)
        true
      } else false
    } getOrElse(throw new IllegalArgumentException(s"Unknown product #${productId}"))
  }
  
}