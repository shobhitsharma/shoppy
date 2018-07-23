package models

import java.io.File

case class Product(id: Long, name: String, description: String, price: Double, photo: Option[File]) {
  
  override def toString = name
  
}

class ProductStatus(val product: Product, initialQuantity: Int) {
  
  require(product != null, "product cannot be null")
  require(initialQuantity >= 0, "initialQuantity must be >= 0")
  
  var _quantity = initialQuantity
  
  def quantity = _quantity
  
  def updateQuantity(amount: Int): Boolean = {
    if (_quantity + amount > 0) {
      _quantity += amount
      true
    } else false
  }
  
  def available = _quantity > 0
  
}

object Product {

  // json converters
  import play.api.libs.json._
  
  implicit val product2Json = new Writes[Product] {
    def writes(product: Product) = Json.obj(
      "id" -> product.id,
      "name" -> product.name,
      "description" -> product.description,
      "price" -> product.price,
      "photo" -> (product.photo map (_.getAbsolutePath()))
    )
  }
    
  implicit val productStatus2Json = new Writes[ProductStatus] {
    def writes(productStatus: ProductStatus) = Json.obj(
      "product" -> productStatus.product,
      "quantity" -> productStatus.quantity
    )
  }
  
  // inventory (data and data access)
  private val inventory = Seq(
    new ProductStatus(Product(1L, "PlayStation 4", "Sony's 8th generation console", 299.99, None), 10),
    new ProductStatus(Product(2L, "XBox One", "Microsoft's 8th generation console", 249.99, None), 10),
    new ProductStatus(Product(3L, "PlayStation Vita", "Sony's portable console", 179.99, None), 30),
    new ProductStatus(Product(4L, "2DS", "Nintendo's portable console", 119.99, None), 45),
    new ProductStatus(Product(5L, "3DS", "Nintendo's portable console", 129.99, None), 45),
    new ProductStatus(Product(6L, "3DS XL", "Nintendo's portable console", 149.99, None), 45),
    new ProductStatus(Product(7L, "Genesis", "Sega's 16 bits console", 39.99, None), 0)
  )
  
  def findById(id: Long): Option[Product] = inventory find (_.product.id == id) map (_.product)
  
  private def findStatusById(productId: Long): Option[ProductStatus] = inventory find (_.product.id == productId)
  
  def available(productId: Long): Boolean = {
    val ps = findStatusById(productId)
    ps map (_.available) getOrElse false
  }
  
  def availableProducts() = inventory filter (_.available) sortBy (_.product.name)
  
  def updateQuantity(productId: Long, amount: Int): Boolean = {
    val ps = findStatusById(productId)
    ps map (_.updateQuantity(amount)) getOrElse false
  }
  
}