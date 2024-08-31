namespace Infrastructure.DbEntities;
public class ProductDbEntity
{
    public ProductDbEntity(int id, string name, DateTime dateCreated)
    {
        Id = id;
        Name = name;
        DateCreated = dateCreated;
    }

    public int Id { get; private set; }
    public string Name { get; set; }
    public DateTime DateCreated { get; private set; }
}