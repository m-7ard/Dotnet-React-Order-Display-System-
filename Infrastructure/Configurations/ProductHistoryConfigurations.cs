using Infrastructure.DbEntities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

public class ProductHistoryConfigurations : IEntityTypeConfiguration<ProductHistoryDbEntity>
{
    public void Configure(EntityTypeBuilder<ProductHistoryDbEntity> builder)
    {

        builder.Property(d => d.Name)
            .HasMaxLength(255)
            .IsRequired();
            
        builder.Property(d => d.Description)
            .HasMaxLength(1028)
            .IsRequired();

        builder.Property(d => d.ValidFrom)
            .HasDefaultValueSql("GETDATE()");
        
        builder
            .HasOne(h => h.Product)
            .WithMany(p => p.ProductHistories)
            .HasForeignKey(h => h.ProductId)
            .OnDelete(DeleteBehavior.SetNull);
        
        builder.Property(d => d.Price)
            .HasPrecision(18, 2);
    }
}