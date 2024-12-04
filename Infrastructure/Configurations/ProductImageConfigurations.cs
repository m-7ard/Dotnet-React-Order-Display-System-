using Infrastructure.DbEntities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

public class ProductImageConfigurations : IEntityTypeConfiguration<ProductImageDbEntity>
{
    public void Configure(EntityTypeBuilder<ProductImageDbEntity> builder)
    {
        builder.Property(d => d.DateCreated).HasDefaultValueSql("GETDATE()");
    }
}