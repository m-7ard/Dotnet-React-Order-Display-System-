using Domain.DomainEvents;
using Domain.DomainEvents.Product;
using Domain.DomainFactories;
using Domain.Errors;
using OneOf;

namespace Domain.Models;
public class Product
{
    public Product(
        Guid id, 
        string name, 
        decimal price, 
        string description, 
        DateTime dateCreated, 
        List<ProductImage> images)
    {
        Id = id;
        Name = name;
        Price = price;
        Description = description;
        DateCreated = dateCreated;
        Images = images;
    }

    public Guid Id { get; private set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; }
    public DateTime DateCreated { get; private set; }
    public List<ProductImage> Images { get; set; }
    public List<DomainEvent> DomainEvents { get; set; } = [];
    public void ClearEvents()
    {
        DomainEvents = [];
    }
    public const int MAX_IMAGE_LENGTH = 8;

    public OneOf<bool, List<DomainError>> TryAddImageFromDraftImage(DraftImage draftImage)
    {
        var productImage = CreateProductImageFromDraft(draftImage);
        if (Images.Count >= MAX_IMAGE_LENGTH)
        {
            return DomainErrorFactory.CreateSingleListError(
                message: "Product cannot have more than 8 images.",
                path: ["images"],
                code: "MAX_PRODUCT_IMAGE_LENGTH_EXCEEDED"
            );
        }

        Images.Add(productImage);
        return true;
    }


    public OneOf<bool, List<DomainError>> TryUpdate(string name, decimal price, string description, List<ProductImage> images)
    {
        if (images.Count > MAX_IMAGE_LENGTH)
        {
            return DomainErrorFactory.CreateSingleListError(
                message: "Product cannot have more than 8 images.",
                path: ["images"],
                code: "MAX_PRODUCT_IMAGE_LENGTH_EXCEEDED"
            );
        }

        Name = name;
        Price = price;
        Description = description;

        var currentImagesById = Images.ToDictionary(
            image => image.Id,
            image => image
        );
        var updatedImagesById = images.ToDictionary(
            image => image.Id,
            image => image
        );

        // Iterate over the currently existing image
        foreach (var (id, image) in currentImagesById)
        {
            // image no longer exists
            if (!updatedImagesById.ContainsKey(id))
            {
                DomainEvents.Add(new ProductImagePendingDeletionEvent(image));
            }
        }

        // Iterate over the new images value
        foreach (var (id, image) in updatedImagesById)
        {
            // image does not yet exist
            if (!currentImagesById.ContainsKey(id))
            {
                DomainEvents.Add(new ProductImagePendingCreationEvent(image));
            }
        }

        Images = images;
        return true;
    }

    public ProductImage CreateProductImageFromDraft(DraftImage draftImage)
    {
        var productImage = ProductImageFactory.BuildNewProductImageFromDraftImage(
            source: draftImage,
            id: Guid.NewGuid(),
            productId: Id
        );

        return productImage;
    }
}