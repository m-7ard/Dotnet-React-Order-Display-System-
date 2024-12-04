using Infrastructure.DbEntities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

public class OrderItemConfigurations : IEntityTypeConfiguration<OrderItemDbEntity>
{
    public void Configure(EntityTypeBuilder<OrderItemDbEntity> builder)
    {
        builder.Property(d => d.DateCreated).HasDefaultValueSql("GETDATE()");
    }
}