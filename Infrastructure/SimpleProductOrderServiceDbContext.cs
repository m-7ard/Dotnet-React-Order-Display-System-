using Infrastructure.DbEntities;
using Microsoft.EntityFrameworkCore;


namespace Infrastructure;

public class SimpleProductOrderServiceDbContext : DbContext
{
    public SimpleProductOrderServiceDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<ProductDbEntity> User { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // User
        modelBuilder.Entity<ProductDbEntity>().Property(d => d.Name)
            .HasMaxLength(255)
            .IsRequired();
        modelBuilder.Entity<ProductDbEntity>().Property(d => d.DateCreated).HasDefaultValueSql("GETDATE()");
    }
}