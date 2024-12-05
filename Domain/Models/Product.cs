using Domain.DomainEvents;
using Domain.DomainEvents.Product;

namespace Domain.Models;
public class Product
{
    public Product(
        int id, 
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

    public int Id { get; private set; }
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

    public void Update(string name, decimal price, string description, List<ProductImage> images)
    {
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
    }
}