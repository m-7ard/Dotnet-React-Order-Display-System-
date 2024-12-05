using Domain.Models;

namespace Domain.DomainEvents.Product;

public class ProductImagePendingCreationEvent : DomainEvent
{
    public ProductImagePendingCreationEvent(ProductImage payload) : base()
    {
        Payload = payload;
    }

    public ProductImage Payload { get; }
    public override string EventType => "PRODUCT_IMAGE_PENDING_CREATION";
}