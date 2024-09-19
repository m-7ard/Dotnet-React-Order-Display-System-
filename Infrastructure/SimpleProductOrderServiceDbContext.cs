using Infrastructure.DbEntities;
using Microsoft.EntityFrameworkCore;


namespace Infrastructure;

public class SimpleProductOrderServiceDbContext : DbContext
{
    public SimpleProductOrderServiceDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<ProductDbEntity> Product { get; set; } = null!;
    public DbSet<ProductHistoryDbEntity> ProductHistory { get; set; } = null!;
    public DbSet<ProductImageDbEntity> ProductImage { get; set; } = null!;
    public DbSet<OrderDbEntity> Order { get; set; } = null!;
    public DbSet<OrderItemDbEntity> OrderItem { get; set; } = null!;
    public DbSet<DraftImageDbEntity> DraftImage { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Product
        modelBuilder.Entity<ProductDbEntity>().Property(d => d.Name)
            .HasMaxLength(255)
            .IsRequired();
        modelBuilder.Entity<ProductDbEntity>().Property(d => d.Description)
            .HasMaxLength(1028)
            .IsRequired();
        modelBuilder.Entity<ProductDbEntity>().Property(d => d.DateCreated).HasDefaultValueSql("GETDATE()");

        // ProductHistory
        modelBuilder.Entity<ProductHistoryDbEntity>().Property(d => d.Name)
            .HasMaxLength(255)
            .IsRequired();
        modelBuilder.Entity<ProductHistoryDbEntity>().Property(d => d.Description)
            .HasMaxLength(1028)
            .IsRequired();
        modelBuilder.Entity<ProductHistoryDbEntity>().Property(d => d.ValidFrom).HasDefaultValueSql("GETDATE()");
        modelBuilder.Entity<ProductHistoryDbEntity>()
            .HasOne(h => h.Product)
            .WithMany(p => p.ProductHistories)
            .HasForeignKey(h => h.ProductId)
            .OnDelete(DeleteBehavior.SetNull);
            
        // DraftImage
        modelBuilder.Entity<ProductImageDbEntity>().Property(d => d.DateCreated).HasDefaultValueSql("GETDATE()");

        // ProductImage
        modelBuilder.Entity<ProductImageDbEntity>().Property(d => d.DateCreated).HasDefaultValueSql("GETDATE()");

        // Order
        modelBuilder.Entity<OrderDbEntity>().Property(d => d.DateCreated).HasDefaultValueSql("GETDATE()");

        // Order Item
        modelBuilder.Entity<OrderItemDbEntity>().Property(d => d.DateCreated).HasDefaultValueSql("GETDATE()");
    }
}