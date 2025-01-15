using Application.Errors;
using Application.Validators.ProductExistsValidator;
using Domain.ValueObjects.Product;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.Read;

public class ReadProductHandler : IRequestHandler<ReadProductQuery, OneOf<ReadProductResult, List<ApplicationError>>>
{
    private readonly IProductExistsValidator<ProductId> _productExistsValidator;

    public ReadProductHandler(IProductExistsValidator<ProductId> productExistsValidator)
    {
        _productExistsValidator = productExistsValidator;
    }

    public async Task<OneOf<ReadProductResult, List<ApplicationError>>> Handle(ReadProductQuery request, CancellationToken cancellationToken)
    {
        var productId = ProductId.ExecuteCreate(request.Id);
        var productExistsResult = await _productExistsValidator.Validate(productId);
        if (productExistsResult.TryPickT1(out var errors, out var product))
        {
            return errors;
        }

        var result = new ReadProductResult(product: product);
        return result;
    }
}