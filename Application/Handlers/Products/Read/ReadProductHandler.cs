using Application.ErrorHandling.Application;
using Application.Errors;
using Application.Interfaces.Persistence;
using MediatR;
using OneOf;

namespace Application.Handlers.Products.Read;

public class ReadProductHandler : IRequestHandler<ReadProductQuery, OneOf<ReadProductResult, List<PlainApplicationError>>>
{
    private readonly IProductRepository _productRepository;

    public ReadProductHandler(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<OneOf<ReadProductResult, List<PlainApplicationError>>> Handle(ReadProductQuery request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(id: request.Id);
        if (product is null)
        {
            return new List<PlainApplicationError>() {
                new PlainApplicationError(
                    message: $"Product with Id \"{request.Id}\" does not exist.",
                    path: ["_"],
                    code: ValidationErrorCodes.ModelDoesNotExist
                )
            };
        }

        var result = new ReadProductResult(product: product);
        return result;
    }
}