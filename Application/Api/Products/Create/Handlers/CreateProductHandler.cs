using Application.ErrorHandling.Application;
using Application.Interfaces.Persistence;
using Domain.DomainFactories;
using MediatR;
using OneOf;

namespace Application.Api.Products.Create.Handlers;

public class CreateProductHandler : IRequestHandler<CreateProductCommand, OneOf<CreateProductResult, List<PlainApplicationError>>>
{
    private readonly IProductRepository _productRespository;

    public CreateProductHandler(IProductRepository productRespository)
    {
        _productRespository = productRespository;
    }

    public async Task<OneOf<CreateProductResult, List<PlainApplicationError>>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var Product = await _productRespository.CreateAsync(
            ProductFactory.BuildNewProduct
            (
                name: request.Name
            )
        );

        var error = new List<PlainApplicationError>();
        if (error.Count > 0)
        {
            return error;
        }

        return new CreateProductResult
        (
            product: Product
        );
    }
}