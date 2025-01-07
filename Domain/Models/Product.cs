using Domain.DomainEvents;
using Domain.DomainEvents.Product;
using Domain.DomainFactories;
using Domain.Errors;
using OneOf;
using OneOf.Types;

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

    public readonly List<string> ALLOWED_FILE_EXTENSIONS = [".jpg, .jpeg", ".png"];

    public ProductImage CreateProductImage(string fileName, string originalFileName, string url)
    {
        var productImage = ProductImageFactory.BuildNewProductImage(
            id: Guid.NewGuid(),
            fileName: fileName,
            originalFileName: originalFileName,
            url: url,
            productId: Id
        );

        return productImage;
    }

    public OneOf<bool, string> CanAddProductImage(string fileName, string originalFileName, string url)
    {
        if (Images.Count >= MAX_IMAGE_LENGTH)
        {
            return "Product cannot have more than 8 images.";
        }

        var fileNameExtension = Path.GetExtension(fileName);
        if (!ALLOWED_FILE_EXTENSIONS.Contains(fileNameExtension))
        {
            return "Saved filename extension is invalid.";
        }

        var originalFileNameExtension = Path.GetExtension(originalFileName);
        if (!ALLOWED_FILE_EXTENSIONS.Contains(originalFileNameExtension))
        {
            return "Original filename extension is invalid.";
        }

        if (!url.EndsWith(fileName))
        {
            return $"Url must end with the saved filename \"{fileName}\"";
        }

        return true;
    }

    public ProductImage ExecuteAddProductImage(string fileName, string originalFileName, string url)
    {
        var canAddProductImageResult = CanAddProductImage(fileName: fileName, originalFileName: originalFileName, url: url);
        if (canAddProductImageResult.TryPickT1(out var error, out var _))
        {
            throw new Exception(error);
        }

        var productImage = CreateProductImage(fileName: fileName, originalFileName: originalFileName, url: url);
        Images.Add(productImage);
        return productImage;
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
}