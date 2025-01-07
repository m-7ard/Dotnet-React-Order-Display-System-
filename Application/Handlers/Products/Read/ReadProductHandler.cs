using Application.Errors;
using Application.Interfaces.Persistence;
using Application.Validators;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.Read;

public class ReadProductHandler : IRequestHandler<ReadProductQuery, OneOf<ReadProductResult, List<ApplicationError>>>
{
    private readonly IProductRepository _productRepository;
    private readonly ProductExistsValidatorAsync _productExistsValidator;

    public ReadProductHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
        _productExistsValidator = new ProductExistsValidatorAsync(productRepository);
    }

    public async Task<OneOf<ReadProductResult, List<ApplicationError>>> Handle(ReadProductQuery request, CancellationToken cancellationToken)
    {
        var productExistsResult = await _productExistsValidator.Validate(request.Id);
        if (productExistsResult.TryPickT1(out var errors, out var product))
        {
            return errors;
        }

        var result = new ReadProductResult(product: product);
        return result;
    }
}