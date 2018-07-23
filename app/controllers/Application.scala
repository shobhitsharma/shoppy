package controllers

import play.api._
import play.api.mvc._
import play.api.libs.json._

import models._
import models.Product.{ product2Json, productStatus2Json }
import models.CartItem.cartItem2Json

object Application extends Controller {

  def index = Action { implicit req =>
    Ok(views.html.index())
  }
  
  def shoppingCart = Action { implicit req =>
    Ok(views.html.shoppingCart())
  }
  
  // ajax calls
  def getProducts = Action {
    val json = Json.toJson(Product.availableProducts())
    Ok(json)
  }
  
  def getCartItems = Action {
    val json = Json.toJson(ShoppingCart.items)
    Ok(json)
  }
  
  def getCartCount = Action {
    val json = Json.toJson(ShoppingCart.itemsCount)
    Ok(json)
  }

  def updateShoppingCart(productId: Long, amount: Int) = Action {
    val json = Json.toJson(ShoppingCart.add(productId, amount))
    Ok(json)
  }
  
}