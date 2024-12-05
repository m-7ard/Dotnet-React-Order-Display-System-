using Application.Errors;
using MediatR;
using OneOf;

namespace Application.Handlers.Orders.Create;

public class CreateOrderCommand : IRequest<OneOf<CreateOrderResult, List<ApplicationError>>>
{
    public CreateOrderCommand(Dictionary<string, OrderItem> orderItemData)
    {
        OrderItemData = orderItemData;
    }

    public Dictionary<string, OrderItem> OrderItemData { get; set; }

    public class OrderItem
    {
        public OrderItem(Guid productId, int quantity)
        {
            ProductId = productId;
            Quantity = quantity;
        }

        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }
}