using System.Globalization;
using Api.Interfaces;
using Api.Services;
using Api.Validators;
using Application.Common;
using Application.Handlers.Products.Create;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services;
using FluentValidation;
using Infrastructure;
using Infrastructure.Files;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);
// dotnet ef migrations add <Name> --project Api --startup-project Api
// API/.env DefaultConnection="Server=localhost;Database=XXX;Trusted_Connection=True;TrustServerCertificate=True;"
// frontend/.env VITE_API_URL=http://localhost:5102

///
///
/// Env
/// 

DotNetEnv.Env.Load();
var DefaultConnection = Environment.GetEnvironmentVariable("DefaultConnection");

///
///
/// DB / database / dbcontext
/// 

builder.Services.AddDbContext<SimpleProductOrderServiceDbContext>(options =>
    options.UseSqlServer(DefaultConnection, b => b.MigrationsAssembly("Api")));

var services = builder.Services;

///
///
/// Localisation
/// 

{
    services.AddLocalization(options => options.ResourcesPath = "Resources");

    services.Configure<RequestLocalizationOptions>(options =>
    {
        var supportedCultures = new[] { new CultureInfo("en-US") };
        options.DefaultRequestCulture = new RequestCulture("en-US");
        options.SupportedCultures = supportedCultures;
        options.SupportedUICultures = supportedCultures;
    });

    services.AddControllers()
        .ConfigureApiBehaviorOptions(options =>
        {
            options.SuppressModelStateInvalidFilter = true;
        })
        .AddViewLocalization()
        .AddDataAnnotationsLocalization();
}

///
///
/// React Cors
/// 

var apiCorsPolicy = "AllowReactApp";
services.AddCors(options =>
{
    options.AddPolicy(apiCorsPolicy,
        builder =>
        {
            builder.WithOrigins("http://localhost:5173") // React app URL
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .AllowAnyHeader();
        });
});


///
///
/// Mediatr
/// 

builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CreateProductHandler).Assembly));

///
///
/// Dependency Injection / DI / Services
/// 

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductHistoryRepository, ProductHistoryRespository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IDraftImageRepository, DraftImageRepository>();

builder.Services.AddScoped<IPlainErrorHandlingService, PlainApiErrorHandlingService>();
builder.Services.AddScoped<IApiModelService, ApiModelService>();
builder.Services.AddSingleton<IFileStorage, FileStorage>();

///
///
/// Fluent Validation DI / Dependency Injection
/// 

builder.Services.AddValidatorsFromAssembly(typeof(UpdateProductValidator).Assembly);

///
///
/// JWT
/// 

/*
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });
*/

builder.Services.AddAuthorization();
builder.Services.AddDirectoryBrowser(); // For media

var app = builder.Build();

app.UseRequestLocalization();

///
///
/// Startup behaviour
/// 

using (var scope = app.Services.CreateScope())
{
    var localService = scope.ServiceProvider;
    var context = localService.GetRequiredService<SimpleProductOrderServiceDbContext>();

    try
    {
        context.Database.EnsureDeleted();
        context.Database.EnsureCreated();
    }
    catch (Exception ex)
    {
        var logger = localService.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while resetting the database.");
    }
}


app.UseCors(apiCorsPolicy);
app.UseAuthentication();
app.UseAuthorization();

///
///
/// Media config
/// 

var mediaProvider = new PhysicalFileProvider(DirectoryService.GetMediaDirectory());

app.UseFileServer(new FileServerOptions
{
    FileProvider = mediaProvider,
    RequestPath = "/media",
    EnableDirectoryBrowsing = true
});

app.UseHttpsRedirection();
app.MapControllers();

app.Run();

public partial class Program {  }
