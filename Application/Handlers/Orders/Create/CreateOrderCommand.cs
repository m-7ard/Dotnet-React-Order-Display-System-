using Application.ErrorHandling.Application;
using MediatR;
using OneOf;

namespace Application.Handlers.Orders.Create;

public class CreateOrderCommand : IRequest<OneOf<CreateOrderResult, List<PlainApplicationError>>>
{
    public CreateOrderCommand(Dictionary<string, OrderItem> orderItemData)
    {
        OrderItemData = orderItemData;
    }

    public Dictionary<string, OrderItem> OrderItemData { get; set; }

    public class OrderItem
    {
        public OrderItem(int productId, int quantity)
        {
            ProductId = productId;
            Quantity = quantity;
        }

        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}