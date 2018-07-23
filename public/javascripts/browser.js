/** @jsx React.DOM */

var ShoppingCartButton = React.createClass({
	render: function() {
		var route = jsRoutes.controllers.Application.shoppingCart();
		return (
			<div className="shoppingCartBtn text-right">
				<a
					href={route.url}
					className="btn btn-default"
					title="Shopping cart"
					data-toggle="tooltip">

					<span className="glyphicon glyphicon-shopping-cart"></span> {this.props.count}
				</a>
			</div>
		);
	}
});

var Product = React.createClass({
	render: function() {
		return (
			<tr>
				<td>{this.props.data.product.name}</td>
				<td>{this.props.data.product.description}</td>
				<td className="price">{this.props.data.product.price}</td>
				<td>{this.props.data.quantity}</td>
				<td>
					<button 
						className="addToCart btn btn-default btn-sm"
						title="Add to cart"
						onClick={this.props.addToCartHandler.bind(null, this.props.key)}
						data-toggle="tooltip">

						<span className="glyphicon glyphicon-plus"></span>
					</button>
				</td>
			</tr>
		);
	}
});

var Browser = React.createClass({
	__loadProducts: function() {
		var route = jsRoutes.controllers.Application.getProducts();
		$.ajax({
			url: route.url,
			dataType: "json",
			success: function(data) {
				this.setState({ products: data });
			}.bind(this)
		});
	},
	__loadCartCount: function() {
		var route = jsRoutes.controllers.Application.getCartCount();
		$.ajax({
			url: route.url,
			dataType: "json",
			success: function(count) {
				this.setState({ cartCount: count });
			}.bind(this)
		});
	},
	__addToCart: function(productId) {
		console.log("adding product #" + productId + " to cart");

		var amount = 1;
		var route = jsRoutes.controllers.Application.updateShoppingCart(productId, amount);
		$.ajax({
			type: route.type,
			url: route.url,
			dataType: "json",
			success: function(updated) {
				if (updated) {
					var updatedProducts = this.state.products.map(function(p) {
						if (p.product.id == productId) {
							p.quantity -= amount;
						}
						return p;
					});
					
					this.setState({ products: updatedProducts, cartCount: this.state.cartCount + amount });
				}
			}.bind(this)
		});
	},
	__priceFormat: function(rootNode) {
		$(rootNode).find("td.price").priceFormat({ prefix: "$" });
	},
	getInitialState: function() {
		return { products: [], cartCount: 0 };
	},
	componentWillMount: function() {
		this.__loadProducts();
		this.__loadCartCount();
	},
	componentDidMount: function() {
		this.__priceFormat(this.getDOMNode());
	},
	componentDidUpdate: function() {
		this.__priceFormat(this.getDOMNode());
	},
	render: function() {
		var handler = this.__addToCart
		var productNodes = this.state.products.map(function (p) {
			return <Product data={p} key={p.product.id} addToCartHandler={handler} />;
		});
		
		return (
			<div className="browser">
				<ShoppingCartButton count={this.state.cartCount} />
				
				<table className="table table-striped">
					<thead>
						<tr>
							<th>Name</th>
							<th>Description</th>
							<th>Price</th>
							<th>Quantity</th>
							<th></th>
						</tr>
					</thead>
						<tbody>
							{productNodes}
						</tbody>
				</table>
			</div>
		);
	}
});