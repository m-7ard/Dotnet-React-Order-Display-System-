using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Application.Common;
using Infrastructure;

namespace Tests.IntegrationTests;

public class IntegrationWebApplicationFactory<TProgram>
    : WebApplicationFactory<TProgram> where TProgram : class
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            /*
            
                Sets up test database

            */

            var descriptor = services.SingleOrDefault(
                d => d.ServiceType ==
                    typeof(DbContextOptions<SimpleProductOrderServiceDbContext>));

            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            services.AddDbContext<SimpleProductOrderServiceDbContext>((sp, options) =>
            {
                var configuration = sp.GetRequiredService<IConfiguration>();
                options.UseSqlServer("Server=localhost;Database=test_warehouse_api;Trusted_Connection=True;TrustServerCertificate=True;");
            });

            var sp = services.BuildServiceProvider();

            using (var scope = sp.CreateScope())
            {
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<SimpleProductOrderServiceDbContext>();
                db.Database.EnsureDeleted();
                db.Database.EnsureCreated();
            }

            var projectRoot = DirectoryService.GetMediaDirectory();
        });
    }

    public SimpleProductOrderServiceDbContext CreateDbContext()
    {
        var scope = Services.CreateScope();
        return scope.ServiceProvider.GetRequiredService<SimpleProductOrderServiceDbContext>();
    }
}
