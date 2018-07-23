/** @jsx React.DOM */

var CartItem = React.createClass({
	render: function() {
		var totalPrice = this.props.data.quantity * this.props.data.price;
		return (
			<tr className="cartItem">
				<td>{this.props.data.name}</td>
				<td>{this.props.data.quantity}</td>
				<td className="price">{this.props.data.price}</td>
				<td className="price">{totalPrice}</td>
			</tr>
		);
	}
});

var ShoppingCart = React.createClass({
	__loadItems: function() {
		var route = jsRoutes.controllers.Application.getCartItems();
		$.ajax({
			url: route.url,
			dataType: "json",
			success: function(data) {
				this.setState({ items: data });
			}.bind(this)
		});
	},
	__grandTotal: function() {
		var grandTotal = 0;
		this.state.items.forEach(function(i) {
			grandTotal += (i.quantity * i.price);
		});
		
		return grandTotal;
	},
	__priceFormat: function(rootNode) {
		$(rootNode).find(".price").priceFormat({ prefix: "$" });
	},
	getInitialState: function() {
		return ({ items: [] });
	},
	componentWillMount: function() {
		this.__loadItems();
	},
	componentDidMount: function() {
		this.__priceFormat(this.getDOMNode());
	},
	componentDidUpdate: function() {
		this.__priceFormat(this.getDOMNode());
	},
	render: function() {
		var grandTotal = this.__grandTotal();
		var nodes = this.state.items.map(function (i) {
			return <CartItem data={i} key={i.productId} />;
		});
		return (
			<div className="cart">
				<table className="table table-striped">
					<thead>
						<tr>
							<th>Product</th>
							<th>Quantity</th>
							<th>Price</th>
							<th>Total</th>
						</tr>
					</thead>
					<tbody>
						{nodes}
					</tbody>
					<tfoot>
						<tr>
							<th colSpan="3" className="text-right">Grand total</th>
							<th className="price">{grandTotal}</th>
						</tr>
					</tfoot>
				</table>
			</div>
		);
	}
});