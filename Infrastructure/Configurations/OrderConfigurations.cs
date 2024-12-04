using Infrastructure.DbEntities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

public class OrderConfigurations : IEntityTypeConfiguration<OrderDbEntity>
{
    public void Configure(EntityTypeBuilder<OrderDbEntity> builder)
    {
        builder.Property(d => d.DateCreated)
            .HasDefaultValueSql("GETDATE()");

        builder.Property(d => d.Total)
            .HasPrecision(18, 2);
    }
}