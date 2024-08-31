namespace Domain.Models;
public class Product
{
    public Product(int id, string name, DateTime dateCreated)
    {
        Id = id;
        Name = name;
        DateCreated = dateCreated;
    }

    public int Id { get; private set; }
    public string Name { get; set; }
    public DateTime DateCreated { get; private set; }
}