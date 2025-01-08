using Application.Errors;
using Application.Interfaces.Persistence;
using Application.Validators;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.Read;

public class ReadProductHandler : IRequestHandler<ReadProductQuery, OneOf<ReadProductResult, List<ApplicationError>>>
{
    private readonly ProductExistsValidatorAsync _productExistsValidator;

    public ReadProductHandler(ProductExistsValidatorAsync productExistsValidator)
    {
        _productExistsValidator = productExistsValidator;
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