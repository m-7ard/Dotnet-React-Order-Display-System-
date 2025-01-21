using Domain.DomainEvents;
using Domain.DomainEvents.Product;
using Domain.DomainFactories;
using Domain.ValueObjects.Product;
using Domain.ValueObjects.ProductImage;
using Domain.ValueObjects.Shared;
using OneOf;

namespace Domain.Models;
public class Product
{
    public Product(
        ProductId id, 
        string name, 
        Money price, 
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

    public ProductId Id { get; private set; }
    public string Name { get; set; }
    public Money Price { get; set; }
    public string Description { get; set; }
    public DateTime DateCreated { get; private set; }
    public List<ProductImage> Images { get; set; }

    public List<DomainEvent> DomainEvents { get; set; } = [];
    public void ClearEvents()
    {
        DomainEvents = [];
    }
    
    public const int MAX_IMAGE_LENGTH = 8;

    public OneOf<bool, string> CanAddProductImage(Guid id, string fileName, string originalFileName, string url)
    {
        var canCreateProductImageId = ProductImageId.CanCreate(id);
        if (canCreateProductImageId.TryPickT1(out var error, out var _))
        {
            return error;
        }

        var canCreateProductImageFileName = FileName.CanCreate(fileName);
        if (canCreateProductImageFileName.TryPickT1(out error, out var _))
        {
            return error;
        }

        var canCreateProductImageOriginalFileName = FileName.CanCreate(originalFileName);
        if (canCreateProductImageOriginalFileName.TryPickT1(out error, out var _))
        {
            return error;
        }

        if (Images.Count >= MAX_IMAGE_LENGTH)
        {
            return "Product cannot have more than 8 images.";
        }

        if (!url.EndsWith(fileName))
        {
            return $"Url must end with the saved filename \"{fileName}\"";
        }

        return true;
    }

    public ProductImageId ExecuteAddProductImage(Guid id, string fileName, string originalFileName, string url)
    {
        var productImageId = ProductImageId.ExecuteCreate(id);
        var productImage = ProductImageFactory.BuildNewProductImage(
            id: productImageId,
            fileName: FileName.ExecuteCreate(fileName),
            originalFileName: FileName.ExecuteCreate(originalFileName),
            url: url,
            productId: ProductId.ExecuteCreate(Id.Value)
        );

        Images.Add(productImage);
        DomainEvents.Add(new ProductImagePendingCreationEvent(productImage));
        return productImageId;
    }

    public void UpdateImages(List<ProductImage> newImages)
    {
        var currentImagesById = Images.ToDictionary(
            image => image.Id,
            image => image
        );
        var updatedImagesById = newImages.ToDictionary(
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

        Images = newImages;
    }

    public ProductImage? FindProductImageByFileName(FileName productImageFileName)
    {
        return Images.Find(image => Equals(image.FileName, productImageFileName));
    }

    public ProductImage? FindProductImageById(ProductImageId productImageId)
    {
        return Images.Find(image => Equals(image.Id, productImageId));
    }

    public OneOf<ProductImage, string> TryFindProductImageById(ProductImageId productImageId)
    {
        var productImage = FindProductImageById(productImageId);
        if (productImage is null)
        {
            return $"ProductImage of Id \"{productImageId}\" does not exist on Product of Id \"${Id}\".";
        }

        return productImage;
    }

    public ProductImage ExecuteFindProductImageById(ProductImageId productImageId)
    {
        var tryFindProductImageByIdResult = TryFindProductImageById(productImageId);
        if (tryFindProductImageByIdResult.TryPickT1(out var error, out var productImage))
        {
            throw new Exception(error);
        }        

        return productImage;
    }


    public OneOf<bool, string> CanDeleteProductImage(ProductImageId productImageId)
    {
        var tryFindProductImageByIdResult = TryFindProductImageById(productImageId);
        if (tryFindProductImageByIdResult.TryPickT1(out var error, out var _))
        {
            return error;
        }

        return true;
    }

    public void ExecuteDeleteProductImage(ProductImageId productImageId)
    {
        var canDeleteProductImageResult = CanDeleteProductImage(productImageId);
        if (canDeleteProductImageResult.TryPickT1(out var error, out _))
        {
            throw new Exception(error);
        }

        var productImage = ExecuteFindProductImageById(productImageId);
        Images = Images.Where(image => image.Id != productImageId).ToList();
        DomainEvents.Add(new ProductImagePendingDeletionEvent(productImage));
    }
}