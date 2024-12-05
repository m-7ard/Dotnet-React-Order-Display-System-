using Domain.Models;

namespace Domain.DomainEvents.Product;

public class ProductImagePendingDeletionEvent : DomainEvent
{
    public ProductImagePendingDeletionEvent(ProductImage payload) : base()
    {
        Payload = payload;
    }

    public ProductImage Payload { get; }
    public override string EventType => "PRODUCT_IMAGE_PENDING_DELETION";
}